"use client";

import { useCallback } from "react";
import {
  ToolResultCard,
  CopyButton,
  ShareButton,
  ToolSkeleton,
  ToolError,
} from "@/components/shared";
import { IpLookupMap } from "./ip-lookup-map";
import type { IpLookupData } from "@/lib/ip-lookup-utils";
import { getFlagEmoji } from "@/lib/ip-lookup-utils";

interface IpLookupResultsProps {
  data: IpLookupData | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  pageUrl: string;
}

export function IpLookupResults({
  data,
  loading,
  error,
  onRetry,
  pageUrl,
}: IpLookupResultsProps) {
  const handleCopyAll = useCallback(() => {
    if (!data) return;
    const lines = [
      `IP Address: ${data.ip}`,
      `IP Version: IPv${data.version}`,
      `Hostname: ${data.hostname}`,
      `Country: ${data.country}`,
      `Country Code: ${data.countryCode}`,
      `Region: ${data.region}`,
      `City: ${data.city}`,
      `Postal Code: ${data.postalCode}`,
      `Continent: ${data.continent}`,
      `Latitude: ${data.lat}`,
      `Longitude: ${data.lon}`,
      `Timezone: ${data.timezone}`,
      `Local Time: ${data.localTime}`,
      `ISP: ${data.isp}`,
      `Organization: ${data.org}`,
      `ASN: ${data.asn}`,
      `Currency: ${data.currency}`,
      `Calling Code: ${data.callingCode}`,
      `VPN: ${data.isVpn ? "Yes" : "No"}`,
      `Proxy: ${data.isProxy ? "Yes" : "No"}`,
      `Tor: ${data.isTor ? "Yes" : "No"}`,
    ];
    const text = lines.join("\n");
    navigator.clipboard.writeText(text).catch(() => {});
  }, [data]);

  if (error) {
    return <ToolError message={error} onRetry={onRetry} />;
  }

  if (loading) {
    return <ToolSkeleton count={18} columns={3} />;
  }

  if (!data) {
    return null;
  }

  const rows = [
    { label: "IP Address", value: data.ip, icon: getFlagEmoji(data.countryCode), mono: true },
    { label: "IP Version", value: `IPv${data.version}`, icon: "🔢" },
    { label: "Hostname", value: data.hostname, icon: "🏷️", mono: true },
    { label: "Country", value: `${data.country} ${data.countryCode}`, icon: "🗺️" },
    { label: "Region", value: data.region, icon: "📍" },
    { label: "City", value: data.city, icon: "🏙️" },
    { label: "Postal Code", value: data.postalCode, icon: "📮" },
    { label: "Continent", value: data.continent, icon: "🌍" },
    { label: "Latitude", value: String(data.lat), icon: "📐", mono: true },
    { label: "Longitude", value: String(data.lon), icon: "📐", mono: true },
    { label: "Timezone", value: data.timezone, icon: "🕐" },
    { label: "Local Time", value: data.localTime, icon: "⏰" },
    { label: "ISP", value: data.isp, icon: "🔌" },
    { label: "Organization", value: data.org, icon: "🏢" },
    { label: "ASN", value: data.asn, icon: "🏷️", mono: true },
    { label: "Currency", value: data.currency, icon: "💵" },
    { label: "Calling Code", value: data.callingCode, icon: "📞" },
    { label: "VPN", value: data.isVpn ? "Yes" : "No", icon: "🛡️" },
    { label: "Proxy", value: data.isProxy ? "Yes" : "No", icon: "🔒" },
    { label: "Tor", value: data.isTor ? "Yes" : "No", icon: "🧅" },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-zinc-200/80 bg-white/60 p-6 shadow-sm backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-900/60">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Lookup Result
            </p>
            <p className="mt-1 font-mono text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {data.ip}
              <span className="ml-2 text-sm font-normal text-zinc-400">
                IPv{data.version}
              </span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <CopyButton text={data.ip} label="Copy IP" />
            <button
              type="button"
              onClick={handleCopyAll}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900"
              aria-label="Copy all results"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="size-4"
                aria-hidden="true"
              >
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
              Copy All
            </button>
            <ShareButton
              title={`IP Lookup: ${data.ip}`}
              text={`IP: ${data.ip} | Location: ${data.city}, ${data.country} | ISP: ${data.isp}`}
              url={`${pageUrl}?ip=${data.ip}`}
            />
          </div>
        </div>
      </div>

      {data.lat !== 0 && data.lon !== 0 && (
        <div className="overflow-hidden rounded-xl border border-zinc-200/80 shadow-sm dark:border-zinc-800/80">
          <IpLookupMap lat={data.lat} lon={data.lon} title={`${data.city}, ${data.country}`} />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((r) => (
          <div key={r.label} className="group relative">
            <ToolResultCard label={r.label} value={r.value} icon={r.icon} mono={r.mono} />
            <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
              <CopyButton text={r.value} label="" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
