import type { Metadata } from "next";
import { PingTest } from "@/components/ping-test/ping-test";
import {
  ToolLayout,
  ToolHero,
  FaqSection,
  RelatedTools,
  RelatedContent,
  JsonLd,
} from "@/components/shared";
import {
  faqSchema,
  webPageSchema,
  breadcrumbSchema,
  softwareAppSchema,
  type FaqItem,
} from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import Link from "next/link";

const slug = "ping-test";
const pageTitle = "Ping Test — Measure Network Latency & Packet Loss";
const pageDescription =
  "Test network latency and packet loss to any server. Get min, average, and max ping times with detailed network diagnostics. Free online ping test tool.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: `${SITE_URL}/${slug}`,
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
  },
  alternates: {
    canonical: `${SITE_URL}/${slug}`,
  },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Network & Internet", href: `${SITE_URL}/category/network-internet` },
  { label: "Ping Test" },
];

const faqItems: FaqItem[] = [
  {
    question: "What is a good ping time for gaming?",
    answer:
      "Below 30 ms is excellent, 30-60 ms is good, 60-100 ms is playable, 100-150 ms is noticeable lag, and above 150 ms is problematic for fast-paced competitive games. Real-time strategy and turn-based games tolerate higher latency.",
  },
  {
    question: "Why does my ping vary between tests even when idle?",
    answer:
      "Network conditions fluctuate constantly due to background traffic on your local network, your ISP's peering congestion, and the route the packet takes through intermediary routers. Jitter (variation in delay) is a normal but measurable property.",
  },
  {
    question: "What causes packet loss during a ping test?",
    answer:
      "Packet loss results from congestion on the network path, faulty hardware (bad cables, failing router ports), CPU saturation on intermediate routers, or firewall rules that drop ICMP or probe traffic beyond certain rates.",
  },
  {
    question: "Does ping measure upload or download speed?",
    answer:
      "Neither. Ping measures round-trip time for a small packet (64 bytes typically). Bandwidth tests measure throughput for large data transfers. A connection with high bandwidth can still have high latency, and low latency does not imply fast throughput.",
  },
  {
    question: "Why does ping to my home IP from work differ from ping at home?",
    answer:
      "The reverse path differs. Your home network has faster internal routes when you are on-site. From an external location, traffic traverses your ISP's upstream networks and peering points, adding latency proportional to geographic and routing distance.",
  },
  {
    question: "Can Wi-Fi affect ping times significantly?",
    answer:
      "Yes. Wi-Fi adds 2-10 ms on average due to radio transmission overhead, but interference, channel congestion, and distance from the access point can spike latency to 100+ ms. Wired Ethernet connections provide more consistent sub-1 ms ping times.",
  },
  {
    question: "What is jitter and why does it matter?",
    answer:
      "Jitter is the variance in ping times between successive probes. High jitter causes uneven voice and video quality in real-time communications. VoIP and video conferencing require jitter under 30 ms for acceptable call quality.",
  },
  {
    question: "How many packets should a reliable ping test send?",
    answer:
      "Five to ten packets provide a statistically meaningful sample. Fewer than three packets can misrepresent the true latency. More than twenty packets may trigger rate limiting on the target server, causing false packet loss readings.",
  },
  {
    question: "Why does ping to a domain show different results than ping to its IP?",
    answer:
      "Pinging a domain triggers a DNS lookup first, which adds miliseconds. More importantly, CDN-backed domains route to different IPs based on the DNS resolver's geographic location, so the ping target itself may differ.",
  },
  {
    question: "What is TCP ping and how is it different from ICMP ping?",
    answer:
      "ICMP ping (what the command-line ping utility uses) sends ICMP echo requests. TCP ping opens a TCP connection to a specific port, measuring the handshake time. This tool uses TCP ping because browsers cannot send raw ICMP packets.",
  },
  {
    question: "Does a high ping always mean a problem with the target server?",
    answer:
      "No. The problem may be on your end (local network congestion, ISP throttling, Wi-Fi interference) or on an intermediate hop. Running a traceroute alongside the ping test identifies which hop introduces the latency spike.",
  },
  {
    question: "What latency threshold triggers VoIP quality degradation?",
    answer:
      "One-way latency above 150 ms noticeablely degrades VoIP call quality. The ITU-T G.114 standard recommends a maximum one-way delay of 150 ms for voice communication. Round-trip ping above 300 ms indicates problematic voice quality.",
  },
];

export default function PingTestPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="Ping Test"
            description="Test network latency and packet loss to any server. Get min, average, and max ping times from our servers."
            breadcrumbs={breadcrumbs}
          >
            <PingTest />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Interpreting Ping Results for Troubleshooting
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              The ping test sends a series of TCP probes to the target and measures the round-trip time for each. The output includes the minimum, average, and maximum latency, plus the packet loss percentage. If you see 0% packet loss and sub-100 ms average latency to a server that your users report as slow, the issue is likely at the application layer or bandwidth constraint rather than network reachability. If you see 50%+ packet loss, the path has a congested or failing router that needs investigation.
            </p>
            <p>
              Use this <Link href="/ping-test" className="text-blue-600 hover:underline dark:text-blue-400">Ping Test</Link> to establish a latency baseline to critical infrastructure: your web server, database host, API gateway, and VoIP provider. Run tests at different times of day and document jitter fluctuations. Compare TCP ping results against the <Link href="/website-status-checker" className="text-blue-600 hover:underline dark:text-blue-400">Website Status Checker</Link> response times to separate network latency from application processing time. Follow up with a <Link href="/port-checker" className="text-blue-600 hover:underline dark:text-blue-400">Port Checker</Link> to confirm the target service is listening on the expected port.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            TCP Ping Versus ICMP: What This Tool Measures
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Traditional command-line ping uses ICMP Echo requests. This browser-based tool cannot send ICMP packets directly, so it uses TCP pings to a configurable port (default 80 or 443). TCP ping measures the time to complete a three-way handshake (SYN → SYN-ACK → ACK). This is arguably more relevant for web application troubleshooting because it measures the same connection type that HTTP traffic uses. ICMP packets are often deprioritized by network gear, making TCP ping results more representative of actual user experience.
            </p>
            <p>
              When a <Link href="/ping-test" className="text-blue-600 hover:underline dark:text-blue-400">Ping Test</Link> succeeds but the <Link href="/website-status-checker" className="text-blue-600 hover:underline dark:text-blue-400">Website Status Checker</Link> returns a 5xx error, the network path is healthy and the problem is in the application stack. When both fail, the issue is network-level or firewall-related. Run a <Link href="/dns-lookup" className="text-blue-600 hover:underline dark:text-blue-400">DNS Lookup</Link> alongside to rule out resolution failures. This layered diagnostic approach narrows the root cause faster than examining any single metric.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Common Mistakes in Latency Testing
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Testing ping from a client that is itself experiencing local network issues skews the results. Always test from a stable network when establishing baselines. Running a single ping instead of a series misses jitter information. Another mistake is testing only during business hours, which misses off-peak congestion patterns. Using an online ping tool from the same geographic region as the target gives artificially low latency; test from the perspective of your actual user base. Some administrators also confuse high latency with packet loss — high latency without packet loss often indicates geographic distance or queuing delay.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            When to Run a Ping Test
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Run a ping test immediately when users report connection issues, slow load times, or VoIP quality problems. Use it during server migrations to confirm the new IP is reachable from external networks. Test latency before deploying latency-sensitive applications (real-time collaboration, gaming servers, financial trading interfaces). Also run periodic ping tests as part of network performance monitoring to track baseline drift over weeks and months.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Ping Test Frequently Asked Questions" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "Search", title: "Port Checker", description: "Test if a port is open or closed from outside the network", href: "/port-checker" },
              { icon: "Search", title: "Website Status Checker", description: "Check if a website is online and measure response time", href: "/website-status-checker" },
              { icon: "Search", title: "DNS Lookup", description: "Query all DNS record types for any domain", href: "/dns-lookup" },
              { icon: "Search", title: "IP Lookup", description: "Trace any IP address location and ISP details", href: "/ip-lookup" },
            ]}
            title="Related Network Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="ping-test" />
    </>
  );
}
