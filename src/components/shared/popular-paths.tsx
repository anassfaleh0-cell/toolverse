"use client";

import Link from "next/link";

interface PathStep {
  toolSlug: string;
  toolName: string;
  label: string;
}

interface DiagnosticPath {
  title: string;
  description: string;
  steps: PathStep[];
}

const POPULAR_PATHS: DiagnosticPath[] = [
  {
    title: "Can't Reach a Website",
    description: "Step-by-step to diagnose and fix website connectivity issues.",
    steps: [
      { toolSlug: "ping", toolName: "Ping", label: "1. Check basic reachability" },
      { toolSlug: "traceroute", toolName: "Traceroute", label: "2. Find where traffic stops" },
      { toolSlug: "dns-lookup", toolName: "DNS Lookup", label: "3. Verify DNS resolution" },
      { toolSlug: "http-headers", toolName: "HTTP Headers", label: "4. Inspect server response" },
    ],
  },
  {
    title: "Slow Connection Troubleshoot",
    description: "Pinpoint the cause of a slow or unreliable connection.",
    steps: [
      { toolSlug: "speedtest", toolName: "Speed Test", label: "1. Measure current throughput" },
      { toolSlug: "ping", toolName: "Ping", label: "2. Check latency and packet loss" },
      { toolSlug: "traceroute", toolName: "Traceroute", label: "3. Identify slow hops" },
      { toolSlug: "bandwidth-calculator", toolName: "Bandwidth Calculator", label: "4. Estimate required bandwidth" },
    ],
  },
  {
    title: "Email Delivery Issues",
    description: "Troubleshoot why emails aren't being delivered.",
    steps: [
      { toolSlug: "dns-lookup", toolName: "DNS Lookup", label: "1. Check MX records" },
      { toolSlug: "dns-lookup", toolName: "DNS Lookup", label: "2. Verify SPF/TXT records" },
      { toolSlug: "http-headers", toolName: "HTTP Headers", label: "3. Check server headers" },
      { toolSlug: "ipv6-connectivity", toolName: "IPv6 Test", label: "4. Ensure IPv6 compatibility" },
    ],
  },
  {
    title: "Security Headers Audit",
    description: "Verify your site's security posture from every angle.",
    steps: [
      { toolSlug: "http-headers", toolName: "HTTP Headers", label: "1. Inspect security headers" },
      { toolSlug: "dns-lookup", toolName: "DNS Lookup", label: "2. Check CNAME/DNSSEC" },
      { toolSlug: "ipv6-connectivity", toolName: "IPv6 Test", label: "3. Verify HTTPS readiness" },
    ],
  },
];

export function PopularPaths() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Popular Diagnostic Paths
        </h2>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          Curated multi-tool workflows for common network issues.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {POPULAR_PATHS.map((path) => (
            <div
              key={path.title}
              className="rounded-2xl border border-zinc-200 p-5 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
            >
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                {path.title}
              </h3>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                {path.description}
              </p>
              <ol className="mt-4 space-y-2">
                {path.steps.map((step) => (
                  <li key={`${step.toolSlug}-${step.label}`}>
                    <Link
                      href={`/${step.toolSlug}`}
                      className="group flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[10px] font-bold text-zinc-600 group-hover:bg-zinc-900 group-hover:text-white dark:bg-zinc-700 dark:text-zinc-300 dark:group-hover:bg-zinc-50 dark:group-hover:text-zinc-900">
                        {step.label.charAt(0)}
                      </span>
                      <span className="flex-1 font-medium text-zinc-700 group-hover:text-zinc-900 dark:text-zinc-300 dark:group-hover:text-zinc-50">
                        {step.label.replace(/^\d+\.\s*/, "")}
                      </span>
                      <span className="text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300">
                        &rarr;
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
