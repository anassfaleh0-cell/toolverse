import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/constants";
import { getAllTools } from "@/lib/registry";
import { getToolConfig } from "@/lib/tools-config";

export async function GET() {
  const baseUrl = SITE_URL;
  const tools = getAllTools().filter((t) => {
    if (!t.url.startsWith("/")) return false;
    const config = getToolConfig(t.slug);
    return !config.isComingSoon;
  });
  const now = new Date().toISOString();

  const urls = tools.map(
    (t) => `  <url><loc>${baseUrl}${t.url}</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>`
  ).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
