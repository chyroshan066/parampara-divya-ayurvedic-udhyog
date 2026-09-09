"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  type OrderStatus,
} from "@/constants/order-status";

const MENU_WIDTH_PX = 144; // matches tw:w-36 below
const VIEWPORT_MARGIN_PX = 8;

// Tailwind (tw:-prefixed) badge colors per status.
const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "tw:bg-amber-100 tw:text-amber-700",
  processing: "tw:bg-blue-100 tw:text-blue-700",
  shipped: "tw:bg-indigo-100 tw:text-indigo-700",
  delivered: "tw:bg-emerald-100 tw:text-emerald-700",
  cancelled: "tw:bg-red-100 tw:text-red-700",
};

interface OrderStatusSelectProps {
  orderId: string;
  status: string;
}

export function OrderStatusSelect({ orderId, status }: OrderStatusSelectProps) {
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [currentStatus, setCurrentStatus] = useState(status);
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(
    null
  );
  const [mounted, setMounted] = useState(false);

  // createPortal needs the DOM to exist, so only render the portal
  // client-side after mount.
  useEffect(() => setMounted(true), []);

  // Places the menu below-right of the trigger by default, but flips it
  // above (or clamps it sideways/vertically) whenever that default spot
  // would run the menu off the edge of the viewport — so it always
  // lands somewhere fully visible instead of being cut off at the
  // bottom or side of the window.
  const positionMenu = () => {
    const buttonRect = buttonRef.current?.getBoundingClientRect();
    if (!buttonRect) return;

    // On the very first call the menu isn't in the DOM yet, so its real
    // size isn't known — this runs again once it is (see effects below),
    // which is what lets it flip/clamp correctly.
    const menuHeight = menuRef.current?.offsetHeight ?? 0;
    const menuWidth = menuRef.current?.offsetWidth ?? MENU_WIDTH_PX;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const spaceBelow = viewportHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;
    const shouldFlipUp =
      menuHeight > 0 &&
      menuHeight + VIEWPORT_MARGIN_PX > spaceBelow &&
      spaceAbove > spaceBelow;

    let top = shouldFlipUp
      ? buttonRect.top - menuHeight - 4
      : buttonRect.bottom + 4;
    top = Math.min(
      Math.max(top, VIEWPORT_MARGIN_PX),
      Math.max(viewportHeight - menuHeight - VIEWPORT_MARGIN_PX, VIEWPORT_MARGIN_PX)
    );

    let left = buttonRect.right - menuWidth;
    left = Math.min(
      Math.max(left, VIEWPORT_MARGIN_PX),
      Math.max(viewportWidth - menuWidth - VIEWPORT_MARGIN_PX, VIEWPORT_MARGIN_PX)
    );

    setMenuPos((prev) => {
      if (
        prev &&
        Math.round(prev.top) === Math.round(top) &&
        Math.round(prev.left) === Math.round(left)
      ) {
        return prev; // stops the effect below from looping forever
      }
      return { top, left };
    });
  };

  // Runs on open, then again once menuPos changes (which happens right
  // after the menu first mounts, when its real size becomes
  // measurable) — converges within a render or two thanks to the
  // equality check in positionMenu above.
  useLayoutEffect(() => {
    if (!isOpen) return;
    positionMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, menuPos]);

  useEffect(() => {
    if (!isOpen) {
      setMenuPos(null);
      return;
    }
    window.addEventListener("scroll", positionMenu, true);
    window.addEventListener("resize", positionMenu);
    return () => {
      window.removeEventListener("scroll", positionMenu, true);
      window.removeEventListener("resize", positionMenu);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        buttonRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const updateStatus = async (nextStatus: OrderStatus) => {
    setIsOpen(false);
    if (nextStatus === currentStatus) return;

    const previousStatus = currentStatus;
    setCurrentStatus(nextStatus); // optimistic
    setError(null);
    setIsSaving(true);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setCurrentStatus(previousStatus);
        setError(data.error || "Failed to update status.");
        return;
      }

      router.refresh();
    } catch {
      setCurrentStatus(previousStatus);
      setError("Failed to update status.");
    } finally {
      setIsSaving(false);
    }
  };

  const badgeClass =
    STATUS_STYLES[currentStatus as OrderStatus] ?? "tw:bg-primary/10 tw:text-primary";

  return (
    <div className="tw:flex tw:flex-col tw:items-end tw:gap-y-1">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        disabled={isSaving}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`tw:flex tw:items-center tw:gap-x-1.5 tw:text-xs tw:font-bold tw:px-3 tw:py-1 tw:rounded-full tw:capitalize tw:cursor-pointer tw:disabled:opacity-60 tw:disabled:cursor-wait tw:transition-opacity ${badgeClass}`}
      >
        {ORDER_STATUS_LABELS[currentStatus as OrderStatus] ?? currentStatus}
        <svg
          className={`tw:w-2.5 tw:h-2.5 tw:shrink-0 tw:transition-transform ${
            isOpen ? "tw:rotate-180" : ""
          }`}
          viewBox="0 0 10 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>

      {error && <p className="tw:text-[11px] tw:text-red-600">{error}</p>}

      {mounted &&
        isOpen &&
        menuPos &&
        createPortal(
          <div
            ref={menuRef}
            role="listbox"
            className="tw:fixed tw:z-50 tw:w-36 tw:bg-white tw:rounded-xl tw:border tw:border-gray-100 tw:py-1 tw:overflow-hidden"
            style={{
              top: menuPos.top,
              left: menuPos.left,
              boxShadow: "3px 4px 29.6px 0px #0000001a",
            }}
          >
            {ORDER_STATUSES.map((value) => (
              <button
                key={value}
                type="button"
                role="option"
                aria-selected={value === currentStatus}
                onClick={() => updateStatus(value)}
                className={`tw:w-full tw:text-left tw:px-3 tw:py-2 tw:text-sm tw:capitalize tw:transition-colors ${
                  value === currentStatus
                    ? "tw:bg-primary/10 tw:text-primary tw:font-semibold"
                    : "tw:text-slate-800 tw:hover:bg-gray-50"
                }`}
              >
                {ORDER_STATUS_LABELS[value]}
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}