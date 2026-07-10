import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const input = searchParams.get("q") || "";
    const mode = searchParams.get("mode") || "encode";
    if (!input.trim()) return NextResponse.json({ error: "Input is required" }, { status: 400 });
    if (mode === "encode") {
      const encoded = Buffer.from(input, "utf-8").toString("base64");
      return NextResponse.json({ encoded, length: encoded.length });
    }
    const decoded = Buffer.from(input, "base64").toString("utf-8");
    return NextResponse.json({ decoded, length: decoded.length });
  } catch {
    return NextResponse.json({ error: "Invalid Base64 input" }, { status: 400 });
  }
}
