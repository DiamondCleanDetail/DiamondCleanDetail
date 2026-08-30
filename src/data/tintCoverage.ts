import type { VehicleSize } from "@/data/catalog";

/**
 * Diagrams for the coverage step: the same three vehicles the tint-level
 * visualizer uses, seen from the front three-quarter, with the glass that
 * this package covers picked out in red.
 *
 * Keyed by coverage package and then vehicle size, so a package with no
 * diagram yet simply has no entry and the step falls back to its placeholder
 * rather than showing a diagram for the wrong coverage — which would be worse
 * than showing none, since the whole job of this step is to say exactly which
 * glass gets film.
 *
 * All three renders sit on one canvas at a shared ground line and a matched
 * scale, so changing vehicle size reads as swapping the car rather than
 * resizing the picture.
 *
 * Within a vehicle, the packages are the same render with different glass
 * highlighted, and they are cut out and placed from a single shared mask —
 * so the two are pixel-identical outside the glass and switching coverage
 * changes only the red. Verified at build time: zero differing alpha pixels
 * between full-* and front-two-* for all three sizes.
 */
export const COVERAGE_CANVAS = { width: 2000, height: 1240 };

/** A Tesla renders as its own vehicle, not as whichever size bucket it fell
 * into: its pricing is by Tesla coverage rather than by size, and showing the
 * glass on a Model 3 while quoting Tesla prices is what makes those prices
 * make sense. Composed onto the same canvas and ground line as the other
 * three, so switching between a Tesla and anything else swaps the car rather
 * than jumping the layout. */
export type CoverageVehicle = VehicleSize | "tesla";

const diagrams: Record<string, Partial<Record<CoverageVehicle, string>>> = {
  "front-two": {
    sedan: "/tint-coverage/front-two-sedan.png",
    suv: "/tint-coverage/front-two-suv.png",
    truck: "/tint-coverage/front-two-truck.png",
    tesla: "/tint-coverage/front-two-tesla.png",
  },
  "full-vehicle": {
    sedan: "/tint-coverage/full-sedan.png",
    suv: "/tint-coverage/full-suv.png",
    truck: "/tint-coverage/full-truck.png",
    tesla: "/tint-coverage/full-tesla.png",
  },
  // Keyed by the add-on slug rather than a package slug — windshield work is
  // an add-on now, but this lookup doesn't care which kind of slug it's fed.
  "windshield-strip": {
    sedan: "/tint-coverage/windshield-strip-sedan.png",
    suv: "/tint-coverage/windshield-strip-suv.png",
    truck: "/tint-coverage/windshield-strip-truck.png",
    tesla: "/tint-coverage/windshield-strip-tesla.png",
  },
  "full-windshield": {
    sedan: "/tint-coverage/full-windshield-sedan.png",
    suv: "/tint-coverage/full-windshield-suv.png",
    truck: "/tint-coverage/full-windshield-truck.png",
    tesla: "/tint-coverage/full-windshield-tesla.png",
  },
  // A photo rather than a render, and Tesla-only — no other car sells the
  // roof. Registered here so it swaps through the same preview slot as the
  // windshield options it is mutually exclusive with, instead of living in
  // its own section as if it combined with them.
  "pano-roof": {
    tesla: "/services/tint-addon-pano-roof.webp",
  },
};

export function coverageDiagram(packageSlug: string, vehicle: CoverageVehicle): string | null {
  return diagrams[packageSlug]?.[vehicle] ?? null;
}
