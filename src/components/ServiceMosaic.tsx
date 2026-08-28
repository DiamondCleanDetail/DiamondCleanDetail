import Link from "next/link";
import Image from "next/image";
import { serviceMosaic } from "@/data/serviceMosaic";
import { catalog, priceLabel } from "@/data/catalog";

/** Real starting price for the category a tile links to, or null for tiles
 * that aren't services (Our Work, Schedule Online) and quote-only categories.
 * Sourced from the catalog so the homepage can never disagree with the
 * service pages. */
function tilePrice(href: string): string | null {
  const slug = href.startsWith("/services/")
    ? href.slice("/services/".length)
    : href === "/window-tinting"
      ? "window-tinting"
      : null;
  if (!slug) return null;
  const category = catalog.find((c) => c.slug === slug);
  if (!category || category.isQuoteOnly) return null;
  return priceLabel(category.packages[0], "sedan");
}

function Tile({ tile }: { tile: (typeof serviceMosaic)[number] }) {
  const price = tilePrice(tile.href);
  return (
    <Link
      href={tile.href}
      className="group relative block h-full w-full overflow-hidden bg-surface-2"
    >
      {tile.image ? (
        <>
          <Image
            src={tile.image}
            alt={tile.title}
            fill
            sizes="(max-width: 640px) 50vw, 16vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 via-40% to-transparent" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-surface-2 to-surface" />
      )}
      <span className="absolute inset-0 flex flex-col justify-end items-start gap-1 p-3 sm:p-4">
        <span className="font-bold uppercase tracking-tight text-sm sm:text-base leading-tight text-foreground drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          {tile.title}
        </span>
        {price && (
          <span className="text-[11px] font-semibold text-foreground/90 bg-background/70 backdrop-blur-sm border border-border rounded-full px-2 py-0.5">
            {price}
          </span>
        )}
      </span>
    </Link>
  );
}

export default function ServiceMosaic() {
  return (
    <div>
      {/* Mosaic — desktop/tablet only */}
      <div className="hidden sm:block bg-border p-px rounded-xl overflow-hidden">
        <div className="grid grid-cols-6 gap-px h-[420px]">
          {serviceMosaic.map((tile) => (
            <div
              key={tile.title}
              style={{
                gridColumn: tile.col,
                gridRow: tile.row === "span" ? "1 / span 2" : tile.row,
              }}
            >
              <Tile tile={tile} />
            </div>
          ))}
        </div>
      </div>

      {/* Simplified 2-up grid on mobile */}
      <div className="sm:hidden grid grid-cols-2 gap-2">
        {serviceMosaic.map((tile) => (
          <div key={tile.title} className="aspect-square">
            <Tile tile={tile} />
          </div>
        ))}
      </div>
    </div>
  );
}
