import type { VehicleSize } from "@/data/catalog";

export type TintLevel = {
  value: 0 | 5 | 15 | 35 | 50 | 80;
  label: string;
  /** Preview photo per vehicle-size bucket, under /public/tint-levels.
   * Missing/undefined renders a "coming soon" placeholder for that size —
   * only the Sedan/Coupe set (an M3) exists today. */
  images: Partial<Record<VehicleSize, string>>;
};

export const tintLevels: TintLevel[] = [
  { value: 0, label: "Clear", images: { sedan: "/tint-levels/0.png" } },
  { value: 80, label: "80%", images: {} },
  { value: 50, label: "50%", images: { sedan: "/tint-levels/50.png" } },
  { value: 35, label: "35%", images: { sedan: "/tint-levels/35.png" } },
  { value: 15, label: "15%", images: { sedan: "/tint-levels/15.png" } },
  { value: 5, label: "5%", images: { sedan: "/tint-levels/5.png" } },
];
