import { NextRequest, NextResponse } from "next/server";
import { SITE_URL } from "@/lib/constants";

const INDEXNOW_KEY = "a4b8K2pX9mL7qR3wV5nY1tC6sD8fG0hJ2kL4mN6pQ8rS";
const BING_INDEXNOW_URL = "https://api.indexnow.org/indexnow";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (key === INDEXNOW_KEY) {
    return new NextResponse(INDEXNOW_KEY);
  }

  const url = searchParams.get("url");
  if (url) {
    const urls = [url];
    return handleSubmission(urls);
  }

  return NextResponse.json({ status: "ok", key: INDEXNOW_KEY });
}

async function handleSubmission(urls: string[]) {
  if (urls.length === 0) {
    return NextResponse.json({ error: "No URLs provided" }, { status: 400 });
  }

  if (urls.length > 100) {
    return NextResponse.json({ error: "Maximum 100 URLs per request" }, { status: 400 });
  }

  const payload = {
    host: new URL(SITE_URL).host,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/indexnow-key.txt`,
    urlList: urls,
  };

  try {
    const response = await fetch(BING_INDEXNOW_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return NextResponse.json({ submitted: urls.length, status: "accepted" });
    }

    return NextResponse.json({
      submitted: urls.length,
      status: response.status,
      message: await response.text().catch(() => "Unknown error"),
    }, { status: response.status });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to submit to IndexNow",
      details: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const urls: string[] = body.urls ?? (body.url ? [body.url] : []);

    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: "Provide 'urls' array or 'url' string" }, { status: 400 });
    }

    return handleSubmission(urls);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
}
