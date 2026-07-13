"use client";

import { useReducer, useEffect, useCallback, startTransition, useState } from "react";
import Link from "next/link";
import { ToolResultCard, ToolSkeleton, ToolError, CopyButton, ShareButton, DashboardSummary, StatusBadge, ScoreGauge, GradeBadge } from "@/components/shared";
import { Card, Button } from "@/components/ui";
import { RefreshButton } from "./refresh-button";
import { DnsLeakCheck } from "./dns-leak-check";
import {
  getBrowserData,
  getDeviceEmoji,
  getOsEmoji,
  getBrowserEmoji,
  type IpGeoData,
  type BrowserData,
  type PrivacyData,
} from "@/lib/ip-utils";

interface IpDisplayProps {
  pageUrl: string;
}

interface IpApiResponse {
  geo: IpGeoData | null;
  privacy: PrivacyData | null;
  ipv4: string | null;
  ipv6: string | null;
  error: string | null;
}

interface State {
  geo: IpGeoData | null;
  privacy: PrivacyData | null;
  ipv4: string | null;
  ipv6: string | null;
  browser: BrowserData | null;
  loading: boolean;
  error: string | null;
}

type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; geo: IpGeoData | null; privacy: PrivacyData | null; ipv4: string | null; ipv6: string | null }
  | { type: "FETCH_ERROR"; error: string }
  | { type: "SET_BROWSER"; browser: BrowserData };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, geo: action.geo, privacy: action.privacy, ipv4: action.ipv4, ipv6: action.ipv6, loading: false };
    case "FETCH_ERROR":
      return { ...state, error: action.error, loading: false };
    case "SET_BROWSER":
      return { ...state, browser: action.browser };
  }
}

const initialState: State = {
  geo: null,
  privacy: null,
  ipv4: null,
  ipv6: null,
  browser: null,
  loading: true,
  error: null,
};

function IpMap({ lat, lon }: { lat: number; lon: number }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.05}%2C${lat - 0.05}%2C${lon + 0.05}%2C${lat + 0.05}&layer=mapnik&marker=${lat}%2C${lon}`;

  return (
    <div className="relative aspect-[2/1] w-full overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="size-8 animate-pulse rounded-full bg-zinc-300 dark:bg-zinc-600" />
        </div>
      )}
      <iframe
        src={src}
        title="Map showing your location"
        className={`h-full w-full border-0 transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        allowFullScreen
        referrerPolicy="no-referrer"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}

function formatAllData(
  geo: IpGeoData | null,
  browser: BrowserData | null,
  ipv4: string | null,
  ipv6: string | null,
  displayIp: string,
): string {
  const lines: string[] = ["What Is My IP - Nuvora", ""];
  lines.push(`IP: ${displayIp}`);
  if (ipv6 && ipv6 !== displayIp) lines.push(`IPv6: ${ipv6}`);
  if (geo) {
    lines.push(`Country: ${geo.country}`);
    lines.push(`Region: ${geo.regionName}`);
    lines.push(`City: ${geo.city}`);
    lines.push(`ZIP Code: ${geo.zip || "—"}`);
    lines.push(`ISP: ${geo.isp}`);
    lines.push(`ASN: ${geo.as}`);
    lines.push(`Timezone: ${geo.timezone}`);
    lines.push(`Latitude: ${geo.lat}`);
    lines.push(`Longitude: ${geo.lon}`);
  }
  if (browser) {
    lines.push("");
    lines.push(`Browser: ${browser.browser}`);
    lines.push(`Browser Version: ${browser.browserVersion || "—"}`);
    lines.push(`Operating System: ${browser.os}`);
    lines.push(`Device Type: ${browser.deviceType}`);
    lines.push(`Screen Resolution: ${browser.screenResolution}`);
    lines.push(`Language: ${browser.language}`);
    lines.push(`User Agent: ${browser.userAgent}`);
  }
  return lines.join("\n");
}

function downloadJson(data: {
  geo: IpGeoData | null;
  ipv4: string | null;
  ipv6: string | null;
  browser: BrowserData | null;
}): void {
  const payload = { ...data, timestamp: new Date().toISOString() };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ip-data.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function IpDisplay({ pageUrl }: IpDisplayProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchIpInfo = useCallback(() => {
    startTransition(() => {
      dispatch({ type: "FETCH_START" });
    });

    fetch("/api/ip-info")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json() as Promise<IpApiResponse>;
      })
      .then((data) => {
        startTransition(() => {
          if (data.error) {
            dispatch({ type: "FETCH_ERROR", error: data.error });
          } else {
            dispatch({
              type: "FETCH_SUCCESS",
              geo: data.geo,
              privacy: data.privacy,
              ipv4: data.ipv4,
              ipv6: data.ipv6,
            });
          }
          dispatch({ type: "SET_BROWSER", browser: getBrowserData() });
        });
      })
      .catch(() => {
        startTransition(() => {
          dispatch({
            type: "FETCH_ERROR",
            error: "Unable to retrieve IP information. Please try again.",
          });
        });
      });
  }, []);

  useEffect(() => {
    fetchIpInfo();
  }, [fetchIpInfo]);

  if (state.error) {
    return (
      <div className="space-y-4">
        <ToolError message={state.error} onRetry={fetchIpInfo} />
        <Card className="p-4 text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
          <p className="font-medium text-zinc-800 dark:text-zinc-200">Troubleshooting tips:</p>
          <ul className="list-inside list-disc space-y-1">
            <li>Check your internet connection</li>
            <li>Try refreshing the page</li>
            <li>Disable any VPN or proxy temporarily</li>
            <li>Allow requests to the IP info API</li>
          </ul>
        </Card>
      </div>
    );
  }

  if (state.loading) {
    return <ToolSkeleton count={12} columns={3} />;
  }

  const { geo, privacy, ipv4, ipv6, browser } = state;
  const displayIp = geo?.ip || ipv4 || ipv6 || "—";
  const allText = formatAllData(geo, browser, ipv4, ipv6, displayIp);

  return (
    <div className="space-y-6">
      {(() => {
        const exposureScore = geo ? 30 : 10;
        const privacyScore = 100 - exposureScore;
        return (
          <DashboardSummary
            title="Your Public IP"
            status={geo !== null ? "good" : "warning"}
            mainFinding={displayIp !== "—" ? `${ipv4 || displayIp}${ipv6 && ipv6 !== displayIp ? ` + IPv6: ${ipv6}` : ""}` : "Could not detect IP"}
            riskLevel={geo !== null ? "low" : "medium"}
            riskLabel={geo ? `${geo.country || "Unknown"}` : "Unavailable"}
            nextAction={geo ? "Your IP is visible to every website you visit. Use a VPN if you want to mask it." : "Refresh the page to try again. If the issue persists, check your internet connection."}
          >
            <ScoreGauge score={privacyScore} size={60} label={privacyScore >= 80 ? "Protected" : privacyScore >= 60 ? "Exposed" : "Visible"} />
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={ipv4 ? "good" : "neutral"} label={ipv4 ? "IPv4" : "No IPv4"} />
              <StatusBadge status={ipv6 ? "good" : "neutral"} label={ipv6 ? "IPv6" : "No IPv6"} />
              <StatusBadge status={geo?.isp ? "good" : "warning"} label={geo?.isp || "ISP Unknown"} />
            </div>
          </DashboardSummary>
        );
      })()}

      <Card variant="elevated" className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
            Your Public IP
          </p>
          <p className="mt-1 font-mono text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {displayIp}
          </p>
          {ipv6 && ipv6 !== displayIp && (
            <p className="mt-1 font-mono text-sm text-zinc-500 dark:text-zinc-400">
              IPv6: {ipv6}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <CopyButton text={displayIp} />
          <RefreshButton onRefresh={fetchIpInfo} loading={false} />
        </div>
      </Card>

      <div className="flex flex-wrap gap-2">
        <CopyButton text={allText} label="Copy All" />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => downloadJson({ geo, ipv4, ipv6, browser })}
          aria-label="Export IP data as JSON"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export JSON
        </Button>
        <ShareButton
          title="What Is My IP - Nuvora"
          text="Find your public IP address with detailed geolocation and browser information."
          url={pageUrl}
        />
      </div>

      {geo && (
        <IpMap lat={geo.lat} lon={geo.lon} />
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {geo && (
          <>
            <ToolResultCard label="IP Address" value={geo.ip} icon="Globe" mono />
            <ToolResultCard label="Country" value={geo.country} icon="MapPin" />
            <ToolResultCard label="Region" value={geo.regionName} icon="MapPin" />
            <ToolResultCard label="City" value={geo.city} icon="Building2" />
            <ToolResultCard label="ZIP Code" value={geo.zip || "—"} icon="MapPin" />
            <ToolResultCard label="ISP" value={geo.isp} icon="Building" />
            <ToolResultCard label="ASN" value={geo.as} icon="Tag" />
            <ToolResultCard label="Timezone" value={geo.timezone} icon="Clock" />
            <ToolResultCard label="Latitude" value={String(geo.lat)} icon="MapPin" />
            <ToolResultCard label="Longitude" value={String(geo.lon)} icon="MapPin" />
          </>
        )}
        {browser && (
          <>
            <ToolResultCard label="Browser" value={browser.browser} icon="Monitor" />
            <ToolResultCard label="Browser Version" value={browser.browserVersion || "—"} icon="Tag" />
            <ToolResultCard label="Operating System" value={browser.os} icon="Monitor" />
            <ToolResultCard label="Device Type" value={browser.deviceType} icon="Smartphone" />
            <ToolResultCard label="Screen Resolution" value={browser.screenResolution} icon="Monitor" />
            <ToolResultCard label="Language" value={browser.language} icon="Globe" />
            <ToolResultCard label="User Agent" value={browser.userAgent.slice(0, 80) + "..."} icon="Bot" />
          </>
        )}
      </div>

      {privacy && (
        <Card variant="elevated" className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                VPN & Proxy Detection
              </h3>
              <p className="mt-0.5 text-xs text-zinc-500">
                Privacy analysis via server-side proxy — powered by HackMyIP
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ScoreGauge score={privacy.score} size={56} label={privacy.grade ? `Grade ${privacy.grade}` : "Score"} />
              <GradeBadge grade={privacy.grade} size={48} />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <StatusBadge
              status={privacy.isVpn ? "critical" : "good"}
              label={privacy.isVpn ? "VPN Detected" : "No VPN"}
            />
            <StatusBadge
              status={privacy.isDatacenter ? "warning" : "good"}
              label={privacy.isDatacenter ? "Datacenter IP" : "Residential IP"}
            />
            {privacy.proxy !== null && (
              <StatusBadge
                status={privacy.proxy ? "critical" : "good"}
                label={privacy.proxy ? "Proxy Detected" : "No Proxy"}
              />
            )}
            <StatusBadge
              status={privacy.type === "residential" ? "good" : privacy.type === "vpn" ? "critical" : "warning"}
              label={`Type: ${privacy.type.charAt(0).toUpperCase() + privacy.type.slice(1)}`}
            />
          </div>
          <p className="mt-3 text-xs text-zinc-500">
            Connection classification: <span className="font-medium text-zinc-700 dark:text-zinc-300">{privacy.type}</span>
            {" · "}Fraud risk score: <span className="font-medium text-zinc-700 dark:text-zinc-300">{privacy.score}/100</span>
            {" · "}Grade: <span className="font-medium text-zinc-700 dark:text-zinc-300">{privacy.grade}</span>
          </p>
        </Card>
      )}

      <Card variant="elevated" className="p-5">
        <DnsLeakCheck publicIp={displayIp} />
      </Card>

      <div className="space-y-4">
        <div className="rounded-xl border border-zinc-200 p-5 text-sm dark:border-zinc-800">
          <h3 className="mb-2 font-medium text-zinc-900 dark:text-zinc-50">Understanding Your Results</h3>
          <div className="space-y-3 text-zinc-600 dark:text-zinc-400">
            <div>
              <p className="font-medium text-zinc-800 dark:text-zinc-200">Public vs Private IP</p>
              <p className="mt-0.5">Your public IP ({displayIp}) is globally routable and visible to every server you connect to. Your private IP (e.g., 192.168.x.x, 10.x.x.x) only exists on your local network and is never sent to the internet. Your router translates between them using NAT.</p>
            </div>
            {ipv4 && ipv6 && (
              <div>
                <p className="font-medium text-zinc-800 dark:text-zinc-200">Dual-Stack: IPv4 + IPv6 Active</p>
                <p className="mt-0.5">Your connection supports both protocols. IPv6 traffic is preferred by modern browsers, so your IPv6 address is what most sites see. Verify your VPN masks both addresses, as many VPNs only tunnel IPv4.</p>
              </div>
            )}
            <div>
              <p className="font-medium text-zinc-800 dark:text-zinc-200">ISP & Location Accuracy</p>
              <p className="mt-0.5">Your ISP ({geo?.isp || "Unknown"}) owns the IP block. The city and region shown are based on ISP registration data, not your physical location. Geolocation is usually accurate to the city level but cannot pinpoint your address. Mobile IPs are even less precise due to carrier-grade NAT.</p>
            </div>
            <div>
              <p className="font-medium text-zinc-800 dark:text-zinc-200">VPN & Proxy Detection Limits</p>
              <p className="mt-0.5">VPN/proxy detection and fraud risk scoring use a server-side proxy (HackMyIP) so your IP is shared with our server during the check. The DNS leak test runs entirely in your browser and does not send data to our server. If a VPN is active, you will see the VPN server&apos;s IP. WebRTC, IPv6, and DNS leaks can bypass the VPN and reveal your actual IP.</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-200 p-5 text-sm dark:border-emerald-900">
          <h3 className="mb-2 font-medium text-emerald-800 dark:text-emerald-200">Privacy Guidance</h3>
          <ul className="space-y-1.5 text-emerald-700 dark:text-emerald-300">
            <li>&#8226; Use a reputable VPN that supports IPv6 leak protection and includes a kill switch.</li>
            <li>&#8226; Disable WebRTC in browser settings or use an extension that blocks WebRTC leaks.</li>
            <li>&#8226; Use encrypted DNS (DoH/DoT) to prevent your ISP from logging DNS queries.</li>
            <li>&#8226; Clear browser fingerprints by using private/incognito mode or privacy-focused browsers.</li>
            <li>&#8226; Check your IP before and after enabling your VPN to confirm the tunnel works on both stacks.</li>
          </ul>
        </div>

        <div className="rounded-xl border border-blue-200 p-5 text-sm dark:border-blue-900">
          <h3 className="mb-2 font-medium text-blue-800 dark:text-blue-200">Security Recommendations</h3>
          <ul className="space-y-1.5 text-blue-700 dark:text-blue-300">
            <li>&#8226; Run <Link href="/port-checker" className="underline">Port Checker</Link> to verify no unexpected services are exposed on your connection.</li>
            <li>&#8226; Monitor your IP reputation — a blacklisted IP can block access to services you use.</li>
            <li>&#8226; Use <Link href="/ip-lookup" className="underline">IP Lookup</Link> to trace any suspicious IP that appears in your server logs.</li>
            <li>&#8226; Check <Link href="/dns-lookup" className="underline">DNS Lookup</Link> to verify your domain&apos;s DNS records haven&apos;t been tampered with.</li>
            <li>&#8226; Run a <Link href="/ping-test" className="underline">Ping Test</Link> to measure latency and detect packet loss that may indicate throttling.</li>
          </ul>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "What Is My IP - Nuvora",
            description:
              "Find your public IPv4 and IPv6 address with detailed geolocation and browser information.",
            url: pageUrl,
            sameAs: ["https://en.wikipedia.org/wiki/IP_address"],
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: "https://www.google.com/search?q=what+is+my+ip",
              },
              "query-input": "required name=search_term",
            },
            mainEntity: {
              "@type": "SoftwareApplication",
              name: "What Is My IP",
              applicationCategory: "UtilityApplication",
              operatingSystem: "All",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            },
          }),
        }}
      />
    </div>
  );
}
