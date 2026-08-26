import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/booking/success", "/coming-soon"],
      },
    ],
    sitemap: "https://diamondcleandetail.com/sitemap.xml",
  };
}
