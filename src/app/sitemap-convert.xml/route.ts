import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/constants";
import { getConverterSlugs } from "@/lib/content/programmatic-slugs";

export async function GET() {
  const baseUrl = SITE_URL;
  const now = new Date().toISOString();
  const slugs = getConverterSlugs();

  const urls = slugs.map(
    (s) => `  <url><loc>${baseUrl}/convert/${s.slug}</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`
  ).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
