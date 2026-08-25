import FadeIn from "@/components/FadeIn";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";

const pairs = [
  { label: "Interior Detail — Sedan" },
  { label: "Full Detail — SUV" },
  { label: "Ceramic Coating — Truck" },
];

export default function BeforeAfterGallery() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10 sm:py-16">
      <FadeIn>
        <span className="text-[10px] sm:text-xs uppercase tracking-widest text-muted">
          The Diamond Standard
        </span>
        <h2 className="text-xl sm:text-2xl font-semibold mt-1 mb-2">Before &amp; After</h2>
        <p className="text-muted mb-4 sm:mb-6 text-sm">
          Placeholder gallery — swap these in for Farhan&apos;s real job
          photos.
        </p>
      </FadeIn>
      {/* Mobile: swipeable row with shorter tiles so three pairs don't take
          two screens of scroll. sm+: normal grid. */}
      <div className="sm:hidden -mx-6 px-6 flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar">
        {pairs.map((pair, i) => (
          <div
            key={i}
            className="snap-start shrink-0 w-[80%] bg-surface border border-border rounded-xl overflow-hidden"
          >
            <div className="grid grid-cols-2">
              <div className="aspect-[4/3] bg-surface-2 flex items-center justify-center text-xs text-muted">
                Before
              </div>
              <div className="aspect-[4/3] bg-gradient-to-br from-accent/30 to-surface-2 flex items-center justify-center text-xs text-muted">
                After
              </div>
            </div>
            <p className="text-sm font-medium px-4 py-3">{pair.label}</p>
          </div>
        ))}
      </div>
      <p className="sm:hidden text-xs text-muted mt-3 text-center">Swipe for more &rarr;</p>

      <StaggerGrid className="hidden sm:grid sm:grid-cols-3 gap-5">
        {pairs.map((pair, i) => (
          <StaggerItem key={i}>
            <div className="card-lift bg-surface border border-border rounded-xl overflow-hidden">
              <div className="grid grid-cols-2">
                <div className="aspect-square bg-surface-2 flex items-center justify-center text-xs text-muted">
                  Before
                </div>
                <div className="aspect-square bg-gradient-to-br from-accent/30 to-surface-2 flex items-center justify-center text-xs text-muted">
                  After
                </div>
              </div>
              <p className="text-sm font-medium px-4 py-3">{pair.label}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerGrid>
    </section>
  );
}
