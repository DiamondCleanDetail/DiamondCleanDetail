export type TintLevel = {
  value: 0 | 5 | 15 | 20 | 35 | 50;
  label: string;
  /** Path under /public/tint-levels. Null renders a "coming soon" placeholder. */
  image: string | null;
  teslaImage: string | null;
};

export const tintLevels: TintLevel[] = [
  { value: 5, label: "5%", image: "/tint-levels/5.png", teslaImage: null },
  { value: 15, label: "15%", image: "/tint-levels/15.png", teslaImage: null },
  { value: 20, label: "20%", image: "/tint-levels/20.png", teslaImage: null },
  { value: 35, label: "35%", image: "/tint-levels/35.png", teslaImage: null },
  { value: 50, label: "50%", image: "/tint-levels/50.png", teslaImage: null },
  { value: 0, label: "Clear", image: "/tint-levels/0.png", teslaImage: null },
];
