import { NextResponse } from "next/server";
import dns from "dns/promises";

export const dynamic = "force-dynamic";

const RECORD_TYPES = ["A", "AAAA", "CNAME", "MX", "NS", "TXT", "SOA", "SRV", "CAA"] as const;
type RecordType = (typeof RECORD_TYPES)[number];

async function resolveRecord(hostname: string, type: RecordType) {
  try {
    const result = await dns.resolve(hostname, type);
    return result;
  } catch (err: unknown) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENODATA" || code === "ENOTFOUND" || code === "ECONNREFUSED") return null;
    throw err;
  }
}

function formatResults(type: string, data: unknown): string[] {
  if (!data) return [];
  if (Array.isArray(data)) {
    return data.map((r) => {
      if (typeof r === "string") return r;
      if (typeof r === "object" && r !== null) return JSON.stringify(r);
      return String(r);
    });
  }
  return [JSON.stringify(data)];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hostname = searchParams.get("hostname")?.trim().toLowerCase();

    if (!hostname) {
      return NextResponse.json(
        { error: "Hostname is required" },
        { status: 400 },
      );
    }

    const hostnameRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/;
    if (!hostnameRegex.test(hostname)) {
      return NextResponse.json(
        { error: "Enter a valid hostname (e.g., example.com)" },
        { status: 400 },
      );
    }

    const results: { type: string; values: string[] }[] = [];

    for (const type of RECORD_TYPES) {
      const data = await resolveRecord(hostname, type);
      const values = formatResults(type, data);
      if (values.length > 0) {
        results.push({ type, values });
      }
    }

    return NextResponse.json({ hostname, records: results }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json(
      { error: "Failed to perform DNS lookup. Please try again." },
      { status: 500 },
    );
  }
}
