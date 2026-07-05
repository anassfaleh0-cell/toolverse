import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface DnsServer {
  name: string;
  url: string;
}

const DNS_SERVERS: DnsServer[] = [
  { name: "Google", url: "https://dns.google/resolve" },
  { name: "Cloudflare", url: "https://cloudflare-dns.com/dns-query" },
  { name: "Quad9", url: "https://dns.quad9.net:1053/dns-query" },
  { name: "OpenDNS", url: "https://doh.opendns.com/dns-query" },
  { name: "Mullvad", url: "https://doh.mullvad.net/dns-query" },
];

const RECORD_TYPES = ["A", "AAAA", "MX", "NS", "TXT", "CNAME"] as const;

async function queryDohServer(server: DnsServer, hostname: string, type: string): Promise<string[] | null> {
  try {
    const url = `${server.url}?name=${encodeURIComponent(hostname)}&type=${type}`;
    const res = await fetch(url, {
      headers: { accept: "application/dns-json" },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const data = await res.json();

    if (data.Status !== 0 || !data.Answer) return null;

    return data.Answer.map((ans: { data: string }) => ans.data);
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hostname = searchParams.get("hostname")?.trim().toLowerCase();
    const recordType = searchParams.get("type")?.trim().toUpperCase() || "A";

    if (!hostname) {
      return NextResponse.json({ error: "Hostname is required" }, { status: 400 });
    }

    const hostnameRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/;
    if (!hostnameRegex.test(hostname)) {
      return NextResponse.json({ error: "Enter a valid hostname" }, { status: 400 });
    }

    if (!RECORD_TYPES.includes(recordType as typeof RECORD_TYPES[number])) {
      return NextResponse.json({ error: `Unsupported record type: ${recordType}` }, { status: 400 });
    }

    const results = await Promise.all(
      DNS_SERVERS.map(async (server) => {
        const values = await queryDohServer(server, hostname, recordType);
        return { server: server.name, values };
      }),
    );

    const uniqueValues = [...new Set(results.filter((r) => r.values).flatMap((r) => r.values!))];

    return NextResponse.json({ hostname, type: recordType, servers: results, uniqueValues }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Failed to check DNS propagation" }, { status: 500 });
  }
}
