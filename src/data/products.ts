export type Product = {
  slug: string;
  name: string;
  description: string;
  price: number;
  inStock: boolean;
  category: "supplies" | "gift-card";
};

export const products: Product[] = [
  {
    slug: "interior-shampoo",
    name: "Interior Shampoo",
    description: "Concentrated fabric and carpet shampoo, 16oz.",
    price: 18,
    inStock: true,
    category: "supplies",
  },
  {
    slug: "ceramic-spray-sealant",
    name: "Ceramic Spray Sealant",
    description: "Quick-apply spray sealant for lasting shine, 16oz.",
    price: 25,
    inStock: true,
    category: "supplies",
  },
  {
    slug: "microfiber-towel-set",
    name: "Microfiber Towel Set (6-pack)",
    description: "Ultra-plush microfiber towels for drying and buffing.",
    price: 22,
    inStock: true,
    category: "supplies",
  },
  {
    slug: "tire-shine-gel",
    name: "Tire Shine Gel",
    description: "Long-lasting gel formula for a deep, wet-look shine.",
    price: 15,
    inStock: false,
    category: "supplies",
  },
  {
    slug: "gift-card-50",
    name: "Gift Card — $50",
    description: "Redeemable for any service or product. Delivered by email.",
    price: 50,
    inStock: true,
    category: "gift-card",
  },
  {
    slug: "gift-card-100",
    name: "Gift Card — $100",
    description: "Redeemable for any service or product. Delivered by email.",
    price: 100,
    inStock: true,
    category: "gift-card",
  },
  {
    slug: "gift-card-200",
    name: "Gift Card — $200",
    description: "Redeemable for any service or product. Delivered by email.",
    price: 200,
    inStock: true,
    category: "gift-card",
  },
];
