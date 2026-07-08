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

const slug = "compare/dns-providers";
const pageTitle = "DNS Provider Comparison — Google vs Cloudflare vs Quad9 vs OpenDNS";
const pageDescription =
  "Compare the top public DNS providers side by side: Google Public DNS (8.8.8.8), Cloudflare (1.1.1.1), Quad9 (9.9.9.9), and OpenDNS (208.67.222.222). Evaluate privacy, speed, security, and features to choose the best DNS for your needs.";

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
  { label: "DNS Providers" },
];

export default function DnsProvidersPage() {
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
                DNS Provider Comparison
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
            Feature Comparison
          </h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            The table below compares the four most popular public DNS providers across key features that matter for privacy, performance, and security.
          </p>
          <div className="mt-8">
            <ComparisonMatrix
              title="DNS Provider Features"
              headers={["Cloudflare (1.1.1.1)", "Google (8.8.8.8)", "Quad9 (9.9.9.9)", "OpenDNS (208.67.222.222)"]}
              rows={[
                { feature: "IPv6 Support", values: ["Yes", "Yes", "Yes", "Partial"] },
                { feature: "DNSSEC", values: ["Yes", "Yes", "Yes", "Yes"] },
                { feature: "Malware Blocking", values: ["Yes", "No", "Yes", "Yes"] },
                { feature: "Analytics / Logging", values: ["No", "Yes", "No", "Yes"] },
                { feature: "Query Logging", values: ["No", "Yes", "No", "Yes"] },
                { feature: "ECS Support", values: ["Yes", "Yes", "No", "No"] },
                { feature: "Anycast Network", values: ["Yes", "Yes", "Yes", "Yes"] },
                { feature: "Average Latency (ms)", values: ["14", "18", "22", "25"] },
                { feature: "Global Locations", values: ["330+", "200+", "180+", "50+"] },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            Pricing Comparison
          </h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            All four providers offer free public DNS resolvers. Paid tiers add advanced filtering, reporting, and integration capabilities.
          </p>
          <div className="mt-8">
            <ComparisonMatrix
              title="DNS Pricing Tiers"
              headers={["Cloudflare", "Google", "Quad9", "OpenDNS"]}
              rows={[
                { feature: "Free Plan", values: ["Yes", "Yes", "Yes", "Yes"] },
                { feature: "Paid Plans", values: ["Cloudflare Gateway ($7/user/mo)", "Google Cloud DNS ($0.20/M queries)", "N/A", "Cisco Umbrella ($1.95/user/mo)"] },
                { feature: "Threat Intelligence", values: ["Gateway add-on", "No", "Built-in", "Umbrella packages"] },
                { feature: "Custom Filtering", values: ["Yes (Gateway)", "No", "No", "Yes"] },
                { feature: "SLA Guarantee", values: ["100%", "100%", "No SLA", "99.9%"] },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            Privacy &amp; Logging Policies
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Cloudflare and Quad9 are the strongest privacy options. Cloudflare publicly committed to never writing query logs to disk and purges all logs within 24 hours. Quad9 has a similar policy and does not sell or share query data. Google Public DNS logs query IP addresses for 24-48 hours for diagnostic purposes. OpenDNS (Cisco Umbrella) retains logs based on subscription level and uses query data for its threat intelligence platform.
            </p>
            <p>
              If privacy is your top concern, Cloudflare (1.1.1.1) or Quad9 (9.9.9.9) are the clear recommendations. If you need EDNS Client Subnet (ECS) to get geographically optimal responses for CDN-hosted content, Cloudflare and Google are your only choices among these four.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            Verdict &amp; Recommendations
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Best for Privacy</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                <strong>Cloudflare (1.1.1.1)</strong> — No query logging, fastest average latency, 330+ global locations. Also supports ECS for CDN performance. Use with <Link href="/dns-lookup" className="text-blue-600 hover:underline dark:text-blue-400">DNS Lookup</Link> to verify resolution.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Best for Security</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                <strong>Quad9 (9.9.9.9)</strong> — Blocks known malicious domains using 19 threat intelligence feeds. No ECS means slightly slower CDN responses but stronger privacy. Pair with <Link href="/dns-propagation-checker" className="text-blue-600 hover:underline dark:text-blue-400">DNS Propagation Checker</Link> to monitor global resolution.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Best for Families</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                <strong>OpenDNS (208.67.222.222)</strong> — Custom content filtering, category-based blocking, and per-user policies via Cisco Umbrella. Ideal for parental controls and enterprise content management.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Best for Reliability</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                <strong>Google (8.8.8.8)</strong> — Proven uptime record since 2009, massive global anycast network, and full ECS support. Best for users who prioritize consistent performance and developer tooling. Validate setup with <Link href="/dns-lookup" className="text-blue-600 hover:underline dark:text-blue-400">DNS Lookup</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            How to Change Your DNS Provider
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Changing DNS providers is straightforward on all major operating systems and routers. On Windows, go to Network Settings &rarr; Change Adapter Options &rarr; IPv4 Properties and enter the preferred and alternate DNS addresses. On macOS, open System Settings &rarr; Network &rarr; Advanced &rarr; DNS. For routers, look for DNS settings in the WAN or Internet configuration page.
            </p>
            <p>
              After switching, use the <Link href="/dns-propagation-checker" className="text-blue-600 hover:underline dark:text-blue-400">DNS Propagation Checker</Link> to verify your new DNS is resolving correctly worldwide. The <Link href="/dns-lookup" className="text-blue-600 hover:underline dark:text-blue-400">DNS Lookup</Link> tool lets you query specific record types to confirm your domain is resolving as expected.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
