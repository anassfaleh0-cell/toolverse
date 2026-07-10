import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("q")?.trim();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    try { new URL(url); } catch {
      return NextResponse.json({ error: "Enter a valid URL (include https://)" }, { status: 400 });
    }

    const response = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(10000) });
    const headers = Object.fromEntries(response.headers.entries());
    const securityHeaders: Record<string, string> = {
      "strict-transport-security": headers["strict-transport-security"] || "Missing",
      "content-security-policy": headers["content-security-policy"] || "Missing",
      "x-frame-options": headers["x-frame-options"] || "Missing",
      "x-content-type-options": headers["x-content-type-options"] || "Missing",
      "referrer-policy": headers["referrer-policy"] || "Missing",
      "permissions-policy": headers["permissions-policy"] || "Missing",
    };

    return NextResponse.json({
      URL: url,
      "Status Code": response.status,
      "Status Text": response.statusText,
      "Response Time": "N/A",
      Headers: Object.entries(headers).map(([k, v]) => `${k}: ${v}`).join("\n"),
      "Security Headers": Object.entries(securityHeaders).map(([k, v]) => `${k}: ${v}`).join("\n"),
      "Security Score": `${Object.values(securityHeaders).filter(v => v !== "Missing").length}/6 present`,
    });
  } catch (err) {
    const msg = (err as Error).message.includes("timed out") ? "Request timed out. The server may be unreachable." : "Failed to fetch headers.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
