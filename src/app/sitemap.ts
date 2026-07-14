import type { MetadataRoute } from "next";
import { getAllTools } from "@/lib/registry";
import { getSitemapPaths } from "@/lib/content/registry";
import { CATEGORIES } from "@/lib/categories";
import { SITEMAP_PATHS } from "@/lib/registry";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://{DOMAIN}";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const toolEntries: MetadataRoute.Sitemap = getAllTools().map((tool) => ({
    url: `${SITE_URL}${tool.url}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryEntries: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${SITE_URL}/category/${cat.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const contentEntries: MetadataRoute.Sitemap = getSitemapPaths().map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const staticEntries: MetadataRoute.Sitemap = SITEMAP_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...toolEntries,
    ...categoryEntries,
    ...contentEntries,
    ...staticEntries,
  ];
}
