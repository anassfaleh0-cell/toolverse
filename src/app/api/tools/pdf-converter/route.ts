import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  return NextResponse.json({ error: "PDF converter is not yet available. Use the PDF editing tools (merge, split, compress) instead." }, { status: 503 });
}

export async function GET() {
  return NextResponse.json({ error: "PDF converter is not yet available." }, { status: 503 });
}
