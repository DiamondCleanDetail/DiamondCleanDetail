import {
  testimonials as curatedTestimonials,
  yelpTestimonials,
  googleTestimonials,
  reviewsAverage as curatedAverage,
  reviewsCount as curatedCount,
  type Testimonial,
} from "@/data/testimonials";

/**
 * The reviews block, live from the Google listing when we can reach it.
 *
 * Farhan should not have to ring us to get a new review onto the website, and
 * a hand-copied rating goes stale silently — it keeps saying 5.0 from 8 long
 * after it is 4.9 from 20, which is the kind of wrong nobody notices until a
 * customer does.
 *
 * Needs two environment variables. Without them this returns the hand-entered
 * list unchanged, so the site works exactly as it does today until the key
 * exists, and keeps working if Google is down or the key is later revoked:
 *
 *   GOOGLE_PLACES_API_KEY  a Places API (New) key from Google Cloud
 *   GOOGLE_PLACE_ID        the listing's place ID (see scripts/find-place-id.mjs)
 */

export type ReviewsData = {
  testimonials: Testimonial[];
  average: number;
  count: number;
  /** Where the numbers came from. "curated" means the hand-entered fallback. */
  source: "google" | "curated";
};

const FALLBACK: ReviewsData = {
  testimonials: curatedTestimonials,
  average: curatedAverage,
  count: curatedCount,
  source: "curated",
};

/** Google returns at most five, and only the ones it considers most relevant.
 * There is no parameter to ask for more or to choose them. */
const MAX_REVIEWS = 5;

/** Long enough for a real review, short enough that one essay can't stretch a
 * card past its neighbours. */
const MAX_QUOTE = 320;

/** Once a day. Google's terms allow caching Places content for up to 30 days,
 * so this is comfortably inside them, and a detailing business does not
 * collect reviews fast enough for anything tighter to be worth the calls. */
const REVALIDATE_SECONDS = 60 * 60 * 24;

/** Newlines and stray control bytes, which would otherwise break out of a
 * review card's layout. */
const CONTROL_CHARS = new RegExp(
  `[${String.fromCharCode(0)}-${String.fromCharCode(31)}${String.fromCharCode(127)}]+`,
  "g"
);

type PlacesReview = {
  rating?: unknown;
  text?: { text?: unknown };
  originalText?: { text?: unknown };
  authorAttribution?: { displayName?: unknown; uri?: unknown };
};

/** Reviews are written by strangers. Everything below treats the payload as
 * untrusted: wrong types are dropped rather than coerced, and text is
 * length-capped and stripped of control characters before it reaches a page. */
function cleanReview(r: PlacesReview): Testimonial | null {
  const rating = typeof r.rating === "number" ? Math.round(r.rating) : null;
  if (rating === null || rating < 1 || rating > 5) return null;

  const raw =
    typeof r.text?.text === "string"
      ? r.text.text
      : typeof r.originalText?.text === "string"
        ? r.originalText.text
        : "";
  const quote = raw.replace(CONTROL_CHARS, " ").replace(/\s+/g, " ").trim();
  if (!quote) return null;

  const name =
    typeof r.authorAttribution?.displayName === "string" &&
    r.authorAttribution.displayName.trim()
      ? r.authorAttribution.displayName.trim().slice(0, 60)
      : "Google reviewer";

  return {
    name,
    quote:
      quote.length > MAX_QUOTE ? `${quote.slice(0, MAX_QUOTE - 1).trimEnd()}…` : quote,
    rating,
    source: "Google" as const,
  };
}

export async function getReviews(): Promise<ReviewsData> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) return FALLBACK;

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
      {
        headers: {
          "X-Goog-Api-Key": key,
          "X-Goog-FieldMask": "rating,userRatingCount,reviews",
        },
        next: { revalidate: REVALIDATE_SECONDS },
      }
    );
    if (!res.ok) {
      console.error(`Google reviews: ${res.status} ${res.statusText}`);
      return FALLBACK;
    }

    const data = await res.json();

    const average = typeof data?.rating === "number" ? data.rating : null;
    const count =
      typeof data?.userRatingCount === "number" ? data.userRatingCount : null;
    const reviews = Array.isArray(data?.reviews)
      ? data.reviews.slice(0, MAX_REVIEWS).map(cleanReview).filter(Boolean)
      : [];

    // The rating and the count are the load-bearing claims on the page, so a
    // response missing either is not worth half-using. Quotes are decoration
    // by comparison — live numbers with the curated quotes underneath them is
    // a coherent page; a live quote beside a stale rating is not.
    if (average === null || count === null) return FALLBACK;

    return {
      // Live Google quotes, then the Yelp ones appended. Without this the
      // moment a key is configured every Yelp review silently disappears —
      // the API only knows about the Google listing.
      testimonials: [
        // Live Google quotes when the listing gave us any, the curated Google
        // ones when it didn't — Google returns at most five and picks them
        // itself, so an empty list is a real possibility.
        ...((reviews.length ? reviews : googleTestimonials) as Testimonial[]),
        ...yelpTestimonials,
      ],
      average: Math.round(average * 10) / 10,
      count,
      source: "google",
    };
  } catch (err) {
    // Never let the listing being unreachable take the homepage with it.
    console.error("Google reviews fetch failed:", err);
    return FALLBACK;
  }
}
