/**
 * The commitments and conditions a customer is entitled to know before they
 * pay, kept in one place rather than written into whichever component happened
 * to need them.
 *
 * Every line here is Farhan's own wording or a direct restatement of it. None
 * of it is inferred: a guarantee the owner has not actually made, or a refund
 * rule invented to fill a gap, is worse than saying nothing.
 */

export const guarantee = {
  name: "Diamond Clean Satisfaction Guarantee",
  /** The promise itself. Deliberately specific about the window and about what
   * we commit to — "we'll make it right" with no timeframe is the kind of
   * assurance customers have learned to discount. */
  promise:
    "If you're not completely satisfied with your service, contact us within 24 hours and we'll work with you to make it right.",
  window: "24 hours",
  /** Phrases the payment step bolds. The wording above is Farhan's and is not
   * ours to shorten; emphasis is the only way to make a paragraph of small
   * grey type scannable without changing what it says. */
  emphasise: ["contact us within 24 hours", "make it right"] as const,
};

export const policies = {
  weather: {
    q: "What happens if the weather stops my appointment?",
    a: "Colorado weather being what it is, this comes up. If conditions mean we can't do the job properly, we'll get in touch and find you another date. If rescheduling doesn't work for you, you get your deposit back in full — no argument.",
    emphasise: ["find you another date", "your deposit back in full — no argument"] as const,
  },
  onArrivalPricing: {
    q: "Is the price I see online the price I pay?",
    a: "Yes, as long as the vehicle matches what you told us. Pricing is based on the size and condition you select when booking, so if the vehicle turns out to be significantly different from that when we arrive, we'll talk it through and agree any change with you before we start work — never after.",
  },
  coveredSpace: {
    q: "Do you need a garage for paint protection film or ceramic coating?",
    a: "Ideally, yes. Film and coatings cure best in a clean, covered, dust-controlled space, and a garage or carport gives the best result. It isn't always a dealbreaker — get in touch with the details of where the vehicle will be and we'll tell you honestly whether it'll work.",
  },
} as const;
