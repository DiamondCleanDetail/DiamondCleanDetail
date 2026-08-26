export type BeforeAfterPair = {
  label: string;
  /** Path under /public once real job photos are added, e.g. "/before-after/sedan-interior-before.jpg". */
  before: string | null;
  after: string | null;
};

export const beforeAfterHomePairs: BeforeAfterPair[] = [
  { label: "The Diamond Detail — Compact SUV", before: "/before-after/rav4-before.jpg", after: "/before-after/rav4-after.jpg" },
  { label: "The Diamond Detail — Full-Size Truck", before: "/before-after/ram-before.jpg", after: "/before-after/ram-after.jpg" },
  { label: "The Diamond Detail Plus — Luxury SUV", before: "/before-after/rangerover-before.jpg", after: "/before-after/rangerover-after.jpg" },
  { label: "The Diamond Detail Pro — Luxury SUV", before: "/before-after/mercedes-before.jpg", after: "/before-after/mercedes-after.jpg" },
  { label: "The Diamond Detail — SUV Interior", before: "/before-after/interior-a-before.jpg", after: "/before-after/interior-a-after.jpg" },
  { label: "The Diamond Detail — Sedan Interior", before: "/before-after/audi-before.jpg", after: "/before-after/audi-after.jpg" },
];
