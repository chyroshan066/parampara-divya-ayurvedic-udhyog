// import { sql } from "@/utils/db";
// import { Envelope, Bell } from "@phosphor-icons/react/dist/ssr";

// export default async function AdminDashboardPage() {
//   const [{ count: totalCount }] = await sql`
//     select count(*)::int as count from contact_messages
//   `;
//   const [{ count: unreadCount }] = await sql`
//     select count(*)::int as count from contact_messages where is_read = false
//   `;

//   const stats = [
//     { label: "TOTAL MESSAGES", value: totalCount, icon: Envelope },
//     { label: "UNREAD MESSAGES", value: unreadCount, icon: Bell },
//   ];

//   return (
//     <div>
//       <h1 className="tw:text-slate-800 tw:text-3xl tw:font-bold tw:mb-2">Dashboard</h1>
//       <p className="tw:text-slate-800/60 tw:text-sm tw:mb-10">
//         Welcome back — here's a quick overview of your clinic.
//       </p>

//       <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:gap-5 tw:max-w-2xl">
//         {stats.map(({ label, value, icon: Icon }) => (
//           <div
//             key={label}
//             className="tw:bg-white tw:rounded-3xl tw:p-6 tw:border tw:border-gray-100 tw:flex tw:items-center tw:gap-x-4"
//           >
//             <div className="tw:flex tw:items-center tw:justify-center tw:w-14 tw:h-14 tw:rounded-full tw:bg-primary/10 tw:text-primary tw:shrink-0">
//               <Icon className="tw:w-6 tw:h-6" weight="bold" />
//             </div>
//             <div>
//               <p className="tw:text-slate-800 tw:text-3xl tw:font-bold tw:leading-tight">
//                 {value}
//               </p>
//               <p className="tw:text-xs tw:font-bold tw:text-primary tw:mt-1">{label}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }







































import Link from "next/link";
import { sql } from "@/utils/db";
import {
  Envelope,
  Bell,
  ShoppingCart,
  ClockCountdown,
  Users,
  UserPlus,
} from "@phosphor-icons/react/dist/ssr";

interface RecentCustomerRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function initials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export default async function AdminDashboardPage() {
  const [{ count: totalMessages }] = await sql`
    select count(*)::int as count from contact_messages
  `;
  const [{ count: unreadMessages }] = await sql`
    select count(*)::int as count from contact_messages where is_read = false
  `;
  const [{ count: totalOrders }] = await sql`
    select count(*)::int as count from orders
  `;
  // "New orders" = orders still sitting in the initial 'pending' status,
  // i.e. ones that haven't been picked up/processed yet — same status
  // value the admin Orders page filters/badges on (see
  // src/constants/order-status.ts).
  const [{ count: newOrders }] = await sql`
    select count(*)::int as count from orders where status = 'pending'
  `;
  const [{ count: totalCustomers }] = await sql`
    select count(*)::int as count from customers
  `;

  // Last 5 signups, most recent first — just enough to spot new
  // customers at a glance; the full list lives on /admin/customers.
  const recentCustomers = (await sql`
    select id, first_name, last_name, email, created_at
    from customers
    order by created_at desc
    limit 5
  `) as unknown as RecentCustomerRow[];

  const stats = [
    { label: "TOTAL ORDERS", value: totalOrders, icon: ShoppingCart },
    { label: "NEW ORDERS", value: newOrders, icon: ClockCountdown },
    { label: "TOTAL CUSTOMERS", value: totalCustomers, icon: Users },
    { label: "TOTAL MESSAGES", value: totalMessages, icon: Envelope },
    { label: "UNREAD MESSAGES", value: unreadMessages, icon: Bell },
  ];

  return (
    <div>
      <h1 className="tw:text-slate-800 tw:text-3xl tw:font-bold tw:mb-2">Dashboard</h1>
      <p className="tw:text-slate-800/60 tw:text-sm tw:mb-10">
        Welcome back — here's a quick overview of your clinic.
      </p>

      <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:lg:grid-cols-3 tw:gap-5 tw:max-w-4xl tw:mb-10">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="tw:bg-white tw:rounded-3xl tw:p-6 tw:border tw:border-gray-100 tw:flex tw:items-center tw:gap-x-4"
          >
            <div className="tw:flex tw:items-center tw:justify-center tw:w-14 tw:h-14 tw:rounded-full tw:bg-primary/10 tw:text-primary tw:shrink-0">
              <Icon className="tw:w-6 tw:h-6" weight="bold" />
            </div>
            <div>
              <p className="tw:text-slate-800 tw:text-3xl tw:font-bold tw:leading-tight">
                {value}
              </p>
              <p className="tw:text-xs tw:font-bold tw:text-primary tw:mt-1">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="tw:max-w-4xl">
        <div className="tw:flex tw:items-center tw:justify-between tw:mb-4">
          <h2 className="tw:text-slate-800 tw:text-xl tw:font-bold">Recent Customers</h2>
          <Link
            href="/admin/customers"
            className="tw:text-sm tw:font-bold tw:text-primary tw:hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="tw:bg-white tw:rounded-3xl tw:border tw:border-gray-100 tw:overflow-hidden">
          {recentCustomers.length === 0 ? (
            <div className="tw:p-10 tw:text-center tw:text-slate-800/60">
              No customers have signed up yet.
            </div>
          ) : (
            <div className="tw:divide-y tw:divide-gray-100">
              {recentCustomers.map((customer) => (
                <Link
                  key={customer.id}
                  href={`/admin/customers#customer-${customer.id}`}
                  className="tw:group tw:flex tw:items-center tw:justify-between tw:gap-x-4 tw:px-6 tw:py-4 tw:hover:bg-gray-50/50 tw:transition-colors"
                >
                  <div className="tw:flex tw:items-center tw:gap-x-3 tw:min-w-0">
                    <div className="tw:flex tw:items-center tw:justify-center tw:w-10 tw:h-10 tw:rounded-full tw:bg-primary/10 tw:text-primary tw:text-sm tw:font-bold tw:shrink-0">
                      {initials(customer.first_name, customer.last_name)}
                    </div>
                    <div className="tw:min-w-0">
                      <p className="tw:font-bold tw:text-slate-800 tw:truncate tw:group-hover:text-primary tw:transition-colors">
                        {customer.first_name} {customer.last_name}
                      </p>
                      <p className="tw:text-xs tw:text-slate-800/60 tw:truncate">
                        {customer.email}
                      </p>
                    </div>
                  </div>
                  <div className="tw:flex tw:items-center tw:gap-x-1.5 tw:text-xs tw:text-slate-800/60 tw:shrink-0">
                    <UserPlus className="tw:w-3.5 tw:h-3.5" weight="bold" />
                    {formatDate(customer.created_at)}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}