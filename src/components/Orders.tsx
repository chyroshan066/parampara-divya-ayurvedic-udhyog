"use client";

import { useState } from "react";
import Link from "next/link";
import type { OrderWithItems } from "@/types/order";
import { Toast, type ToastType } from "@/components/Toast";

interface OrdersProps {
  initialOrders: OrderWithItems[];
  isLoggedIn: boolean;
}

interface ToastState {
  type: ToastType;
  message: string;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function orderTotal(items: OrderWithItems["items"]) {
  return items.reduce(
    (sum, item) => sum + Number(item.unit_price) * item.quantity,
    0
  );
}

export const Orders = ({ initialOrders, isLoggedIn }: OrdersProps) => {
  const [orders, setOrders] = useState<OrderWithItems[]>(initialOrders);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const handleCancel = async (orderId: string) => {
    setBusyId(orderId);
    try {
      const res = await fetch(`/api/customer/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setToast({
          type: "error",
          message: data.error || "Couldn't cancel this order.",
        });
        return;
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: "cancelled" } : order
        )
      );
      setToast({ type: "success", message: "Order cancelled." });
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (orderId: string) => {
    setBusyId(orderId);
    try {
      const res = await fetch(`/api/customer/orders/${orderId}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setToast({
          type: "error",
          message: data.error || "Couldn't remove this order.",
        });
        return;
      }

      setOrders((prev) => prev.filter((order) => order.id !== orderId));
      setToast({ type: "success", message: "Order removed." });
    } finally {
      setBusyId(null);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="ayur-bgcover ayur-orderspage-wrapper">
        <div className="container">
          <p>
            <Link href="/login?redirectTo=/orders">Log in</Link> to view your
            orders.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="ayur-bgcover ayur-orderspage-wrapper">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12">
            {orders.length === 0 ? (
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
                <h3 className="ayur-empty-state-title">No Orders Yet</h3>
                <p className="ayur-empty-state-text">
                  Looks like you haven&apos;t placed any orders. Once you do,
                  they&apos;ll show up here so you can track and manage them.
                </p>
                <Link href="/shop" className="ayur-btn ayur-empty-state-btn">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="ayur-order-list">
                {orders.map((order) => {
                  const isBusy = busyId === order.id;
                  // A customer can only cancel while it's still
                  // pending — once admin marks it processing/shipped,
                  // cancellation is admin's call from then on.
                  const canCancel = order.status === "pending";
                  // Removing from history is only offered once the
                  // order has reached a terminal state, so an active
                  // order never disappears from the admin dashboard
                  // mid-flight.
                  const canDelete =
                    order.status === "cancelled" || order.status === "delivered";

                  return (
                    <div key={order.id} className="ayur-order-card">
                      <div className="ayur-order-card-head">
                        <div>
                          <p className="ayur-order-date">
                            {formatDate(order.created_at)}
                          </p>
                        </div>
                        <span
                          className={`ayur-order-status ayur-order-status-${order.status}`}
                        >
                          {STATUS_LABELS[order.status] ?? order.status}
                        </span>
                      </div>

                      <div className="ayur-cart-table table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Product Image</th>
                              <th>Product Name</th>
                              <th>Unit Price</th>
                              <th>Quantity</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map((item) => (
                              <tr key={item.id}>
                                <td>
                                  {item.product_img && (
                                    <img
                                      src={item.product_img}
                                      alt={item.product_name}
                                    />
                                  )}
                                </td>
                                <td>
                                  <h2>{item.product_name}</h2>
                                </td>
                                <td>Rs.{item.unit_price}</td>
                                <td>{item.quantity}</td>
                                <td>
                                  Rs.
                                  {(
                                    Number(item.unit_price) * item.quantity
                                  ).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="ayur-order-card-foot">
                        <p className="ayur-order-total">
                          Total: <span>Rs.{orderTotal(order.items).toFixed(2)}</span>
                        </p>
                        <div className="ayur-order-actions">
                          {canCancel && (
                            <button
                              type="button"
                              className="ayur-btn ayur-order-cancel-btn"
                              onClick={() => handleCancel(order.id)}
                              disabled={isBusy}
                            >
                              {isBusy ? "Cancelling..." : "Cancel Order"}
                            </button>
                          )}
                          {canDelete && (
                            <button
                              type="button"
                              className="ayur-btn ayur-order-delete-btn"
                              onClick={() => handleDelete(order.id)}
                              disabled={isBusy}
                            >
                              {isBusy ? "Removing..." : "Delete"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          position="bottom-right"
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};