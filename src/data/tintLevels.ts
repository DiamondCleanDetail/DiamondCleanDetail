import type { VehicleSize } from "@/data/catalog";

export type TintLevel = {
  value: 0 | 5 | 15 | 35 | 50 | 80;
  label: string;
  /** Preview photo per vehicle-size bucket, under /public/tint-levels.
   * Missing/undefined renders a "coming soon" placeholder for that size —
   * only the Sedan/Coupe set (an M3) exists today. */
  images: Partial<Record<VehicleSize, string>>;
  /** Preview photo of this shade on a windshield strip specifically. */
  windshieldImage?: string;
  /** 80% only applies to the windshield visor strip, not full windows —
   * excluded from the main Step 1 shade bar. */
  windshieldOnly?: boolean;
};

export const tintLevels: TintLevel[] = [
  { value: 0, label: "Clear", images: { sedan: "/tint-levels/0.png" } },
  { value: 80, label: "80%", images: {}, windshieldOnly: true },
  { value: 50, label: "50%", images: { sedan: "/tint-levels/50.png" } },
  { value: 35, label: "35%", images: { sedan: "/tint-levels/35.png" } },
  { value: 15, label: "15%", images: { sedan: "/tint-levels/15.png" } },
  { value: 5, label: "5%", images: { sedan: "/tint-levels/5.png" } },
];

/** Shades offered for the windshield visor strip — includes 80%, which
 * doesn't apply to full windows. */
export const windshieldTintLevels = tintLevels.filter((l) => l.value !== 0);
