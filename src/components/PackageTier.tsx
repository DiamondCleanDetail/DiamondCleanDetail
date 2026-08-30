/** One diamond per tier: one for the entry package, three for the best.
 *
 * Only rendered where a category's packages are genuinely a good/better/best
 * ladder. Plenty of them are not — Front Two Windows against Full Vehicle is
 * coverage, Monthly against Bi-Weekly is cadence, and RV against Boat is a
 * different vehicle entirely — and stamping a rank on those would tell a
 * customer that one is the better buy when the honest answer is that they are
 * different things. That is why the rank is set per package in the catalogue
 * rather than inferred from position in the array. */
/** The tint film cards reuse this same glyph for their good/better/best
 * pips, so the two rank indicators on the site read as one idea. */
export const DIAMOND_PATH =
  "M21.44 11H17.7l-3.12 8.44l6.77-8.27c.04-.05.06-.11.1-.17ZM10.72 2L8.39 9h7.22l-2.33-7zm10.81 6.91l-3.37-5.9A2 2 0 0 0 16.42 2h-1.03l2.33 7h3.84s-.02-.06-.04-.09ZM8.39 11l3.4 10.2L15.56 11zM5.84 3.01l-3.37 5.9s-.02.06-.04.09h3.84L8.6 2H7.57c-.72 0-1.38.39-1.74 1.01Zm3.02 15.73L6.28 11H2.56c.04.05.06.11.1.17l6.2 7.58Z";

export default function PackageTier({
  tier,
  total,
  className = "",
}: {
  /** 1-based rank within the category's ladder. */
  tier: number;
  /** How many rungs the ladder has, for the screen-reader label only. */
  total?: number;
  className?: string;
}) {
  if (!tier || tier < 1) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 text-accent ${className}`}
      // The diamonds are decoration to the eye and a rank to everyone else,
      // so the row carries the label and the shapes themselves are hidden.
      role="img"
      aria-label={total ? `Tier ${tier} of ${total}` : `Tier ${tier}`}
    >
      {Array.from({ length: tier }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5 sm:h-4 sm:w-4"
          aria-hidden="true"
          focusable="false"
        >
          <path d={DIAMOND_PATH} fill="currentColor" />
        </svg>
      ))}
    </span>
  );
}
