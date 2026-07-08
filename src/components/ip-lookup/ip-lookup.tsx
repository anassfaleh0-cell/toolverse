"use client";

import { useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { IpLookupForm } from "./ip-lookup-form";
import { IpLookupResults } from "./ip-lookup-results";
import { IpLookupHistory } from "./ip-lookup-history";
import { addToHistory, type IpLookupData } from "@/lib/ip-lookup-utils";

export function IpLookup() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [data, setData] = useState<IpLookupData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lookedUpIp, setLookedUpIp] = useState<string | undefined>(undefined);

  const performLookup = useCallback(
    async (ip: string) => {
      setLoading(true);
      setError(null);
      setData(null);

      const params = new URLSearchParams(searchParams.toString());
      params.set("ip", ip);
      router.replace(`?${params.toString()}`, { scroll: false });

      try {
        const res = await fetch(`/api/ip-lookup?ip=${encodeURIComponent(ip)}`);
        const result = await res.json();

        if (!res.ok) {
          setError(result.error || "Lookup failed");
          return;
        }

        setData(result);
        setLookedUpIp(ip);

        addToHistory({
          ip: result.ip,
          timestamp: Date.now(),
          country: result.country,
          countryCode: result.countryCode,
          city: result.city,
          isp: result.isp,
        });
      } catch {
        setError("Unable to look up IP address. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [searchParams, router],
  );

  const handleRefresh = useCallback(() => {
    if (lookedUpIp) performLookup(lookedUpIp);
  }, [lookedUpIp, performLookup]);

  return (
    <div className="space-y-8">
      <IpLookupForm onLookup={performLookup} loading={loading} />

      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        <IpLookupResults
          data={data}
          loading={loading}
          error={error}
          onRetry={handleRefresh}
        />
        <aside className="order-first lg:order-last">
          <IpLookupHistory onSelect={performLookup} currentIp={lookedUpIp} />
        </aside>
      </div>
    </div>
  );
}
