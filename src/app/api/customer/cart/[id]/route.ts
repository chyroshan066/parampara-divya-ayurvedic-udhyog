import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "@/utils/db";
import { getCustomerSession } from "@/utils/customer-auth";

const updateQuantitySchema = z.object({
  quantity: z.number().int().positive().max(999),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCustomerSession(request);
  if (!session) {
    return NextResponse.json({ error: "Please log in to update your cart." }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = updateQuantitySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Please provide a valid quantity." }, { status: 400 });
  }

  // customer_id is included in the WHERE clause (not just id) so a
  // customer can never update another customer's cart row by guessing
  // an id — this is the actual ownership check, not a UI nicety.
  const [updated] = await sql`
    update cart_items
    set quantity = ${parsed.data.quantity}, updated_at = now()
    where id = ${id} and customer_id = ${session.sub}
    returning id
  `;

  if (!updated) {
    return NextResponse.json({ error: "Cart item not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCustomerSession(request);
  if (!session) {
    return NextResponse.json({ error: "Please log in to update your cart." }, { status: 401 });
  }

  const { id } = await params;

  const [deleted] = await sql`
    delete from cart_items
    where id = ${id} and customer_id = ${session.sub}
    returning id
  `;

  if (!deleted) {
    return NextResponse.json({ error: "Cart item not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}