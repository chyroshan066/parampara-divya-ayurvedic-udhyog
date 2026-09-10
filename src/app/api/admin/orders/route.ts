import { NextRequest, NextResponse, after } from "next/server";
import { z } from "zod";
import { sql } from "@/utils/db";
import { getCustomerSession } from "@/utils/customer-auth";
import { sendAdminNewOrderEmail } from "@/utils/email";

const orderItemSchema = z.object({
  productName: z.string().trim().min(1).max(200),
  productImg: z.string().trim().max(500).optional().nullable(),
  unitPrice: z.number().positive(),
  quantity: z.number().int().positive().max(999),
});

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
});

export async function POST(request: NextRequest) {
  // Ordering requires a logged-in customer — this is the enforcement
  // point. The storefront should redirect to /login before ever calling
  // this, but that's a UX nicety, not the security boundary; this check
  // is what actually stops an unauthenticated order from being created.
  const session = await getCustomerSession(request);
  if (!session) {
    return NextResponse.json(
      { error: "Please log in to place an order." },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = createOrderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check your order details and try again." },
      { status: 400 }
    );
  }

  const { items } = parsed.data;

  const [order] = await sql`
    insert into orders (customer_id)
    values (${session.sub})
    returning id
  `;

  // Small, bounded item count per order (single product card today), so
  // sequential inserts are simpler than hand-building a bulk insert and
  // the performance difference is negligible here.
  for (const item of items) {
    await sql`
      insert into order_items (order_id, product_name, product_img, unit_price, quantity)
      values (
        ${order.id},
        ${item.productName},
        ${item.productImg ?? null},
        ${item.unitPrice},
        ${item.quantity}
      )
    `;
  }

  const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  // Admin-only notification, so it doesn't need to block the checkout
  // response the customer is waiting on. after() still guarantees it (and
  // its retries) runs to completion instead of risking a silent drop like
  // a bare fire-and-forget would on Vercel.
  after(() =>
    sendAdminNewOrderEmail({
      orderId: order.id,
      customerName: `${session.firstName} ${session.lastName}`,
      customerEmail: session.email,
      items: items.map((item) => ({
        productName: item.productName,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
      })),
      total,
    })
  );

  return NextResponse.json({ success: true, orderId: order.id });
}