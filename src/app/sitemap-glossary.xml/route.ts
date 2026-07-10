import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/constants";
import { getGlossarySlugs } from "@/lib/content/programmatic-slugs";

export async function GET() {
  const baseUrl = SITE_URL;
  const now = new Date().toISOString();
  const slugs = getGlossarySlugs();

  const urls = slugs.map(
    (s) => `  <url><loc>${baseUrl}/glossary/${s.term}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`
  ).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
