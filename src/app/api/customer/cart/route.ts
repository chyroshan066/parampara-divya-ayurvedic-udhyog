import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "@/utils/db";
import { getCustomerSession } from "@/utils/customer-auth";

const addCartItemSchema = z.object({
  productName: z.string().trim().min(1).max(200),
  productImg: z.string().trim().max(500).optional().nullable(),
  unitPrice: z.number().positive(),
  quantity: z.number().int().positive().max(999),
});

export async function GET(request: NextRequest) {
  const session = await getCustomerSession(request);
  if (!session) {
    return NextResponse.json({ error: "Please log in to view your cart." }, { status: 401 });
  }

  const items = await sql`
    select id, customer_id, product_name, product_img, unit_price, quantity, created_at, updated_at
    from cart_items
    where customer_id = ${session.sub}
    order by created_at asc
  `;

  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  // Same enforcement point as /api/admin/orders — the storefront
  // redirects to /login before calling this as a UX nicety, but this
  // check is what actually stops an unauthenticated add-to-cart.
  const session = await getCustomerSession(request);
  if (!session) {
    return NextResponse.json({ error: "Please log in to add items to your cart." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = addCartItemSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the item details and try again." }, { status: 400 });
  }

  const { productName, productImg, unitPrice, quantity } = parsed.data;

  // Upsert: if this product is already in the cart, add to its
  // existing quantity and refresh the snapshotted price/image instead
  // of creating a duplicate row.
  const [item] = await sql`
    insert into cart_items (customer_id, product_name, product_img, unit_price, quantity)
    values (${session.sub}, ${productName}, ${productImg ?? null}, ${unitPrice}, ${quantity})
    on conflict (customer_id, product_name)
    do update set
      quantity = cart_items.quantity + excluded.quantity,
      unit_price = excluded.unit_price,
      product_img = excluded.product_img,
      updated_at = now()
    returning id, quantity
  `;

  return NextResponse.json({ success: true, id: item.id, quantity: item.quantity });
}