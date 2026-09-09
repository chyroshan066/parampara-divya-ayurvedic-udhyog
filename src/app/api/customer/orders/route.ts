import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/utils/db";
import { getCustomerSession } from "@/utils/customer-auth";

export async function GET(request: NextRequest) {
  const session = await getCustomerSession(request);
  if (!session) {
    return NextResponse.json(
      { error: "Please log in to view your orders." },
      { status: 401 }
    );
  }

  const orders = await sql`
    select
      o.id,
      o.customer_id,
      o.status,
      o.created_at,
      json_agg(
        json_build_object(
          'id', oi.id,
          'order_id', oi.order_id,
          'product_name', oi.product_name,
          'product_img', oi.product_img,
          'unit_price', oi.unit_price,
          'quantity', oi.quantity,
          'created_at', oi.created_at
        ) order by oi.created_at
      ) as items
    from orders o
    join order_items oi on oi.order_id = o.id
    where o.customer_id = ${session.sub}
    group by o.id, o.customer_id, o.status, o.created_at
    order by o.created_at desc
  `;

  return NextResponse.json({ orders });
}