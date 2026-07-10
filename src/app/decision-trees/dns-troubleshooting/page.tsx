import type { Metadata } from "next";
import { DecisionTree, JsonLd, Breadcrumbs, SocialShare, RelatedTools } from "@/components/shared";
import { webPageSchema, breadcrumbSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

const slug = "decision-trees/dns-troubleshooting";
const pageTitle = "DNS Troubleshooting Decision Tree — Diagnose DNS Issues";
const pageDescription =
  "A step by step DNS troubleshooting guide. Answer yes/no questions to diagnose DNS resolution failures, propagation delays, and configuration errors.";

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
  { label: "Decision Trees", href: `${SITE_URL}/decision-trees` },
  { label: "DNS Troubleshooting" },
];

const nodes: Record<string, { id: string; question?: string; options?: { label: string; next: string }[]; answer?: string; isFinal?: boolean }> = {
  start: {
    id: "start",
    question: "Can you access websites using a raw IP address (e.g., http://8.8.8.8)?",
    options: [
      { label: "Yes, I can access by IP", next: "canAccessDomain" },
      { label: "No, I cannot access by IP", next: "nslookupCheck" },
    ],
  },
  canAccessDomain: {
    id: "canAccessDomain",
    question: "Can you access websites by their domain name (e.g., https://example.com)?",
    options: [
      { label: "Yes, domains work fine", next: "intermittentIssues" },
      { label: "No, domains do not resolve", next: "flushCacheCheck" },
    ],
  },
  intermittentIssues: {
    id: "intermittentIssues",
    question: "Do you experience intermittent DNS failures — some sites load while others don't?",
    options: [
      { label: "Yes, intermittent failures", next: "finalFlushCache" },
      { label: "No, everything works", next: "finalNoIssue" },
    ],
  },
  flushCacheCheck: {
    id: "flushCacheCheck",
    question: "Have you tried flushing your DNS cache?",
    options: [
      { label: "Yes, I flushed my cache", next: "finalDnsConfigCheck" },
      { label: "No, I have not", next: "finalFlushCache" },
    ],
  },
  nslookupCheck: {
    id: "nslookupCheck",
    question: "Does nslookup or dig return DNS records when you query the domain?",
    options: [
      { label: "Yes, DNS records are returned", next: "finalFirewallCheck" },
      { label: "No, DNS records are not returned", next: "finalDnsServerCheck" },
    ],
  },
  finalFlushCache: {
    id: "finalFlushCache",
    isFinal: true,
    answer:
      "Flush your DNS cache. On Windows run 'ipconfig /flushdns', on macOS run 'sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder', on Linux run 'sudo systemd-resolve --flush-caches'. After flushing, restart your browser and try accessing the site again. Use the DNS Lookup tool (Nuvora.dev/dns-lookup) to verify resolution after flushing.",
  },
  finalDnsConfigCheck: {
    id: "finalDnsConfigCheck",
    isFinal: true,
    answer:
      "Check your network DNS server configuration. Ensure your DNS server addresses are correct in your network settings. Try switching to a public DNS resolver like Google (8.8.8.8, 8.8.4.4) or Cloudflare (1.1.1.1). Use the DNS Propagation Checker (Nuvora.dev/dns-propagation-checker) to verify global resolution.",
  },
  finalFirewallCheck: {
    id: "finalFirewallCheck",
    isFinal: true,
    answer:
      "Your firewall or security software may be blocking DNS traffic. Check that UDP port 53 is not blocked by your firewall. Temporarily disable any third-party security software to test. Also verify that your router is not intercepting DNS queries (DNS hijacking). Use a Reverse DNS Lookup (Nuvora.dev/reverse-dns-lookup) to verify PTR records if email delivery is affected.",
  },
  finalDnsServerCheck: {
    id: "finalDnsServerCheck",
    isFinal: true,
    answer:
      "Your DNS server appears to be unreachable or not responding. Try switching to a public DNS resolver such as Google DNS (8.8.8.8, 8.8.4.4), Cloudflare (1.1.1.1), or Quad9 (9.9.9.9). If the problem persists, contact your ISP — there may be a regional outage. Use DNS Lookup (Nuvora.dev/dns-lookup) to test multiple resolvers.",
  },
  finalNoIssue: {
    id: "finalNoIssue",
    isFinal: true,
    answer:
      "No DNS issues detected based on your answers. If you are still experiencing problems, consider using our DNS Lookup tool (Nuvora.dev/dns-lookup) for a deeper inspection, or check DNS Propagation (Nuvora.dev/dns-propagation-checker) if you recently made DNS changes.",
  },
};

export default function DnsTroubleshootingPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <section className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <Breadcrumbs items={breadcrumbs} />
          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                DNS Troubleshooting Decision Tree
              </h1>
              <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400">
                Follow this step-by-step guide to diagnose and resolve common DNS issues. Answer each question based on your symptoms to find the right fix.
              </p>
            </div>
            <SocialShare url={`${SITE_URL}/${slug}`} title={pageTitle} />
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="sr-only">Decision Tree</h2>
          <DecisionTree title="DNS Troubleshooting" nodes={nodes} startId="start" />
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            How to Use This Decision Tree
          </h2>
          <div className="mt-6 space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
            <p>
              This interactive decision tree walks you through a structured DNS troubleshooting process. Start at the first question and select the option that best matches your situation. Each answer leads to a follow-up question or a specific recommendation.
            </p>
            <p>
              Use the <strong>Back</strong> button to revisit previous questions and the <strong>Restart</strong> button to start over. Recommendations include links to relevant tools for further investigation.
            </p>
            <p>
              Common DNS issues covered include: resolution failures, cache corruption, firewall interference, and unreachable DNS servers.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "🔍", title: "DNS Lookup", description: "Query all DNS record types for any domain", href: "/dns-lookup" },
              { icon: "🔍", title: "DNS Propagation Checker", description: "Verify DNS changes worldwide", href: "/dns-propagation-checker" },
              { icon: "🔍", title: "Reverse DNS Lookup", description: "Find hostnames from IP addresses", href: "/reverse-dns-lookup" },
              { icon: "🔍", title: "WHOIS Lookup", description: "Check domain registration details", href: "/whois-lookup" },
            ]}
            title="Related DNS Tools"
          />
        </div>
      </section>
    </>
  );
}
