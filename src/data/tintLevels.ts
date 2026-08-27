export type TintLevel = {
  value: 0 | 5 | 15 | 35 | 50 | 80;
  label: string;
  /** Path under /public/tint-levels. Null renders a "coming soon" placeholder. */
  image: string | null;
};

export const tintLevels: TintLevel[] = [
  { value: 0, label: "Clear", image: "/tint-levels/0.png" },
  { value: 80, label: "80%", image: null },
  { value: 50, label: "50%", image: "/tint-levels/50.png" },
  { value: 35, label: "35%", image: "/tint-levels/35.png" },
  { value: 15, label: "15%", image: "/tint-levels/15.png" },
  { value: 5, label: "5%", image: "/tint-levels/5.png" },
];
