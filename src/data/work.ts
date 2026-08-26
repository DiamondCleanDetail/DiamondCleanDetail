export type WorkItem = {
  slug: string;
  title: string;
  /** Photos from a single job, all shown in one card. Paths under
   * /public/work, e.g. "/work/jose-1.webp". An empty array renders a
   * "photo coming soon" placeholder. */
  images: string[];
  testimonial?: {
    name: string;
    quote: string;
  };
};

export const workItems: WorkItem[] = [
  {
    slug: "bmw-x5-pro-detail",
    title: "The Diamond Detail Pro — BMW X5",
    images: ["/work/bmw-x5-1.webp"],
  },
  {
    slug: "velar-full-detail",
    title: "The Diamond Detail Plus — Range Rover Velar",
    images: ["/work/velar-1.webp", "/work/velar-2.webp", "/work/velar-3.webp"],
  },
  {
    slug: "acura-mdx-interior",
    title: "Clean & Condition — Acura MDX",
    images: ["/work/acura-mdx-1.webp", "/work/acura-mdx-2.webp"],
  },
  {
    slug: "porsche-cayenne-wash",
    title: "The Diamond Detail — Porsche Cayenne",
    images: ["/work/porsche-cayenne-1.webp"],
  },
  {
    slug: "jeep-wrangler-detail",
    title: "The Diamond Detail — Jeep Wrangler",
    images: ["/work/jeep-wrangler-1.webp"],
  },
  {
    slug: "jose-discovery-sport",
    title: "The Diamond Detail — Land Rover Discovery Sport",
    images: ["/work/jose-3.webp", "/work/jose-2.webp", "/work/jose-1.webp"],
    testimonial: {
      name: "Jose Villatoro",
      quote:
        "Above excellent service. Great attention to detail and all for a great price. Highly recommend with any service that they provide.",
    },
  },
  {
    slug: "morgan-suv",
    title: "The Diamond Detail Plus — Blue SUV",
    images: ["/work/morgan-1.webp", "/work/morgan-2.webp"],
    testimonial: {
      name: "Morgan Priddy",
      quote:
        "Services were easy to schedule, they arrived on time and did a wonderful job. My car looks brand new! Thank you!",
    },
  },
  {
    slug: "sport-bike-detail",
    title: "Mobile Detail — Sport Bike",
    images: ["/work/sport-bike.jpg"],
    testimonial: {
      name: "Leroy Estrada",
      quote: "Excellent work! Came to my apartment and detailed my Aprilia. 10/10",
    },
  },
  {
    slug: "harley-bagger-detail",
    title: "Motorcycle Detail — Harley-Davidson Bagger",
    images: ["/work/harley-bagger.jpg"],
  },
  {
    slug: "lexus-rx-detail",
    title: "The Diamond Detail Pro — Lexus RX",
    images: ["/work/lexus-rx-1.webp"],
  },
  {
    slug: "francs-1",
    title: "The Diamond Detail",
    images: [],
    testimonial: {
      name: "Francs",
      quote:
        "One of the top tier detailers in Denver — they made my car look brand new, like it had just come out of the factory.",
    },
  },
];
