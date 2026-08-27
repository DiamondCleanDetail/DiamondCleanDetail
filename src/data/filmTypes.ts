export type FilmType = {
  slug: "diamond-smoke" | "diamond-ceramic-rx" | "diamond-ceramic-rx1";
  name: string;
  code: string;
  tagline: string;
  description: string;
  /** What to show when a customer expands the card — specific, factual
   * selling points rather than generic marketing copy. */
  benefits: string[];
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
      "A deep-dyed film built for a clean, dark look at the lowest cost of our three films. It blocks 99%+ of UV rays and won't fade or turn purple over time, but doesn't reject heat the way our ceramic films do.",
    benefits: [
      "Deep, non-reflective black finish",
      "99%+ UV rejection",
      "Fade-free — won't turn purple with age",
      "Blocks 30–42% of total solar energy",
      "Lifetime warranty",
    ],
    priceNote: "Base pricing",
  },
  {
    slug: "diamond-ceramic-rx",
    name: "Diamond Ceramic RX",
    code: "RX",
    tagline: "Carbon-ceramic — our most popular performance film.",
    description:
      "A carbon-pigmented ceramic film that meaningfully outperforms dyed film on heat rejection while staying clear and glare-free. This is the film most customers land on — real performance without flagship pricing.",
    benefits: [
      "Blocks 71–85% of infrared heat",
      "Blocks up to 63% of total solar energy",
      "99%+ UV rejection",
      "No signal interference with GPS, radio, or phones",
      "Lifetime warranty",
    ],
    priceNote: "Pricing TBD",
    featured: true,
  },
  {
    slug: "diamond-ceramic-rx1",
    name: "Diamond Ceramic RX1",
    code: "RX1",
    tagline: "Dual-ceramic — maximum heat reduction and clarity.",
    description:
      "Our flagship film. A dual-layer ceramic construction pushes infrared rejection to the top of the range at every shade, for drivers who want the most heat and glare blocked without going darker than they want.",
    benefits: [
      "Blocks 95% of infrared heat at every shade",
      "Blocks up to 70% of total solar energy",
      "99%+ UV rejection",
      "Extreme optical clarity — no haze",
      "Lifetime warranty",
    ],
    priceNote: "Pricing TBD",
  },
];
