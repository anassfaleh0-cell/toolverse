import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/constants";

export async function GET() {
  const baseUrl = SITE_URL;
  const now = new Date().toISOString();

  const staticPaths = [
    "/feed.xml", "/sitemap", "/editorial-guidelines",
    "/how-we-test-tools", "/about-our-research", "/transparency",
    "/tag", "/bookmarks", "/search", "/compare-dns",
    "/workflow/website-health-check", "/about", "/changelog",
    "/whats-new", "/trending", "/editor-picks", "/roadmap",
    "/100m-roadmap", "/500-tool-roadmap", "/open-source",
    "/research", "/glossary", "/case-studies",
    "/community-templates", "/choose-the-right-tool",
    "/benchmarks/dns-performance", "/learning-paths/dns-fundamentals",
    "/how-it-works",
  ];

  const bestOfPaths = [
    "/best-online/best-free-online-tools", "/best-online/best-dns-tools",
    "/best-online/best-image-tools", "/best-online/best-seo-tools",
    "/best-online/best-json-tools", "/best-online/best-developer-tools",
    "/best-online/best-website-tools", "/best-online/best-security-tools",
    "/best-online/best-ai-tools", "/best-online/best-productivity-tools",
    "/best-online/best-marketing-tools", "/best-online/best-pdf-tools",
    "/decision-trees/dns-troubleshooting", "/decision-trees/ssl-troubleshooting",
    "/decision-trees/seo-diagnostics",
    "/compare/dns-providers", "/compare/ssl-certificate-types",
    "/tool-comparisons/network-diagnostics",
    "/technical-flow/dns-resolution", "/technical-flow/ssl-tls-handshake",
    "/protocols/http-versus-https", "/protocols/dns-protocols",
    "/troubleshooting/dns-propagation", "/troubleshooting/ssl-certificate",
    "/cheat-sheets/developer-dns", "/cheat-sheets/developer-ssl-tls",
  ];

  const allPaths = [
    ...new Set([
      ...staticPaths,
      ...bestOfPaths,
    ]),
  ];

  const priorityMap: Record<string, number> = {
    "/": 1, "/about": 0.7, "/contact": 0.6,
    "/privacy": 0.4, "/terms": 0.4,
    "/glossary": 0.8, "/case-studies": 0.7,
  };

  const urls = allPaths.map(
    (p) => `  <url><loc>${baseUrl}${p}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>${priorityMap[p] ?? 0.5}</priority></url>`
  ).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
