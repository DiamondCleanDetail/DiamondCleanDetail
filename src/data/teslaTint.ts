import type { FilmType } from "@/data/filmTypes";

/**
 * Tesla tint pricing.
 *
 * Teslas are priced on a different axis from every other car on the site.
 * Normally the price comes from coverage × vehicle size; a Tesla's comes from
 * coverage × film, because the work is defined by which pieces of that
 * specific glass are being covered rather than by how big the car is. A Model 3
 * is a compact saloon whose single-piece rear window is one of the most
 * expensive panels to do properly, so sizing it as a "Sedan / Coupe" gets the
 * price wrong in both directions.
 *
 * PROVENANCE: these figures were supplied by Farhan, taken from Turbo Tint
 * Aurora's published Tesla pricing. They are a competitor's numbers adopted
 * deliberately, not our own build-up — worth knowing before anyone "corrects"
 * them to match the non-Tesla price list, which they will not line up with.
 */

/** Which of the three films a Tesla price belongs to. Keyed by film slug so
 * the table can't reference a film that no longer exists. */
export type TeslaFilmPrices = Record<FilmType["slug"], number>;

export type TeslaCoverage = {
  slug: string;
  /** What is actually being covered. */
  name: string;
  /** Which Teslas this option applies to, in the customer's words. */
  models: string;
  /** The Tesla model names (matching src/data/vehicles.ts) this option is
   * offered for, so the form can show only the options that apply once
   * someone has told us what they drive. */
  appliesTo: string[];
  prices: TeslaFilmPrices;
};

export const teslaCoverages: TeslaCoverage[] = [
  {
    slug: "tesla-front-doors",
    name: "Front doors only",
    models: "Model S, X & Y",
    appliesTo: ["Model S", "Model X", "Model Y"],
    prices: {
      "diamond-smoke": 119,
      "diamond-ceramic-rx": 189,
      "diamond-ceramic-rx1": 329,
    },
  },
  {
    slug: "tesla-full-car",
    name: "Full car",
    models: "Model S, X & Y",
    appliesTo: ["Model S", "Model X", "Model Y"],
    prices: {
      "diamond-smoke": 299,
      "diamond-ceramic-rx": 449,
      "diamond-ceramic-rx1": 659,
    },
  },
  {
    slug: "tesla-model-3-partial-rear",
    name: "Full car, partial rear window",
    models: "Model 3",
    appliesTo: ["Model 3"],
    prices: {
      "diamond-smoke": 299,
      "diamond-ceramic-rx": 449,
      "diamond-ceramic-rx1": 659,
    },
  },
  {
    slug: "tesla-model-3-full-rear",
    name: "Full car, full rear window",
    models: "Model 3",
    appliesTo: ["Model 3"],
    prices: {
      "diamond-smoke": 479,
      "diamond-ceramic-rx": 599,
      "diamond-ceramic-rx1": 799,
    },
  },
];

/** The price for one Tesla coverage option on one film, or null if the pair
 * isn't one we offer. Null rather than a fallback number on purpose: a wrong
 * price charged confidently is worse than an honest "we'll confirm". */
export function teslaTintPrice(coverageSlug: string, filmSlug: string): number | null {
  const coverage = teslaCoverages.find((c) => c.slug === coverageSlug);
  if (!coverage) return null;
  const price = coverage.prices[filmSlug as FilmType["slug"]];
  return typeof price === "number" ? price : null;
}

/** The coverage options offered for a given Tesla, or all of them when we
 * don't yet know which model it is. Model 3 and the rest genuinely differ —
 * the rear-window choice only exists on a Model 3. */
export function teslaCoveragesFor(model: string | null): TeslaCoverage[] {
  if (!model) return teslaCoverages;
  const matches = teslaCoverages.filter((c) => c.appliesTo.includes(model));
  return matches.length > 0 ? matches : teslaCoverages;
}

/**
 * Which Tesla coverage options correspond to one of the site's normal
 * coverage packages.
 *
 * The tint page sells coverage packages; Tesla pricing is quoted against
 * Tesla-specific coverage. Without this mapping the page shows the size-based
 * price and the checkout charges the Tesla one, and the customer watches the
 * number go up between the two — which is the fastest way to lose a booking
 * you had already won.
 */
const PACKAGE_TO_TESLA_COVERAGE: Record<string, string[]> = {
  "front-two": ["tesla-front-doors"],
  "full-vehicle": ["tesla-full-car", "tesla-model-3-partial-rear", "tesla-model-3-full-rear"],
  // A windshield strip has no Tesla-specific price, so it keeps the standard one.
  "windshield-strip": [],
};

/** The Tesla price to show for a coverage package, or null when there isn't a
 * Tesla-specific one and the standard price stands.
 *
 * `isFrom` is set when the package spans more than one Tesla option — a Model 3
 * full-vehicle job costs different amounts depending on whether the rear
 * window is done in full, and that choice is made during booking. */
export function teslaPriceForPackage(
  packageSlug: string,
  filmSlug: string,
  model: string | null
): { price: number; isFrom: boolean } | null {
  const slugs = PACKAGE_TO_TESLA_COVERAGE[packageSlug] ?? [];
  const candidates = teslaCoverages
    .filter((c) => slugs.includes(c.slug))
    .filter((c) => !model || c.appliesTo.includes(model));
  const prices = candidates
    .map((c) => c.prices[filmSlug as FilmType["slug"]])
    .filter((n): n is number => typeof n === "number");
  if (prices.length === 0) return null;
  return { price: Math.min(...prices), isFrom: prices.length > 1 };
}

/** Pulls a Tesla model name out of the free-text vehicle field ("2024 Tesla
 * Model 3"), so the form can narrow the options without asking again.
 * Longest-first so "Model 3" isn't matched inside nothing and "Model S" isn't
 * shadowed by a shorter prefix. */
export function teslaModelFromVehicleInfo(vehicleInfo: string): string | null {
  const known = ["Model 3", "Model S", "Model X", "Model Y", "Cybertruck"];
  const haystack = vehicleInfo.toLowerCase();
  return known.find((m) => haystack.includes(m.toLowerCase())) ?? null;
}
