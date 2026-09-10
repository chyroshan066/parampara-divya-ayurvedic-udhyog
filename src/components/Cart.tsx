"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { CartItem } from "@/types/cart";
import { Toast, type ToastType } from "@/components/Toast";

const POST_ORDER_REDIRECT = "/orders";

interface CartProps {
  initialItems: CartItem[];
  isLoggedIn: boolean;
}

interface ToastState {
  type: ToastType;
  message: string;
}

export const Cart = ({ initialItems, isLoggedIn }: CartProps) => {
  const router = useRouter();

  const [items, setItems] = useState<CartItem[]>(initialItems);
  // Last-known-saved quantity per item id, so we know which rows have
  // unsaved edits and only PATCH the ones that actually changed.
  const [savedQuantities, setSavedQuantities] = useState<
    Record<string, number>
  >(() =>
    Object.fromEntries(initialItems.map((item) => [item.id, item.quantity])),
  );

  const [removingId, setRemovingId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  // Horizontal-scroll hint for the cart table on narrow screens: only
  // shown while the table actually overflows its container, and hidden
  // for good the first time the user scrolls it.
  const cartScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollCart, setCanScrollCart] = useState(false);
  const [hasScrolledCart, setHasScrolledCart] = useState(false);

  useEffect(() => {
    const el = cartScrollRef.current;
    if (!el) return;

    const checkOverflow = () => {
      setCanScrollCart(el.scrollWidth > el.clientWidth + 1);
    };

    checkOverflow();
    const observer = new ResizeObserver(checkOverflow);
    observer.observe(el);
    return () => observer.disconnect();
  }, [items.length]);

  const handleCartScroll = () => {
    if (!hasScrolledCart && (cartScrollRef.current?.scrollLeft ?? 0) > 4) {
      setHasScrolledCart(true);
    }
  };

  const isBusy = isUpdating || isPlacingOrder || removingId !== null;

  const hasUnsavedChanges = useMemo(
    () => items.some((item) => item.quantity !== savedQuantities[item.id]),
    [items, savedQuantities],
  );

  const updateLocalQuantity = (id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const handleUpdateCart = async () => {
    const changed = items.filter(
      (item) => item.quantity !== savedQuantities[item.id],
    );
    if (changed.length === 0) return;

    const invalid = changed.find(
      (item) => !Number.isInteger(item.quantity) || item.quantity < 1,
    );
    if (invalid) {
      setToast({ type: "error", message: "Quantity must be at least 1." });
      return;
    }

    setIsUpdating(true);
    try {
      const results = await Promise.allSettled(
        changed.map((item) =>
          fetch(`/api/customer/cart/${item.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity: item.quantity }),
          }).then((res) => {
            if (!res.ok) throw new Error();
            return item;
          }),
        ),
      );

      const succeededIds = new Set(
        results
          .filter(
            (r): r is PromiseFulfilledResult<CartItem> =>
              r.status === "fulfilled",
          )
          .map((r) => r.value.id),
      );
      const failedCount = results.length - succeededIds.size;

      setSavedQuantities((prev) => {
        const next = { ...prev };
        for (const item of changed) {
          if (succeededIds.has(item.id)) next[item.id] = item.quantity;
        }
        return next;
      });

      if (failedCount === 0) {
        setToast({ type: "success", message: "Cart updated." });
      } else if (succeededIds.size === 0) {
        setToast({
          type: "error",
          message: "Couldn't update your cart. Please try again.",
        });
      } else {
        setToast({
          type: "error",
          message: `Updated ${succeededIds.size} item${succeededIds.size === 1 ? "" : "s"}, but ${failedCount} failed.`,
        });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async (id: string) => {
    setRemovingId(id);
    try {
      const res = await fetch(`/api/customer/cart/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setToast({
          type: "error",
          message: data.error || "Couldn't remove that item.",
        });
        return;
      }
      setItems((prev) => prev.filter((item) => item.id !== id));
      setSavedQuantities((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      setToast({ type: "success", message: "Item removed from cart." });
    } finally {
      setRemovingId(null);
    }
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0 || isBusy) return;

    setIsPlacingOrder(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productName: item.product_name,
            productImg: item.product_img,
            unitPrice: Number(item.unit_price),
            quantity: item.quantity,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setToast({
          type: "error",
          message: data.error || "Couldn't place your order.",
        });
        return;
      }

      // Best-effort cleanup of the now-ordered cart rows. The order was
      // already created successfully, so we don't roll anything back if
      // one of these fails — the cart will just still show the item.
      await Promise.allSettled(
        items.map((item) =>
          fetch(`/api/customer/cart/${item.id}`, { method: "DELETE" }),
        ),
      );

      setItems([]);
      setSavedQuantities({});
      setToast({
        type: "success",
        message: "Order placed successfully! Redirecting...",
      });

      setTimeout(() => {
        router.push(POST_ORDER_REDIRECT);
      }, 1500);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const total = items.reduce(
    (sum, item) => sum + Number(item.unit_price) * item.quantity,
    0,
  );

  if (!isLoggedIn) {
    return (
      <div className="ayur-bgcover ayur-cartpage-wrapper">
        <div className="container">
          <p>
            <Link href="/login?redirectTo=/cart">Log in</Link> to view your
            cart.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="ayur-bgcover ayur-cartpage-wrapper">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12">
            {items.length === 0 ? (
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
                      d="M6 7h12l-1 13a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 7Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 7V5a3 3 0 0 1 6 0v2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <h3 className="ayur-empty-state-title">Your Cart is Empty</h3>
                <p className="ayur-empty-state-text">
                  Looks like you haven&apos;t added anything yet. Browse our
                  products and find something you&apos;ll love.
                </p>
                <Link href="/shop" className="ayur-btn ayur-empty-state-btn">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <>
                <div className="ayur-cart-table">
                  <div
                    className={`ayur-cart-scroll${
                      canScrollCart && !hasScrolledCart
                        ? " ayur-cart-scroll--hint"
                        : ""
                    }`}
                    ref={cartScrollRef}
                    onScroll={handleCartScroll}
                  >
                    <table className="table">
                      <thead>
                        <tr>
                          <th>S.No.</th>
                          <th>Product Image</th>
                          <th>Product Name</th>
                          <th>Unit Price</th>
                          <th>Quantity</th>
                          <th>Total</th>
                          <th>Remove</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, index) => (
                          <tr key={item.id}>
                            <td>{index + 1}</td>
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
                            <td>
                              <input
                                type="number"
                                value={item.quantity}
                                min={1}
                                disabled={isBusy}
                                onChange={(e) =>
                                  updateLocalQuantity(
                                    item.id,
                                    Number(e.target.value),
                                  )
                                }
                              />
                            </td>
                            <td>
                              Rs.
                              {(Number(item.unit_price) * item.quantity).toFixed(
                                2,
                              )}
                            </td>
                            <td>
                              <button
                                type="button"
                                className="ayur-tab-delete"
                                onClick={() => !isBusy && handleRemove(item.id)}
                              >
                                <img src="/images/delete.png" alt="delete" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div
                    className="ayur-updatecart-btn-wrapper"
                    style={{ textAlign: "right", marginTop: 20 }}
                  >
                    <button
                      type="button"
                      className="ayur-btn"
                      onClick={handleUpdateCart}
                      disabled={!hasUnsavedChanges || isBusy}
                    >
                      {isUpdating ? "Updating..." : "Update Cart"}
                    </button>
                  </div>
                </div>
                <div className="ayur-carttotal-wrapper">
                  <div className="ayur-cart-total">
                    <h2>Cart Totals</h2>
                    <table className="table table-bordere">
                      <tbody>
                        <tr className="ayur-ordertotal">
                          <th>Total</th>
                          <td>
                            <span className="amount">
                              Rs.{total.toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="ayur-checkout-btn">
                      <button
                        type="button"
                        className="ayur-btn"
                        onClick={() => !isBusy && handlePlaceOrder()}
                      >
                        {isPlacingOrder ? "Placing Order..." : "Order"}
                      </button>
                    </div>
                  </div>
                </div>
              </>
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