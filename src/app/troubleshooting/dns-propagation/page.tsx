import type { Metadata } from "next";
import Link from "next/link";
import {
  TroubleshootingFlow,
  JsonLd,
  Breadcrumbs,
  SocialShare,
  RelatedTools,
} from "@/components/shared";
import { webPageSchema, breadcrumbSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

const slug = "troubleshooting/dns-propagation";
const pageTitle = "DNS Propagation Troubleshooting — Interactive Flow";
const pageDescription =
  "Step through an interactive DNS propagation troubleshooting flow. Diagnose whether DNS changes have propagated, check TTL values, and verify resolution from multiple locations.";

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
  { label: "Troubleshooting", href: `${SITE_URL}/troubleshooting` },
  { label: "DNS Propagation" },
];

const steps = {
  start: {
    id: "start",
    instruction: "Did you recently change DNS records (A, AAAA, CNAME, MX, etc.)?",
    detail: "This flow helps determine if your recent DNS changes have propagated correctly.",
    checkLabel: "I recently changed DNS records",
    yesNext: "howLongAgo",
    noNext: "checkPropagation",
  },
  howLongAgo: {
    id: "howLongAgo",
    instruction: "How long ago did you make the DNS changes?",
    detail: "DNS propagation can take anywhere from a few minutes to 72 hours depending on TTL values.",
    checkLabel: "Less than 1 hour ago",
    yesNext: "checkTtl",
    noNext: "checkMultipleLocations",
  },
  checkTtl: {
    id: "checkTtl",
    instruction: "What is the TTL (Time to Live) value on your DNS records?",
    detail: "TTL controls how long DNS resolvers cache your records. Lower TTL means faster propagation.",
    checkLabel: "TTL is low (60–300 seconds)",
    yesNext: "waitTtlExpiry",
    noNext: "reduceTtl",
  },
  checkMultipleLocations: {
    id: "checkMultipleLocations",
    instruction: "Have you checked your DNS records from multiple geographic locations?",
    detail: "Propagation can complete in some regions faster than others due to resolver caching patterns.",
    checkLabel: "Yes, I checked from multiple locations",
    yesNext: "checkAuthoritative",
    noNext: "checkPropagationTool",
  },
  waitTtlExpiry: {
    id: "waitTtlExpiry",
    instruction: "Have you waited the full TTL duration since making the change?",
    detail: "Even with low TTL, existing cached records must expire before the new values propagate.",
    checkLabel: "Yes, TTL has fully expired",
    yesNext: "checkAuthoritative",
    noNext: "waitTtlExpiryFix",
  },
  reduceTtl: {
    id: "reduceTtl",
    instruction: "Can you reduce the TTL value now to speed up propagation?",
    detail: "Lower the TTL to 60–300 seconds before making changes, then raise it back after propagation is confirmed.",
    checkLabel: "Yes, I can reduce the TTL",
    yesNext: "reduceTtlFix",
    noNext: "waitPropagation",
  },
  checkPropagation: {
    id: "checkPropagation",
    instruction: "Are you checking whether a recent change has propagated, or diagnosing an existing issue?",
    detail: "If you didn't make changes, propagation may not be the root cause.",
    checkLabel: "Checking propagation of recent changes",
    yesNext: "checkTtl",
    noNext: "dnsIssueFix",
  },
  checkAuthoritative: {
    id: "checkAuthoritative",
    instruction: "Does the authoritative DNS server return the correct records?",
    detail: "Query your authoritative nameserver directly using nslookup or dig with the @nameserver option to bypass caching.",
    checkLabel: "Yes, authoritative has correct records",
    yesNext: "contactProvider",
    noNext: "authoritativeCheckFix",
  },
  checkPropagationTool: {
    id: "checkPropagationTool",
    checkLabel: "Check with DNS Propagation Checker tool",
    isYesFix: true,
    yesFix: "Run your domain through the DNS Propagation Checker at Nuvora.dev/dns-propagation-checker. This tool queries resolvers worldwide and shows which locations have picked up your changes and which still show old cached records.",
  },
  waitTtlExpiryFix: {
    id: "waitTtlExpiryFix",
    isYesFix: true,
    checkLabel: "Wait for TTL to expire",
    yesFix: "Wait for the full TTL duration to pass. Most DNS resolvers respect the TTL value and will not query the authoritative server for a new record until the cached entry expires. Check again after the TTL window has passed. Use the DNS Propagation Checker (Nuvora.dev/dns-propagation-checker) to monitor progress.",
  },
  reduceTtlFix: {
    id: "reduceTtlFix",
    isYesFix: true,
    checkLabel: "Reduce TTL and wait",
    yesFix: "Lower the TTL on your DNS records to 60–300 seconds. This tells resolvers to cache the record for a shorter time. Wait for the original TTL to expire, then changes will propagate quickly. After propagation is confirmed, consider raising the TTL back to a higher value (e.g., 3600 seconds) to reduce query load on your authoritative servers.",
  },
  waitPropagation: {
    id: "waitPropagation",
    isYesFix: true,
    checkLabel: "Wait for propagation to complete",
    yesFix: "With your current TTL settings, propagation may take several hours. The maximum propagation time is 72 hours but most changes resolve within 1–4 hours. Check back periodically using the DNS Propagation Checker (Nuvora.dev/dns-propagation-checker). Consider reducing TTL before making future changes.",
  },
  dnsIssueFix: {
    id: "dnsIssueFix",
    isYesFix: true,
    checkLabel: "Check DNS Lookup tool",
    yesFix: "If you are not troubleshooting propagation of a recent change, your issue may be caused by incorrect DNS configuration rather than propagation delay. Use the DNS Lookup tool (Nuvora.dev/dns-lookup) to verify your current DNS records are configured correctly. Check for typos in hostnames, missing records, or incorrect values.",
  },
  authoritativeCheckFix: {
    id: "authoritativeCheckFix",
    isYesFix: true,
    checkLabel: "Check authoritative DNS configuration",
    yesFix: "Your authoritative DNS server is not returning the expected records. Log into your DNS provider's control panel and verify the records are saved correctly. Check for any pending changes, propagation locks, or configuration errors. If the provider dashboard shows the correct records but the authoritative server does not, contact your DNS provider's support team.",
  },
  contactProvider: {
    id: "contactProvider",
    isYesFix: true,
    checkLabel: "Contact DNS provider",
    yesFix: "If the authoritative server has the correct records but resolvers worldwide still show old data after the TTL has expired, there may be a problem with your DNS provider's infrastructure. Contact their support team with the specific domain names and record types. Mention the TTL values and how long you have been waiting. Some providers may have secondary propagation delays between their hidden primary and public-facing nameservers.",
  },
};

export default function DnsPropagationTroubleshootingPage() {
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
                DNS Propagation Troubleshooting
              </h1>
              <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400">
                Follow this interactive flow to diagnose whether your DNS changes have propagated and determine the right next steps.
              </p>
            </div>
            <SocialShare url={`${SITE_URL}/${slug}`} title={pageTitle} />
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="sr-only">Troubleshooting Flow</h2>
          <TroubleshootingFlow title="DNS Propagation Troubleshooting" steps={steps} startId="start" />
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            How to Use This Troubleshooting Flow
          </h2>
          <div className="mt-6 space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
            <p>
              This interactive flow asks a series of yes/no questions about your DNS changes and current setup. Answer each question honestly to receive a tailored recommendation.
            </p>
            <p>
              Select <strong>Yes — {steps.start.checkLabel}</strong> if the description matches your situation, or <strong>No</strong> to proceed down a different path. Each step narrows down the issue until a specific resolution is provided.
            </p>
            <p>
              Use the <strong>Restart</strong> button at any time to begin a new session. For detailed DNS analysis, use the <Link href="/dns-propagation-checker" className="text-blue-600 hover:underline dark:text-blue-400">DNS Propagation Checker</Link> or <Link href="/dns-lookup" className="text-blue-600 hover:underline dark:text-blue-400">DNS Lookup</Link> tools alongside this guide.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "🔍", title: "DNS Propagation Checker", description: "Verify DNS changes from locations worldwide", href: "/dns-propagation-checker" },
              { icon: "🔍", title: "DNS Lookup", description: "Query all DNS record types for any domain", href: "/dns-lookup" },
              { icon: "🔍", title: "DNS Record Types", description: "Reference for all DNS record types and their uses", href: "/dns-record-types" },
              { icon: "🔍", title: "WHOIS Lookup", description: "Check domain registration and nameserver details", href: "/whois-lookup" },
            ]}
            title="Related DNS Tools"
          />
        </div>
      </section>
    </>
  );
}
