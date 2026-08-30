import type { MetadataRoute } from "next";
import { catalog } from "@/data/catalog";

const siteUrl = "https://diamondcleandetail.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/services", "/window-tinting", "/our-work", "/booking", "/shop", "/about"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));

  const serviceRoutes = catalog
    .filter((c) => c.slug !== "window-tinting")
    .map((c) => ({
      url: `${siteUrl}/services/${c.slug}`,
      lastModified: new Date(),
    }));

  return [...staticRoutes, ...serviceRoutes];
}
