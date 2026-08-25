import { serviceArea } from "@/data/serviceArea";

export default function ServiceAreaMap() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-10 sm:py-16">
      <h2 className="text-xl sm:text-2xl font-semibold mb-2">Service Area</h2>
      <p className="text-muted mb-4 sm:mb-6 text-sm">
        Mobile detailing within {serviceArea.radiusMiles} miles of{" "}
        {serviceArea.baseCity}.
      </p>
      <div className="grid sm:grid-cols-2 gap-6 items-center">
        <div className="aspect-video bg-surface-2 border border-border rounded-xl flex items-center justify-center text-sm text-muted">
          Map placeholder — embed Google Maps once address is set
        </div>
        <div className="flex flex-wrap gap-2">
          {serviceArea.cities.map((city) => (
            <span
              key={city}
              className="bg-surface border border-border rounded-full px-3 py-1 text-sm text-muted"
            >
              {city}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
