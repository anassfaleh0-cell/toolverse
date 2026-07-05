import { getAllTools } from "@/lib/registry";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase().trim();

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  const results = getAllTools()
    .filter(
      (tool) =>
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q),
    )
    .slice(0, 8)
    .map((tool) => ({
      slug: tool.slug,
      name: tool.name,
      url: tool.url,
      category: tool.category,
    }));

  return NextResponse.json(results);
}
