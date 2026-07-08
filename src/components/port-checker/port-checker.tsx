"use client";

import { useState, useTransition } from "react";
import { Input, Button, Alert, Skeleton } from "@/components/ui";
import { CopyButton, DashboardSummary, StatusBadge, CompositeScore, RiskMeter, ToolFaqSection } from "@/components/shared";
import { TOOL_FAQS } from "@/lib/tool-faqs";

interface PortResult {
  port: number;
  service: string;
  status: "open" | "closed" | "filtered";
  responseTime: number | null;
}

interface PortResultData {
  host: string;
  ports: PortResult[];
}

export function PortChecker() {
  const [host, setHost] = useState("");
  const [customPort, setCustomPort] = useState("");
  const [result, setResult] = useState<PortResultData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = host.trim().toLowerCase();
    if (!trimmed) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      let url = `/api/port-checker?host=${encodeURIComponent(trimmed)}`;
      const customPortTrimmed = customPort.trim();
      if (customPortTrimmed) {
        const portNum = parseInt(customPortTrimmed, 10);
        if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
          setError("Port must be between 1 and 65535");
          setLoading(false);
          return;
        }
        url += `&port=${portNum}`;
      }

      const res = await fetch(url);
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Port check failed");
      } else {
        startTransition(() => setResult(json));
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const openPorts = result?.ports.filter((p) => p.status === "open") || [];
  const closedPorts = result?.ports.filter((p) => p.status === "closed") || [];
  const filteredPorts = result?.ports.filter((p) => p.status === "filtered") || [];

  return (
    <div className="mx-auto max-w-3xl">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Input
          type="text"
          value={host}
          onChange={(e) => setHost(e.target.value)}
          placeholder="example.com"
          aria-label="Hostname"
        />
        <Input
          type="text"
          value={customPort}
          onChange={(e) => setCustomPort(e.target.value)}
          placeholder="Port (optional)"
          className="w-32"
          aria-label="Port number"
        />
        <Button
          type="submit"
          disabled={loading}
          variant="primary"
        >
          {loading ? "Scanning..." : "Scan"}
        </Button>
      </form>

      {error && (
        <Alert variant="error" className="mt-6">{error}</Alert>
      )}

      {loading && (
        <div className="mt-8">
          <Skeleton count={6} columns={3} />
        </div>
      )}

      {result && !loading && (
        <div className="mt-8 space-y-6">
          {(() => {
            const riskyPorts = [21, 23, 25, 3389, 22, 445, 135, 139, 1433, 3306, 5900, 6379, 8080, 27017];
            const attackScore = Math.min(100, openPorts.filter(p => riskyPorts.includes(p.port)).length * 20 + openPorts.filter(p => !riskyPorts.includes(p.port)).length * 5);
            const total = result.ports.length;
            return (
              <DashboardSummary
                title={result.host}
                status={openPorts.length === 0 ? "good" : openPorts.length <= 3 ? "warning" : "critical"}
                mainFinding={openPorts.length === 0 ? "No open ports detected" : `${openPorts.length} open, ${filteredPorts.length} filtered, ${closedPorts.length} closed — Attack Surface: ${attackScore}/100`}
                riskLevel={openPorts.length === 0 ? "low" : openPorts.length <= 3 ? "medium" : "high"}
                riskLabel={attackScore <= 10 ? "Minimal" : attackScore <= 40 ? "Moderate" : attackScore <= 70 ? "Elevated" : "Severe"}
                nextAction={openPorts.length > 0 ? "Review each open port. Close unused ports at the firewall. Restrict access by source IP where possible." : "Your host has no exposed ports. Continue monitoring with periodic scans."}
              >
                <CompositeScore overall={100 - attackScore} subScores={[
                  { label: "Open", score: openPorts.length, max: total },
                  { label: "Filtered", score: total - openPorts.length - closedPorts.length, max: total },
                  { label: "Closed", score: closedPorts.length, max: total },
                ]} size={60} />
                <RiskMeter level={attackScore <= 10 ? "low" : attackScore <= 40 ? "medium" : "high"} label={attackScore <= 10 ? "Minimal Risk" : attackScore <= 40 ? "Moderate Risk" : "High Risk"} />
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={openPorts.length === 0 ? "good" : "warning"} label={`${openPorts.length} Open`} />
                  <StatusBadge status={filteredPorts.length > 0 ? "warning" : "good"} label={`${filteredPorts.length} Filtered`} />
                  {openPorts.some((p: {port: number}) => riskyPorts.slice(0, 4).includes(p.port)) && (
                    <StatusBadge status="critical" label="Risky Ports" />
                  )}
                </div>
              </DashboardSummary>
            );
          })()}

          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Scan results for <span className="font-medium text-zinc-900 dark:text-zinc-50">{result.host}</span>
              {" "}— {openPorts.length} open, {filteredPorts.length} filtered, {closedPorts.length} closed
            </p>
            <CopyButton text={JSON.stringify(result, null, 2)} label="Copy" />
          </div>

          {openPorts.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold text-green-600 dark:text-green-400">Open Ports</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {openPorts.map((p) => (
                  <div key={p.port} className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
                    <p className="text-lg font-bold text-green-700 dark:text-green-300">{p.port}</p>
                    <p className="text-xs text-green-600 dark:text-green-400">{p.service}</p>
                    <p className="mt-1 text-xs text-green-500">{p.responseTime}ms</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredPorts.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold text-amber-600 dark:text-amber-400">Filtered Ports</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {filteredPorts.map((p) => (
                  <div key={p.port} className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                    <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{p.port}</p>
                    <p className="text-xs text-zinc-500">{p.service}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {closedPorts.length > 0 && (
            <details className="rounded-xl border border-zinc-200 dark:border-zinc-800">
              <summary className="cursor-pointer px-5 py-3 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                Closed Ports ({closedPorts.length})
              </summary>
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {closedPorts.map((p) => (
                  <div key={p.port} className="flex items-center justify-between px-5 py-2 text-sm">
                    <span className="text-zinc-900 dark:text-zinc-50">{p.port}</span>
                    <span className="text-zinc-500 dark:text-zinc-400">{p.service}</span>
                  </div>
                ))}
              </div>
            </details>
          )}

          {openPorts.length > 0 && (
            <div className="rounded-xl border border-zinc-200 p-5 text-sm dark:border-zinc-800">
              <p className="mb-2 font-medium text-zinc-900 dark:text-zinc-50">
                Security Assessment
              </p>
              <div className="space-y-2 text-zinc-600 dark:text-zinc-400">
                <p>
                  <strong>{openPorts.length} port{openPorts.length > 1 ? "s are" : " is"} open.</strong>{" "}
                  {openPorts.some((p) => [21, 23, 25, 3389].includes(p.port))
                    ? "Ports commonly targeted by attackers (FTP, Telnet, SMTP, RDP) are exposed. Review whether each service requires public access."
                    : "Open ports are necessary for running services, but every open port expands the attack surface."}
                </p>
                <p>
                  To reduce risk: close unused ports at the firewall, restrict access by source IP where possible,
                  use strong authentication, and keep all services patched. Run this scan periodically to detect
                  unauthorized services.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {result && !loading && (
        <div className="mt-8">
          <ToolFaqSection items={TOOL_FAQS["port-checker"]} toolName="Port Checker" />
        </div>
      )}
      {!result && !loading && !error && (
        <div className="mt-8 rounded-xl border border-zinc-200 p-8 text-center dark:border-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400">
            Enter a hostname above to scan common ports and check which services are exposed.
          </p>
        </div>
      )}
    </div>
  );
}
