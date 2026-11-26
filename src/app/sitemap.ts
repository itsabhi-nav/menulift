import type { MetadataRoute } from "next";
import { seoPages, siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "how-it-works", "pricing", "results", "about", "faq", "book", "check", "partners", ...seoPages.map((p) => p.path)];
  return pages.flatMap((p) => [
    {
      url: `${siteUrl}/${p}`,
      changeFrequency: "weekly" as const,
      priority: p === "" ? 1 : 0.7,
      alternates: { languages: { en: `${siteUrl}/${p}`, hi: `${siteUrl}/hi${p ? `/${p}` : ""}` } },
    },
    { url: `${siteUrl}/hi${p ? `/${p}` : ""}`, changeFrequency: "weekly" as const, priority: p === "" ? 0.9 : 0.6 },
  ]);
}
