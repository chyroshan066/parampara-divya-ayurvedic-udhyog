"use client";

import { createContext, useCallback, useContext, useState, ReactNode } from "react";
import { Toast, ToastType } from "./Toast";

interface ToastState {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  showToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);

  // id makes each toast a fresh Toast instance, so its internal
  // dismiss timer restarts even if the same message fires twice in a row.
  const showToast = useCallback((type: ToastType, message: string) => {
    setToast({ id: Date.now(), type, message });
  }, []);

  const handleClose = useCallback(() => setToast(null), []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={handleClose}
          position="bottom-right"
        />
      )}
    </ToastContext.Provider>
  );
}