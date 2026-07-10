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

    const start = Date.now();
    const response = await fetch(url, { method: "GET", signal: AbortSignal.timeout(10000) });
    const elapsed = Date.now() - start;

    const statusOk = response.status >= 200 && response.status < 400;
    const statusLabel =
      response.status >= 200 && response.status < 300 ? "OK" :
      response.status >= 300 && response.status < 400 ? "Redirect" :
      response.status >= 400 && response.status < 500 ? "Client Error" :
      "Server Error";

    return NextResponse.json({
      "URL": url,
      "Status Code": `${response.status} ${response.statusText}`,
      "Status Category": statusLabel,
      "Response Time": `${elapsed}ms`,
      "Status": statusOk ? "Website is up and reachable." : "Website returned an error status.",
    });
  } catch (err) {
    const msg = (err as Error).message.includes("timed out") ? "Request timed out. The website may be down or unreachable." : "Failed to check website status.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
