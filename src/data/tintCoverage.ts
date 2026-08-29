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
 */
export const COVERAGE_CANVAS = { width: 2000, height: 1240 };

const diagrams: Record<string, Partial<Record<VehicleSize, string>>> = {
  "full-vehicle": {
    sedan: "/tint-coverage/full-sedan.png",
    suv: "/tint-coverage/full-suv.png",
    truck: "/tint-coverage/full-truck.png",
  },
  // "front-two" and "windshield-strip" renders are still to come.
};

export function coverageDiagram(packageSlug: string, size: VehicleSize): string | null {
  return diagrams[packageSlug]?.[size] ?? null;
}
