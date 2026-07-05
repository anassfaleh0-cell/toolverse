"use client";

import { useReducer, useEffect, useCallback, startTransition } from "react";
import { ToolResultCard, ToolSkeleton, ToolError, CopyButton } from "@/components/shared";
import { RefreshButton } from "./refresh-button";
import {
  getBrowserData,
  getDeviceEmoji,
  getOsEmoji,
  getBrowserEmoji,
  type IpGeoData,
  type BrowserData,
} from "@/lib/ip-utils";

interface IpDisplayProps {
  pageUrl: string;
}

interface IpApiResponse {
  geo: IpGeoData | null;
  ipv4: string | null;
  ipv6: string | null;
  error: string | null;
}

interface State {
  geo: IpGeoData | null;
  ipv4: string | null;
  ipv6: string | null;
  browser: BrowserData | null;
  loading: boolean;
  error: string | null;
}

type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; geo: IpGeoData | null; ipv4: string | null; ipv6: string | null }
  | { type: "FETCH_ERROR"; error: string }
  | { type: "SET_BROWSER"; browser: BrowserData };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, geo: action.geo, ipv4: action.ipv4, ipv6: action.ipv6, loading: false };
    case "FETCH_ERROR":
      return { ...state, error: action.error, loading: false };
    case "SET_BROWSER":
      return { ...state, browser: action.browser };
  }
}

const initialState: State = {
  geo: null,
  ipv4: null,
  ipv6: null,
  browser: null,
  loading: true,
  error: null,
};

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
    return <ToolError message={state.error} onRetry={fetchIpInfo} />;
  }

  if (state.loading) {
    return <ToolSkeleton count={12} columns={3} />;
  }

  const { geo, ipv4, ipv6, browser } = state;
  const displayIp = geo?.ip || ipv4 || ipv6 || "—";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
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
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {geo && (
          <>
            <ToolResultCard label="IP Address" value={geo.ip} icon="🌐" mono />
            <ToolResultCard label="Country" value={geo.country} icon="🗺️" />
            <ToolResultCard label="Region" value={geo.regionName} icon="📍" />
            <ToolResultCard label="City" value={geo.city} icon="🏙️" />
            <ToolResultCard label="ZIP Code" value={geo.zip || "—"} icon="📮" />
            <ToolResultCard label="ISP" value={geo.isp} icon="🔌" />
            <ToolResultCard label="ASN" value={geo.as} icon="🏷️" />
            <ToolResultCard label="Timezone" value={geo.timezone} icon="🕐" />
            <ToolResultCard label="Latitude" value={String(geo.lat)} icon="📐" />
            <ToolResultCard label="Longitude" value={String(geo.lon)} icon="📐" />
          </>
        )}
        {browser && (
          <>
            <ToolResultCard label="Browser" value={browser.browser} icon={getBrowserEmoji(browser.browser)} />
            <ToolResultCard label="Browser Version" value={browser.browserVersion || "—"} icon="🔢" />
            <ToolResultCard label="Operating System" value={browser.os} icon={getOsEmoji(browser.os)} />
            <ToolResultCard label="Device Type" value={browser.deviceType} icon={getDeviceEmoji(browser.deviceType)} />
            <ToolResultCard label="Screen Resolution" value={browser.screenResolution} icon="🖥️" />
            <ToolResultCard label="Language" value={browser.language} icon="🔤" />
            <ToolResultCard label="User Agent" value={browser.userAgent.slice(0, 80) + "..."} icon="🤖" />
          </>
        )}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "What Is My IP - ToolVerse",
            description:
              "Find your public IPv4 and IPv6 address with detailed geolocation and browser information.",
            url: pageUrl,
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
