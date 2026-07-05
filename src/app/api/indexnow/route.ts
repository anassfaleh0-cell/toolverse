import { NextRequest, NextResponse } from "next/server";
import { SITE_URL } from "@/lib/constants";

const INDEXNOW_URL = "https://api.indexnow.org/indexnow";

export async function POST(request: NextRequest) {
  try {
    const body: { urlList?: string[] } = await request.json();
    const urlList = body.urlList;

    if (!urlList || !Array.isArray(urlList) || urlList.length === 0) {
      return NextResponse.json(
        { error: "urlList must be a non-empty array of URLs" },
        { status: 400 },
      );
    }

    const payload = {
      host: new URL(SITE_URL).hostname,
      key: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
      keyLocation: `${SITE_URL}/indexnow-key.txt`,
      urlList: urlList.map((url) =>
        url.startsWith("http") ? url : `${SITE_URL}${url.startsWith("/") ? url : `/${url}`}`,
      ),
    };

    const response = await fetch(INDEXNOW_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { error: `IndexNow API error: ${response.status}`, details: text },
        { status: response.status },
      );
    }

    return NextResponse.json({ submitted: true, count: urlList.length });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}
