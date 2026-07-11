"use client";

import {
  ToolResultCard,
  CopyButton,
  ToolSkeleton,
  ToolError,
  DashboardSummary,
  StatusBadge,
  ScoreGauge,
  ToolFaqSection,
} from "@/components/shared";
import { TOOL_FAQS } from "@/lib/tool-faqs";
import { IpLookupMap } from "./ip-lookup-map";
import type { IpLookupData } from "@/lib/ip-lookup-utils";
import { getFlagEmoji } from "@/lib/ip-lookup-utils";

interface IpLookupResultsProps {
  data: IpLookupData | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function IpLookupResults({
  data,
  loading,
  error,
  onRetry,
}: IpLookupResultsProps) {

  if (error) {
    return <ToolError message={error} onRetry={onRetry} />;
  }

  if (loading) {
    return <ToolSkeleton count={18} columns={3} />;
  }

  if (!data) {
    return (
      <div className="rounded-xl border border-zinc-200 p-8 text-center dark:border-zinc-800">
        <p className="text-zinc-600 dark:text-zinc-400">
          Enter an IP address above to look up location, ISP, ASN, and more.
        </p>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Try entering <span className="font-mono text-zinc-700 dark:text-zinc-300">8.8.8.8</span> (Google DNS) to see a sample result.
        </p>
      </div>
    );
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
  ];

  return (
    <div className="space-y-6">
      {(() => {
        const hasFullData = data.city !== "—" && data.isp !== "—";
        const privacyScore = hasFullData ? 40 : data.city !== "—" ? 60 : 80;
        const asnShort = data.asn ? data.asn.replace("AS", "") : "";
        return (
          <DashboardSummary
            title={data.ip}
            status={data.city !== "—" ? "good" : "warning"}
            mainFinding={`${data.city}, ${data.country}${data.countryCode}${data.isp !== "—" ? ` · ${data.isp}` : ""}`}
            riskLevel="low"
            riskLabel={`IPv${data.version}`}
            timestamp={new Date().toISOString()}
            nextAction={data.isp !== "—" ? "Use this data for network diagnostics. For real-time threat detection, run periodic lookups." : "Some data fields are unavailable. Try a different IP address for more complete results."}
          >
            <ScoreGauge score={100 - privacyScore} size={60} label="Privacy" />
            {data.asn !== "—" && <div className="text-center"><p className="text-xs text-zinc-500">ASN</p><p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{asnShort}</p></div>}
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={data.countryCode ? "good" : "neutral"} label={data.countryCode || "No Geo"} />
              <StatusBadge status={data.isp !== "—" ? "good" : "warning"} label={data.isp !== "—" ? "ISP Known" : "ISP Unknown"} />
              <StatusBadge status={data.hostname ? "good" : "neutral"} label={data.hostname ? "PTR Record" : "No PTR"} />
            </div>
          </DashboardSummary>
        );
      })()}

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

      <div className="rounded-xl border border-zinc-200 p-5 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
        <p className="mb-2 font-medium text-zinc-900 dark:text-zinc-50">
          About This Data
        </p>
        <ul className="space-y-2">
          <li>
            <strong>Source:</strong> ip-api.com — geolocation data derived from BGP routing tables, WHOIS allocation records, and latency measurements from global probe networks.
          </li>
          <li>
            <strong>Generated:</strong> {new Date().toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          </li>
          <li>
            <strong>Accuracy:</strong> City-level accuracy for residential IPs is typically 85-95% in developed countries. Mobile and datacenter IPs are less precise. This data should not be used for street-level location or law enforcement purposes.
          </li>
          <li>
            <strong>VPN/Proxy Detection:</strong> Not available in the current tier. For reliable VPN/proxy detection, use a dedicated threat intelligence feed.
          </li>
        </ul>
      </div>
      <div className="mt-8">
        <ToolFaqSection items={TOOL_FAQS["ip-lookup"]} toolName="IP Lookup" />
      </div>
    </div>
  );
}
