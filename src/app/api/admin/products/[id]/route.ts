import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/utils/db";
import { getAdminSession } from "@/utils/auth";
import { uploadProductImage, deleteProductImage } from "@/utils/cloudinary";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const [existing] = await sql`
    select id, image_public_id from products where id = ${id}
  `;
  if (!existing) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

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

  // Image is optional on edit — only replace it if a new file was
  // actually chosen. A submitted FormData can still include an empty
  // File for an untouched file input, so size > 0 is the real check.
  const hasNewImage = image instanceof File && image.size > 0;

  let imageUrl: string | undefined;
  let imagePublicId: string | undefined;

  if (hasNewImage) {
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
    const uploaded = await uploadProductImage(buffer);
    imageUrl = uploaded.url;
    imagePublicId = uploaded.publicId;
  }

  const [updated] = hasNewImage
    ? await sql`
        update products
        set name = ${name.trim()},
            description = ${descriptionValue},
            price = ${price},
            image_url = ${imageUrl},
            image_public_id = ${imagePublicId},
            updated_at = now()
        where id = ${id}
        returning id, name, description, image_url, image_public_id, price, created_at, updated_at
      `
    : await sql`
        update products
        set name = ${name.trim()},
            description = ${descriptionValue},
            price = ${price},
            updated_at = now()
        where id = ${id}
        returning id, name, description, image_url, image_public_id, price, created_at, updated_at
      `;

  // Only delete the OLD Cloudinary asset once the new one is safely
  // uploaded and the row is updated — never the other way around, so
  // a failed upload or update never leaves a product with no image.
  if (hasNewImage && existing.image_public_id) {
    await deleteProductImage(existing.image_public_id);
  }

  return NextResponse.json({ success: true, product: updated });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const [deleted] = await sql`
    delete from products where id = ${id}
    returning id, image_public_id
  `;

  if (!deleted) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  if (deleted.image_public_id) {
    await deleteProductImage(deleted.image_public_id);
  }

  return NextResponse.json({ success: true });
}