import type { VehicleSize } from "@/data/catalog";

export type TintLevel = {
  value: 0 | 5 | 15 | 35 | 50 | 80;
  label: string;
  /** Preview photo per vehicle-size bucket, under /public/tint-levels.
   * Missing/undefined renders a "coming soon" placeholder for that size.
   * Sedan/Coupe is an M3, SUV/Minivan an RDX, Truck/Full-size SUV a G63 —
   * all three facing right, all cropped tight to the vehicle so that equal
   * rendered widths mean equal scale. See TintVisualizer for why that is what
   * keeps them comparable. */
  images: Partial<Record<VehicleSize, string>>;
  /** Preview photo of this shade on a windshield strip specifically. */
  windshieldImage?: string;
  /** 80% only applies to the windshield visor strip, not full windows —
   * excluded from the main Step 1 shade bar. */
  windshieldOnly?: boolean;
};

export const tintLevels: TintLevel[] = [
  // INTERIM: the sedan clear is still the old render. The four shades were
  // re-rendered without the accidental windshield tint, but no clear came
  // with them, and the old base only matches the new one to a 93% silhouette
  // — so Clear<->shade toggles shift slightly until the corrected clear
  // render arrives. Replace /tint-levels/0.png and delete this note.
  { value: 0, label: "Clear", images: { sedan: "/tint-levels/0.png", suv: "/tint-levels/suv-0.png", truck: "/tint-levels/truck-0.png" } },
  { value: 80, label: "80%", images: {}, windshieldOnly: true },
  { value: 50, label: "50%", images: { sedan: "/tint-levels/50.png", suv: "/tint-levels/suv-50.png", truck: "/tint-levels/truck-50.png" } },
  { value: 35, label: "35%", images: { sedan: "/tint-levels/35.png", suv: "/tint-levels/suv-35.png", truck: "/tint-levels/truck-35.png" } },
  { value: 15, label: "15%", images: { sedan: "/tint-levels/15.png", suv: "/tint-levels/suv-15.png", truck: "/tint-levels/truck-15.png" } },
  { value: 5, label: "5%", images: { sedan: "/tint-levels/5.png", suv: "/tint-levels/suv-5.png", truck: "/tint-levels/truck-5.png" } },
];

