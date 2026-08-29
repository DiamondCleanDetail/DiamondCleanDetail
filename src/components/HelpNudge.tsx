import { serviceArea } from "@/data/serviceArea";

/**
 * "Not sure? Ask a human." — placed wherever someone is being asked to
 * choose between things they may not know the difference between.
 *
 * Phone and email are in the footer on every page, but a footer is where you
 * look once you've already decided to get in touch. The point of this is to
 * say so at the moment of hesitation, before someone closes the tab because
 * they couldn't tell RX from RX1.
 */
export default function HelpNudge({
  label = "Not sure which to pick?",
  light = false,
  className = "",
}: {
  label?: string;
  /** For the light configurator blocks (tint, PPF preview). */
  light?: boolean;
  className?: string;
}) {
  const muted = light ? "text-neutral-500" : "text-muted";
  const strong = light ? "text-neutral-900" : "text-foreground";
  const rule = light ? "border-neutral-200" : "border-border";

  return (
    <div className={`border-t ${rule} pt-6 mt-8 text-center ${className}`}>
      <p className={`text-sm ${muted}`}>
        <span className={`font-semibold ${strong}`}>{label}</span> Tell us the car and what&apos;s
        bothering you, and we&apos;ll tell you honestly what it needs — including if that&apos;s
        less than you were about to book.
      </p>
      <p className="mt-2 text-sm">
        <a
          href={`tel:${serviceArea.phoneHref}`}
          className={`font-semibold ${strong} underline underline-offset-4 decoration-current/30 hover:decoration-current transition-colors`}
        >
          {serviceArea.phone}
        </a>
        <span className={`mx-2 ${muted}`} aria-hidden>
          &middot;
        </span>
        <a
          href={`mailto:${serviceArea.email}`}
          className={`font-semibold ${strong} underline underline-offset-4 decoration-current/30 hover:decoration-current transition-colors`}
        >
          {serviceArea.email}
        </a>
      </p>
      <p className={`mt-2 text-xs ${muted}`}>
        Phone answered {serviceArea.hours[0].time.replace("Monday–Friday, ", "weekdays ")}.
      </p>
    </div>
  );
}
