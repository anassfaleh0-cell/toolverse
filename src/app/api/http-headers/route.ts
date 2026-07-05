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

    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    const allowedProtocols = ["http:", "https:"];
    if (!allowedProtocols.includes(parsed.protocol)) {
      return NextResponse.json({ error: "Only HTTP and HTTPS URLs are allowed" }, { status: 400 });
    }

    const startTime = performance.now();
    const response = await fetch(url, {
      method: "GET",
      redirect: "manual",
      signal: AbortSignal.timeout(10000),
      headers: {
        "User-Agent": "ToolVerse-HTTP-Headers-Checker/1.0",
      },
    });
    const endTime = performance.now();

    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const redirectChain: { url: string; status: number; headers: Record<string, string> }[] = [];
    let finalStatus = response.status;
    let finalUrl = url;

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (location) {
        redirectChain.push({
          url,
          status: response.status,
          headers,
        });
        try {
          const redirectTarget = new URL(location, url).href;
          const followRes = await fetch(redirectTarget, {
            method: "GET",
            redirect: "follow",
            signal: AbortSignal.timeout(10000),
          });
          finalStatus = followRes.status;
          finalUrl = redirectTarget;
          const followHeaders: Record<string, string> = {};
          followRes.headers.forEach((value, key) => {
            followHeaders[key] = value;
          });
          redirectChain.push({
            url: redirectTarget,
            status: followRes.status,
            headers: followHeaders,
          });
        } catch {
          // follow failed, use original
        }
      }
    }

    return NextResponse.json({
      url,
      finalUrl,
      statusCode: finalStatus,
      statusText: response.statusText,
      responseTime: Math.round(endTime - startTime),
      headers,
      redirectChain,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch headers";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
