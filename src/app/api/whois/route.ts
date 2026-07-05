import { NextResponse } from "next/server";
import { lookup } from "whois";
import type { WhoisOptions } from "whois";

export const dynamic = "force-dynamic";

function lookupWhois(domain: string): Promise<string> {
  return new Promise((resolve, reject) => {
    lookup(domain, { follow: 2, timeout: 30000 } as WhoisOptions, (err, data) => {
      if (err) reject(err);
      else if (typeof data === "string" && data.length >= 50) resolve(data);
      else reject(new Error("No WHOIS data found"));
    });
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain")?.trim().toLowerCase();

    if (!domain) {
      return NextResponse.json(
        { error: "Domain name is required" },
        { status: 400 },
      );
    }

    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/;
    if (!domainRegex.test(domain)) {
      return NextResponse.json(
        { error: "Enter a valid domain name (e.g., example.com)" },
        { status: 400 },
      );
    }

    const data = await lookupWhois(domain);
    return NextResponse.json({ domain, data }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch WHOIS data. Please try again." },
      { status: 500 },
    );
  }
}
