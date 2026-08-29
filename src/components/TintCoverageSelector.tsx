"use client";

import { addOnPrice, getCategory, vehicleSizeLabels, VehicleSize, resolveLinePrice, Package } from "@/data/catalog";
import { teslaPriceForPackage, teslaModelFromVehicleInfo } from "@/data/teslaTint";
import { coverageDiagram, COVERAGE_CANVAS } from "@/data/tintCoverage";
import Image from "next/image";
import StackedImage from "@/components/StackedImage";
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
  // Both coverage diagrams and both windshield ones stay mounted, so choosing
  // between them is a style change rather than a fetch.
  const coverageVariants = category.packages
    .map((p) => ({ key: p.slug, src: coverageDiagram(p.slug, vehicleSize) }))
    .filter((v): v is { key: string; src: string } => Boolean(v.src));
  const windshieldSlug = windshieldAddOns.includes("full-windshield")
    ? "full-windshield"
    : "windshield-strip";
  const windshieldVariants = ["windshield-strip", "full-windshield"]
    .map((slug) => ({ key: slug, src: coverageDiagram(slug, vehicleSize) }))
    .filter((v): v is { key: string; src: string } => Boolean(v.src));

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
              <StackedImage
                variants={coverageVariants}
                active={pkg.slug}
                priorityKey={pkg.slug}
                alt={`${pkg.name} tint coverage on a ${vehicleSizeLabels[vehicleSize]}`}
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
            <h4 className="text-lg font-semibold text-neutral-900">
              {isTesla ? "Add the windshield or roof?" : "Add the windshield?"}
            </h4>
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
                    windshieldAddOns.some((slug) =>
                      category.addOns?.some(
                        (x) => x.slug === slug && x.exclusiveGroup === "windshield"
                      )
                    )
                      ? ""
                      : "opacity-40 grayscale"
                  }`}
                  style={{ aspectRatio: `${COVERAGE_CANVAS.width} / ${COVERAGE_CANVAS.height}` }}
                >
                  <StackedImage
                    variants={windshieldVariants}
                    active={windshieldSlug}
                    alt={`${
                      windshieldSlug === "full-windshield" ? "Full windshield" : "Windshield strip"
                    } coverage on a ${vehicleSizeLabels[vehicleSize]}`}
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
              {/* "None" keeps a full-width row of its own; the two options
                  that carry a photo sit side by side. Stacked full width, an
                  880x400 photo was being squeezed into roughly 7:1 and read
                  as an abstract smear — in a half-width column it shows at
                  its own ratio, uncropped. */}
              {/* Two-up only from lg. This list already sits in the right-hand
                  half of the section, so splitting it at sm made four columns
                  across the page — each option about 160px, enough to wrap
                  "Windshield Strip" onto two lines and cut the price off. */}
              <div
                className="grid lg:grid-cols-2 gap-3"
                role="radiogroup"
                aria-label="Windshield tint"
              >
                {[
                  {
                    slug: null as string | null,
                    name: "No windshield tint",
                    price: null as number | null,
                    description: "Just the coverage you picked above.",
                    photo: null as { src: string; alt: string } | null,
                  },
                  ...(category.addOns ?? [])
                    // Only the windshield pair belongs in this radio group.
                    // Independent extras (the Tesla roof) render below as
                    // checkboxes — folding them in here would have made the
                    // roof mutually exclusive with the windshield, and
                    // roof-plus-windshield is a perfectly good order.
                    .filter((a) => a.exclusiveGroup === "windshield" && (!a.teslaOnly || isTesla))
                    .map((a) => ({
                    slug: a.slug as string | null,
                    name: a.name,
                    // Context-resolved: a Tesla strip is $59, the Model X
                    // windshield $429, the roof priced by film — the same
                    // addOnPrice the checkout charges with.
                    price: addOnPrice(a, {
                      isTesla,
                      filmSlug,
                      teslaModel: teslaModelFromVehicleInfo(vehicleInfo),
                    }) as number | null,
                    description: a.description,
                    // The problem each option exists to solve, shown small.
                    // Sun in your eyes is why anyone buys the strip; a
                    // sun-cracked dash is what the full windshield's UV cut
                    // prevents. The photo makes the "oh, that's me" click
                    // that the description alone doesn't.
                    photo:
                      a.slug === "windshield-strip"
                        ? {
                            src: "/services/windshield-glare.webp",
                            alt: "Driver squinting into low sun coming under the visor",
                          }
                        : a.slug === "full-windshield"
                          ? {
                              src: "/services/windshield-cracked-dash.webp",
                              alt: "A dashboard cracked by years of sun through the windshield",
                            }
                          : null,
                  })),
                ].map((a) => {
                  const windshieldChosen = windshieldAddOns.some((slug) =>
                    category.addOns?.some(
                      (x) => x.slug === slug && x.exclusiveGroup === "windshield"
                    )
                  );
                  const selected =
                    a.slug === null ? !windshieldChosen : windshieldAddOns.includes(a.slug);
                  return (
                    <label
                      key={a.slug ?? "none"}
                      className={`block rounded-xl border-2 overflow-hidden cursor-pointer transition-colors ${
                        a.slug === null ? "lg:col-span-2" : "flex flex-col"
                      } ${
                        selected
                          ? "border-neutral-900 bg-neutral-50"
                          : "border-neutral-200 hover:border-neutral-400"
                      }`}
                    >
                      {/* Slim, muted banner rather than a hero: it's a nudge,
                          not the subject. Greyed until the option is chosen so
                          the selected card is also the most vivid one. */}
                      {a.photo && (
                        <span className="relative block w-full aspect-[880/400]">
                          <Image
                            src={a.photo.src}
                            alt={a.photo.alt}
                            fill
                            sizes="(max-width: 640px) 100vw, 25vw"
                            className={`object-cover transition-[filter,opacity] ${
                              selected ? "" : "grayscale-[35%] opacity-80"
                            }`}
                          />
                        </span>
                      )}
                      <span className="flex items-start gap-3 px-4 py-3.5">
                        <input
                          type="radio"
                          name="windshield-tint-option"
                          checked={selected}
                          onChange={() => {
                            const kept = windshieldAddOns.filter((slug) => {
                              const other = category.addOns?.find((x) => x.slug === slug);
                              return other && other.exclusiveGroup !== "windshield";
                            });
                            setWindshieldAddOns(a.slug === null ? kept : [...kept, a.slug]);
                          }}
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
                      </span>
                    </label>
                  );
                })}

              </div>

              {/* Independent extras — today just the Tesla panoramic roof —
                  as checkboxes under the radio trio: they combine freely with
                  any windshield choice (or none). Film-priced, so the figure
                  follows the film picked in step 4.
                  Outside the radiogroup, and full width rather than in one of
                  its columns: a checkbox is not one of the radios' options,
                  and sitting in a half-width cell it read as a fourth choice
                  in that set with an empty slot beside it. */}
              <div className="mt-3 space-y-3">
                {(category.addOns ?? [])
                  .filter((a) => !a.exclusiveGroup && (!a.teslaOnly || isTesla))
                  .map((a) => {
                    const selected = windshieldAddOns.includes(a.slug);
                    const price = addOnPrice(a, {
                      isTesla,
                      filmSlug,
                      teslaModel: teslaModelFromVehicleInfo(vehicleInfo),
                    });
                    return (
                      <label
                        key={a.slug}
                        className={`flex items-start gap-3 rounded-xl border-2 px-4 py-3.5 cursor-pointer transition-colors ${
                          selected
                            ? "border-neutral-900 bg-neutral-50"
                            : "border-neutral-200 hover:border-neutral-400"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() =>
                            setWindshieldAddOns(
                              selected
                                ? windshieldAddOns.filter((slug) => slug !== a.slug)
                                : [...windshieldAddOns, a.slug]
                            )
                          }
                          className="mt-1 h-4 w-4 rounded border-2 border-neutral-300 accent-neutral-900"
                        />
                        <span className="flex-1 min-w-0">
                          <span className="flex items-baseline justify-between gap-3">
                            <span className="text-sm font-semibold text-neutral-900">{a.name}</span>
                            <span className="text-sm font-bold text-neutral-900 tabular-nums shrink-0">
                              +${price}
                            </span>
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
