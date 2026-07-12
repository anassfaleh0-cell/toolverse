import type { Metadata } from "next";
import { Breadcrumbs, JsonLd, SocialShare } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `DNS Resolution Flow — How DNS Works Step by Step`,
  description: "Visual guide to DNS resolution: from browser to recursive resolver to authoritative nameserver. Understand every step of the DNS lookup process with diagrams.",
  openGraph: { title: "DNS Resolution Flow — How DNS Works Step by Step", description: "Visual guide to DNS resolution from browser to authoritative nameserver." },
  twitter: { title: "DNS Resolution Flow", description: "Visual guide to DNS resolution." },
  alternates: { canonical: `${SITE_URL}/technical-flow/dns-resolution` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Technical Flow", href: `${SITE_URL}/technical-flow` },
  { label: "DNS Resolution" },
];

const STEPS = [
  { num: 1, title: "Browser initiates DNS lookup", detail: "User enters example.com in the browser address bar. The browser checks its local cache for a recent DNS response. If not found, it queries the OS resolver.", color: "blue" },
  { num: 2, title: "OS resolver checks local cache", detail: "The OS checks the local DNS client cache (hosts file, systemd-resolved, dnscache). If the record is cached and still within TTL, it returns immediately. Otherwise, it forwards to the configured recursive resolver.", color: "blue" },
  { num: 3, title: "Recursive resolver receives query", detail: "The recursive resolver (usually operated by ISP, Google 8.8.8.8, or Cloudflare 1.1.1.1) receives the query. It checks its own cache for the answer.", color: "indigo" },
  { num: 4, title: "Root nameserver query", detail: "If not cached, the resolver queries a root nameserver (there are 13 logical root zones). The root responds with the address of the TLD nameserver for .com.", color: "purple" },
  { num: 5, title: "TLD nameserver query", detail: "The resolver queries the .com TLD nameserver. The TLD responds with the address of the authoritative nameserver for example.com.", color: "purple" },
  { num: 6, title: "Authoritative nameserver query", detail: "The resolver queries the authoritative nameserver for example.com. The authoritative server returns the DNS records (A, AAAA, MX, etc.) for the domain.", color: "violet" },
  { num: 7, title: "Response propagates back", detail: "The recursive resolver caches the response according to the TTL, then returns the result to the OS resolver, which passes it to the browser.", color: "indigo" },
  { num: 8, title: "Browser establishes connection", detail: "The browser now has the IP address. It opens a TCP connection, performs a TLS handshake (for HTTPS), and sends the HTTP request to load the page.", color: "green" },
];

function FlowStep({ step }: { step: typeof STEPS[number] }) {
  const colorMap: Record<string, string> = { blue: "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950", indigo: "border-indigo-200 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-950", purple: "border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950", violet: "border-violet-200 bg-violet-50 dark:border-violet-800 dark:bg-violet-950", green: "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950" };
  const badgeMap: Record<string, string> = { blue: "bg-blue-600 text-white dark:bg-blue-500", indigo: "bg-indigo-600 text-white dark:bg-indigo-500", purple: "bg-purple-600 text-white dark:bg-purple-500", violet: "bg-violet-600 text-white dark:bg-violet-500", green: "bg-green-600 text-white dark:bg-green-500" };
  return (
    <div className={`relative rounded-lg border p-5 ${colorMap[step.color]}`}>
      <div className="flex items-start gap-4">
        <span className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${badgeMap[step.color]}`}>{step.num}</span>
        <div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{step.title}</h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{step.detail}</p>
        </div>
      </div>
      {step.num < STEPS.length && <div className="ml-4 mt-2 h-6 w-0.5 bg-zinc-300 dark:bg-zinc-600" />}
    </div>
  );
}

export default function DnsResolutionFlowPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: "DNS Resolution Flow — How DNS Works", description: "Step-by-step visual guide to DNS resolution.", url: `${SITE_URL}/technical-flow/dns-resolution`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <div className="mt-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">DNS Resolution Flow</h1>
              <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">A step-by-step visual walkthrough of how DNS resolves a domain name into an IP address.</p>
            </div>
            <SocialShare url={`${SITE_URL}/technical-flow/dns-resolution`} title="DNS Resolution Flow — How DNS Works Step by Step" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="mb-8 overflow-hidden rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <svg viewBox="0 0 700 100" className="h-auto w-full" aria-label="DNS resolution flow diagram">
            <rect x="10" y="10" width="80" height="40" rx="6" fill="#3b82f6" />
            <text x="50" y="35" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Browser</text>
            <line x1="90" y1="30" x2="160" y2="30" stroke="#3b82f6" strokeWidth="1.5" />
            <polygon points="160,25 170,30 160,35" fill="#3b82f6" />
            <rect x="170" y="10" width="100" height="40" rx="6" fill="#6366f1" />
            <text x="220" y="35" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">OS Resolver</text>
            <line x1="270" y1="30" x2="340" y2="30" stroke="#6366f1" strokeWidth="1.5" />
            <polygon points="340,25 350,30 340,35" fill="#6366f1" />
            <rect x="350" y="10" width="120" height="40" rx="6" fill="#8b5cf6" />
            <text x="410" y="35" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Recursive Resolver</text>
            <line x1="470" y1="30" x2="540" y2="30" stroke="#8b5cf6" strokeWidth="1.5" />
            <polygon points="540,25 550,30 540,35" fill="#8b5cf6" />
            <rect x="550" y="10" width="130" height="40" rx="6" fill="#a855f7" />
            <text x="615" y="35" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Authoritative DNS</text>
            <text x="410" y="75" textAnchor="middle" fontSize="10" fill="#a1a1aa">Query Chain</text>
          </svg>
        </div>

        <div className="space-y-0">
          {STEPS.map((step) => <FlowStep key={step.num} step={step} />)}
        </div>

        <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
          <h2 className="mb-3 text-lg font-bold text-zinc-900 dark:text-zinc-100">Key Concepts</h2>
          <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li><strong className="text-zinc-900 dark:text-zinc-100">TTL (Time To Live):</strong> Determines how long DNS responses are cached. Shorter TTLs mean faster updates but more queries. Common values: 300s (5 min) for dynamic records, 86400s (24h) for stable records.</li>
            <li><strong className="text-zinc-900 dark:text-zinc-100">Recursive vs. Iterative:</strong> Most resolvers use recursive resolution (resolver does all work). Some support iterative (resolver follows referrals step by step). Both reach the same result.</li>
            <li><strong className="text-zinc-900 dark:text-zinc-100">Anycast:</strong> Major DNS providers use Anycast routing so multiple servers share the same IP. Your query goes to the nearest available server, reducing latency.</li>
          </ul>
        </div>
      </section>
    </>
  );
}
