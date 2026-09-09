// import { cookies } from "next/headers";
// import { About } from "@/components/About";
// import { Achievement } from "@/components/Achievement";
// import { Banner } from "@/components/Banner";
// // import { Care } from "@/components/Care";
// // import { Team } from "@/components/Team";
// import { Testimonial } from "@/components/Testimonial";
// import { Products } from "@/components/Products";
// import { Why } from "@/components/Why";
// import {
//   CUSTOMER_SESSION_COOKIE,
//   verifyCustomerSessionToken,
// } from "@/utils/customer-auth";

// export default async function Home() {
//   const cookieStore = await cookies();
//   const token = cookieStore.get(CUSTOMER_SESSION_COOKIE)?.value;
//   const isLoggedIn = token ? Boolean(await verifyCustomerSessionToken(token)) : false;

//   return (
//     <>
//     <Banner/>
//     {/* <Care /> */}
//     <Products isLoggedIn={isLoggedIn} />
//     <About />
//     <Achievement />
//     <Why />
//     <Testimonial />
//     {/* <Team /> */}
//     </>
//   );
// }

































import { cookies } from "next/headers";
import { sql } from "@/utils/db";
import { About } from "@/components/About";
import { Achievement } from "@/components/Achievement";
import { Banner } from "@/components/Banner";
import { Testimonial } from "@/components/Testimonial";
import { Products } from "@/components/Products";
import { Why } from "@/components/Why";
import {
  CUSTOMER_SESSION_COOKIE,
  verifyCustomerSessionToken,
} from "@/utils/customer-auth";
import type { Product } from "@/types/product";

export default async function Home() {
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
      <Banner />
      <Products products={products} isLoggedIn={isLoggedIn} />
      <About />
      <Achievement />
      <Why />
      <Testimonial />
    </>
  );
}