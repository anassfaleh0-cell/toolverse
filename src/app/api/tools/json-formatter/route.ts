import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const input = searchParams.get("q") || "";
    if (!input.trim()) return NextResponse.json({ error: "JSON input is required" }, { status: 400 });
    const parsed = JSON.parse(input);
    return NextResponse.json({ formatted: JSON.stringify(parsed, null, 2), valid: true, size: `${input.length} → ${JSON.stringify(parsed, null, 2).length} chars` });
  } catch (e) {
    return NextResponse.json({ error: `Invalid JSON: ${(e as Error).message}` }, { status: 400 });
  }
}
