import type { VehicleSize } from "@/data/catalog";
import type { FilmType } from "@/data/filmTypes";

/**
 * Non-Tesla tint pricing: coverage × film × vehicle size.
 *
 * Until this table existed, the film choice didn't touch the price — the
 * flagship ceramic went out at the dyed-film rate, and the page papered over
 * it with "film upgrade priced separately, we'll confirm your total". Now the
 * three films price like the three products they are.
 *
 * PROVENANCE: adopted from Turbo Tint Aurora's published price sheets, the
 * same source Farhan named for the Tesla numbers — Rev (dyed) maps to Diamond
 * Smoke, Turbo (nano-ceramic) to Diamond Ceramic RX, Redline (dual-layer
 * ceramic) to Diamond Ceramic RX1. Their sheets use two size classes where we
 * use three: CAR/TRUCK covers our Sedan/Coupe, and SUV/MINIVAN covers both of
 * our larger buckets, which the source doesn't split. Front-doors-only is one
 * price at every size on their sheet, and stays that way here. All of it is
 * a competitor's pricing adopted deliberately, pending Farhan's own numbers.
 *
 * The Diamond Smoke row is the base price and MUST equal the coverage
 * packages' byVehicleSize figures in catalog.ts — priceLabel and the package
 * cards quote those, and this table is what checkout charges.
 */
const PRICES: Record<string, Record<FilmType["slug"], Record<VehicleSize, number>>> = {
  "front-two": {
    "diamond-smoke": { sedan: 119, suv: 119, truck: 119 },
    "diamond-ceramic-rx": { sedan: 189, suv: 189, truck: 189 },
    "diamond-ceramic-rx1": { sedan: 329, suv: 329, truck: 329 },
  },
  "full-vehicle": {
    "diamond-smoke": { sedan: 279, suv: 299, truck: 299 },
    "diamond-ceramic-rx": { sedan: 399, suv: 449, truck: 449 },
    "diamond-ceramic-rx1": { sedan: 649, suv: 679, truck: 679 },
  },
};

/** The tint price for a coverage/film/size, or null when the combination
 * isn't priced — callers fall back to the package's base price, so a film
 * with no row charges as base rather than as free. */
export function tintPrice(
  packageSlug: string,
  filmSlug: string,
  size: VehicleSize
): number | null {
  return PRICES[packageSlug]?.[filmSlug as FilmType["slug"]]?.[size] ?? null;
}
