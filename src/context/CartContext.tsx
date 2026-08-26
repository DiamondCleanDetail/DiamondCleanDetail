"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

export type CartItem = {
  id: string;
  serviceSlug: string;
  packageSlug: string;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (serviceSlug: string, packageSlug: string) => void;
  removeItem: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const CART_KEY = "dcd-cart";

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  // Starts empty on both server and client to avoid a hydration mismatch —
  // localStorage isn't available during SSR. The real cart loads on mount
  // below, combined with the persist effect (rather than kept separate) so
  // the first commit can't write this render's pre-load empty array over
  // the real stored cart before the load applies.
  const [items, setItems] = useState<CartItem[]>([]);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      setItems(loadCart());
      return;
    }
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      // localStorage unavailable (private browsing, etc.) — non-fatal.
    }
  }, [items]);

  function addItem(serviceSlug: string, packageSlug: string) {
    setItems((prev) => {
      if (prev.some((i) => i.serviceSlug === serviceSlug && i.packageSlug === packageSlug)) {
        return prev; // already in cart
      }
      return [...prev, { id: `${serviceSlug}-${packageSlug}-${Date.now()}`, serviceSlug, packageSlug }];
    });
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function clear() {
    setItems([]);
  }

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
