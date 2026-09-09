import { cookies } from "next/headers";
import { sql } from "@/utils/db";
import {
  CUSTOMER_SESSION_COOKIE,
  verifyCustomerSessionToken,
} from "@/utils/customer-auth";
import { Breadcrumb } from "@/components/Breadcrumb";
import type { OrderWithItems } from "@/types/order";
import { Orders } from "@/components/Orders";

export default async function OrdersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CUSTOMER_SESSION_COOKIE)?.value;
  const session = token ? await verifyCustomerSessionToken(token) : null;

  let orders: OrderWithItems[] = [];
  if (session) {
    orders = (await sql`
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
    `) as unknown as OrderWithItems[];
  }

  return (
    <>
      <Breadcrumb />
      <Orders initialOrders={orders} isLoggedIn={Boolean(session)} />
    </>
  );
}