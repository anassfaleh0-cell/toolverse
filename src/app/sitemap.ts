import type { MetadataRoute } from "next";
import { SITEMAP_PATHS } from "@/lib/registry";
import { getSitemapPaths } from "@/lib/content/registry";
import { getAllLandingSlugs } from "@/lib/seo/landing-pages";
import { getAllTagSlugs } from "@/lib/seo/tags";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://toolverse.dev";
  const now = new Date();

  const priorityMap: Record<string, number> = {
    "/": 1,
    "/tools": 0.9,
    "/categories": 0.8,
    "/what-is-my-ip": 0.9,
    "/ip-lookup": 0.9,
    "/resources": 0.9,
    "/guides": 0.9,
    "/learn": 0.9,
    "/blog": 0.9,
    "/compare": 0.9,
  };

  const staticExtra = [
    "/feed.xml",
    "/sitemap",
    "/editorial-guidelines",
    "/how-we-test-tools",
    "/about-our-research",
    "/transparency",
    "/tag",
  ];

  const landingPaths = getAllLandingSlugs().map((slug) => `/${slug}`);
  const tagPaths = getAllTagSlugs().map((slug) => `/tag/${slug}`);

  const allPaths = [
    ...SITEMAP_PATHS,
    ...getSitemapPaths(),
    ...staticExtra,
    ...landingPaths,
    ...tagPaths,
  ];

  return allPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: priorityMap[path] ?? 0.6,
  }));
}
