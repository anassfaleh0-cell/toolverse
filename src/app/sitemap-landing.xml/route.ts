import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/constants";
import { getAllLandingSlugs } from "@/lib/seo/landing-pages";
import { getAllTagSlugs } from "@/lib/seo/tags";

export async function GET() {
  const baseUrl = SITE_URL;
  const now = new Date().toISOString();

  const landingPaths = [
    "/", "/tools", "/categories", "/resources", "/guides", "/learn", "/blog",
    "/compare", "/glossary", "/case-studies", "/community-templates", "/roadmap",
    "/changelog", "/whats-new", "/trending", "/editor-picks", "/research",
    "/open-source", "/choose-the-right-tool", "/bookmarks", "/collections",
    "/search", "/sitemap", "/100m-roadmap", "/500-tool-roadmap",
    "/benchmarks/dns-performance", "/learning-paths/dns-fundamentals",
    "/decision-trees/dns-troubleshooting", "/decision-trees/ssl-troubleshooting",
    "/decision-trees/seo-diagnostics", "/compare/dns-providers",
    "/compare/ssl-certificate-types", "/tool-comparisons/network-diagnostics",
    "/technical-flow/dns-resolution", "/technical-flow/ssl-tls-handshake",
    "/troubleshooting/dns-propagation", "/troubleshooting/ssl-certificate",
    "/cheat-sheets/developer-dns", "/cheat-sheets/developer-ssl-tls",
    "/protocols/http-versus-https", "/protocols/dns-protocols",
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
    "/glossary": 0.8, "/case-studies": 0.7,
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
