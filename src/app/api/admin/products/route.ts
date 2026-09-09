import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/utils/db";
import { getAdminSession } from "@/utils/auth";
import { uploadProductImage } from "@/utils/cloudinary";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function GET(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await sql`
    select id, name, description, image_url, image_public_id, price, created_at, updated_at
    from products
    order by created_at desc
  `;

  return NextResponse.json({ products });
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // multipart/form-data, not JSON — the image file has to travel
  // alongside the text fields in one request.
  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const name = formData.get("name");
  const description = formData.get("description");
  const priceRaw = formData.get("price");
  const image = formData.get("image");

  if (typeof name !== "string" || name.trim().length === 0 || name.length > 200) {
    return NextResponse.json(
      { error: "Please provide a valid product name." },
      { status: 400 }
    );
  }

  const price = typeof priceRaw === "string" ? Number(priceRaw) : NaN;
  if (!Number.isFinite(price) || price <= 0) {
    return NextResponse.json({ error: "Please provide a valid price." }, { status: 400 });
  }

  const descriptionValue =
    typeof description === "string" && description.trim().length > 0
      ? description.trim()
      : null;

  if (!(image instanceof File) || image.size === 0) {
    return NextResponse.json({ error: "Please upload a product image." }, { status: 400 });
  }
  if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {
    return NextResponse.json(
      { error: "Image must be a JPEG, PNG, or WebP file." },
      { status: 400 }
    );
  }
  if (image.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: "Image must be under 5MB." }, { status: 400 });
  }

  const buffer = Buffer.from(await image.arrayBuffer());
  const { url, publicId } = await uploadProductImage(buffer);

  const [product] = await sql`
    insert into products (name, description, image_url, image_public_id, price)
    values (${name.trim()}, ${descriptionValue}, ${url}, ${publicId}, ${price})
    returning id, name, description, image_url, image_public_id, price, created_at, updated_at
  `;

  return NextResponse.json({ success: true, product });
}