import Image from "next/image";
import FadeIn from "@/components/FadeIn";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";
import { beforeAfterHomePairs } from "@/data/beforeAfterHome";

function Tile({ src, label, aspect }: { src: string | null; label: "Before" | "After"; aspect: string }) {
  if (src) {
    return (
      <div className={`relative ${aspect} bg-surface-2`}>
        <Image src={src} alt={label} fill sizes="(max-width: 640px) 40vw, 20vw" className="object-cover" />
      </div>
    );
  }
  return (
    <div className={`${aspect} bg-surface-2 flex items-center justify-center text-xs text-muted`}>
      {label} — coming soon
    </div>
  );
}

export default function BeforeAfterGallery() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10 sm:py-16">
      <FadeIn>
        <span className="text-[10px] sm:text-xs uppercase tracking-widest text-muted">
          The Diamond Standard
        </span>
        <h2 className="text-xl sm:text-2xl font-semibold mt-1 mb-6 sm:mb-8">Before &amp; After</h2>
      </FadeIn>
      {/* Mobile: swipeable row with shorter tiles so three pairs don't take
          two screens of scroll. sm+: normal grid. */}
      <div className="sm:hidden -mx-6 px-6 flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar">
        {beforeAfterHomePairs.map((pair, i) => (
          <div
            key={i}
            className="snap-start shrink-0 w-[80%] bg-surface border border-border rounded-xl overflow-hidden"
          >
            <div className="grid grid-cols-2">
              <Tile src={pair.before} label="Before" aspect="aspect-[4/3]" />
              <Tile src={pair.after} label="After" aspect="aspect-[4/3]" />
            </div>
            <p className="text-sm font-medium px-4 py-3">{pair.label}</p>
          </div>
        ))}
      </div>
      <p className="sm:hidden text-xs text-muted mt-3 text-center">Swipe for more &rarr;</p>

      <StaggerGrid className="hidden sm:grid sm:grid-cols-3 gap-5">
        {beforeAfterHomePairs.map((pair, i) => (
          <StaggerItem key={i}>
            <div className="card-lift bg-surface border border-border rounded-xl overflow-hidden">
              <div className="grid grid-cols-2">
                <Tile src={pair.before} label="Before" aspect="aspect-square" />
                <Tile src={pair.after} label="After" aspect="aspect-square" />
              </div>
              <p className="text-sm font-medium px-4 py-3">{pair.label}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerGrid>
    </section>
  );
}
