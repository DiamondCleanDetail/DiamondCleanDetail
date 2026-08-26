export type FilmType = {
  slug: "diamond-smoke" | "diamond-ceramic-rx" | "diamond-ceramic-rx1";
  name: string;
  code: string;
  tagline: string;
  description: string;
  /** Relative price note shown until Farhan confirms exact per-tier pricing. */
  priceNote: string;
  featured?: boolean;
};

export const filmTypes: FilmType[] = [
  {
    slug: "diamond-smoke",
    name: "Diamond Smoke",
    code: "DS",
    tagline: "Entry-level dyed film — mainly for looks.",
    description:
      "Our entry-level dyed film. Gives windows a clean, dark look and blocks UV rays, without the heat-rejection performance of our ceramic films.",
    priceNote: "Base pricing",
  },
  {
    slug: "diamond-ceramic-rx",
    name: "Diamond Ceramic RX",
    code: "RX",
    tagline: "Nano-ceramic — our most popular performance film.",
    description:
      "Nano-ceramic film that blocks significantly more heat than dyed film while staying clear and glare-free. The most popular choice for everyday drivers.",
    priceNote: "Pricing TBD",
    featured: true,
  },
  {
    slug: "diamond-ceramic-rx1",
    name: "Diamond Ceramic RX1",
    code: "RX1",
    tagline: "Dual-layer nano-ceramic — maximum heat reduction.",
    description:
      "Our flagship film. Dual-layer nano-ceramic construction for maximum heat rejection and infrared blocking, for drivers who want the best performance available.",
    priceNote: "Pricing TBD",
  },
];
