import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const RATE_LIMIT_REQUESTS = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;
const CACHE_TTL_MS = 3_600_000;

const rateLimitMap = new Map<string, number[]>();
const cacheMap = new Map<string, { data: unknown; timestamp: number }>();

function getClientIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_REQUESTS) return false;
  recent.push(now);
  rateLimitMap.set(ip, recent);
  return true;
}

const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment before trying again." }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const domain = searchParams.get("domain")?.trim().toLowerCase();

  if (!domain) {
    return NextResponse.json({ error: "Domain parameter is required" }, { status: 400 });
  }

  if (!domainRegex.test(domain)) {
    return NextResponse.json({ error: "Please enter a valid domain name (e.g., example.com)" }, { status: 400 });
  }

  const cached = cacheMap.get(domain);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cached.data);
  }

  const apiKey = process.env.OPENPAGERANK_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OpenPageRank API key not configured. Set OPENPAGERANK_API_KEY in environment variables." }, { status: 503 });
  }

  try {
    const apiUrl = `https://openpagerank.com/api/v1.0/getPageRank?domains[]=${encodeURIComponent(domain)}`;
    const response = await fetch(apiUrl, {
      headers: { "API-OPR": apiKey },
      signal: AbortSignal.timeout(10000),
    });

    if (response.status === 429) {
      return NextResponse.json({ error: "Daily limit reached. Please try again later." }, { status: 429 });
    }

    if (response.status === 403) {
      return NextResponse.json({ error: "API key invalid or quota exceeded." }, { status: 403 });
    }

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch domain strength data. Please try again." }, { status: 502 });
    }

    const data = await response.json();
    const result = data.response?.[0];

    if (!result || result.status_code === 404 || (result.error && result.error !== "")) {
      const output = { domain, score: 0, note: "Domain not found in index" };
      cacheMap.set(domain, { data: output, timestamp: Date.now() });
      return NextResponse.json(output);
    }

    const output = {
      domain: result.domain,
      score: result.page_rank_decimal,
      scoreInteger: result.page_rank_integer,
      rank: result.rank ? parseInt(result.rank, 10) : null,
      source: "OpenPageRank (CommonCrawl open dataset)",
      updated: "28th Mar 2026",
    };

    cacheMap.set(domain, { data: output, timestamp: Date.now() });
    return NextResponse.json(output);
  } catch {
    return NextResponse.json({ error: "Failed to fetch domain strength data. Please try again." }, { status: 502 });
  }
}
