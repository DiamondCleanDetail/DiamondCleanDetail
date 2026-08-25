const pairs = [
  { label: "Interior Detail — Sedan" },
  { label: "Full Detail — SUV" },
  { label: "Ceramic Coating — Truck" },
];

export default function BeforeAfterGallery() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="text-2xl font-semibold mb-2">Before &amp; After</h2>
      <p className="text-muted mb-6 text-sm">
        Placeholder gallery — swap these in for Farhan&apos;s real job
        photos.
      </p>
      <div className="grid sm:grid-cols-3 gap-5">
        {pairs.map((pair, i) => (
          <div key={i} className="bg-surface border border-border rounded-xl overflow-hidden">
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
        ))}
      </div>
    </section>
  );
}
