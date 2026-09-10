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