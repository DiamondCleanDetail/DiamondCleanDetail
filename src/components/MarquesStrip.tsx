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

/**
 * Logo lookup, keyed by the same brand string the work data uses.
 *
 * This is deliberately a lookup and not the list itself — the work data still
 * decides which marques appear. A brand with no entry here falls back to its
 * name set as a wordmark, so adding a job for a marque we have no logo for
 * shows the marque rather than dropping it. (Jaguar is mapped ahead of its
 * first job for the same reason, in reverse: the logo is ready, but nothing
 * renders until the work data earns it.)
 *
 * `aspect` and `scale` are measured, not guessed — see the note on sizing on
 * `Logo` below.
 */
const logos: Record<string, { file: string; aspect: number; scale: number }> = {
  Audi: { file: "audi.svg", aspect: 2.88, scale: 0.66 },
  Bentley: { file: "bentley.svg", aspect: 3.17, scale: 0.7 },
  BMW: { file: "bmw.svg", aspect: 1, scale: 1.25 },
  Ferrari: { file: "ferrari.svg", aspect: 5.52, scale: 0.5 },
  Jaguar: { file: "jaguar.svg", aspect: 2.15, scale: 1 },
  Lamborghini: { file: "lamborghini.svg", aspect: 0.86, scale: 1.25 },
  "Land Rover": { file: "land-rover.png", aspect: 1.9, scale: 0.91 },
  "Mercedes-Benz": { file: "mercedes-benz.svg", aspect: 1, scale: 1.25 },
  Porsche: { file: "porsche.svg", aspect: 0.78, scale: 1.25 },
};

/**
 * Every logo is painted as a mask filled with `currentColor` rather than drawn
 * as an image. That is what makes nine logos from two file formats — eight
 * SVGs and a PNG traced off a photo — land on exactly one colour: whatever the
 * strip's text colour is. Nothing here has to know which format it came from,
 * and changing the strip's colour changes all nine.
 *
 * Sizing is by ink area, not by height. Matching heights would have made the
 * Ferrari wordmark (5.26:1) read as roughly five times the Porsche crest
 * (0.78:1) sitting beside it. Each logo was rendered, its opaque pixels
 * counted, and `scale` set to bring that count to the median — so they carry
 * the same visual weight even though the Lamborghini bull stands about three
 * times taller than the Ferrari letters. `aspect` is the measured ink box, so
 * the element is exactly the size of the mark with no dead padding to gap the
 * row unevenly.
 */
function Logo({ brand }: { brand: string }) {
  const logo = logos[brand];

  if (!logo) {
    // No logo for this marque — show the name rather than dropping the car.
    return (
      <span className="whitespace-nowrap text-sm sm:text-base font-semibold uppercase tracking-[0.15em]">
        {brand}
      </span>
    );
  }

  return (
    <>
      <span
        aria-hidden
        className="block bg-current"
        style={{
          height: `calc(var(--logo-h) * ${logo.scale})`,
          width: `calc(var(--logo-h) * ${logo.scale * logo.aspect})`,
          maskImage: `url(/brand/marques/${logo.file})`,
          WebkitMaskImage: `url(/brand/marques/${logo.file})`,
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        }}
      />
      <span className="sr-only">{brand}</span>
    </>
  );
}

/** Keeps the scroll speed constant as marques are added, rather than the lap
 * time being fixed and the strip getting faster with every new one. */
const SECONDS_PER_MARQUE = 3.5;

function MarqueeCopy({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <ul
      // The second copy exists only to make the loop seamless, so it is hidden
      // from assistive tech — otherwise the whole list is announced twice.
      aria-hidden={duplicate || undefined}
      className={`flex shrink-0 items-center gap-x-10 pr-10 sm:gap-x-16 sm:pr-16 text-muted/70 ${
        duplicate ? "marquee-copy-duplicate" : ""
      }`}
    >
      {marques.map((m) => (
        <li key={m} className="flex shrink-0 items-center">
          <Logo brand={m} />
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
          className="marquee-viewport [--logo-h:24px] sm:[--logo-h:30px]"
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
