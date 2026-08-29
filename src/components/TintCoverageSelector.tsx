"use client";

import { getCategory, vehicleSizeLabels, VehicleSize, resolveLinePrice, Package } from "@/data/catalog";
import { teslaPriceForPackage, teslaModelFromVehicleInfo } from "@/data/teslaTint";
import { coverageDiagram, COVERAGE_CANVAS } from "@/data/tintCoverage";
import Image from "next/image";
import SegmentedTabs from "@/components/SegmentedTabs";

const category = getCategory("window-tinting")!;

export default function TintCoverageSelector({
  vehicleSize,
  pkg,
  setPkg,
  isTesla = false,
  filmSlug,
  vehicleInfo = "",
  windshieldAddOns = [],
  setWindshieldAddOns = () => {},
}: {
  vehicleSize: VehicleSize;
  pkg: Package;
  setPkg: (p: Package) => void;
  isTesla?: boolean;
  filmSlug?: string;
  vehicleInfo?: string;
  /** Selected windshield add-on slugs, owned by the page so they can ride
   * into the booking link alongside the coverage choice. */
  windshieldAddOns?: string[];
  setWindshieldAddOns?: (slugs: string[]) => void;
}) {
  // A Tesla is priced on coverage × film rather than on vehicle size, so it
  // has to be quoted from the Tesla table here too. Showing the size-based
  // price on this step and charging the Tesla one at checkout would move the
  // number after someone had already decided.
  const teslaPrice =
    isTesla && filmSlug
      ? teslaPriceForPackage(pkg.slug, filmSlug, teslaModelFromVehicleInfo(vehicleInfo))
      : null;
  const price =
    teslaPrice?.price ?? resolveLinePrice(pkg, vehicleSize, { filmSlug }) ?? 0;
  const diagram = coverageDiagram(pkg.slug, vehicleSize);

  return (
    <div className="w-full">
      <div className="mx-auto max-w-6xl px-6">
        {/* Coverage package tabs */}
        <SegmentedTabs
          items={category.packages.map((p) => ({ value: p.slug, label: p.name }))}
          value={pkg.slug}
          onChange={(slug) => setPkg(category.packages.find((p) => p.slug === slug) ?? pkg)}
          layoutId="coverage-package-highlight"
          className="w-full"
        />

        {/* Preview + details */}
        <div className="mt-10 sm:mt-14 grid sm:grid-cols-2 gap-8 sm:gap-10 items-center">
          {/* The box is cut to the diagram canvas, and the diagram is
              bottom-aligned like the shade visualizer above it, so the three
              vehicles stand on one ground line and switching size swaps the
              car rather than moving it. Packages without a render yet keep
              the placeholder rather than borrowing another package's diagram
              — showing the wrong glass highlighted would be worse than
              showing none, since naming the exact glass is this step's whole
              job. */}
          <div
            className="relative w-full"
            style={{ aspectRatio: `${COVERAGE_CANVAS.width} / ${COVERAGE_CANVAS.height}` }}
          >
            {diagram ? (
              <Image
                src={diagram}
                alt={`${pkg.name} tint coverage on a ${vehicleSizeLabels[vehicleSize]}`}
                fill
                priority
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-contain object-bottom"
              />
            ) : (
              <div className="absolute inset-0 rounded-xl border-2 border-dashed border-neutral-300 flex items-center justify-center">
                <p className="text-sm text-neutral-500 text-center px-6">
                  {pkg.name} diagram coming soon
                </p>
              </div>
            )}
          </div>

          <div>
            <h4 className="text-lg font-semibold text-neutral-900">{pkg.name}</h4>
            <p className="text-sm text-neutral-500 mt-1">{pkg.tagline}</p>
            <ul className="mt-3 space-y-1">
              {pkg.features.map((f) => (
                <li key={f} className="text-sm text-neutral-500 flex gap-2">
                  <span className="text-neutral-900">&#10003;</span>
                  {f}
                </li>
              ))}
            </ul>
            <p className="text-xs text-neutral-500 mt-4 uppercase tracking-widest">
              {teslaPrice
                ? teslaPrice.isFrom
                  ? "Tesla price from"
                  : "Tesla price"
                : `Price for ${vehicleSizeLabels[vehicleSize]}`}
            </p>
            <p className="text-2xl font-semibold chrome-text-dark">${price}</p>
          </div>
        </div>

        {/* Windshield options live under the coverage choice as add-ons, not
            as a third tab. As a tab, the strip was mutually exclusive with the
            coverages — "full vehicle plus the strip" was unbookable, which is
            the most natural combination there is. */}
        {(category.addOns ?? []).length > 0 && (
          <div className="mt-12 sm:mt-16 border-t-2 border-neutral-200 pt-10 sm:pt-12">
            <h4 className="text-lg font-semibold text-neutral-900">Add the windshield?</h4>
            <p className="text-sm text-neutral-500 mt-1 max-w-[60ch]">
              Pick one — the full windshield already includes the strip's glass. Either rides along with the coverage you chose above.
            </p>

            {/* The diagram follows the selection: Full Windshield when it's
                checked (its glass is the superset, so it's the honest picture
                even with both ticked), the strip when only that is, and the
                strip as the default invitation when neither is yet. Because
                every variant is cut from one shared mask, the car itself never
                moves — only the red does. */}
            <div className="mt-6 grid sm:grid-cols-2 gap-8 sm:gap-10 items-center">
              {/* Guarded rather than fed src="" — an empty src renders the
                  browser's broken-image glyph, which is exactly how the
                  unregistered diagram slipped through the first time. */}
              {/* With nothing chosen the strip render stays up as a preview
                  of what the options cover, but dimmed — at full strength the
                  highlighted glass read as an active selection sitting next
                  to a "None" that claimed otherwise. */}
              {coverageDiagram(
                windshieldAddOns.includes("full-windshield") ? "full-windshield" : "windshield-strip",
                vehicleSize
              ) ? (
                <div
                  className={`relative w-full transition-opacity ${
                    windshieldAddOns.length === 0 ? "opacity-40 grayscale" : ""
                  }`}
                  style={{ aspectRatio: `${COVERAGE_CANVAS.width} / ${COVERAGE_CANVAS.height}` }}
                >
                  <Image
                    src={
                      coverageDiagram(
                        windshieldAddOns.includes("full-windshield")
                          ? "full-windshield"
                          : "windshield-strip",
                        vehicleSize
                      )!
                    }
                    alt={`${
                      windshieldAddOns.includes("full-windshield")
                        ? "Full windshield"
                        : "Windshield strip"
                    } coverage on a ${vehicleSizeLabels[vehicleSize]}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-contain object-bottom"
                  />
                </div>
              ) : (
                <div
                  className="relative w-full rounded-xl border-2 border-dashed border-neutral-300 flex items-center justify-center"
                  style={{ aspectRatio: `${COVERAGE_CANVAS.width} / ${COVERAGE_CANVAS.height}` }}
                >
                  <p className="text-sm text-neutral-500">Windshield diagram coming soon</p>
                </div>
              )}

              {/* A real radio trio, with "None" as an explicit first option.
                  The earlier version relied on tapping the selected option
                  again to clear it — mechanically true, but nothing said so,
                  and radio circles read as "one of these is required". An
                  option you can point at is the only affordance that
                  actually communicates "you can have neither". */}
              <div className="space-y-3" role="radiogroup" aria-label="Windshield tint">
                {[
                  {
                    slug: null as string | null,
                    name: "No windshield tint",
                    price: null as number | null,
                    description: "Just the coverage you picked above.",
                  },
                  ...(category.addOns ?? []).map((a) => ({
                    slug: a.slug as string | null,
                    name: a.name,
                    price: a.price as number | null,
                    description: a.description,
                  })),
                ].map((a) => {
                  const selected =
                    a.slug === null ? windshieldAddOns.length === 0 : windshieldAddOns.includes(a.slug);
                  return (
                    <label
                      key={a.slug ?? "none"}
                      className={`flex items-start gap-3 rounded-xl border-2 px-4 py-3.5 cursor-pointer transition-colors ${
                        selected
                          ? "border-neutral-900 bg-neutral-50"
                          : "border-neutral-200 hover:border-neutral-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="windshield-tint-option"
                        checked={selected}
                        onChange={() => setWindshieldAddOns(a.slug === null ? [] : [a.slug])}
                        className="mt-1 h-4 w-4 appearance-none rounded-full border-2 border-neutral-300 checked:border-neutral-900 checked:bg-neutral-900 checked:shadow-[inset_0_0_0_3px_white] transition-colors"
                      />
                      <span className="flex-1 min-w-0">
                        <span className="flex items-baseline justify-between gap-3">
                          <span className="text-sm font-semibold text-neutral-900">{a.name}</span>
                          {a.price !== null && (
                            <span className="text-sm font-bold text-neutral-900 tabular-nums shrink-0">
                              +${a.price}
                            </span>
                          )}
                        </span>
                        <span className="block text-xs text-neutral-500 mt-1 leading-relaxed">
                          {a.description}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
