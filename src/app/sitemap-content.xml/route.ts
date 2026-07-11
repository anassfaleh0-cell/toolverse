import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/constants";
import { getAllContent } from "@/lib/content/registry";

export async function GET() {
  const baseUrl = SITE_URL;
  const now = new Date().toISOString();
  const allContent = getAllContent();

  const TYPE_ROUTE: Record<string, string> = {
    guide: "guides", article: "blog", comparison: "compare",
    learn: "learn", tutorial: "learn", examples: "examples",
    errors: "errors", reference: "reference", "cheat-sheet": "cheat-sheets",
    "best-practices": "best-practices", commands: "commands", "use-cases": "use-cases",
  };

  const urls = allContent.filter((c) => !c.noindex).map((c) => {
    const route = TYPE_ROUTE[c.type] ?? c.type;
    const isPillar = c.slug.startsWith("ultimate-guide") || c.title.startsWith("Ultimate Guide");
    const priority = route === "blog" ? (isPillar ? "0.8" : "0.7") : "0.6";
    const changefreq = route === "blog" ? "monthly" : "weekly";
    const lastmod = c.publishedAt ? c.publishedAt + "T00:00:00Z" : now;
    return `  <url><loc>${baseUrl}/${route}/${c.slug}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
