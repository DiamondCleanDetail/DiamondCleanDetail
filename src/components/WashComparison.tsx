/** "Drive-through wash vs. us" comparison — the single most effective
 * conversion device on the national mobile-detailing sites. Every row here
 * restates a claim already made elsewhere on this site (hand wash, mobile
 * service, interior deep clean, final walkthrough) — nothing new is claimed. */
const rows: { them: string; us: string }[] = [
  {
    them: "Spinning brushes that grind grit into the paint",
    us: "Every panel hand-washed and hand-dried — no swirl marks",
  },
  {
    them: "You drive there, wait in line, and drive back",
    us: "We come to your driveway or office, fully equipped",
  },
  {
    them: "A quick vacuum at best",
    us: "Deep interior clean, seats to crevices",
  },
  {
    them: "Out the exit, sight unseen",
    us: "A final walkthrough with you before we leave",
  },
];

export default function WashComparison() {
  return (
    <div className="grid sm:grid-cols-2 gap-3 sm:gap-0 sm:rounded-2xl sm:overflow-hidden sm:border sm:border-border">
      {/* Drive-through column */}
      <div className="rounded-2xl sm:rounded-none border border-border sm:border-0 bg-background/60 p-6 sm:p-8">
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted/70">The Drive-Through Wash</p>
        <ul className="mt-5 space-y-4">
          {rows.map((r) => (
            <li key={r.them} className="flex gap-3 text-sm text-muted/70">
              <span className="shrink-0 text-muted/50" aria-hidden>
                &times;
              </span>
              {r.them}
            </li>
          ))}
        </ul>
      </div>

      {/* Diamond Clean column */}
      <div className="relative rounded-2xl sm:rounded-none border border-accent/40 sm:border-0 bg-surface p-6 sm:p-8 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(24rem_12rem_at_50%_-20%,rgba(236,238,240,0.1),transparent_70%)]"
        />
        <div className="relative">
          <p className="text-[10px] uppercase tracking-[0.25em] chrome-text font-bold">Diamond Clean Detail</p>
          <ul className="mt-5 space-y-4">
            {rows.map((r) => (
              <li key={r.us} className="flex gap-3 text-sm">
                <span className="shrink-0 text-accent" aria-hidden>
                  &#10003;
                </span>
                {r.us}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
