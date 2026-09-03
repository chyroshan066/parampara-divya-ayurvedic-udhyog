"use client";

import { useEffect, type RefObject } from "react";

/**
 * Calls `onOutsideClick` whenever a pointer event happens outside of the
 * element referenced by `ref`. Used to close popovers (DatePicker, TimePicker)
 * when the user clicks anywhere else on the page.
 */
export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onOutsideClick: () => void,
  isActive: boolean = true
) {
  useEffect(() => {
    if (!isActive) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onOutsideClick();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [ref, onOutsideClick, isActive]);
}