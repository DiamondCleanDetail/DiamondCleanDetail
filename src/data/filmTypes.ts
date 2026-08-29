export type FilmType = {
  slug: "diamond-smoke" | "diamond-ceramic-rx" | "diamond-ceramic-rx1";
  name: string;
  code: string;
  /** Where this film sits on the good/better/best ladder. Customers arrive
   * knowing nothing about tint, so the ladder has to be readable before any
   * of the copy is — `tierRank` fills that many pips on the card. Held as
   * data rather than derived from array position so reordering the list
   * can't silently re-rank the films. */
  tier: string;
  tierRank: 1 | 2 | 3;
  /** One line, in plain language, leading with what the customer gets. The
   * film technology belongs in `description` as supporting detail. */
  tagline: string;
  description: string;
  /** What to show when a customer expands the card — specific, factual
   * selling points rather than generic marketing copy. */
  benefits: string[];
  /** Short relative-cost cue on the film card; exact figures live in
   * tintPricing.ts and every quoted price comes from there. */
  priceNote: string;
  featured?: boolean;
};

export const filmTypes: FilmType[] = [
  {
    slug: "diamond-smoke",
    name: "Diamond Smoke",
    code: "DS",
    tier: "Good",
    tierRank: 1,
    tagline:
      "The dark, finished look for the lowest price — with 99%+ of UV blocked, but the least heat of our three films.",
    description:
      "Gets you a clean, dark look at the lowest cost of our three films. It's a deep-dyed film, so it blocks 99%+ of UV rays and won't fade or turn purple over time, but it doesn't reject heat the way our ceramic films do.",
    benefits: [
      "Deep, non-reflective black finish",
      "99%+ UV rejection",
      "Fade-free — won't turn purple with age",
      "Blocks 30–42% of total solar energy",
      "Lifetime manufacturer warranty",
    ],
    priceNote: "Base pricing",
  },
  {
    slug: "diamond-ceramic-rx",
    name: "Diamond Ceramic RX",
    code: "RX",
    tier: "Better",
    tierRank: 2,
    tagline:
      "A noticeably cooler cabin without flagship pricing — the film most of our customers choose.",
    description:
      "Keeps the cabin meaningfully cooler than dyed film while staying clear and glare-free. It's a carbon-pigmented ceramic: real performance without flagship pricing, which is where most customers land.",
    benefits: [
      "Blocks 71–85% of infrared heat",
      "Blocks up to 63% of total solar energy",
      "99%+ UV rejection",
      "No signal interference with GPS, radio, or phones",
      "Lifetime manufacturer warranty",
    ],
    priceNote: "From +$70",
    featured: true,
  },
  {
    slug: "diamond-ceramic-rx1",
    name: "Diamond Ceramic RX1",
    code: "RX1",
    tier: "Best",
    tierRank: 3,
    tagline:
      "The most heat blocked and the clearest view, at whatever shade you pick.",
    description:
      "Blocks the most heat and glare of anything we install, at every shade — so you don't have to go darker than you want to stay cool. Our flagship film, built from a dual-layer ceramic construction that pushes infrared rejection to the top of the range.",
    benefits: [
      "Blocks 95% of infrared heat at every shade",
      "Blocks up to 70% of total solar energy",
      "99%+ UV rejection",
      "Extreme optical clarity — no haze",
      "Lifetime manufacturer warranty",
    ],
    priceNote: "From +$210",
  },
];
