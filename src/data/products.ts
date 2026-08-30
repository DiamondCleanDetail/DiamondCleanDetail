// The shop catalogue. Prices are the single source of truth for checkout —
// the /api/shop/checkout route re-resolves every line from here and never
// trusts a figure sent by the browser, exactly like the booking route.
//
// Prices and the supply list are placeholders for Farhan to confirm before
// launch (same as the stock photography). Gift cards are the part that needs
// no sign-off — they're just dollar amounts.

export type ProductKind = "supply" | "gift-card";

export type Product = {
  slug: string;
  name: string;
  description: string;
  /** Held in cents so money never rides on a float through checkout. */
  priceCents: number;
  kind: ProductKind;
  /** Out-of-stock supplies still show, but can't be added to an order. */
  inStock: boolean;
};

/** A physical item ships; a gift card is delivered as a code by email. This is
 * what decides whether checkout collects a shipping address. */
export function isShippable(p: Product): boolean {
  return p.kind === "supply";
}

export const products: Product[] = [
  {
    slug: "interior-shampoo",
    name: "Interior Shampoo",
    description: "Concentrated fabric and carpet shampoo. 16 oz.",
    priceCents: 1800,
    kind: "supply",
    inStock: true,
  },
  {
    slug: "ceramic-spray-sealant",
    name: "Ceramic Spray Sealant",
    description: "Quick-apply spray sealant for lasting gloss and beading. 16 oz.",
    priceCents: 2500,
    kind: "supply",
    inStock: true,
  },
  {
    slug: "microfiber-towel-set",
    name: "Microfiber Towel Set",
    description: "Six ultra-plush microfiber towels for drying and buffing.",
    priceCents: 2200,
    kind: "supply",
    inStock: true,
  },
  {
    slug: "tire-shine-gel",
    name: "Tire Shine Gel",
    description: "Long-lasting gel for a deep, even, wet-look shine.",
    priceCents: 1500,
    kind: "supply",
    inStock: false,
  },
  {
    slug: "gift-card-50",
    name: "Gift Card — $50",
    description: "Redeemable against any service. Delivered by email as a code.",
    priceCents: 5000,
    kind: "gift-card",
    inStock: true,
  },
  {
    slug: "gift-card-100",
    name: "Gift Card — $100",
    description: "Redeemable against any service. Delivered by email as a code.",
    priceCents: 10000,
    kind: "gift-card",
    inStock: true,
  },
  {
    slug: "gift-card-200",
    name: "Gift Card — $200",
    description: "Redeemable against any service. Delivered by email as a code.",
    priceCents: 20000,
    kind: "gift-card",
    inStock: true,
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

/** Flat shipping charged once per order that contains any physical item;
 * gift-card-only orders ship nothing and pay nothing. A placeholder rate for
 * Farhan to confirm — change this one number, or set it to 0 for free/local
 * delivery. */
export const SHIPPING_FLAT_CENTS = 995;

/** Hard cap on how many of one line a single order can hold — a sanity bound
 * so a crafted request can't create a thousand-item Stripe session. */
export const MAX_LINE_QTY = 25;
