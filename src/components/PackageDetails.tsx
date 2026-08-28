import type { Package } from "@/data/catalog";

/** The parts of a package card that vary by service: the headline outcome for
 * tiered corrective work, who it suits, and — importantly — what it does not
 * cover. Rendered together so every card that has this data presents it the
 * same way. */
export default function PackageDetails({ pkg }: { pkg: Package }) {
  const hasAny = pkg.defectRemoval || pkg.bestFor?.length || pkg.excludes?.length;
  if (!hasAny) return null;

  return (
    <>
      {pkg.defectRemoval && (
        <div className="mt-4 flex items-baseline gap-2.5">
          <span className="chrome-text text-2xl font-black leading-none tabular-nums">
            {pkg.defectRemoval}
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted">
            Defect removal
          </span>
        </div>
      )}

      {pkg.bestFor && pkg.bestFor.length > 0 && (
        <div className="mt-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted">Best for</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {pkg.bestFor.map((b) => (
              <li
                key={b}
                className="text-xs text-muted bg-surface-2 border border-border rounded-full px-2.5 py-1"
              >
                {b}
              </li>
            ))}
          </ul>
        </div>
      )}

      {pkg.excludes && pkg.excludes.length > 0 && (
        <div className="mt-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted">Not included</p>
          <ul className="mt-1.5 space-y-1">
            {pkg.excludes.map((e) => (
              <li key={e} className="text-xs text-muted/80 flex gap-2">
                <span className="text-muted/50 shrink-0" aria-hidden>
                  &times;
                </span>
                {e}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
