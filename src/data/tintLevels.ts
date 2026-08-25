export type TintLevel = {
  value: 5 | 15 | 20 | 35 | 50;
  label: string;
  /** Path under /public/tint-levels once Farhan supplies the Photoshopped
   * reference photo for this shade, e.g. "/tint-levels/20-standard.jpg".
   * Null renders a placeholder. */
  image: string | null;
  teslaImage: string | null;
};

export const tintLevels: TintLevel[] = [
  { value: 5, label: "5%", image: null, teslaImage: null },
  { value: 15, label: "15%", image: null, teslaImage: null },
  { value: 20, label: "20%", image: null, teslaImage: null },
  { value: 35, label: "35%", image: null, teslaImage: null },
  { value: 50, label: "50%", image: null, teslaImage: null },
];
