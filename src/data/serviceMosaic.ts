export type MosaicTile = {
  title: string;
  href: string;
  /** Path under /public once Farhan supplies the photo, e.g. "/mosaic/ppf.jpg". */
  image: string | null;
  col: 1 | 2 | 3 | 4 | 5 | 6;
  /** "1" or "2" for a normal half-height tile, "span" for a full-height tile. */
  row: "1" | "2" | "span";
};

export const serviceMosaic: MosaicTile[] = [
  { title: "Mobile Detailing", href: "/services/mobile-detailing", image: "/mosaic/mobile-detailing.jpg", col: 1, row: "1" },
  { title: "Ceramic Coatings", href: "/services/ceramic-coating", image: "/services/ceramic-coating-hero.jpg", col: 1, row: "2" },
  { title: "Paint Protection Film", href: "/services/paint-protection-film", image: "/services/ppf-hero.jpg", col: 2, row: "1" },
  { title: "Window Tinting", href: "/window-tinting", image: "/services/window-tinting-hero.webp", col: 2, row: "2" },
  { title: "See Our Work", href: "/our-work", image: "/work/morgan-1.webp", col: 3, row: "span" },
  { title: "Paint Correction", href: "/services/paint-correction", image: "/mosaic/paint-correction.jpg", col: 4, row: "1" },
  { title: "Fleet Services", href: "/services/fleet-detailing", image: "/mosaic/fleet-detailing.jpg", col: 4, row: "2" },
  { title: "Wheel Coatings", href: "/services/ceramic-coating", image: "/mosaic/wheel-ceramic-coating.jpg", col: 5, row: "1" },
  { title: "Leather Restoration", href: "/services/leather-restoration", image: "/mosaic/leather-restoration.jpg", col: 5, row: "2" },
  { title: "Schedule Online", href: "/booking", image: "/mosaic/schedule-online.jpg", col: 6, row: "span" },
];
