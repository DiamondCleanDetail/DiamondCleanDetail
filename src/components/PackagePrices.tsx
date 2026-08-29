import {
  formatPrice,
  priceForSize,
  vehicleSizeLabels,
  vehicleSizeShortLabels,
  type Package,
  type VehicleSize,
} from "@/data/catalog";

const sizes: VehicleSize[] = ["sedan", "suv", "truck"];

/** Shows the price for every vehicle size at once, rather than a sedan price
 * plus "larger vehicles priced at checkout". People arrive knowing what they
 * drive, so answering it here removes a reason to bounce. Falls back to the
 * single figure for starting-at / quote packages, which don't vary by size. */
export default function PackagePrices({ pkg }: { pkg: Package }) {
  if (pkg.pricing.type !== "fixed") {
    return (
      <div>
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted">
          {pkg.pricing.type === "quote" ? "Pricing" : "Starting From"}
        </p>
        <p className="chrome-text text-3xl font-black leading-tight mt-1">
          {pkg.pricing.type === "quote"
            ? "Get a Quote"
            : formatPrice(pkg.pricing.amount)}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* A tier priced from a floor says so in the heading rather than only in
          a "+" on each figure, which is easy to read as part of the number. */}
      <p className="text-[10px] uppercase tracking-[0.25em] text-muted mb-2">
        {pkg.priceIsFrom ? "Starting Price by Vehicle" : "Price by Vehicle"}
      </p>
      <div className="grid grid-cols-3 gap-2">
        {sizes.map((s) => (
          <div
            key={s}
            className="price-cell rounded-lg bg-surface-2 border border-border px-2 py-2.5 text-center"
            title={vehicleSizeLabels[s]}
          >
            <p className="text-[10px] uppercase tracking-widest text-muted">{vehicleSizeShortLabels[s]}</p>
            <p className="price-figure chrome-text font-black leading-none mt-1 tabular-nums">
              {formatPrice(priceForSize(pkg, s) ?? 0)}
              {pkg.priceIsFrom && "+"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
