export type Testimonial = {
  name: string;
  quote: string;
  rating: number;
  /** Which listing it was left on. Shown on the card, and it is also what
   * keeps the headline figure honest: that score and count describe the
   * Google listing specifically, so only Google entries may feed it. */
  source: "Google" | "Yelp";
};

/**
 * Real reviews for Diamond Clean Detailing LLC, from the Google and Yelp
 * listings. Quotes are verbatim — trimming a review to make it fit is editing
 * a customer's words, so they run at whatever length they were written.
 *
 * The Yelp entries are all marked five stars. Yelp shows a per-review score
 * that was not in what we were sent, but every one of them is unambiguously
 * positive and the owner replied to one calling it a five-star review. Worth
 * a spot-check against the listing if it ever matters.
 */
export const testimonials: Testimonial[] = [
  {
    name: "Jose Villatoro",
    quote:
      "Above excellent service. Great attention to detail and all for a great price. Highly recommend with any service that they provide.",
    rating: 5,
    source: "Google",
  },
  {
    name: "Morgan Priddy",
    quote:
      "Services were easy to schedule, they arrived on time and did a wonderful job. My car looks brand new! Thank you!",
    rating: 5,
    source: "Google",
  },
  {
    name: "Golf_Kyle",
    quote:
      "Great guy and professional, affordable, efficient service! Would highly recommend.",
    rating: 5,
    source: "Google",
  },
  {
    name: "Leroy Estrada",
    quote:
      "Excellent work! Came to my apartment and detailed my Aprilia. 10/10",
    rating: 5,
    source: "Google",
  },
  {
    name: "Francs",
    quote:
      "One of the top tier detailers in Denver — they made my car look brand new, like it had just come out of the factory. The tech really makes sure he gets every single spot.",
    rating: 5,
    source: "Google",
  },
  {
    name: "Lesyanis Solano Solano",
    quote: "Excellent service and professionalism. 100 out of 100.",
    rating: 5,
    source: "Google",
  },
  {
    // TODO: name taken from the owner's reply ("Thank you so much for this
    // amazing review, Honesty"), because the reviewer line wasn't in what we
    // were sent. Worth confirming against the Yelp listing.
    name: "Honesty",
    quote:
      "In a world where everyone gives you less - these amazing people gave me 150%. Great attitudes, excellent work ethic, phenomenal value, no over-charging, no confusion - just great people doing perfect work. They arrived on time, got right to work, gave me updates along the way - and delivered our car in the best and most beautiful shape it's ever been in.",
    rating: 5,
    source: "Yelp",
  },
  {
    name: "Britt G.",
    quote:
      "Very professional! They were able to get us in on short notice. They did both our cars and really paid attention to detail. Reasonably priced as well! I highly recommend.",
    rating: 5,
    source: "Yelp",
  },
  {
    name: "Mary F.",
    quote:
      "Wow! These guys are amazing. They were able to come the next day after I reached out to them. They did such a thorough job. I've never seen my car look so good. And we got several quotes and they were extremely affordable compared to the others. I will definitely have them back.",
    rating: 5,
    source: "Yelp",
  },
  {
    name: "Angus M.",
    quote:
      "Great service, I requested a clean on a Sunday, they showed up at 9am Monday and got my car better than when I bought it. The only detailers I will be using.",
    rating: 5,
    source: "Yelp",
  },
  {
    name: "Jose C V.",
    quote:
      "Professionally well done, took care of three vehicles. Highly recommend if you're looking to get that new car smell — get the ozone treatment. Great service and great value.",
    rating: 5,
    source: "Yelp",
  },
  {
    name: "John R.",
    quote:
      "They did a wonderful job on some very dirty and stained seats. Looks like new. Highly recommend them.",
    rating: 5,
    source: "Yelp",
  },
  {
    name: "Elena H.",
    quote:
      "They were very nice and professional! Did a great job detailing my car and replied quickly to messages. Thanks guys!",
    rating: 5,
    source: "Yelp",
  },
  {
    name: "D P.",
    quote:
      "I had paint correction and detailing done, and everything went smoothly. Very professional! He explained what was done and what needed to be done in great detail. He took his time and ensured everything was perfect before leaving. You won't be disappointed. I'll definitely use him again.",
    rating: 5,
    source: "Yelp",
  },
];

/** Headline rating shown above the reviews. Averaged from the reviews above,
 * so it can never overstate them.
 *
 * `totalOnGoogle` is the count on the Google listing, which may be higher than
 * the handful quoted here — set it to the real number and it will be used
 * instead. Left null, the page reports only what it can actually show. */
export const reviewsTotalOnGoogle: number | null = 8;

/** Google entries only. The headline block says "N Google reviews" and links
 * to the Google listing, so folding Yelp scores into that average would make
 * the number describe something other than what it is labelled as. */
export const googleTestimonials = testimonials.filter((t) => t.source === "Google");

/** Yelp entries. Kept separately because the live Google feed replaces the
 * Google quotes but must not take these with them — they come from a
 * different listing the API knows nothing about. */
export const yelpTestimonials = testimonials.filter((t) => t.source === "Yelp");

export const reviewsAverage =
  Math.round(
    (googleTestimonials.reduce((sum, t) => sum + t.rating, 0) / googleTestimonials.length) * 10
  ) / 10;

export const reviewsCount = reviewsTotalOnGoogle ?? googleTestimonials.length;
