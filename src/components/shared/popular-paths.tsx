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
      { toolSlug: "ping-test", toolName: "Ping Test", label: "1. Check basic reachability" },
      { toolSlug: "website-status-checker", toolName: "Website Status Checker", label: "2. Find where traffic stops" },
      { toolSlug: "dns-lookup", toolName: "DNS Lookup", label: "3. Verify DNS resolution" },
      { toolSlug: "http-headers-checker", toolName: "HTTP Headers Checker", label: "4. Inspect server response" },
    ],
  },
  {
    title: "Slow Connection Troubleshoot",
    description: "Pinpoint the cause of a slow or unreliable connection.",
    steps: [
      { toolSlug: "ping-test", toolName: "Ping Test", label: "1. Measure latency and packet loss" },
      { toolSlug: "website-status-checker", toolName: "Website Status Checker", label: "2. Check website response time" },
      { toolSlug: "dns-lookup", toolName: "DNS Lookup", label: "3. Verify DNS resolution speed" },
      { toolSlug: "http-headers-checker", toolName: "HTTP Headers Checker", label: "4. Inspect server response" },
    ],
  },
  {
    title: "Email Delivery Issues",
    description: "Troubleshoot why emails aren't being delivered.",
    steps: [
      { toolSlug: "dns-lookup", toolName: "DNS Lookup", label: "1. Check MX and SPF records" },
      { toolSlug: "reverse-dns-lookup", toolName: "Reverse DNS Lookup", label: "2. Verify PTR records" },
      { toolSlug: "http-headers-checker", toolName: "HTTP Headers Checker", label: "3. Check server headers" },
      { toolSlug: "ssl-certificate-checker", toolName: "SSL Certificate Checker", label: "4. Verify TLS readiness" },
    ],
  },
  {
    title: "Security Headers Audit",
    description: "Verify your site's security posture from every angle.",
    steps: [
      { toolSlug: "http-headers-checker", toolName: "HTTP Headers Checker", label: "1. Inspect security headers" },
      { toolSlug: "dns-lookup", toolName: "DNS Lookup", label: "2. Check CNAME/DNSSEC" },
      { toolSlug: "ssl-certificate-checker", toolName: "SSL Certificate Checker", label: "3. Verify HTTPS readiness" },
    ],
  },
];

export function PopularPaths() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight text-text-primary">
          Popular Diagnostic Paths
        </h2>
        <p className="mt-1 text-text-secondary">
          Curated multi-tool workflows for common network issues.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {POPULAR_PATHS.map((path) => (
            <div
              key={path.title}
              className="rounded-2xl border border-border-subtle bg-surface p-5 transition-all hover:shadow-sm"
            >
              <h3 className="text-base font-semibold text-text-primary">
                {path.title}
              </h3>
              <p className="mt-1 text-xs text-text-tertiary">
                {path.description}
              </p>
              <ol className="mt-4 space-y-2">
                {path.steps.map((step) => (
                  <li key={`${step.toolSlug}-${step.label}`}>
                    <Link
                      href={`/${step.toolSlug}`}
                      className="group flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs transition-colors hover:bg-surface-secondary"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-secondary text-[10px] font-bold text-text-secondary group-hover:bg-nuvora-600 group-hover:text-white dark:group-hover:bg-nuvora-400 dark:group-hover:text-zinc-900">
                        {step.label.charAt(0)}
                      </span>
                      <span className="flex-1 font-medium text-text-secondary group-hover:text-text-primary">
                        {step.label.replace(/^\d+\.\s*/, "")}
                      </span>
                      <span className="text-text-tertiary group-hover:text-text-secondary">
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
