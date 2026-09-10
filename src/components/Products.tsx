"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useProductQuantities } from "@/hooks/useProductQuantities";
import type { Product } from "@/types/product";

const MAX_QUANTITY_PER_PRODUCT = 99;
const TOAST_DURATION_MS = 4000;
const SUCCESS_BUTTON_RESET_MS = 2500;

type OrderButtonStatus = "idle" | "loading" | "success";
type CartButtonStatus = "idle" | "loading" | "success";

interface Toast {
  id: string;
  type: "success" | "error";
  message: string;
}

interface ProductsProps {
  products: Product[];
  isLoggedIn: boolean;
  /**
   * Caps how many products are shown, with a "View More" link for the
   * rest (used on the homepage's teaser section). Omit entirely to
   * show every product with no cap and no "View More" link — this is
   * what /shop does, since it's the full catalog page.
   */
  limit?: number;
  /**
   * Whether to render the "Medicine / Our Top Products" heading above
   * the grid. Defaults to true (the homepage teaser). /shop passes
   * false — it already has its own page heading via Breadcrumb, and
   * doesn't need a second "Our Top Products" label repeated above a
   * page that IS the full products list.
   */
  showHeading?: boolean;
}

export const Products = ({
  products,
  isLoggedIn,
  limit,
  showHeading = true,
}: ProductsProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const displayedProducts = limit ? products.slice(0, limit) : products;
  const hasMoreProducts = limit ? products.length > limit : false;

  const { getQuantity, increaseQuantity, decreaseQuantity } = useProductQuantities({
    min: 0,
    max: MAX_QUANTITY_PER_PRODUCT,
    initialQuantity: 1,
  });

  // Per-button transient state only (loading / a brief "Ordered ✓" /
  // "Added ✓" flash) — this never changes the card's layout, unlike a
  // message paragraph would. The actual notification lives in `toasts`
  // below instead.
  const [orderStatus, setOrderStatus] = useState<Record<string, OrderButtonStatus>>({});
  const [cartStatus, setCartStatus] = useState<Record<string, CartButtonStatus>>({});
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const showToast = (type: Toast["type"], message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => dismissToast(id), TOAST_DURATION_MS);
  };

  const clearOrderButtonStatus = (productId: string) => {
    setOrderStatus((prev) => {
      if (!(productId in prev)) return prev;
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  };

  const clearCartButtonStatus = (productId: string) => {
    setCartStatus((prev) => {
      if (!(productId in prev)) return prev;
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  };

  const goToLogin = () => {
    router.push(`/login?redirectTo=${encodeURIComponent(pathname || "/")}`);
  };

  const handleAddToCart = async (
    productId: string,
    productName: string,
    productImg: string | null,
    unitPrice: number,
    quantity: number
  ) => {
    if (quantity === 0) return;

    // Same reasoning as handleOrder: this is a UX shortcut, not the
    // security boundary — the cart route's own getCustomerSession check
    // (401 handling below) is what actually enforces login.
    if (!isLoggedIn) {
      goToLogin();
      return;
    }

    setCartStatus((prev) => ({ ...prev, [productId]: "loading" }));

    try {
      const res = await fetch("/api/customer/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          productImg,
          unitPrice,
          quantity,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        clearCartButtonStatus(productId);
        if (res.status === 401) {
          goToLogin();
          return;
        }
        showToast("error", data.error || "Something went wrong. Please try again.");
        return;
      }

      setCartStatus((prev) => ({ ...prev, [productId]: "success" }));
      showToast("success", "Added to cart!");
      // Re-renders server components on this route — including
      // layout.tsx's cartCount query — so the header badge picks up
      // the new total immediately instead of waiting for the next
      // navigation.
      router.refresh();
      setTimeout(() => clearCartButtonStatus(productId), SUCCESS_BUTTON_RESET_MS);
    } catch {
      clearCartButtonStatus(productId);
      showToast("error", "Something went wrong. Please try again.");
    }
  };

  const handleOrder = async (
    productId: string,
    productName: string,
    productImg: string | null,
    unitPrice: number,
    quantity: number
  ) => {
    if (quantity === 0) return;

    // Client-side check is just a UX shortcut so a logged-out visitor
    // goes straight to /login instead of round-tripping to the API
    // first — the API's own getCustomerSession check (401 handling
    // below) is what actually enforces this.
    if (!isLoggedIn) {
      goToLogin();
      return;
    }

    setOrderStatus((prev) => ({ ...prev, [productId]: "loading" }));

    try {
      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ productName, productImg, unitPrice, quantity }],
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        clearOrderButtonStatus(productId);
        if (res.status === 401) {
          goToLogin();
          return;
        }
        showToast("error", data.error || "Something went wrong. Please try again.");
        return;
      }

      setOrderStatus((prev) => ({ ...prev, [productId]: "success" }));
      showToast("success", "Order placed successfully!");
      setTimeout(() => clearOrderButtonStatus(productId), SUCCESS_BUTTON_RESET_MS);
    } catch {
      clearOrderButtonStatus(productId);
      showToast("error", "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="ayur-bgcover ayur-topproduct-sec">
      <div className="container">
        {showHeading && (
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12">
              <div className="ayur-heading-wrap">
                <h5>Medicine</h5>
                <h3>Our Top Products</h3>
              </div>
            </div>
          </div>
        )}
        <div className="row">
          {displayedProducts.map((product) => {
            const productId = product.id;
            const quantity = getQuantity(productId);
            const isAtMinQuantity = quantity <= 0;
            const status = orderStatus[productId] ?? "idle";
            const isOrdering = status === "loading";
            const cartBtnStatus = cartStatus[productId] ?? "idle";
            const isAddingToCart = cartBtnStatus === "loading";

            return (
              <div key={productId} className="col-lg-4 col-md-6 col-sm-6">
                <div className="ayur-tpro-box">
                  <div className="ayur-tpro-img">
                    <img
                      src={product.image_url ?? "/images/products/placeholder.jpg"}
                      alt={product.name}
                    />
                  </div>
                  <div className="ayur-tpro-text">
                    <div className="ayur-tpro-toprow">
                      <h3>
                        <a href="shop-single.html">{product.name}</a>
                      </h3>
                      <div className="ayur-tpro-price">
                        <p>Rs.{product.price}</p>
                      </div>
                    </div>

                    <div className="ayur-tpro-actions">
                      <div
                        className="ayur-tpro-qty"
                        role="group"
                        aria-label={`${product.name} quantity`}
                      >
                        <button
                          type="button"
                          className="ayur-qty-btn ayur-qty-btn-minus"
                          onClick={() => decreaseQuantity(productId)}
                          disabled={isAtMinQuantity}
                          aria-label={`Decrease quantity of ${product.name}`}
                        >
                          &minus;
                        </button>
                        <span className="ayur-qty-value" aria-live="polite">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          className="ayur-qty-btn ayur-qty-btn-plus"
                          onClick={() => increaseQuantity(productId)}
                          aria-label={`Increase quantity of ${product.name}`}
                        >
                          +
                        </button>
                      </div>

                      <div className="ayur-tpro-cta-group">
                        <button
                          type="button"
                          className="ayur-btn ayur-tpro-addcart-btn"
                          onClick={() =>
                            handleAddToCart(
                              productId,
                              product.name,
                              product.image_url,
                              Number(product.price),
                              quantity
                            )
                          }
                          disabled={isAtMinQuantity || isAddingToCart}
                        >
                          <span>
                            <svg
                              width="20"
                              height="19"
                              viewBox="0 0 20 19"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M0.826087 2.39643e-08C0.606995 2.39643e-08 0.396877 0.0870339 0.241955 0.241955C0.0870339 0.396877 0 0.606995 0 0.826087C0 1.04518 0.0870339 1.2553 0.241955 1.41022C0.396877 1.56514 0.606995 1.65217 0.826087 1.65217H2.29652C2.4166 1.65238 2.53358 1.69029 2.63096 1.76054C2.72834 1.8308 2.8012 1.92986 2.83926 2.04374L5.56287 10.2162C5.6843 10.5797 5.69917 10.9696 5.60665 11.3413L5.38278 12.2393C5.05317 13.5561 6.07835 14.8696 7.43478 14.8696H17.3478C17.5669 14.8696 17.777 14.7825 17.932 14.6276C18.0869 14.4727 18.1739 14.2626 18.1739 14.0435C18.1739 13.8244 18.0869 13.6143 17.932 13.4593C17.777 13.3044 17.5669 13.2174 17.3478 13.2174H7.43478C7.11261 13.2174 6.90609 12.953 6.98457 12.6416L7.15391 11.9659C7.18244 11.8516 7.24833 11.7501 7.34112 11.6775C7.43391 11.6049 7.54828 11.5654 7.66609 11.5652H16.5217C16.6953 11.5654 16.8646 11.511 17.0055 11.4095C17.1463 11.3081 17.2517 11.1649 17.3065 11.0002L19.508 4.39148C19.5494 4.26729 19.5607 4.13505 19.5409 4.00566C19.5211 3.87626 19.4709 3.75342 19.3943 3.64725C19.3178 3.54108 19.2171 3.45463 19.1005 3.39501C18.984 3.33539 18.855 3.30432 18.7241 3.30435H5.415C5.29478 3.30431 5.17762 3.26649 5.08007 3.19622C4.98253 3.12595 4.90954 3.0268 4.87143 2.91278L4.0883 0.565043C4.03349 0.400482 3.92828 0.257348 3.78757 0.15593C3.64686 0.0545128 3.4778 -4.17427e-05 3.30435 2.39643e-08H0.826087ZM6.6087 15.6957C6.17051 15.6957 5.75028 15.8697 5.44043 16.1796C5.13059 16.4894 4.95652 16.9096 4.95652 17.3478C4.95652 17.786 5.13059 18.2062 5.44043 18.5161C5.75028 18.8259 6.17051 19 6.6087 19C7.04688 19 7.46712 18.8259 7.77696 18.5161C8.0868 18.2062 8.26087 17.786 8.26087 17.3478C8.26087 16.9096 8.0868 16.4894 7.77696 16.1796C7.46712 15.8697 7.04688 15.6957 6.6087 15.6957ZM16.5217 15.6957C16.0836 15.6957 15.6633 15.8697 15.3535 16.1796C15.0436 16.4894 14.8696 16.9096 14.8696 17.3478C14.8696 17.786 15.0436 18.2062 15.3535 18.5161C15.6633 18.8259 16.0836 19 16.5217 19C16.9599 19 17.3802 18.8259 17.69 18.5161C17.9998 18.2062 18.1739 17.786 18.1739 17.3478C18.1739 16.9096 17.9998 16.4894 17.69 16.1796C17.3802 15.8697 16.9599 15.6957 16.5217 15.6957Z"
                                fill="currentColor"
                              />
                            </svg>
                          </span>
                          {isAddingToCart
                            ? "Adding..."
                            : cartBtnStatus === "success"
                            ? "Added ✓"
                            : "Add to Cart"}
                        </button>
                        <button
                          type="button"
                          className="ayur-btn ayur-tpro-buy-btn"
                          onClick={() =>
                            handleOrder(
                              productId,
                              product.name,
                              product.image_url,
                              Number(product.price),
                              quantity
                            )
                          }
                          disabled={isAtMinQuantity || isOrdering}
                        >
                          {isOrdering
                            ? "Placing..."
                            : status === "success"
                            ? "Ordered ✓"
                            : "Order"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {hasMoreProducts && (
            <div className="col-lg-12 col-md-12 col-sm-12">
              <div className="ayur-tpro-viewbtn">
                <a href="/shop" className="ayur-btn">
                  View More
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="ayur-bgshape ayur-tpro-bgshape">
        <img src="/images/bg-shape1.webp" alt="img" />
        <img src="/images/bg-leaf1.webp" alt="img" />
      </div>

      {toasts.length > 0 && (
        <div className="ayur-toast-container">
          {toasts.map((toast) => (
            <div key={toast.id} className={`ayur-toast ayur-toast-${toast.type}`}>
              <p className="ayur-toast-message">{toast.message}</p>
              <button
                type="button"
                className="ayur-toast-close"
                onClick={() => dismissToast(toast.id)}
                aria-label="Dismiss notification"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};