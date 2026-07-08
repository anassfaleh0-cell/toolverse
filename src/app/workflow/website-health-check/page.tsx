"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { ResultExport, ToolMethodology } from "@/components/shared";
import { saveResult } from "@/lib/user-storage";

interface StepResult {
  step: string;
  status: "pending" | "running" | "passed" | "failed" | "skipped";
  summary: string;
  data?: unknown;
}

const STEPS = [
  { id: "dns", label: "DNS Lookup", href: "/dns-lookup", description: "Verify domain resolution and DNS records" },
  { id: "whois", label: "WHOIS Lookup", href: "/whois-lookup", description: "Check domain registration and expiry" },
  { id: "ssl", label: "SSL Certificate", href: "/ssl-certificate-checker", description: "Validate certificate chain and expiry" },
  { id: "headers", label: "HTTP Headers", href: "/http-headers-checker", description: "Inspect security headers and response" },
  { id: "port", label: "Port Checker", href: "/port-checker", description: "Verify critical ports are open" },
  { id: "ping", label: "Ping Test", href: "/ping-test", description: "Measure latency and packet loss" },
];

const API_MAP: Record<string, string> = {
  dns: "/api/dns-lookup?hostname=",
  whois: "/api/whois?domain=",
  ssl: "/api/ssl-certificate?host=",
  headers: "/api/http-headers?url=https://",
  port: "/api/port-checker?hostname=",
  ping: "/api/ping-test?host=",
};

export default function WebsiteHealthCheckPage() {
  const [domain, setDomain] = useState("");
  const [results, setResults] = useState<StepResult[]>([]);
  const [running, setRunning] = useState(false);
  const [finalDomain, setFinalDomain] = useState("");

  const runCheck = useCallback(async () => {
    const trimmed = domain.trim().toLowerCase();
    if (!trimmed) return;

    setRunning(true);
    setFinalDomain(trimmed);
    const stepResults: StepResult[] = STEPS.map((s) => ({
      step: s.id,
      status: "pending" as const,
      summary: "",
    }));
    setResults(stepResults);

    for (let i = 0; i < STEPS.length; i++) {
      stepResults[i] = { ...stepResults[i], status: "running" };
      setResults([...stepResults]);

      try {
        let url = API_MAP[STEPS[i].id] + encodeURIComponent(trimmed);
        if (STEPS[i].id === "headers") url = API_MAP[STEPS[i].id] + encodeURIComponent(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
        const res = await fetch(url);
        const json = await res.json();

        if (res.ok && !json.error) {
          const summary = getStepSummary(STEPS[i].id, json);
          stepResults[i] = { step: STEPS[i].id, status: "passed", summary, data: json };
          saveResult(STEPS[i].id, json);
        } else {
          stepResults[i] = { step: STEPS[i].id, status: "failed", summary: json.error || "Check failed" };
        }
      } catch {
        stepResults[i] = { step: STEPS[i].id, status: "failed", summary: "Network error" };
      }
      setResults([...stepResults]);
    }
    setRunning(false);
  }, [domain]);

  const formatWorkflowText = useCallback(() => {
    const lines = [
      `Website Health Check for: ${finalDomain}`,
      `Generated: ${new Date().toISOString()}`,
      "",
    ];
    for (const r of results) {
      const step = STEPS.find((s) => s.id === r.step);
      lines.push(`[${r.status.toUpperCase()}] ${step?.label || r.step}: ${r.summary}`);
    }
    return lines.join("\n");
  }, [results, finalDomain]);

  const allPassed = results.length > 0 && results.every((r) => r.status === "passed");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">Workflow</p>
        <h1 className="mt-1 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Website Health Check
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Run a comprehensive diagnostic across DNS, WHOIS, SSL, HTTP headers, ports, and latency.
        </p>
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="example.com"
          className="flex-1 rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
          aria-label="Domain name"
        />
        <Button type="button" onClick={runCheck} disabled={running || !domain.trim()}>
          {running ? "Running..." : "Run Health Check"}
        </Button>
      </div>

      {results.length > 0 && (
        <div className="mt-8 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Results for {finalDomain}
            </h2>
            <ResultExport rawData={results} fileName={`health-check-${finalDomain}`} displayName="Website Health Check" formatAsText={formatWorkflowText} />
          </div>

          <div className="space-y-2">
            {results.map((r) => {
              const step = STEPS.find((s) => s.id === r.step);
              return (
                <div
                  key={r.step}
                  className={`flex items-center justify-between rounded-xl border px-5 py-4 text-sm transition-colors ${
                    r.status === "passed"
                      ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/10"
                      : r.status === "failed"
                        ? "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/10"
                        : r.status === "running"
                          ? "border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/10"
                          : "border-zinc-200 dark:border-zinc-800"
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-base ${
                        r.status === "passed" ? "text-emerald-500" :
                        r.status === "failed" ? "text-red-500" :
                        r.status === "running" ? "text-blue-500" : "text-zinc-300"
                      }`}>
                        {r.status === "passed" ? "✓" : r.status === "failed" ? "✗" : r.status === "running" ? "→" : "○"}
                      </span>
                      <span className="font-medium text-zinc-900 dark:text-zinc-50">
                        {step?.label || r.step}
                      </span>
                    </div>
                    {r.summary && (
                      <p className="mt-0.5 text-xs text-zinc-500">{r.summary}</p>
                    )}
                  </div>
                  {step && r.status === "passed" && (
                    <Link href={step.href} className="text-xs text-blue-600 hover:underline dark:text-blue-400">
                      Open Tool
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          {allPassed && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-center dark:border-emerald-800 dark:bg-emerald-950/10">
              <p className="text-emerald-700 dark:text-emerald-300 font-semibold">
                All checks passed for {finalDomain}
              </p>
              <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                Your website is properly configured across all diagnostic categories.
              </p>
            </div>
          )}

          <div className="mt-6">
            <ToolMethodology sections={[
              { title: "How This Works", body: "This workflow runs six independent diagnostic checks in sequence against your domain. Each check uses the same infrastructure as the individual tool pages. Results are cumulative — passing earlier steps increases confidence in later checks." },
              { title: "Limitations", body: "Results reflect our server's perspective, not your end users'. CDN-backed sites may show different results from different geographic locations. Some checks (WHOIS, Port) may be rate-limited by upstream services." },
              { title: "Privacy", body: "Your domain is sent to each respective API endpoint. No data is stored server-side. Results are saved locally in your browser for history." },
            ]} />
          </div>
        </div>
      )}
    </div>
  );
}

function getStepSummary(step: string, data: unknown): string {
  try {
    switch (step) {
      case "dns": {
        const d = data as { hostname: string; records: { type: string; values: unknown[] }[] };
        const count = d.records?.reduce((s, r) => s + r.values.length, 0) || 0;
        return `${d.records?.length || 0} record types, ${count} total values`;
      }
      case "whois": {
        const d = data as { domain: string };
        return `Found registration data for ${d.domain}`;
      }
      case "ssl": {
        const d = data as { certificate: { daysRemaining: number; commonName: string } };
        return `${d.certificate?.commonName} — ${d.certificate?.daysRemaining} days remaining`;
      }
      case "headers": {
        const d = data as { statusCode: number; responseTime: number; headers: Record<string, string> };
        return `Status ${d.statusCode} — ${d.responseTime}ms — ${Object.keys(d.headers || {}).length} headers`;
      }
      case "port": {
        const d = data as { port: number; open: boolean };
        return d.open ? `Port ${d.port} is open` : `Port is closed or filtered`;
      }
      case "ping": {
        const d = data as { avg: number; packetLoss: number; host: string };
        return `${d.avg}ms avg, ${d.packetLoss}% loss`;
      }
      default:
        return "Completed";
    }
  } catch {
    return "Result available";
  }
}
