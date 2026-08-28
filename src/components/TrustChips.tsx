import { reviewsAverage } from "@/data/testimonials";

/** Slim credibility strip under the hero — the pattern every established
 * mobile detailer runs. Every chip restates something verifiable elsewhere on
 * the site: mobile service and hand-wash-only are in the service copy, the
 * rating is computed from the real reviews in the data, and online booking is
 * the site's own checkout. */
const chips = [
  `★ ${reviewsAverage.toFixed(1)} on Google`,
  "We come to you — Denver Metro",
  "Hand wash only, never a tunnel",
  "Book & pay online in minutes",
];

export default function TrustChips() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-8 sm:pb-10">
      {/* An even grid rather than flex-wrap: with four chips, wrapping left a
          single orphan centred on its own row. Two even rows on small screens,
          one aligned band on desktop — it can't wrap ragged at any width. */}
      {/* Paired explicitly instead of relying on flex-wrap, which put three
          chips on one line and orphaned the fourth. Two tight rows of two on
          small screens, one row of four from lg — even at every width, and the
          chips still size to their own text rather than to a shared column. */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-2 sm:gap-3">
        {[chips.slice(0, 2), chips.slice(2)].map((pair, i) => (
          <ul key={i} className="flex items-center justify-center gap-2 sm:gap-3">
            {pair.map((c) => (
              <li
                key={c}
                className="text-[11px] sm:text-xs font-medium text-muted bg-surface border border-border rounded-full px-3.5 py-1.5 whitespace-nowrap"
              >
                {c}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
