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
          faded. These two values put both bands within a shade of #E5.

          The offsets sit inside the band rather than bleeding above it. They
          used to be negative, which put the ink 7px over the rule so every
          numeral was sliced by the line at the top of its own section. They
          also look inverted — a larger inset on the smaller screen — because
          the padding that matters is measured from the ink, not the element:
          a font's internal leading scales with its size, so the 176px numeral
          already carries ~23px of its own clearance where the 96px one only
          carries ~13. Both land ~20-27px clear of the rule. */}
      <span
        aria-hidden
        className={`pointer-events-none select-none absolute top-3 sm:top-4 right-3 sm:right-10 text-[4.25rem] sm:text-[8rem] font-black leading-none tabular-nums tracking-tight ${
          alt ? "text-neutral-900/[0.075]" : "text-neutral-900/[0.105]"
        }`}
      >
        {String(step).padStart(2, "0")}
      </span>

      {/* Extra head room on phones, where the ghost numeral and the progress
          rail are otherwise fighting for the same 40px: the numeral is wide
          relative to a 375px screen and the rail is centred, so once the
          numeral moved down off the rule it landed on the pips. On desktop
          they never met — the numeral sits far right of a centred rail — so
          that breakpoint keeps its original spacing. */}
      <div className="relative pt-24 pb-14 sm:py-24">
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
