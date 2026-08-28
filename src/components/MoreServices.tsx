import Link from "next/link";
import Image from "next/image";
import { catalog, priceLabel } from "@/data/catalog";
import { StaggerGrid, StaggerItem } from "@/components/StaggerGrid";

/** Compact cross-sell strip: the other services, with a real starting price
 * on each so it's a decision rather than a menu. Excludes whichever page it
 * is sitting on. */
export default function MoreServices({
  excludeSlug,
  slugs = ["ceramic-coating", "paint-correction", "paint-protection-film", "window-tinting"],
}: {
  excludeSlug?: string;
  slugs?: string[];
}) {
  const items = slugs
    .filter((s) => s !== excludeSlug)
    .map((s) => catalog.find((c) => c.slug === s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  if (items.length === 0) return null;

  return (
    <StaggerGrid className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {items.map((c) => (
        <StaggerItem key={c.slug}>
          <Link
            href={c.slug === "window-tinting" ? "/window-tinting" : `/services/${c.slug}`}
            className="card-lift group block h-full bg-surface border border-border rounded-xl overflow-hidden"
          >
            <div className="relative aspect-[4/3] bg-surface-2">
              {c.cardImage ? (
                <Image
                  src={c.cardImage}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-[11px] text-muted">Photo coming soon</p>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-sm sm:text-base">{c.name}</h3>
              <p className="mt-1 text-sm font-semibold chrome-text">
                {c.isQuoteOnly ? "Get a Quote" : priceLabel(c.packages[0], "sedan")}
              </p>
            </div>
          </Link>
        </StaggerItem>
      ))}
    </StaggerGrid>
  );
}
