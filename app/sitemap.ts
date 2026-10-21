import type { MetadataRoute } from "next";
import { DOCS } from "../lib/docs";
import { SITE_URL } from "../lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/benchmark`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...DOCS.map((d) => ({ url: `${SITE_URL}/docs/${d.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
