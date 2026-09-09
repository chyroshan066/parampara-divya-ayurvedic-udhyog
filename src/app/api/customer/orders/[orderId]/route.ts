import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "@/utils/db";
import { getCustomerSession } from "@/utils/customer-auth";

const cancelOrderSchema = z.object({
  status: z.literal("cancelled"),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const session = await getCustomerSession(request);
  if (!session) {
    return NextResponse.json(
      { error: "Please log in to manage your orders." },
      { status: 401 }
    );
  }

  const { orderId } = await params;
  const body = await request.json().catch(() => null);
  const parsed = cancelOrderSchema.safeParse(body);

  if (!parsed.success) {
    // Customers can only ever move an order to "cancelled" from here —
    // any other transition (processing/shipped/delivered) is
    // admin-only, via /api/admin/orders/[orderId]/status.
    return NextResponse.json(
      { error: "Orders can only be cancelled from here." },
      { status: 400 }
    );
  }

  // Ownership AND current status are both enforced in the WHERE
  // clause: customer_id stops a customer touching someone else's
  // order, and status = 'pending' stops cancelling one that's already
  // being processed/shipped/delivered/cancelled.
  const [updated] = await sql`
    update orders
    set status = 'cancelled'
    where id = ${orderId} and customer_id = ${session.sub} and status = 'pending'
    returning id, status
  `;

  if (!updated) {
    return NextResponse.json(
      { error: "This order can no longer be cancelled." },
      { status: 409 }
    );
  }

  return NextResponse.json({ success: true, status: updated.status });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const session = await getCustomerSession(request);
  if (!session) {
    return NextResponse.json(
      { error: "Please log in to manage your orders." },
      { status: 401 }
    );
  }

  const { orderId } = await params;

  // Only a finished order (cancelled or delivered) can be removed from
  // history — one still pending/processing/shipped has to go through
  // cancellation first, so it never disappears out from under the
  // admin dashboard while still "in flight". order_items cascades via
  // its FK (see 004_orders.sql), so no separate cleanup needed there.
  const [deleted] = await sql`
    delete from orders
    where id = ${orderId}
      and customer_id = ${session.sub}
      and status in ('cancelled', 'delivered')
    returning id
  `;

  if (!deleted) {
    return NextResponse.json(
      { error: "Only cancelled or delivered orders can be removed." },
      { status: 409 }
    );
  }

  return NextResponse.json({ success: true });
}