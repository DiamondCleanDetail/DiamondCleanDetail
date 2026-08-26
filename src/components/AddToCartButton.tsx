"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function AddToCartButton({
  serviceSlug,
  packageSlug,
}: {
  serviceSlug: string;
  packageSlug: string;
}) {
  const { items, addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const inCart = items.some((i) => i.serviceSlug === serviceSlug && i.packageSlug === packageSlug);

  return (
    <button
      type="button"
      onClick={() => {
        addItem(serviceSlug, packageSlug);
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 1500);
      }}
      disabled={inCart}
      className="text-center px-5 py-2 rounded-lg font-semibold text-sm border border-border text-foreground hover:border-muted transition-colors disabled:opacity-60 disabled:cursor-default"
    >
      {inCart ? (justAdded ? "Added ✓" : "In Cart") : "Add to Cart"}
    </button>
  );
}
