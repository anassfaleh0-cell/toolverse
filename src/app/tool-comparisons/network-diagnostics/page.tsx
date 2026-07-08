import type { Metadata } from "next";
import Link from "next/link";
import {
  ComparisonMatrix,
  Breadcrumbs,
  SocialShare,
  JsonLd,
} from "@/components/shared";
import {
  webPageSchema,
  breadcrumbSchema,
} from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

const slug = "tool-comparisons/network-diagnostics";
const pageTitle = "Network Diagnostic Tools Compared — Ping vs Traceroute vs MTR vs PathPing";
const pageDescription =
  "Compare the four essential network diagnostic tools: Ping, Traceroute, MTR (My TraceRoute), and PathPing. Learn which tool to use for latency testing, routing issues, packet loss, and continuous network monitoring.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: `${SITE_URL}/${slug}`,
  },
  twitter: {
    title: pageTitle,
    description: pageDescription,
  },
  alternates: {
    canonical: `${SITE_URL}/${slug}`,
  },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Comparisons", href: `${SITE_URL}/compare` },
  { label: "Network Diagnostics" },
];

export default function NetworkDiagnosticsPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                Network Diagnostic Tools Compared
              </h1>
              <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
                {pageDescription}
              </p>
            </div>
            <SocialShare url={`${SITE_URL}/${slug}`} title={pageTitle} />
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            Tool Comparison Matrix
          </h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            Each network diagnostic tool operates at a different layer and provides unique insights. This matrix highlights their key differences at a glance.
          </p>
          <div className="mt-8">
            <ComparisonMatrix
              title="Network Diagnostic Tools"
              headers={["Ping", "Traceroute", "MTR", "PathPing"]}
              rows={[
                { feature: "OSI Layer", values: ["Layer 3 (Network)", "Layer 3 (Network)", "Layer 3 (Network)", "Layer 3 (Network)"] },
                { feature: "Protocol", values: ["ICMP / TCP", "ICMP / UDP / TCP", "ICMP / TCP", "ICMP"] },
                { feature: "Data Provided", values: ["Latency, packet loss", "Hop-by-hop route, per-hop latency", "Continuous per-hop latency & loss", "Per-hop latency & loss over time"] },
                { feature: "Best Use Case", values: ["Quick reachability check", "Route path discovery", "Sustained path analysis", "Windows diagnostics"] },
                { feature: "Output Format", values: ["Real-time lines", "List of hops with times", "Live updating table", "Summary after N probes"] },
                { feature: "Windows Support", values: ["Built-in", "tracert", "Third-party (WinMTR)", "Built-in (pathping)"] },
                { feature: "Linux Support", values: ["Built-in", "traceroute", "mtr", "Not built-in"] },
                { feature: "macOS Support", values: ["Built-in", "traceroute", "mtr (via brew)", "Not built-in"] },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            Detailed Tool Explanations
          </h2>
          <div className="mt-8 space-y-10">
            <div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Ping — The Quick Health Check</h3>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>
                  Ping sends ICMP Echo Request packets to a target host and measures the round-trip time for each reply. It is the simplest network diagnostic tool and the first you should reach for when a host is unreachable. A successful ping confirms basic IP-level connectivity. Packet loss indicates congestion or a failing link. High latency without loss suggests geographic distance or serialization delay.
                </p>
                <p>
                  Use our <Link href="/ping-test" className="text-blue-600 hover:underline dark:text-blue-400">Ping Test</Link> tool to measure latency and packet loss from our servers. Combine it with the <Link href="/website-status-checker" className="text-blue-600 hover:underline dark:text-blue-400">Website Status Checker</Link> to separate network-level issues from application-layer problems. If ping succeeds but the website does not load, the issue is likely in the application or firewall stack.
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Traceroute — Mapping the Path</h3>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>
                  Traceroute discovers the route packets take from your computer to a destination. It sends packets with incrementing TTL (Time To Live) values so each router along the path replies with a TTL-exceeded ICMP message, revealing its IP address. Traceroute also measures round-trip time to each hop, helping you identify which router in the path introduces latency.
                </p>
                <p>
                  Use traceroute when ping to a destination shows high latency but you do not know where the delay originates. A sudden latency spike at hop 7 points to an ISP or peering issue. Use <Link href="/dns-lookup" className="text-blue-600 hover:underline dark:text-blue-400">DNS Lookup</Link> to resolve the IPs discovered by traceroute and identify which network each hop belongs to.
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">MTR — Continuous Path Analysis</h3>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>
                  MTR (My TraceRoute) combines ping and traceroute into a single tool. It continuously probes each hop on the path and displays a live-updating table of latency, packet loss, and jitter per hop. MTR is the most powerful tool for diagnosing intermittent network issues because it accumulates data over time, revealing patterns that single-shot tools miss.
                </p>
                <p>
                  Run MTR for 100+ probes to a target and examine the loss percentages at each hop. If loss appears only at the final hop, the target is likely rate-limiting ICMP. If loss accumulates at intermediate hops, you have identified a congested or failing router. Validate your findings with the <Link href="/website-status-checker" className="text-blue-600 hover:underline dark:text-blue-400">Website Status Checker</Link> to see if the loss correlates with application performance degradation.
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">PathPing — Windows Network Diagnostics</h3>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>
                  PathPing is a Windows-native tool that combines features of ping and traceroute. It first traces the route to the destination, then sends a series of probes to each hop over a configurable period (default 50 probes per hop). PathPing outputs a summary table showing latency and loss statistics for each hop.
                </p>
                <p>
                  PathPing is useful on Windows systems where MTR is not installed. It requires administrator privileges. The main drawback is that PathPing takes much longer to complete than a standard traceroute because it sends multiple probes to each hop sequentially. For quick diagnostics on Windows, use <Link href="/ping-test" className="text-blue-600 hover:underline dark:text-blue-400">Ping Test</Link> first, then follow up with PathPing if you need detailed per-hop statistics. Cross-reference the results with <Link href="/dns-lookup" className="text-blue-600 hover:underline dark:text-blue-400">DNS Lookup</Link> to verify that the destination resolves correctly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            Recommendations by Scenario
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Website Not Loading</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Start with <strong>Ping</strong> to check reachability. If ping fails, run <strong>traceroute</strong> to find where the connection drops. Use <Link href="/website-status-checker" className="text-blue-600 hover:underline dark:text-blue-400">Website Status Checker</Link> to confirm from an external perspective.</p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Intermittent Slowdowns</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Run <strong>MTR</strong> for 5–10 minutes to capture the pattern. MTR&apos;s continuous sampling reveals periodic packet loss or latency spikes that intermittent tests miss.</p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">VoIP Quality Issues</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Use <strong>Ping</strong> to measure jitter (variance between successive pings). Values above 30 ms indicate problematic voice quality. Follow up with <strong>MTR</strong> to identify the problematic hop.</p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">New Server Deployment</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Run <strong>traceroute</strong> from multiple geographic locations to verify the route is optimal. Use <Link href="/ping-test" className="text-blue-600 hover:underline dark:text-blue-400">Ping Test</Link> to establish a latency baseline. Check <Link href="/dns-lookup" className="text-blue-600 hover:underline dark:text-blue-400">DNS Lookup</Link> to confirm resolution.</p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Windows-Only Environment</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Use built-in <strong>ping</strong> for quick checks, <strong>tracert</strong> for route discovery, and <strong>pathping</strong> for detailed per-hop analysis. Install WinMTR for MTR-like functionality.</p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Firewall / ISP Blocking</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">If ICMP is blocked, try <strong>TCP-based traceroute</strong> or use <Link href="/port-checker" className="text-blue-600 hover:underline dark:text-blue-400">Port Checker</Link> to test if specific ports are reachable.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            Combining Tools for Effective Troubleshooting
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              No single tool provides the full picture. A structured diagnostic workflow starts with <Link href="/ping-test" className="text-blue-600 hover:underline dark:text-blue-400">Ping Test</Link> to confirm basic reachability and establish a latency baseline. If ping succeeds, use traceroute to map the path. If you see high latency or loss on specific hops, run MTR for several minutes to determine if the problem is sustained or intermittent. On Windows, PathPing serves a similar role to MTR.
            </p>
            <p>
              Always cross-reference network diagnostic findings with other tools. A host that appears down from a ping test may respond to a <Link href="/port-checker" className="text-blue-600 hover:underline dark:text-blue-400">Port Checker</Link> if ICMP is blocked. A server that pings fine but serves HTTP errors needs the <Link href="/website-status-checker" className="text-blue-600 hover:underline dark:text-blue-400">Website Status Checker</Link>. Resolve IPs discovered during traceroute with <Link href="/dns-lookup" className="text-blue-600 hover:underline dark:text-blue-400">DNS Lookup</Link> to identify network ownership and plan escalation correctly.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
