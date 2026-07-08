import { NextResponse } from "next/server";
import type { IpGeoData } from "@/lib/ip-utils";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const clientIp = forwarded?.split(",")[0]?.trim() || realIp || "";

  try {
    let ipv4: string | null = null;
    let ipv6: string | null = null;

    if (clientIp.includes(":")) {
      ipv6 = clientIp;
    } else if (clientIp) {
      ipv4 = clientIp;
    }

    let geo: IpGeoData | null = null;

    if (clientIp) {
      try {
        const encodedIp = clientIp.includes(":") ? `[${clientIp}]` : clientIp;
        const geoRes = await fetch(`http://ip-api.com/json/${encodedIp}`, {
          signal: AbortSignal.timeout(5000),
          next: { revalidate: 3600 },
        });
        const geoData = await geoRes.json();

        if (geoData.status === "success") {
          geo = {
            ip: geoData.query,
            country: geoData.country,
            countryCode: geoData.countryCode,
            region: geoData.region,
            regionName: geoData.regionName,
            city: geoData.city,
            zip: geoData.zip,
            lat: geoData.lat,
            lon: geoData.lon,
            timezone: geoData.timezone,
            isp: geoData.isp,
            org: geoData.org,
            as: geoData.as,
          };
        }
      } catch {
        // geolocation fetch failed silently — return what we have
      }
    }

    return NextResponse.json({ geo, ipv4, ipv6, error: null }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json(
      { geo: null, ipv4: null, ipv6: null, error: "Failed to fetch IP information" },
      { status: 500 },
    );
  }
}
