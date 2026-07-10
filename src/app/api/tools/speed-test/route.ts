import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PAYLOAD_SIZES: Record<string, number> = {
  small: 1024 * 100,        // 100 KB
  medium: 1024 * 1024,      // 1 MB
  large: 1024 * 1024 * 5,   // 5 MB
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") || "ping";
    const size = searchParams.get("size") || "small";
    const payloadSize = PAYLOAD_SIZES[size] || PAYLOAD_SIZES.small;

    if (action === "ping") {
      return NextResponse.json({
        status: "ok",
        timestamp: Date.now(),
        server: process.env.NEXT_PUBLIC_SITE_NAME || "Nuvora",
      }, { headers: { "Cache-Control": "no-store" } });
    }

    if (action === "download") {
      const buffer = new Uint8Array(payloadSize);
      for (let i = 0; i < buffer.length; i += 65536) {
        const chunk = Math.min(65536, buffer.length - i);
        crypto.getRandomValues(buffer.subarray(i, i + chunk));
      }

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": "application/octet-stream",
          "Content-Length": payloadSize.toString(),
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "X-Payload-Size": payloadSize.toString(),
        },
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Speed test failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
