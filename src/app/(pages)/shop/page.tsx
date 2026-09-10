import { cookies } from "next/headers";
import { sql } from "@/utils/db";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Products } from "@/components/Products";
import {
  CUSTOMER_SESSION_COOKIE,
  verifyCustomerSessionToken,
} from "@/utils/customer-auth";
import type { Product } from "@/types/product";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Authentic Ayurvedic Products | Parampara Ayurvedic Clinic",
  description: "Browse and buy authentic herbal medicines, wellness oils, and natural health products online from Parampara Ayurvedic Clinic in Boudha, Kathmandu.",
  keywords: [
    "ayurvedic store kathmandu",
    "ayurvedic store boudha",
    "ayurvedic store chabahil",
    "ayurvedic store gokarneshwor",
    "ayurvedic store devkota sadak",
    "buy ayurvedic medicine online nepal",
    "ayurvedic clinic in kathmandu",
    "best ayurvedic clinic in kathmandu",
    "ayurvedic clinic in boudha",
    "best ayurvedic clinic in boudha",
    "ayurvedic clinic in chabahil",
    "best ayurvedic clinic in chabahil",
    "ayurvedic clinic in gokarneshwor",
    "best ayurvedic clinic in gokarneshwor",
    "ayurvedic clinic in devkota sadak",
    "best ayurvedic clinic in devkota sadak",
    "herbal products kathmandu",
    "herbal products boudha",
    "herbal products chabahil",
    "herbal products gokarneshwor",
    "herbal products devkota sadak",
  ],
  authors: [{ name: "Parampara Ayurvedic Clinic" }],
  creator: "Parampara Ayurvedic Clinic",
  publisher: "Parampara Ayurvedic Clinic",
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    title: "Shop Ayurvedic Remedies & Products | Parampara Ayurvedic Clinic",
    description: "Discover our selection of premium herbal remedies and authentic Ayurvedic products crafted for natural health and wellness.",
    type: "website",
    locale: "en_US",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/shop`,
    siteName: "Parampara Ayurvedic Clinic",
    images: [
      {
        url: "/images/preview.webp",
        width: 1200,
        height: 630,
        alt: "Parampara Ayurvedic Clinic Online Shop",
      },
    ],
  },
};

export default async function ShopPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CUSTOMER_SESSION_COOKIE)?.value;
  const isLoggedIn = token ? Boolean(await verifyCustomerSessionToken(token)) : false;

  const products = (await sql`
    select id, name, description, image_url, image_public_id, price, created_at, updated_at
    from products
    order by created_at desc
  `) as unknown as Product[];

  return (
    <>
      <Breadcrumb />
      {products.length > 0 ? (
        <Products products={products} isLoggedIn={isLoggedIn} showHeading={false} />
      ) : (
        // Unlike the homepage — which just omits <Products /> entirely
        // when there's nothing to show, since it's one section among
        // several — the shop page IS the product listing. Leaving it
        // fully blank here would look broken rather than intentional,
        // so it gets the same .ayur-empty-state treatment already used
        // on /cart and /orders when they're empty.
        <div className="ayur-bgcover ayur-shoppage-wrapper">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="ayur-empty-state">
                  <span className="ayur-empty-state-icon">
                    <svg
                      width="56"
                      height="56"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 7.5L12 3l9 4.5M3 7.5v9L12 21m-9-13.5L12 11m0 10V11m9-3.5v9L12 21m9-13.5L12 11"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <h3 className="ayur-empty-state-title">No Products Yet</h3>
                  <p className="ayur-empty-state-text">
                    We&apos;re still stocking the shelves. Check back soon —
                    new products will show up here as they&apos;re added.
                  </p>
                  <Link href="/" className="ayur-btn ayur-empty-state-btn">
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}