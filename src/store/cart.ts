// ============================================================
// MANI 272 STORE — Cart Store (Zustand) — Duration-based pricing
// ============================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product, DurationPrice } from "@/types";

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, tier?: DurationPrice) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getTotalUSD: () => number;
  getTotalINR: () => number;
  getItemCount: () => number;
}

// Cart item key = productId + duration (so same product with different duration = different item)
function cartKey(productId: string, duration: string): string {
  return `${productId}__${duration}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1, tier) =>
        set((state) => {
          const dur = tier || { id: "30days", label: "30 Days Access", usd: 23, inr: 1599 } as DurationPrice;
          const key = cartKey(product.id, dur.id);
          const existing = state.items.find((i) => cartKey(i.product.id, i.duration) === key);
          if (existing) {
            return {
              items: state.items.map((i) =>
                cartKey(i.product.id, i.duration) === key
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, {
              product,
              quantity,
              duration: dur.id,
              durationLabel: dur.label,
              priceUSD: dur.usd,
              priceINR: dur.inr,
            }],
          };
        }),
      removeItem: (key) =>
        set((state) => ({
          items: state.items.filter((i) => cartKey(i.product.id, i.duration) !== key),
        })),
      updateQuantity: (key, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => cartKey(i.product.id, i.duration) !== key)
              : state.items.map((i) =>
                  cartKey(i.product.id, i.duration) === key ? { ...i, quantity } : i
                ),
        })),
      clearCart: () => set({ items: [] }),
      getTotal: () =>
        get().items.reduce((sum, i) => sum + (i.priceINR || i.product.price) * i.quantity, 0),
      getTotalUSD: () =>
        get().items.reduce((sum, i) => sum + (i.priceUSD || Math.round(i.product.price / 80)) * i.quantity, 0),
      getTotalINR: () =>
        get().items.reduce((sum, i) => sum + (i.priceINR || i.product.price) * i.quantity, 0),
      getItemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "mani-272-cart-v2" }
  )
);
