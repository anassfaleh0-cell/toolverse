import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/constants";
import { getAllLandingSlugs } from "@/lib/seo/landing-pages";
import { getAllTagSlugs } from "@/lib/seo/tags";

export async function GET() {
  const baseUrl = SITE_URL;
  const now = new Date().toISOString();

  const landingPaths = [
    "/", "/tools", "/categories", "/resources", "/guides", "/learn", "/blog",
    "/compare", "/collections",
  ];

  const allPaths = [
    ...new Set([
      ...landingPaths,
      ...getAllLandingSlugs().map((s) => `/${s}`),
      ...getAllTagSlugs().map((s) => `/tag/${s}`),
    ]),
  ];

  const priorityMap: Record<string, number> = {
    "/": 1, "/tools": 0.9, "/categories": 0.8,
  };

  const urls = allPaths.map(
    (p) => `  <url><loc>${baseUrl}${p}</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>${priorityMap[p] ?? 0.5}</priority></url>`
  ).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
