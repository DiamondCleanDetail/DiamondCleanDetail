import FadeIn from "@/components/FadeIn";
import { workItems } from "@/data/work";

/** Marques actually represented in the portfolio, pulled from the work data
 * rather than hand-listed, so it can never claim a car we haven't detailed.
 * This is the high-end positioning doing real work: the client list is the
 * proof, not an adjective. */
const excluded = new Set(["More Vehicles", "Motorcycles"]);

// Draft jobs are excluded too: an unpublished entry must not be able to put
// a marque on the public list before the job itself is confirmed.
const marques = Array.from(
  new Set(workItems.filter((w) => !w.draft).map((w) => w.brand))
).filter((b) => !excluded.has(b));

/** Keeps the scroll speed constant as marques are added, rather than the lap
 * time being fixed and the strip getting faster with every new one. */
const SECONDS_PER_MARQUE = 3.5;

function MarqueeCopy({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <ul
      // The second copy exists only to make the loop seamless, so it is hidden
      // from assistive tech — otherwise the whole list is announced twice.
      aria-hidden={duplicate || undefined}
      className={`flex shrink-0 items-center gap-x-10 pr-10 sm:gap-x-16 sm:pr-16 ${
        duplicate ? "marquee-copy-duplicate" : ""
      }`}
    >
      {marques.map((m) => (
        <li
          key={m}
          className="whitespace-nowrap text-sm sm:text-base font-semibold uppercase tracking-[0.15em] text-muted/70"
        >
          {m}
        </li>
      ))}
    </ul>
  );
}

export default function MarquesStrip() {
  if (marques.length === 0) return null;

  return (
    <section className="pb-10 sm:pb-16">
      <FadeIn>
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-center text-[10px] sm:text-xs uppercase tracking-[0.25em] text-muted mb-6">
            Trusted With
          </p>
        </div>
        {/* Deliberately outside the page's max-width and padding: the strip
            runs off both edges, with the mask in globals.css fading it out
            rather than ending on a hard cut. */}
        <div
          className="marquee-viewport"
          style={{ ["--marquee-duration" as string]: `${marques.length * SECONDS_PER_MARQUE}s` }}
        >
          <div className="marquee-track">
            <MarqueeCopy />
            <MarqueeCopy duplicate />
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
