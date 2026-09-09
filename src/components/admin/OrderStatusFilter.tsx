import Link from "next/link";
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  type OrderStatus,
} from "@/constants/order-status";

// Same badge colors as OrderStatusSelect, reused here for visual
// consistency between the filter pills and the per-order status badge.
const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "tw:bg-amber-100 tw:text-amber-700",
  processing: "tw:bg-blue-100 tw:text-blue-700",
  shipped: "tw:bg-indigo-100 tw:text-indigo-700",
  delivered: "tw:bg-emerald-100 tw:text-emerald-700",
  cancelled: "tw:bg-red-100 tw:text-red-700",
};

interface OrderStatusFilterProps {
  selectedStatus: OrderStatus | "all";
  counts: Record<OrderStatus, number>;
  totalCount: number;
}

export function OrderStatusFilter({
  selectedStatus,
  counts,
  totalCount,
}: OrderStatusFilterProps) {
  const options: { value: OrderStatus | "all"; label: string; count: number }[] = [
    { value: "all", label: "All", count: totalCount },
    ...ORDER_STATUSES.map((status) => ({
      value: status,
      label: ORDER_STATUS_LABELS[status],
      count: counts[status] ?? 0,
    })),
  ];

  return (
    <div className="tw:flex tw:flex-wrap tw:gap-2 tw:mb-8">
      {options.map((option) => {
        const isActive = option.value === selectedStatus;
        const activeClass =
          option.value === "all"
            ? "tw:bg-primary tw:text-white"
            : STATUS_STYLES[option.value as OrderStatus];

        // "All" clears the query param entirely rather than sending
        // ?status=all, so the plain /admin/orders URL stays the
        // canonical unfiltered link.
        const href =
          option.value === "all" ? "/admin/orders" : `/admin/orders?status=${option.value}`;

        return (
          <Link
            key={option.value}
            href={href}
            className={`tw:flex tw:items-center tw:gap-x-1.5 tw:text-xs tw:font-bold tw:px-3.5 tw:py-1.5 tw:rounded-full tw:capitalize tw:transition-colors ${
              isActive
                ? activeClass
                : "tw:bg-gray-100 tw:text-slate-800/60 tw:hover:bg-gray-200"
            }`}
          >
            {option.label}
            <span className={isActive ? "tw:opacity-80" : "tw:opacity-60"}>
              {option.count}
            </span>
          </Link>
        );
      })}
    </div>
  );
}