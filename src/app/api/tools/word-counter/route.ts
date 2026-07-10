import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get("q") || "";
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, "").length;
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim()).length;
    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim()).length;
    const readingTime = Math.ceil(words / 200);
    return NextResponse.json({ Words: words, Characters: chars, "Characters (no space)": charsNoSpace, Sentences: sentences, Paragraphs: paragraphs, "Reading Time": `${readingTime} min` });
  } catch {
    return NextResponse.json({ error: "Failed to count words" }, { status: 500 });
  }
}
