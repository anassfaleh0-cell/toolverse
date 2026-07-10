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

    const chain: { url: string; status: number; statusText: string }[] = [];
    let current = url;
    let redirectCount = 0;
    const maxRedirects = 10;

    while (redirectCount < maxRedirects) {
      const response = await fetch(current, { method: "HEAD", redirect: "manual", signal: AbortSignal.timeout(10000) });
      chain.push({ url: current, status: response.status, statusText: response.statusText });

      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get("location");
        if (!location) break;
        try { current = new URL(location, current).href; } catch { break; }
        redirectCount++;
      } else {
        break;
      }
    }

    const finalStatus = chain[chain.length - 1]?.status || 0;
    const isRedirectChain = chain.length > 1;
    const isSuccessful = finalStatus >= 200 && finalStatus < 300;

    return NextResponse.json({
      "URL": url,
      "Redirect Chain": chain.map((s, i) => `  ${i}: ${s.status} ${s.statusText} → ${s.url}`).join("\n"),
      "Total Redirects": `${chain.length - 1}`,
      "Final Status": `${finalStatus} ${chain[chain.length - 1]?.statusText || ""}`,
      "Final URL": chain[chain.length - 1]?.url || url,
      "Result": !isRedirectChain ? "No redirects — direct OK response." : isSuccessful ? "Redirects end at a working page." : "Redirect chain ends with an error status.",
    });
  } catch (err) {
    const msg = (err as Error).message.includes("timed out") ? "Request timed out." : "Failed to check redirects.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
