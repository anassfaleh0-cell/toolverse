import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";
import { getAllTools } from "@/lib/registry";

export const dynamic = "force-static";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const tools = getAllTools();
  const now = new Date().toUTCString();

  const items = tools
    .map(
      (tool) => `
    <item>
      <title>${escapeXml(tool.name)}</title>
      <description>${escapeXml(tool.description)}</description>
      <link>${SITE_URL}${tool.url}</link>
      <guid>${SITE_URL}${tool.url}</guid>
      <category>${escapeXml(tool.category)}</category>
    </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <link>${SITE_URL}</link>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
