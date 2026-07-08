import { getAllTools } from "@/lib/registry";
import { getAllContent } from "@/lib/content/registry";
import { TOOL_FAQS } from "@/lib/tool-faqs";
import { CATEGORIES } from "@/lib/categories";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface SearchResult {
  slug: string;
  name: string;
  url: string;
  category: string;
  type: string;
  match: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.toLowerCase().trim();

    if (!q || q.length < 2) {
      return NextResponse.json([], {
        headers: { "Cache-Control": "no-cache" },
      });
    }

    const results: SearchResult[] = [];

    for (const tool of getAllTools()) {
      if (tool.name.toLowerCase().includes(q) || tool.description.toLowerCase().includes(q)) {
        results.push({
          slug: tool.slug,
          name: tool.name,
          url: tool.url,
          category: tool.category,
          type: "tool",
          match: tool.name,
        });
      }
    }

    for (const piece of getAllContent()) {
      const typeRoute = piece.type === "article" ? "blog" : piece.type;
      if (piece.title.toLowerCase().includes(q) || piece.description.toLowerCase().includes(q)) {
        results.push({
          slug: piece.slug,
          name: piece.title,
          url: `/${typeRoute}/${piece.slug}`,
          category: piece.category,
          type: piece.type as SearchResult["type"],
          match: piece.title,
        });
      } else {
        const matchedSection = piece.sections.find((s) =>
          s.heading.toLowerCase().includes(q) || s.body.toLowerCase().includes(q),
        );
        if (matchedSection) {
          results.push({
            slug: piece.slug,
            name: piece.title,
            url: `/${typeRoute}/${piece.slug}`,
            category: piece.category,
          type: piece.type,
            match: matchedSection.heading,
          });
        }
      }
    }

    for (const [toolSlug, faqs] of Object.entries(TOOL_FAQS)) {
      for (const faq of faqs) {
        if (faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q)) {
          const url = `/${toolSlug}`;
          if (!results.some((r) => r.url === url && r.type === "faq")) {
            results.push({
              slug: toolSlug,
              name: faq.question,
              url,
              category: "network-internet",
              type: "faq",
              match: faq.question,
            });
          }
        }
      }
    }

    for (const cat of CATEGORIES) {
      if (cat.label.toLowerCase().includes(q) || cat.description.toLowerCase().includes(q)) {
        results.push({
          slug: cat.slug,
          name: cat.label,
          url: `/category/${cat.slug}`,
          category: cat.slug,
          type: "category",
          match: cat.label,
        });
      }
    }

    results.sort((a, b) => {
      const aExact = a.match.toLowerCase() === q ? 0 : 1;
      const bExact = b.match.toLowerCase() === q ? 0 : 1;
      if (aExact !== bExact) return aExact - bExact;
      return a.name.length - b.name.length;
    });

    return NextResponse.json(results.slice(0, 12), {
      headers: { "Cache-Control": "no-cache" },
    });
  } catch {
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 },
    );
  }
}
