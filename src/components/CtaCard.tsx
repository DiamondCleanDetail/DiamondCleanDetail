import Link from "next/link";

/** The closing "payoff" card used at the end of a page — a raised surface with
 * a soft overhead glow so the final ask reads as a moment rather than just
 * another bordered box. Mirrors the selection summary on the tinting page. */
export default function CtaCard({
  eyebrow,
  title,
  accent,
  subtitle,
  href,
  cta,
}: {
  eyebrow?: string;
  title: string;
  /** Trailing words rendered in the chrome gradient. */
  accent?: string;
  subtitle?: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-surface border border-border px-6 py-10 sm:px-12 sm:py-14 text-center shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(40rem_20rem_at_50%_-30%,rgba(236,238,240,0.12),transparent_70%)]"
      />
      <div className="relative">
        {eyebrow && (
          <span className="block text-[10px] sm:text-xs uppercase tracking-[0.25em] text-muted mb-3">
            {eyebrow}
          </span>
        )}
        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-balance">
          {title}
          {accent && (
            <>
              {" "}
              <span className="chrome-text">{accent}</span>
            </>
          )}
        </h2>
        {subtitle && (
          <p className="text-sm sm:text-base text-muted mt-3 max-w-xl mx-auto">{subtitle}</p>
        )}
        <Link
          href={href}
          className="chrome-btn inline-block mt-7 sm:mt-8 px-8 py-3.5 rounded-lg font-bold text-base"
        >
          {cta}
        </Link>
      </div>
    </div>
  );
}
