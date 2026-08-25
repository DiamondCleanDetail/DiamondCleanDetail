export type WorkItem = {
  slug: string;
  title: string;
  // Path under /public/work once real photos are added, e.g. "/work/jose-1.jpg".
  image: string | null;
  testimonial?: {
    name: string;
    quote: string;
  };
};

export const workItems: WorkItem[] = [
  {
    slug: "jose-1",
    title: "Full Detail — Land Rover Discovery Sport",
    image: "/work/jose-3.webp",
    testimonial: {
      name: "Jose Villatoro",
      quote:
        "Above excellent service. Great attention to detail and all for a great price. Highly recommend with any service that they provide.",
    },
  },
  {
    slug: "jose-2",
    title: "Interior Detail — Land Rover Discovery Sport",
    image: "/work/jose-2.webp",
  },
  {
    slug: "jose-3",
    title: "Full Detail — Land Rover Discovery Sport",
    image: "/work/jose-1.webp",
  },
  {
    slug: "morgan-1",
    title: "Full Detail — Blue SUV",
    image: "/work/morgan-1.webp",
    testimonial: {
      name: "Morgan Priddy",
      quote:
        "Services were easy to schedule, they arrived on time and did a wonderful job. My car looks brand new! Thank you!",
    },
  },
  {
    slug: "morgan-2",
    title: "Interior Detail — Blue SUV",
    image: "/work/morgan-2.webp",
  },
  {
    slug: "sport-bike-detail",
    title: "Mobile Detail — Sport Bike",
    image: "/work/sport-bike.jpg",
    testimonial: {
      name: "Leroy Estrada",
      quote: "Excellent work! Came to my apartment and detailed my Aprilia. 10/10",
    },
  },
  {
    slug: "harley-bagger-detail",
    title: "Motorcycle Detail — Harley-Davidson Bagger",
    image: "/work/harley-bagger.jpg",
  },
  {
    slug: "lexus-rx-detail",
    title: "Full Detail — Lexus RX",
    image: "/work/lexus-rx.jpg",
  },
  {
    slug: "francs-1",
    title: "Full Detail",
    image: null,
    testimonial: {
      name: "Francs",
      quote:
        "One of the top tier detailers in Denver — they made my car look brand new, like it had just come out of the factory.",
    },
  },
];
