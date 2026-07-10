import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let url = searchParams.get("url")?.trim();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`;
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    const startTime = performance.now();
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
      headers: { "User-Agent": "Nuvora-Status-Checker/1.0" },
    });
    const endTime = performance.now();

    const contentType = response.headers.get("content-type") || "";
    const contentLength = response.headers.get("content-length");
    const server = response.headers.get("server") || "";

    const status = response.status;
    let statusLabel = "Online";
    if (status >= 400) statusLabel = "Error";
    if (status >= 300 && status < 400) statusLabel = "Redirect";

    return NextResponse.json({
      url,
      statusCode: status,
      statusLabel,
      responseTime: Math.round(endTime - startTime),
      contentType,
      contentLength: contentLength ? parseInt(contentLength, 10) : null,
      server,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({
      url: "",
      statusCode: 0,
      statusLabel: "Offline",
      responseTime: 0,
      contentType: "",
      contentLength: null,
      server: "",
      error: message,
    }, { status: 500 });
  }
}
