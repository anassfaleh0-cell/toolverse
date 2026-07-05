import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";
import { getAllContent } from "@/lib/content/registry";

export const dynamic = "force-static";

export async function GET() {
  const content = getAllContent();
  const now = new Date();

  const items = content
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 50)
    .map(
      (piece) => `
    <item>
      <title><![CDATA[${piece.title}]]></title>
      <link>${SITE_URL}/${piece.type}/${piece.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/${piece.type}/${piece.slug}</guid>
      <description><![CDATA[${piece.description}]]></description>
      <pubDate>${new Date(piece.publishedAt).toUTCString()}</pubDate>
      <category>${piece.category || "general"}</category>
    </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>en-us</language>
    <lastBuildDate>${now.toUTCString()}</lastBuildDate>
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
