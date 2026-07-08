import { NextResponse } from "next/server";
import dns from "dns/promises";
import { validateIp, getContinent, getCurrency, getCallingCode, formatLocalTime } from "@/lib/ip-lookup-utils";
import type { IpLookupData } from "@/lib/ip-lookup-utils";

export const dynamic = "force-dynamic";

async function reverseDns(ip: string): Promise<string> {
  try {
    const hostnames = await dns.reverse(ip);
    return hostnames[0] || "—";
  } catch {
    return "—";
  }
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

    const validation = validateIp(ip);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 },
      );
    }

    const [geoRes, hostname] = await Promise.all([
      fetch(`http://ip-api.com/json/${ip}`, { next: { revalidate: 3600 } }),
      reverseDns(ip),
    ]);

    const geoData = await geoRes.json();

    if (geoData.status !== "success") {
      return NextResponse.json(
        { error: geoData.message || "Could not look up this IP address" },
        { status: 404 },
      );
    }

    const countryCode = geoData.countryCode || "";
    const result: IpLookupData = {
      ip: geoData.query,
      version: validation.version!,
      hostname,
      country: geoData.country || "—",
      countryCode,
      region: geoData.regionName || "—",
      city: geoData.city || "—",
      postalCode: geoData.zip || "—",
      continent: getContinent(countryCode),
      lat: geoData.lat || 0,
      lon: geoData.lon || 0,
      timezone: geoData.timezone || "—",
      localTime: geoData.timezone ? formatLocalTime(geoData.timezone) : "—",
      isp: geoData.isp || "—",
      org: geoData.org || "—",
      asn: geoData.as || "—",
      currency: getCurrency(countryCode),
      callingCode: getCallingCode(countryCode),
    };

    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json(
      { error: "Failed to look up IP address. Please try again." },
      { status: 500 },
    );
  }
}
