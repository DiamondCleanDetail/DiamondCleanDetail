export type BeforeAfterPair = {
  label: string;
  /** Path under /public once real job photos are added, e.g. "/before-after/sedan-interior-before.jpg". */
  before: string | null;
  after: string | null;
};

export const beforeAfterHomePairs: BeforeAfterPair[] = [
  { label: "Interior Detail — Sedan", before: null, after: null },
  { label: "Full Detail — SUV", before: null, after: null },
  { label: "Ceramic Coating — Truck", before: null, after: null },
];
