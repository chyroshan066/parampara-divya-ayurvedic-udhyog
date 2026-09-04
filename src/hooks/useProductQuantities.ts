"use client";

import { useCallback, useState } from "react";

export type ProductQuantities = Record<string, number>;

interface UseProductQuantitiesOptions {
  /** Lowest allowed quantity for any product (the floor for decrease). Defaults to 0. */
  min?: number;
  /** Highest allowed quantity for any product. Unbounded if omitted. */
  max?: number;
  /**
   * Starting quantity for a product that hasn't been touched yet.
   * Defaults to `min`. Kept separate from `min` so a card can, e.g.,
   * start at 1 while still allowing decrease down to a floor of 0.
   */
  initialQuantity?: number;
}

/**
 * Tracks a quantity per product id (e.g. per-card +/- steppers on a
 * product listing). This is intentionally self-contained — there's no
 * cart store yet, so it just holds quantity state and exposes clean
 * increase/decrease/reset actions. Once real cart state exists, the
 * `handleAddToCart` / `handleBuyNow` callers of this hook are the only
 * place that needs to change.
 */
export function useProductQuantities(options: UseProductQuantitiesOptions = {}) {
  const { min = 0, max, initialQuantity = min } = options;
  const [quantities, setQuantities] = useState<ProductQuantities>({});

  const getQuantity = useCallback(
    (productId: string) => quantities[productId] ?? initialQuantity,
    [quantities, initialQuantity]
  );

  const increaseQuantity = useCallback(
    (productId: string) => {
      setQuantities((prev) => {
        const current = prev[productId] ?? initialQuantity;
        const next = max !== undefined ? Math.min(current + 1, max) : current + 1;
        if (next === current) return prev;
        return { ...prev, [productId]: next };
      });
    },
    [initialQuantity, max]
  );

  const decreaseQuantity = useCallback(
    (productId: string) => {
      setQuantities((prev) => {
        const current = prev[productId] ?? initialQuantity;
        if (current <= min) return prev; // already at the floor, no-op
        return { ...prev, [productId]: current - 1 };
      });
    },
    [initialQuantity, min]
  );

  const resetQuantity = useCallback(
    (productId: string) => {
      setQuantities((prev) => ({ ...prev, [productId]: initialQuantity }));
    },
    [initialQuantity]
  );

  return {
    quantities,
    getQuantity,
    increaseQuantity,
    decreaseQuantity,
    resetQuantity,
  };
}