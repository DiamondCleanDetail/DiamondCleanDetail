import type { ReactNode } from "react";

/** Wraps one step of the tint configurator in its own visually distinct band.
 * Each step gets an alternating background, a hard top rule, a progress rail,
 * and an oversized ghost numeral so the three steps read as separate stages
 * rather than one continuous wall of controls. */
export default function TintStepSection({
  step,
  totalSteps = 3,
  title,
  subtitle,
  children,
}: {
  step: number;
  totalSteps?: number;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  // Alternate the band tint so adjacent steps never blend into each other.
  const alt = step % 2 === 0;

  return (
    <section
      className={`relative w-full border-t-2 border-neutral-300 ${
        alt ? "bg-neutral-100" : "bg-white"
      }`}
    >
      {/* Zero-padded, and not for decoration: a bare "1" is a plain vertical
          bar 63px wide where "2", "3" and "4" are 101–111px of distinctive
          shape, so at ghost opacity the first step read as a grey rectangle
          rather than a numeral while the rest read fine. Padding gives every
          step the same width and gives the 1 a form to be recognised by.

          The alpha differs by band because the shade should not. At one fixed
          alpha the ghost lands on #F1F1F1 over the white bands and #E7E7E7
          over the grey ones — the same contrast on paper, but visibly weaker
          on the brighter ground, which is why the odd-numbered steps looked
          faded. These two values put both bands within a shade of #E5. */}
      <span
        aria-hidden
        className={`pointer-events-none select-none absolute -top-4 sm:-top-8 right-3 sm:right-10 text-[6rem] sm:text-[11rem] font-black leading-none tabular-nums tracking-tight ${
          alt ? "text-neutral-900/[0.075]" : "text-neutral-900/[0.105]"
        }`}
      >
        {String(step).padStart(2, "0")}
      </span>

      <div className="relative py-14 sm:py-24">
        <header className="mx-auto max-w-3xl px-6 text-center mb-10 sm:mb-14">
          <div className="flex items-center justify-center gap-1.5 mb-6">
            {Array.from({ length: totalSteps }, (_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i + 1 === step ? "w-10 bg-neutral-900" : "w-5 bg-neutral-300"
                }`}
              />
            ))}
          </div>
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-neutral-500">
            Step {step} of {totalSteps}
          </p>
          <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-neutral-900 mt-2 text-balance">
            {title}
          </h3>
          <p className="text-sm sm:text-base text-neutral-500 mt-3">{subtitle}</p>
        </header>

        {children}
      </div>
    </section>
  );
}
