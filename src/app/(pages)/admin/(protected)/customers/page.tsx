// import { sql } from "@/utils/db";
// import { User, Phone, MapPin, Envelope } from "@phosphor-icons/react/dist/ssr";

// interface CustomerListRow {
//   customerId: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string | null;
//   address: string | null;
//   createdAt: string;
//   orderCount: number;
//   lifetimeTotal: string;
// }

// function formatJoinedDate(iso: string) {
//   return new Date(iso).toLocaleDateString("en-US", {
//     dateStyle: "medium",
//   });
// }

// export default async function AdminCustomersPage() {
//   // Left join (not the inner join the Orders page uses) so a customer
//   // who has signed up but never ordered still shows up here — this page
//   // is a directory of everyone with an account, not just buyers.
//   const customers = (await sql`
//     select
//       c.id as "customerId",
//       c.first_name as "firstName",
//       c.last_name as "lastName",
//       c.email,
//       c.phone,
//       c.address,
//       c.created_at as "createdAt",
//       count(distinct o.id) as "orderCount",
//       coalesce(sum(oi.unit_price * oi.quantity), 0) as "lifetimeTotal"
//     from customers c
//     left join orders o on o.customer_id = c.id
//     left join order_items oi on oi.order_id = o.id
//     group by c.id, c.first_name, c.last_name, c.email, c.phone, c.address, c.created_at
//     order by c.created_at desc
//   `) as unknown as CustomerListRow[];

//   return (
//     <div>
//       {/* Highlights whichever card is jumped to via #customer-<id> (e.g.
//           from a customer's name/email on the Orders page) with a
//           primary-colored border and tint, so it's obvious which one you
//           landed on. Stays highlighted as long as that's the active
//           anchor — it clears once you navigate to a different customer
//           or off the page. scroll-mt gives the anchor some breathing
//           room above the fold in case the topbar is sticky. This isn't
//           wrapped in @layer, so — per the cascade-layers rule set up in
//           legacy.css — it beats the tw: utility classes on border-color
//           regardless of specificity. */}
//       <style>{`
//         .ayur-customer-card {
//           transition: border-color 0.2s ease, border-width 0.2s ease, background-color 0.2s ease;
//         }
//         .ayur-customer-card:target {
//           border-width: 2px;
//           border-color: var(--ayur-primary-color, #b9765f);
//           background-color: var(--ayur-primary-lightcolor, #fdf1ec);
//         }
//       `}</style>

//       <h1 className="tw:text-slate-800 tw:text-3xl tw:font-bold tw:mb-2">
//         Customers
//       </h1>
//       <p className="tw:text-slate-800/60 tw:text-sm tw:mb-10">
//         {customers.length === 0
//           ? "No accounts yet."
//           : `${customers.length} registered customer${
//               customers.length === 1 ? "" : "s"
//             }.`}
//       </p>

//       <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:xl:grid-cols-3 tw:gap-6 tw:max-w-6xl">
//         {customers.map((customer) => (
//           <div
//             key={customer.customerId}
//             id={`customer-${customer.customerId}`}
//             className="ayur-customer-card tw:scroll-mt-24 tw:bg-white tw:rounded-3xl tw:border tw:border-gray-100 tw:p-6 tw:flex tw:flex-col tw:gap-y-4"
//           >
//             <div className="tw:flex tw:items-center tw:gap-x-3">
//               <div className="tw:flex tw:items-center tw:justify-center tw:w-11 tw:h-11 tw:rounded-full tw:bg-primary/10 tw:text-primary tw:shrink-0">
//                 <User className="tw:w-5 tw:h-5" weight="bold" />
//               </div>
//               <div className="tw:min-w-0">
//                 <p className="tw:font-bold tw:text-slate-800 tw:truncate">
//                   {customer.firstName} {customer.lastName}
//                 </p>
//                 <p className="tw:text-xs tw:text-slate-800/60">
//                   Joined {formatJoinedDate(customer.createdAt)}
//                 </p>
//               </div>
//             </div>

//             <div className="tw:flex tw:flex-col tw:gap-y-2 tw:text-sm">
//               <div className="tw:flex tw:items-center tw:gap-x-2 tw:text-slate-800/80">
//                 <Envelope className="tw:w-4 tw:h-4 tw:shrink-0 tw:text-slate-800/40" />
//                 <span className="tw:truncate">{customer.email}</span>
//               </div>
//               <div className="tw:flex tw:items-center tw:gap-x-2 tw:text-slate-800/80">
//                 <Phone className="tw:w-4 tw:h-4 tw:shrink-0 tw:text-slate-800/40" />
//                 <span>{customer.phone || "Not provided"}</span>
//               </div>
//               <div className="tw:flex tw:items-start tw:gap-x-2 tw:text-slate-800/80">
//                 <MapPin className="tw:w-4 tw:h-4 tw:shrink-0 tw:text-slate-800/40 tw:mt-0.5" />
//                 <span>{customer.address || "Not provided"}</span>
//               </div>
//             </div>

//             <div className="tw:flex tw:items-center tw:justify-between tw:pt-4 tw:border-t tw:border-gray-100">
//               <div>
//                 <p className="tw:text-xs tw:text-slate-800/60">Orders</p>
//                 <p className="tw:font-bold tw:text-slate-800">
//                   {customer.orderCount}
//                 </p>
//               </div>
//               <div className="tw:text-right">
//                 <p className="tw:text-xs tw:text-slate-800/60">Lifetime spend</p>
//                 <p className="tw:font-bold tw:text-slate-800">
//                   Rs. {Number(customer.lifetimeTotal).toFixed(2)}
//                 </p>
//               </div>
//             </div>
//           </div>
//         ))}

//         {customers.length === 0 && (
//           <div className="tw:sm:col-span-2 tw:xl:col-span-3 tw:bg-white tw:rounded-3xl tw:border tw:border-gray-100 tw:p-10 tw:text-center tw:text-slate-800/60">
//             Customers who create an account on the storefront will show up
//             here.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }





























import { sql } from "@/utils/db";
import { User, Phone, MapPin, Envelope } from "@phosphor-icons/react/dist/ssr";
import { CustomerHighlighter } from "@/components/admin/CustomerHighlighter";

interface CustomerListRow {
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  address: string | null;
  createdAt: string;
  orderCount: number;
  lifetimeTotal: string;
}

function formatJoinedDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    dateStyle: "medium",
  });
}

export default async function AdminCustomersPage() {
  // Left join (not the inner join the Orders page uses) so a customer
  // who has signed up but never ordered still shows up here — this page
  // is a directory of everyone with an account, not just buyers.
  const customers = (await sql`
    select
      c.id as "customerId",
      c.first_name as "firstName",
      c.last_name as "lastName",
      c.email,
      c.phone,
      c.address,
      c.created_at as "createdAt",
      count(distinct o.id) as "orderCount",
      coalesce(sum(oi.unit_price * oi.quantity), 0) as "lifetimeTotal"
    from customers c
    left join orders o on o.customer_id = c.id
    left join order_items oi on oi.order_id = o.id
    group by c.id, c.first_name, c.last_name, c.email, c.phone, c.address, c.created_at
    order by c.created_at desc
  `) as unknown as CustomerListRow[];

  return (
    <div>
      {/* Highlights whichever card CustomerHighlighter (a client
          component) determines matches the current #customer-<id>
          hash — e.g. arriving from a customer's name/email on the
          Orders page — with a primary-colored border and tint. Driven
          by a plain class rather than CSS :target (see
          CustomerHighlighter.tsx for why). scroll-mt gives the anchor
          some breathing room above the fold in case the topbar is
          sticky. This isn't wrapped in @layer, so — per the
          cascade-layers rule set up in legacy.css — it beats the tw:
          utility classes on border-color regardless of specificity. */}
      <style>{`
        .ayur-customer-card {
          transition: border-color 0.2s ease, border-width 0.2s ease, background-color 0.2s ease;
        }
        .ayur-customer-card.ayur-customer-highlighted {
          border-width: 2px;
          border-color: var(--ayur-primary-color, #b9765f);
          background-color: var(--ayur-primary-lightcolor, #fdf1ec);
        }
      `}</style>
      <CustomerHighlighter />

      <h1 className="tw:text-slate-800 tw:text-3xl tw:font-bold tw:mb-2">
        Customers
      </h1>
      <p className="tw:text-slate-800/60 tw:text-sm tw:mb-10">
        {customers.length === 0
          ? "No accounts yet."
          : `${customers.length} registered customer${
              customers.length === 1 ? "" : "s"
            }.`}
      </p>

      <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:xl:grid-cols-3 tw:gap-6 tw:max-w-6xl">
        {customers.map((customer) => (
          <div
            key={customer.customerId}
            id={`customer-${customer.customerId}`}
            className="ayur-customer-card tw:scroll-mt-24 tw:bg-white tw:rounded-3xl tw:border tw:border-gray-100 tw:p-6 tw:flex tw:flex-col tw:gap-y-4"
          >
            <div className="tw:flex tw:items-center tw:gap-x-3">
              <div className="tw:flex tw:items-center tw:justify-center tw:w-11 tw:h-11 tw:rounded-full tw:bg-primary/10 tw:text-primary tw:shrink-0">
                <User className="tw:w-5 tw:h-5" weight="bold" />
              </div>
              <div className="tw:min-w-0">
                <p className="tw:font-bold tw:text-slate-800 tw:truncate">
                  {customer.firstName} {customer.lastName}
                </p>
                <p className="tw:text-xs tw:text-slate-800/60">
                  Joined {formatJoinedDate(customer.createdAt)}
                </p>
              </div>
            </div>

            <div className="tw:flex tw:flex-col tw:gap-y-2 tw:text-sm">
              <div className="tw:flex tw:items-center tw:gap-x-2 tw:text-slate-800/80">
                <Envelope className="tw:w-4 tw:h-4 tw:shrink-0 tw:text-slate-800/40" />
                <span className="tw:truncate">{customer.email}</span>
              </div>
              <div className="tw:flex tw:items-center tw:gap-x-2 tw:text-slate-800/80">
                <Phone className="tw:w-4 tw:h-4 tw:shrink-0 tw:text-slate-800/40" />
                <span>{customer.phone || "Not provided"}</span>
              </div>
              <div className="tw:flex tw:items-start tw:gap-x-2 tw:text-slate-800/80">
                <MapPin className="tw:w-4 tw:h-4 tw:shrink-0 tw:text-slate-800/40 tw:mt-0.5" />
                <span>{customer.address || "Not provided"}</span>
              </div>
            </div>

            <div className="tw:flex tw:items-center tw:justify-between tw:pt-4 tw:border-t tw:border-gray-100">
              <div>
                <p className="tw:text-xs tw:text-slate-800/60">Orders</p>
                <p className="tw:font-bold tw:text-slate-800">
                  {customer.orderCount}
                </p>
              </div>
              <div className="tw:text-right">
                <p className="tw:text-xs tw:text-slate-800/60">Lifetime spend</p>
                <p className="tw:font-bold tw:text-slate-800">
                  Rs. {Number(customer.lifetimeTotal).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}

        {customers.length === 0 && (
          <div className="tw:sm:col-span-2 tw:xl:col-span-3 tw:bg-white tw:rounded-3xl tw:border tw:border-gray-100 tw:p-10 tw:text-center tw:text-slate-800/60">
            Customers who create an account on the storefront will show up
            here.
          </div>
        )}
      </div>
    </div>
  );
}