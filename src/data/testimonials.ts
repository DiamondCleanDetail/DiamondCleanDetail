export type Testimonial = {
  name: string;
  quote: string;
  rating: number;
};

// Real Google reviews for Diamond Clean Detailing LLC.
export const testimonials: Testimonial[] = [
  {
    name: "Jose Villatoro",
    quote:
      "Above excellent service. Great attention to detail and all for a great price. Highly recommend with any service that they provide.",
    rating: 5,
  },
  {
    name: "Morgan Priddy",
    quote:
      "Services were easy to schedule, they arrived on time and did a wonderful job. My car looks brand new! Thank you!",
    rating: 5,
  },
  {
    name: "Golf_Kyle",
    quote:
      "Great guy and professional, affordable, efficient service! Would highly recommend.",
    rating: 5,
  },
  {
    name: "Leroy Estrada",
    quote:
      "Excellent work! Came to my apartment and detailed my Aprilia. 10/10",
    rating: 5,
  },
  {
    name: "Francs",
    quote:
      "One of the top tier detailers in Denver — they made my car look brand new, like it had just come out of the factory. The tech really makes sure he gets every single spot.",
    rating: 5,
  },
  {
    name: "Lesyanis Solano Solano",
    quote: "Excellent service and professionalism. 100 out of 100.",
    rating: 5,
  },
];

/** Headline rating shown above the reviews. Averaged from the reviews above,
 * so it can never overstate them.
 *
 * `totalOnGoogle` is the count on the Google listing, which may be higher than
 * the handful quoted here — set it to the real number and it will be used
 * instead. Left null, the page reports only what it can actually show. */
export const reviewsTotalOnGoogle: number | null = null;

export const reviewsAverage =
  Math.round(
    (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length) * 10
  ) / 10;

export const reviewsCount = reviewsTotalOnGoogle ?? testimonials.length;
