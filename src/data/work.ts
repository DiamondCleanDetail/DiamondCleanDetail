export type WorkItem = {
  slug: string;
  title: string;
  /** Used to group cards under a "Make" divider on the Our Work page. */
  brand: string;
  /** Photos from a single job, all shown in one card. Paths under
   * /public/work, e.g. "/work/jose-1.webp". An empty array renders a
   * "photo coming soon" placeholder. */
  images: string[];
  /** Clips from the same job. Each needs a poster: the grid shows the poster
   * and only fetches the video once someone asks to play it, so a job with a
   * clip costs a still's worth of bandwidth until then. */
  videos?: { src: string; poster: string }[];
  /** Kept out of the published grid until the details are confirmed. */
  draft?: boolean;
  testimonial?: {
    name: string;
    quote: string;
  };
};

/** One playable or viewable thing from a job. */
export type WorkMedia =
  | { kind: "image"; src: string }
  | { kind: "video"; src: string; poster: string };

/** A job's media in display order. Clips lead: the card shows the first item,
 * and a video is the strongest thing a job has to show. */
export function workMedia(item: WorkItem): WorkMedia[] {
  return [
    ...(item.videos ?? []).map((v) => ({ kind: "video" as const, src: v.src, poster: v.poster })),
    ...item.images.map((src) => ({ kind: "image" as const, src })),
  ];
}

export const workItems: WorkItem[] = [
  {
    slug: "ferrari-488-spider-detail",
    title: "The Diamond Detail Pro — Ferrari 488 Spider",
    brand: "Ferrari",
    // The orange-interior car. Two 488 Spiders were mixed into one entry —
    // this one and a beige-interior car below — which is why photos 4 and 5
    // used to show a different cabin from photos 1 to 3.
    images: [
      "/work/ferrari-488-1.webp",
      "/work/ferrari-488-2.webp",
      "/work/ferrari-488-3.webp",
    ],
  },
  {
    // The beige-interior 488. Its third photo was filed as "bmw-m3-1" and sat
    // on the M3's card, where a "488 SPIDER" badge on cream leather was
    // fairly hard to mistake for a BMW.
    //
    // TODO: package unconfirmed. The title deliberately names no tier rather
    // than borrowing the orange car's "Pro" — ask Farhan which this was.
    slug: "ferrari-488-spider-beige-detail",
    title: "Ferrari 488 Spider",
    brand: "Ferrari",
    images: [
      "/work/ferrari-488-beige-1.webp",
      "/work/ferrari-488-beige-2.webp",
      "/work/ferrari-488-beige-3.webp",
    ],
  },
  {
    slug: "lamborghini-huracan-detail",
    title: "The Diamond Detail Pro — Lamborghini Huracán",
    brand: "Lamborghini",
    images: ["/work/lamborghini-huracan-1.webp", "/work/lamborghini-huracan-2.webp"],
  },
  {
    slug: "bentley-detail",
    title: "The Diamond Detail Pro — Bentley",
    brand: "Bentley",
    images: ["/work/bentley-1.webp", "/work/bentley-2.webp", "/work/bentley-3.webp"],
  },
  {
    slug: "porsche-cayenne-wash",
    title: "The Diamond Detail — Porsche Cayenne",
    brand: "Porsche",
    images: ["/work/porsche-cayenne-1.webp"],
  },
  {
    slug: "porsche-911-red-detail",
    title: "The Diamond Detail — Porsche 911",
    brand: "Porsche",
    images: ["/work/porsche-911-red-1.webp", "/work/porsche-911-red-2.webp", "/work/porsche-911-red-3.webp"],
  },
  {
    slug: "porsche-macan-white-detail",
    title: "The Diamond Detail — Porsche Macan",
    brand: "Porsche",
    images: [
      "/work/porsche-macan-white-1.webp",
      "/work/porsche-macan-white-2.webp",
      "/work/porsche-macan-white-3.webp",
      "/work/porsche-macan-white-4.webp",
      "/work/porsche-macan-white-5.webp",
      "/work/porsche-macan-white-6.webp",
      "/work/porsche-macan-white-7.webp",
    ],
  },
  {
    slug: "porsche-911-orange-detail",
    title: "The Diamond Detail Plus — Porsche 911 Carrera 4S",
    brand: "Porsche",
    images: [
      "/work/porsche-911-orange-1.webp",
      "/work/porsche-911-orange-2.webp",
      "/work/porsche-911-orange-3.webp",
      "/work/porsche-911-orange-4.webp",
      "/work/porsche-911-orange-5.webp",
      "/work/porsche-911-orange-6.webp",
      "/work/porsche-911-orange-7.webp",
    ],
  },
  {
    slug: "porsche-macan-orange-detail",
    title: "The Diamond Detail — Porsche Macan GTS",
    brand: "Porsche",
    images: [
      "/work/porsche-macan-orange-1.webp",
      "/work/porsche-macan-orange-2.webp",
      "/work/porsche-macan-orange-3.webp",
      "/work/porsche-macan-orange-4.webp",
      "/work/porsche-macan-orange-5.webp",
    ],
  },
  {
    // Published: Ayden confirmed the clip is ours. The vehicle reads off the
    // footage itself — side script says GT3 RS, and the swan-neck wing,
    // bonnet ducts and fender louvres match a 992.
    //
    // TODO(farhan): the package is still unknown, so the title names the car
    // and nothing else rather than borrowing the other Porsches' tier. Say
    // which service this was and it can take a tier like the rest.
    slug: "porsche-911-gt3rs-walkaround",
    title: "Porsche 911 GT3 RS",
    brand: "Porsche",
    images: [],
    videos: [
      {
        src: "/work/porsche-911-gt3rs-walkaround.mp4",
        poster: "/work/porsche-911-gt3rs-poster.webp",
      },
    ],
  },
  {
    slug: "mercedes-amg-gt-detail",
    title: "The Diamond Detail Pro — Mercedes-AMG GT",
    brand: "Mercedes-Benz",
    images: [
      "/work/mercedes-amg-gt-1.webp",
      "/work/mercedes-amg-gt-2.webp",
      "/work/mercedes-amg-gt-3.webp",
      "/work/mercedes-amg-gt-4.webp",
      "/work/mercedes-amg-gt-5.webp",
      "/work/mercedes-amg-gt-6.webp",
    ],
  },
  {
    slug: "bmw-x5-pro-detail",
    title: "The Diamond Detail Pro — BMW X5",
    brand: "BMW",
    images: ["/work/bmw-x5-1.webp"],
  },
  {
    slug: "bmw-m3-competition-detail",
    title: "The Diamond Detail — BMW M3 Competition",
    brand: "BMW",
    // One photo, not two: the other was the beige Ferrari's, now filed with it.
    images: ["/work/bmw-m3-2.webp"],
  },
  {
    slug: "velar-full-detail",
    title: "The Diamond Detail Plus — Range Rover Velar",
    brand: "Land Rover",
    images: ["/work/velar-1.webp", "/work/velar-2.webp", "/work/velar-3.webp"],
  },
  {
    slug: "jose-discovery-sport",
    title: "The Diamond Detail — Land Rover Discovery Sport",
    brand: "Land Rover",
    images: ["/work/jose-3.webp", "/work/jose-2.webp", "/work/jose-1.webp"],
    testimonial: {
      name: "Jose Villatoro",
      quote:
        "Above excellent service. Great attention to detail and all for a great price. Highly recommend with any service that they provide.",
    },
  },
  {
    slug: "range-rover-black-detail",
    title: "The Diamond Detail Plus — Range Rover",
    brand: "Land Rover",
    images: [
      "/work/range-rover-black-1.webp",
      "/work/range-rover-black-2.webp",
      "/work/range-rover-black-3.webp",
      "/work/range-rover-black-4.webp",
      "/work/range-rover-black-5.webp",
      "/work/range-rover-black-6.webp",
    ],
  },
  {
    slug: "audi-interior-detail",
    title: "The Diamond Detail — Audi Interior",
    brand: "Audi",
    images: [
      "/work/audi-interior-1.webp",
      "/work/audi-interior-2.webp",
      "/work/audi-interior-3.webp",
      "/work/audi-interior-4.webp",
      "/work/audi-interior-5.webp",
      "/work/audi-interior-6.webp",
      "/work/audi-interior-7.webp",
      "/work/audi-interior-8.webp",
    ],
  },
  {
    slug: "lexus-rx-detail",
    title: "The Diamond Detail Pro — Lexus RX",
    brand: "Lexus",
    images: ["/work/lexus-rx-1.webp"],
  },
  {
    slug: "acura-mdx-interior",
    title: "Clean & Condition — Acura MDX",
    brand: "Acura",
    images: ["/work/acura-mdx-1.webp", "/work/acura-mdx-2.webp"],
  },
  {
    slug: "jeep-wrangler-detail",
    title: "The Diamond Detail — Jeep Wrangler",
    brand: "Jeep",
    images: ["/work/jeep-wrangler-1.webp"],
  },
  {
    slug: "sport-bike-detail",
    title: "Mobile Detail — Sport Bike",
    brand: "Motorcycles",
    images: ["/work/sport-bike.jpg"],
    testimonial: {
      name: "Leroy Estrada",
      quote: "Excellent work! Came to my apartment and detailed my Aprilia. 10/10",
    },
  },
  {
    slug: "harley-bagger-detail",
    title: "Motorcycle Detail — Harley-Davidson Bagger",
    brand: "Motorcycles",
    images: ["/work/harley-bagger.jpg"],
  },
  {
    slug: "morgan-suv",
    title: "The Diamond Detail Plus — Blue SUV",
    brand: "More Vehicles",
    images: ["/work/morgan-1.webp", "/work/morgan-2.webp"],
    testimonial: {
      name: "Morgan Priddy",
      quote:
        "Services were easy to schedule, they arrived on time and did a wonderful job. My car looks brand new! Thank you!",
    },
  },
  {
    slug: "green-car-detail",
    title: "The Diamond Detail — Green Hatchback",
    brand: "More Vehicles",
    images: ["/work/green-car-1.webp", "/work/green-car-2.webp", "/work/green-car-3.webp"],
  },
  {
    // Jobs added from Farhan's own photos. Titles name the vehicle and
    // nothing else: only the ceramic X5 below has a confirmed service behind
    // it, and borrowing a package name for the rest would be inventing one.
    slug: "bmw-x5-ceramic-coating",
    title: "Ceramic Coating — BMW X5",
    brand: "BMW",
    images: ["/work/bmw-x5-ceramic.webp"],
  },
  {
    slug: "bmw-x5-detail",
    title: "BMW X5",
    brand: "BMW",
    images: ["/work/bmw-x5-driveway.webp"],
  },
  {
    // TODO: Tahoe or Suburban — they are identical from the front, and this
    // photo is a front three-quarter. Worth confirming before anyone reads
    // it as carelessness.
    slug: "chevrolet-tahoe-detail",
    title: "Chevrolet Tahoe",
    brand: "Chevrolet",
    images: ["/work/chevrolet-tahoe-1.webp"],
  },
  {
    slug: "corvette-c8-detail",
    title: "Chevrolet Corvette C8",
    brand: "Chevrolet",
    images: ["/work/corvette-c8-1.webp"],
  },
  {
    slug: "tesla-model-y-detail",
    title: "Tesla Model Y",
    brand: "Tesla",
    images: ["/work/tesla-model-y-1.webp"],
  },
  {
    slug: "mazda-cx5-detail",
    title: "Mazda CX-5",
    brand: "Mazda",
    images: ["/work/mazda-cx5-1.webp"],
  },
  {
    slug: "honda-crv-detail",
    title: "Honda CR-V",
    brand: "Honda",
    images: ["/work/honda-crv-1.webp"],
  },
  {
    // The labels are burned into the image, so the title says what it is
    // rather than claiming a package the photo cannot evidence.
    slug: "bmw-x5-interior-before-after",
    title: "BMW X5 — Interior, Before & After",
    brand: "BMW",
    images: ["/work/bmw-x5-interior-ba.webp"],
  },
  {
    slug: "francs-1",
    title: "The Diamond Detail",
    brand: "More Vehicles",
    images: [],
    testimonial: {
      name: "Francs",
      quote:
        "One of the top tier detailers in Denver — they made my car look brand new, like it had just come out of the factory.",
    },
  },
];

/** Anchor id for a marque's section on /our-work.
 *
 * Shared so the "Trusted With" strip and the gallery cannot drift apart: the
 * strip links to `#${brandAnchor(brand)}` and the gallery renders the matching
 * id, both derived from the same brand string in this file. */
export function brandAnchor(brand: string): string {
  return "marque-" + brand.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
