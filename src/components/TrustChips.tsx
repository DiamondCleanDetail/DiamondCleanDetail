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
      <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
        {chips.map((c) => (
          <li
            key={c}
            className="text-[11px] sm:text-xs font-medium text-muted bg-surface border border-border rounded-full px-3.5 py-1.5 whitespace-nowrap"
          >
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}
