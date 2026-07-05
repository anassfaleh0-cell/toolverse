import { NextResponse } from "next/server";
import dns from "dns/promises";

export const dynamic = "force-dynamic";

function isValidIp(ip: string): boolean {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{0,4}:){1,7}[0-9a-fA-F]{0,4}$/;
  if (ipv4Regex.test(ip)) {
    return ip.split(".").every((octet) => {
      const num = parseInt(octet, 10);
      return num >= 0 && num <= 255;
    });
  }
  return ipv6Regex.test(ip);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ip = searchParams.get("ip")?.trim();

    if (!ip) {
      return NextResponse.json(
        { error: "IP address is required" },
        { status: 400 },
      );
    }

    if (!isValidIp(ip)) {
      return NextResponse.json(
        { error: "Enter a valid IPv4 or IPv6 address" },
        { status: 400 },
      );
    }

    const hostnames = await dns.reverse(ip);
    return NextResponse.json({ ip, hostnames: hostnames.length > 0 ? hostnames : [] }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json(
      { error: "No reverse DNS record found for this IP address" },
      { status: 404 },
    );
  }
}
