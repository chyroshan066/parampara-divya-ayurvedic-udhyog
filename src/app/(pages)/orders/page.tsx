import { cookies } from "next/headers";
import { sql } from "@/utils/db";
import {
  CUSTOMER_SESSION_COOKIE,
  verifyCustomerSessionToken,
} from "@/utils/customer-auth";
import { Breadcrumb } from "@/components/Breadcrumb";
import type { OrderWithItems } from "@/types/order";
import { Orders } from "@/components/Orders";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Orders | Parampara Ayurvedic Clinic",
  description: "View and track your order history for authentic Ayurvedic products and remedies purchased from Parampara Ayurvedic Clinic.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/orders",
  },
  openGraph: {
    title: "My Orders | Parampara Ayurvedic Clinic",
    description: "Track your Ayurvedic product purchases and order history with Parampara Ayurvedic Clinic.",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/orders`,
    siteName: "Parampara Ayurvedic Clinic",
  },
};

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