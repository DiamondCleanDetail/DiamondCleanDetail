"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

/** Empties the cart once the customer reaches a confirmed booking outcome. */
export default function ClearCart() {
  const { clear } = useCart();
  useEffect(() => {
    clear();
    // Only ever run once, right after mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
