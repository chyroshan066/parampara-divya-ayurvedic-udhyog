import { cookies } from "next/headers";
import { sql } from "@/utils/db";
import { CUSTOMER_SESSION_COOKIE, verifyCustomerSessionToken } from "@/utils/customer-auth";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Cart } from "@/components/Cart";
import type { CartItem } from "@/types/cart";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart | Parampara Ayurvedic Clinic",
  description: "Review your selected herbal products and Ayurvedic remedies in your shopping cart before secure checkout at Parampara Ayurvedic Clinic.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/cart",
  },
  openGraph: {
    title: "Shopping Cart | Parampara Ayurvedic Clinic",
    description: "Review your selected herbal products and Ayurvedic remedies in your shopping cart.",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
    siteName: "Parampara Ayurvedic Clinic",
  },
};

export default async function CartPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CUSTOMER_SESSION_COOKIE)?.value;
  const session = token ? await verifyCustomerSessionToken(token) : null;

  let items: CartItem[] = [];
  if (session) {
    items = (await sql`
      select id, customer_id, product_name, product_img, unit_price, quantity, created_at, updated_at
      from cart_items
      where customer_id = ${session.sub}
      order by created_at asc
    `) as unknown as CartItem[];
  }

  return (
    <>
      <Breadcrumb />
      <Cart initialItems={items} isLoggedIn={Boolean(session)} />
    </>
  );
}