import type { Metadata } from "next";
import { DnsPropagationChecker } from "@/components/dns-propagation/dns-propagation";
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

const slug = "dns-propagation-checker";
const pageTitle = "DNS Propagation Checker — Verify DNS Changes Worldwide";
const pageDescription =
  "Check DNS propagation from 20+ global locations. See which resolvers have updated A, AAAA, MX, NS, CNAME, and TXT records. Free DNS propagation tool.";

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
  { label: "DNS Propagation Checker" },
];

const faqItems: FaqItem[] = [
  {
    question: "What determines how long DNS propagation takes?",
    answer:
      "The TTL of the record before the change is the primary factor. Resolvers cache the old value for the duration of the original TTL. Some ISPs enforce a minimum cache time regardless of TTL, and DNSSEC validation can add additional delays if signatures are mismatched.",
  },
  {
    question: "Why do some users see the old site hours after I changed the record?",
    answer:
      "Their ISP's recursive resolver may enforce a minimum TTL longer than what you set. Some resolvers also ignore TTL changes within the first few hours if they are configured with aggressive prefetching or negative caching policies.",
  },
  {
    question: "Does DNS propagation happen sequentially across the world?",
    answer:
      "No. Propagation is not an ordered geographic wave. It depends on when each resolver's cache expires and when it next queries the authoritative servers. A resolver in Australia may update before one in the same city as your server.",
  },
  {
    question: "Should I lower TTL before or after making DNS changes?",
    answer:
      "Lower TTL 48-72 hours before the change. This gives the old TTL value time to propagate across caching resolvers. After the change, raise the TTL back to your normal setting once all locations confirm the new record.",
  },
  {
    question: "Can a DNS Propagation Checker speed up propagation?",
    answer:
      "No. The checker is a diagnostic tool. It queries resolvers from multiple locations to show you current state. It does not flush or bypass caches. Only waiting out the TTL or contacting ISP abuse desks can expedite resolution.",
  },
  {
    question: "What is lame delegation and why is it dangerous?",
    answer:
      "Lame delegation occurs when the domain's NS records point to name servers that are not configured to serve the zone. This happens during migrations when the registrar's glue records update before the new name servers are ready. It causes total resolution failure for affected users.",
  },
  {
    question: "Why do MX and NS records sometimes propagate differently than A records?",
    answer:
      "Different resolver types and resolver pools handle MX and NS lookups. Some ISPs run separate infrastructure for mail and web traffic, so the caches on each path clear independently, creating propagation skew.",
  },
  {
    question: "Do CDNs affect DNS propagation?",
    answer:
      "Yes. CDN providers use CNAME flattening, Anycast, and dynamic DNS-based routing that can override or mask your origin TTL. A propagation check on a CDN-backed domain may show inconsistent results across locations due to the CDN's own routing logic.",
  },
  {
    question: "How many global locations should a reliable checker test?",
    answer:
      "At minimum, locations across North America, Europe, and Asia-Pacific. A checker with fewer than 10 nodes may miss propagation gaps in specific geographies. Cross-referencing with the authoritative server's query logs gives the most accurate picture.",
  },
  {
    question: "Can I use a propagation checker before changing nameservers?",
    answer:
      "Yes. Run it against your current NS records to establish a baseline TTL and propagation pattern. After the change, run it again and compare results. This baseline approach helps you distinguish propagation delay from configuration problems.",
  },
  {
    question: "What is the fastest TTL I can safely set?",
    answer:
      "60 seconds is standard for migration windows. Some registrars and DNS providers support 30-second TTLs, but not all resolvers honor values below 60. During normal operations, 300-3600 seconds is typical depending on your tolerance for stale data.",
  },
  {
    question: "Why does a propagation checker show different results for the same record?",
    answer:
      "Geographic variability, ISP-level caching policies, and the resolver's upstream path all influence results. Two resolvers in the same country may show different states if one uses a parent cache that has not refreshed yet.",
  },
];

export default function DnsPropagationPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="DNS Propagation Checker"
            description="Check DNS propagation from multiple global resolvers. See which servers have updated A, AAAA, MX, NS, CNAME, and TXT records."
            breadcrumbs={breadcrumbs}
          >
            <DnsPropagationChecker />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Why Propagation Times Vary Across Regions and ISPs
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              When you update a DNS record, the change does not go live everywhere at the same moment. Every recursive resolver between your authoritative name server and the end user caches the old value until the record&apos;s TTL expires. The problem is compounded by providers that override minimum TTLs. Comcast and some European ISPs routinely ignore TTL settings under 300 seconds, forcing propagation to stretch for hours regardless of your zone configuration. This checker sends queries from geographically distributed resolvers in North America, Europe, Asia, and Oceania, then compares each response against what your authoritative name servers currently serve.
            </p>
            <p>
              Before migrating a domain to a new host, lower the TTL on all records to 60 seconds at least 48 hours ahead. After making the cutover, run this <Link href="/dns-propagation-checker" className="text-blue-600 hover:underline dark:text-blue-400">DNS Propagation Checker</Link> at 30-minute intervals to map when each region converges. Toggle between record types: check your MX records for mail continuity, verify NS records to confirm glue record consistency at the registry level, and inspect TXT records if you are rolling new SPF or DKIM keys. Using a <Link href="/dns-lookup" className="text-blue-600 hover:underline dark:text-blue-400">DNS Lookup</Link> in parallel helps isolate whether the issue is propagation delay versus a configuration error on the authoritative side.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Mapping Record Types to Migration Impact
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Not all DNS records affect the same services during propagation. An A or CNAME record change controls website availability. Visitors see the old site until their resolver updates. An MX record change controls email routing. If MX records propagate unevenly, some senders still deliver to the old mail server while others route to the new one, causing mailbox splits. NS record changes are the most dangerous because they affect the entire zone&apos;s resolution. If glue records at the TLD have not aligned with the new authoritative servers, the domain enters a lame delegation state where nobody can resolve anything.
            </p>
            <p>
              Use this checker to validate each record type independently during a migration. After updating your NS records, verify that all check locations resolve the same authoritative servers. If one region still hits the old name servers, the registry-side glue records may not have updated. The <Link href="/reverse-dns-lookup" className="text-blue-600 hover:underline dark:text-blue-400">Reverse DNS Lookup</Link> tool complements this by letting you confirm PTR records for your new mail server IPs, while the <Link href="/whois-lookup" className="text-blue-600 hover:underline dark:text-blue-400">WHOIS Lookup</Link> verifies that the domain&apos;s registrar contact info is current.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Critical Errors That Prolong DNS Propagation
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              The biggest mistake is making changes without lowering TTLs first. If your A record has a 24-hour TTL, the old IP is cacheable for a full day after the switch, and some ISPs serve it for 48 hours due to their own minimum cache windows. Another common failure is updating only the authoritative zone while forgetting the registrar-side name server delegation. This creates a split where some resolvers follow the old NS path. Configuring incompatible DNSSEC signatures during migration (previously signed zones with new keys) locks out validating resolvers entirely. Always stage changes during low-traffic windows where you can afford a partial outage.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            When to Use DNS Propagation Checker
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Use this tool immediately after changing any DNS record to confirm the update is spreading correctly. Run it during domain migrations, web host switches, or email server cutovers to track real-time convergence across regions. Before opening a support ticket claiming &quot;DNS has not propagated,&quot; verify here, because many supposed propagation delays turn out to be browser caches or local resolver issues. Operations teams also use it to validate that TTL reductions have taken effect before a planned migration window.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Best Practices for DNS Migration Planning
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Plan DNS migrations in phases. Week one: reduce TTLs to 60 seconds. Week two: make the actual record changes during a maintenance window. Week three: monitor propagation completion across all global locations. Week four: restore normal TTLs. Always maintain overlapping DNS configurations during cutover so both old and new records resolve correctly. Document all pre-migration and post-migration record values in case a rollback is needed. Test email flow, website accessibility, and API connectivity from multiple geographic regions before declaring the migration complete.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="DNS Propagation Frequently Asked Questions" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "Search", title: "DNS Lookup", description: "Query all DNS record types for any domain", href: "/dns-lookup" },
              { icon: "Search", title: "Reverse DNS Lookup", description: "Find hostnames from IP addresses via PTR records", href: "/reverse-dns-lookup" },
              { icon: "Search", title: "WHOIS Lookup", description: "Check domain registration and ownership info", href: "/whois-lookup" },
              { icon: "Search", title: "IP Lookup", description: "Trace any IP address location and ISP details", href: "/ip-lookup" },
            ]}
            title="Related Network Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="dns-propagation-checker" />
    </>
  );
}
