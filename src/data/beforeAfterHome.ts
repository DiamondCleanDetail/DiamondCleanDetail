export type BeforeAfterPair = {
  label: string;
  /** Path under /public once real job photos are added, e.g. "/before-after/sedan-interior-before.jpg". */
  before: string | null;
  after: string | null;
};

export const beforeAfterHomePairs: BeforeAfterPair[] = [
  { label: "Exterior Detail — Compact SUV", before: "/before-after/rav4-before.jpg", after: "/before-after/rav4-after.jpg" },
  { label: "Exterior Detail — Full-Size Truck", before: "/before-after/ram-before.jpg", after: "/before-after/ram-after.jpg" },
  { label: "Exterior Detail — Luxury SUV", before: "/before-after/rangerover-before.jpg", after: "/before-after/rangerover-after.jpg" },
  { label: "Paint Decontamination & Gloss Restore", before: "/before-after/mercedes-before.jpg", after: "/before-after/mercedes-after.jpg" },
  { label: "Interior Shampoo & Extraction", before: "/before-after/interior-a-before.jpg", after: "/before-after/interior-a-after.jpg" },
  { label: "Interior Deep Clean — Sedan", before: "/before-after/audi-before.jpg", after: "/before-after/audi-after.jpg" },
];
