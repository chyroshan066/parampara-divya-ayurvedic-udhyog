// import Link from "next/link";
// import { sql } from "@/utils/db";
// import { ShoppingCart } from "@phosphor-icons/react/dist/ssr";
// import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";

// interface OrderItemRow {
//   productName: string;
//   productImg: string | null;
//   unitPrice: string;
//   quantity: number;
// }

// interface OrderRow {
//   orderId: string;
//   createdAt: string;
//   status: string;
//   items: OrderItemRow[];
// }

// interface CustomerOrdersRow {
//   customer_id: string;
//   first_name: string;
//   last_name: string;
//   email: string;
//   orders: OrderRow[];
// }

// function formatDate(iso: string) {
//   return new Date(iso).toLocaleString("en-US", {
//     dateStyle: "medium",
//     timeStyle: "short",
//   });
// }

// function orderTotal(items: OrderItemRow[]) {
//   return items.reduce(
//     (sum, item) => sum + Number(item.unitPrice) * item.quantity,
//     0
//   );
// }

// export default async function AdminOrdersPage() {
//   // One row per customer, with all of their orders (each with its own
//   // nested items) aggregated into a single `orders` JSON array — so a
//   // customer who has ordered five times still appears as one row here,
//   // not five, and a new order from a returning customer joins their
//   // existing group automatically rather than creating a new one.
//   const customerOrders = (await sql`
//     select
//       c.id as customer_id,
//       c.first_name,
//       c.last_name,
//       c.email,
//       json_agg(
//         json_build_object(
//           'orderId', o.id,
//           'createdAt', o.created_at,
//           'status', o.status,
//           'items', (
//             select json_agg(
//               json_build_object(
//                 'productName', oi.product_name,
//                 'productImg', oi.product_img,
//                 'unitPrice', oi.unit_price,
//                 'quantity', oi.quantity
//               ) order by oi.created_at
//             )
//             from order_items oi
//             where oi.order_id = o.id
//           )
//         ) order by o.created_at desc
//       ) as orders
//     from customers c
//     join orders o on o.customer_id = c.id
//     group by c.id, c.first_name, c.last_name, c.email
//     order by max(o.created_at) desc
//   `) as unknown as CustomerOrdersRow[];

//   const totalOrders = customerOrders.reduce(
//     (sum, customer) => sum + customer.orders.length,
//     0
//   );

//   return (
//     <div>
//       <h1 className="tw:text-slate-800 tw:text-3xl tw:font-bold tw:mb-2">
//         Orders
//       </h1>
//       <p className="tw:text-slate-800/60 tw:text-sm tw:mb-10">
//         {totalOrders === 0
//           ? "No orders yet."
//           : `${totalOrders} order${totalOrders === 1 ? "" : "s"} from ${
//               customerOrders.length
//             } customer${customerOrders.length === 1 ? "" : "s"}.`}
//       </p>

//       <div className="tw:flex tw:flex-col tw:gap-y-6 tw:max-w-4xl">
//         {customerOrders.map((customer) => {
//           const customerTotal = customer.orders.reduce(
//             (sum, order) => sum + orderTotal(order.items),
//             0
//           );

//           return (
//             <div
//               key={customer.customer_id}
//               className="tw:bg-white tw:rounded-3xl tw:border tw:border-gray-100 tw:overflow-hidden"
//             >
//               <div className="tw:flex tw:items-center tw:justify-between tw:gap-x-4 tw:px-6 tw:py-4 tw:border-b tw:border-gray-100 tw:bg-gray-50/50">
//                 <div className="tw:flex tw:items-center tw:gap-x-3 tw:min-w-0">
//                   <div className="tw:flex tw:items-center tw:justify-center tw:w-10 tw:h-10 tw:rounded-full tw:bg-primary/10 tw:text-primary tw:shrink-0">
//                     <ShoppingCart className="tw:w-5 tw:h-5" weight="bold" />
//                   </div>
//                   {/* Links through to that customer's card on the
//                       Customers page — see #customer-<id> anchor there. */}
//                   <Link
//                     href={`/admin/customers#customer-${customer.customer_id}`}
//                     className="tw:group tw:min-w-0"
//                   >
//                     <p className="tw:font-bold tw:text-slate-800 tw:truncate tw:group-hover:text-primary tw:transition-colors">
//                       {customer.first_name} {customer.last_name}
//                     </p>
//                     <p className="tw:text-xs tw:text-slate-800/60 tw:truncate tw:group-hover:text-primary/70 tw:transition-colors">
//                       {customer.email}
//                     </p>
//                   </Link>
//                 </div>
//                 <div className="tw:text-right tw:shrink-0">
//                   <p className="tw:font-bold tw:text-slate-800">
//                     Rs. {customerTotal.toFixed(2)}
//                   </p>
//                   <p className="tw:text-xs tw:text-slate-800/60">
//                     {customer.orders.length} order
//                     {customer.orders.length === 1 ? "" : "s"}
//                   </p>
//                 </div>
//               </div>

//               <div className="tw:divide-y tw:divide-gray-100">
//                 {customer.orders.map((order) => (
//                   <div key={order.orderId} className="tw:px-6 tw:py-4">
//                     <div className="tw:flex tw:items-center tw:justify-between tw:mb-3">
//                       <p className="tw:text-xs tw:font-bold tw:text-slate-800/60 tw:uppercase tw:tracking-wide">
//                         {formatDate(order.createdAt)}
//                       </p>
//                       <OrderStatusSelect
//                         orderId={order.orderId}
//                         status={order.status}
//                       />
//                     </div>
//                     <div className="tw:flex tw:flex-col tw:gap-y-2">
//                       {order.items.map((item, index) => (
//                         <div
//                           key={index}
//                           className="tw:flex tw:items-center tw:justify-between tw:gap-x-4 tw:text-sm"
//                         >
//                           <span className="tw:text-slate-800">
//                             {item.productName}{" "}
//                             <span className="tw:text-slate-800/60">
//                               × {item.quantity}
//                             </span>
//                           </span>
//                           <span className="tw:font-bold tw:text-slate-800">
//                             Rs. {(Number(item.unitPrice) * item.quantity).toFixed(2)}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           );
//         })}

//         {customerOrders.length === 0 && (
//           <div className="tw:bg-white tw:rounded-3xl tw:border tw:border-gray-100 tw:p-10 tw:text-center tw:text-slate-800/60">
//             Orders placed on the storefront will show up here, grouped by
//             customer.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }














































import Link from "next/link";
import { sql } from "@/utils/db";
import { ShoppingCart } from "@phosphor-icons/react/dist/ssr";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { ORDER_STATUSES, ORDER_STATUS_LABELS, type OrderStatus } from "@/constants/order-status";
import { OrderStatusFilter } from "@/components/admin/OrderStatusFilter";

interface OrderItemRow {
  productName: string;
  productImg: string | null;
  unitPrice: string;
  quantity: number;
}

interface OrderRow {
  orderId: string;
  createdAt: string;
  status: string;
  items: OrderItemRow[];
}

interface CustomerOrdersRow {
  customer_id: string;
  first_name: string;
  last_name: string;
  email: string;
  orders: OrderRow[];
}

interface StatusCountRow {
  status: OrderStatus;
  count: number;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function orderTotal(items: OrderItemRow[]) {
  return items.reduce(
    (sum, item) => sum + Number(item.unitPrice) * item.quantity,
    0
  );
}

function isOrderStatus(value: string | undefined): value is OrderStatus {
  return !!value && (ORDER_STATUSES as readonly string[]).includes(value);
}

interface AdminOrdersPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const { status } = await searchParams;
  // Anything that isn't one of the known statuses (missing param,
  // typo'd query string, etc.) falls back to "all" rather than
  // erroring or silently showing an empty list.
  const selectedStatus: OrderStatus | "all" = isOrderStatus(status) ? status : "all";

  // Per-status counts for the filter pill badges. Queried across ALL
  // orders (not just the current filter) so every pill always shows
  // its true count, not just the count within whatever's selected.
  const statusCountRows = (await sql`
    select status, count(*)::int as count
    from orders
    group by status
  `) as unknown as StatusCountRow[];

  const counts = statusCountRows.reduce((acc, row) => {
    acc[row.status] = row.count;
    return acc;
  }, {} as Record<OrderStatus, number>);

  const totalCountAllStatuses = statusCountRows.reduce((sum, row) => sum + row.count, 0);

  // One row per customer, with all of their orders (each with its own
  // nested items) aggregated into a single `orders` JSON array — so a
  // customer who has ordered five times still appears as one row here,
  // not five, and a new order from a returning customer joins their
  // existing group automatically rather than creating a new one.
  //
  // When a status filter is active, it's applied in the JOIN's WHERE
  // clause (before the GROUP BY) — so only matching orders are
  // aggregated, and a customer with zero orders in that status drops
  // out of the list entirely rather than showing up with an empty
  // orders array.
  const customerOrders = (
    selectedStatus === "all"
      ? await sql`
          select
            c.id as customer_id,
            c.first_name,
            c.last_name,
            c.email,
            json_agg(
              json_build_object(
                'orderId', o.id,
                'createdAt', o.created_at,
                'status', o.status,
                'items', (
                  select json_agg(
                    json_build_object(
                      'productName', oi.product_name,
                      'productImg', oi.product_img,
                      'unitPrice', oi.unit_price,
                      'quantity', oi.quantity
                    ) order by oi.created_at
                  )
                  from order_items oi
                  where oi.order_id = o.id
                )
              ) order by o.created_at desc
            ) as orders
          from customers c
          join orders o on o.customer_id = c.id
          group by c.id, c.first_name, c.last_name, c.email
          order by max(o.created_at) desc
        `
      : await sql`
          select
            c.id as customer_id,
            c.first_name,
            c.last_name,
            c.email,
            json_agg(
              json_build_object(
                'orderId', o.id,
                'createdAt', o.created_at,
                'status', o.status,
                'items', (
                  select json_agg(
                    json_build_object(
                      'productName', oi.product_name,
                      'productImg', oi.product_img,
                      'unitPrice', oi.unit_price,
                      'quantity', oi.quantity
                    ) order by oi.created_at
                  )
                  from order_items oi
                  where oi.order_id = o.id
                )
              ) order by o.created_at desc
            ) as orders
          from customers c
          join orders o on o.customer_id = c.id
          where o.status = ${selectedStatus}
          group by c.id, c.first_name, c.last_name, c.email
          order by max(o.created_at) desc
        `
  ) as unknown as CustomerOrdersRow[];

  const totalOrders = customerOrders.reduce(
    (sum, customer) => sum + customer.orders.length,
    0
  );

  const emptyStateMessage =
    selectedStatus === "all"
      ? "Orders placed on the storefront will show up here, grouped by customer."
      : `No ${ORDER_STATUS_LABELS[selectedStatus].toLowerCase()} orders right now.`;

  return (
    <div>
      <h1 className="tw:text-slate-800 tw:text-3xl tw:font-bold tw:mb-2">
        Orders
      </h1>
      <p className="tw:text-slate-800/60 tw:text-sm tw:mb-6">
        {totalOrders === 0
          ? selectedStatus === "all"
            ? "No orders yet."
            : `No ${ORDER_STATUS_LABELS[selectedStatus].toLowerCase()} orders.`
          : `${totalOrders} order${totalOrders === 1 ? "" : "s"} from ${
              customerOrders.length
            } customer${customerOrders.length === 1 ? "" : "s"}.`}
      </p>

      <OrderStatusFilter
        selectedStatus={selectedStatus}
        counts={counts}
        totalCount={totalCountAllStatuses}
      />

      <div className="tw:flex tw:flex-col tw:gap-y-6 tw:max-w-4xl">
        {customerOrders.map((customer) => {
          const customerTotal = customer.orders.reduce(
            (sum, order) => sum + orderTotal(order.items),
            0
          );

          return (
            <div
              key={customer.customer_id}
              className="tw:bg-white tw:rounded-3xl tw:border tw:border-gray-100 tw:overflow-hidden"
            >
              <div className="tw:flex tw:items-center tw:justify-between tw:gap-x-4 tw:px-6 tw:py-4 tw:border-b tw:border-gray-100 tw:bg-gray-50/50">
                <div className="tw:flex tw:items-center tw:gap-x-3 tw:min-w-0">
                  <div className="tw:flex tw:items-center tw:justify-center tw:w-10 tw:h-10 tw:rounded-full tw:bg-primary/10 tw:text-primary tw:shrink-0">
                    <ShoppingCart className="tw:w-5 tw:h-5" weight="bold" />
                  </div>
                  {/* Links through to that customer's card on the
                      Customers page — see #customer-<id> anchor there. */}
                  <Link
                    href={`/admin/customers#customer-${customer.customer_id}`}
                    className="tw:group tw:min-w-0"
                  >
                    <p className="tw:font-bold tw:text-slate-800 tw:truncate tw:group-hover:text-primary tw:transition-colors">
                      {customer.first_name} {customer.last_name}
                    </p>
                    <p className="tw:text-xs tw:text-slate-800/60 tw:truncate tw:group-hover:text-primary/70 tw:transition-colors">
                      {customer.email}
                    </p>
                  </Link>
                </div>
                <div className="tw:text-right tw:shrink-0">
                  <p className="tw:font-bold tw:text-slate-800">
                    Rs. {customerTotal.toFixed(2)}
                  </p>
                  <p className="tw:text-xs tw:text-slate-800/60">
                    {customer.orders.length} order
                    {customer.orders.length === 1 ? "" : "s"}
                  </p>
                </div>
              </div>

              <div className="tw:divide-y tw:divide-gray-100">
                {customer.orders.map((order) => (
                  <div key={order.orderId} className="tw:px-6 tw:py-4">
                    <div className="tw:flex tw:items-center tw:justify-between tw:mb-3">
                      <p className="tw:text-xs tw:font-bold tw:text-slate-800/60 tw:uppercase tw:tracking-wide">
                        {formatDate(order.createdAt)}
                      </p>
                      <OrderStatusSelect
                        orderId={order.orderId}
                        status={order.status}
                      />
                    </div>
                    <div className="tw:flex tw:flex-col tw:gap-y-2">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="tw:flex tw:items-center tw:justify-between tw:gap-x-4 tw:text-sm"
                        >
                          <span className="tw:text-slate-800">
                            {item.productName}{" "}
                            <span className="tw:text-slate-800/60">
                              × {item.quantity}
                            </span>
                          </span>
                          <span className="tw:font-bold tw:text-slate-800">
                            Rs. {(Number(item.unitPrice) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {customerOrders.length === 0 && (
          <div className="tw:bg-white tw:rounded-3xl tw:border tw:border-gray-100 tw:p-10 tw:text-center tw:text-slate-800/60">
            {emptyStateMessage}
          </div>
        )}
      </div>
    </div>
  );
}