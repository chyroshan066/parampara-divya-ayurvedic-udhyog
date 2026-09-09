"use client";

import { useEffect } from "react";
import { CheckCircle, XCircle, X } from "@phosphor-icons/react";

export type ToastType = "success" | "error";
export type ToastPosition = "bottom-left" | "bottom-right";

interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
  duration?: number; // ms
  /** Defaults to "bottom-left" to preserve existing call sites. */
  position?: ToastPosition;
}

const POSITION_CLASSES: Record<ToastPosition, string> = {
  "bottom-left": "tw:bottom-6 tw:left-6",
  "bottom-right": "tw:bottom-6 tw:right-6",
};

export function Toast({
  type,
  message,
  onClose,
  duration = 6000,
  position = "bottom-left",
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const isSuccess = type === "success";

  return (
    <div
      role="alert"
      className={`tw:fixed ${POSITION_CLASSES[position]} tw:z-[9999] tw:flex tw:items-start tw:gap-x-3 tw:max-w-sm tw:w-[calc(100%-3rem)] tw:sm:w-96 tw:rounded-2xl tw:shadow-lg tw:px-4 tw:py-3 tw:border ${
        isSuccess
          ? "tw:bg-green-50 tw:border-green-200 tw:text-green-800"
          : "tw:bg-red-50 tw:border-red-200 tw:text-red-800"
      }`}
    >
      <span className="tw:shrink-0 tw:mt-0.5">
        {isSuccess ? (
          <CheckCircle className="tw:w-5 tw:h-5" weight="fill" />
        ) : (
          <XCircle className="tw:w-5 tw:h-5" weight="fill" />
        )}
      </span>
      <p className="tw:flex-1 tw:text-sm tw:font-medium">{message}</p>
      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss"
        className="tw:shrink-0 tw:text-current tw:opacity-60 tw:transition-opacity tw:hover:opacity-100"
      >
        <X className="tw:w-4 tw:h-4" weight="bold" />
      </button>
    </div>
  );
}