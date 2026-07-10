import { NextResponse } from "next/server";
import type { IpGeoData, PrivacyData } from "@/lib/ip-utils";

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
    let privacy: PrivacyData | null = null;

    if (clientIp) {
      try {
        const encodedIp = clientIp.includes(":") ? `[${clientIp}]` : clientIp;
        const [geoRes, hackmyipRes] = await Promise.allSettled([
          fetch(`http://ip-api.com/json/${encodedIp}`, {
            signal: AbortSignal.timeout(5000),
            next: { revalidate: 3600 },
          }),
          fetch(`https://hackmyip.com/api/v1/ip/${encodedIp}`, {
            signal: AbortSignal.timeout(5000),
            headers: { Accept: "application/json" },
          }),
        ]);

        if (geoRes.status === "fulfilled") {
          const geoData = await geoRes.value.json();
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
        }

        if (hackmyipRes.status === "fulfilled") {
          const hData = await hackmyipRes.value.json();
          if (hData.success && hData.data?.privacy) {
            const p = hData.data.privacy;
            privacy = {
              type: p.type || "unknown",
              score: typeof p.score === "number" ? p.score : 50,
              grade: p.grade || "C",
              isVpn: !!p.is_vpn,
              isDatacenter: !!p.is_datacenter,
              isResidential: !!p.is_residential,
              proxy: p.proxy ?? null,
              hosting: p.hosting ?? null,
              mobile: p.mobile ?? null,
            };
          }
        }
      } catch {
        // sub-fetches failed silently — return what we have
      }
    }

    return NextResponse.json(
      { geo, privacy, ipv4, ipv6, error: null },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { geo: null, privacy: null, ipv4: null, ipv6: null, error: "Failed to fetch IP information" },
      { status: 500 },
    );
  }
}
