import type { Metadata } from "next";
import { ReverseDnsLookup } from "@/components/reverse-dns/reverse-dns";
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

const slug = "reverse-dns-lookup";
const pageTitle = "Reverse DNS Lookup - Check PTR Records for Email & Servers";
const pageDescription =
  "Verify PTR records for any IP address. Check rDNS configuration to ensure email deliverability and server authentication. Free reverse DNS lookup tool.";

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
  { label: "Network & Internet", href: `${SITE_URL}/category/network-internet` },
  { label: "Reverse DNS Lookup" },
];

const faqItems: FaqItem[] = [
  {
    question: "What exactly does a reverse DNS lookup check?",
    answer:
      "It queries the DNS for a PTR record under the in-addr.arpa (IPv4) or ip6.arpa (IPv6) namespace, resolving an IP address back to a hostname. The response comes from the authoritative DNS server for that IP block's reverse zone, typically managed by the ISP.",
  },
  {
    question: "Why does rDNS matter for email delivery?",
    answer:
      "During SMTP negotiation, the receiving mail server looks up the connecting IP's PTR record and matches it against the EHLO hostname. A mismatch adds spam score penalties or triggers rejection under strict DMARC or MTA-STS policies, even if your SPF and DKIM pass validation.",
  },
  {
    question: "Can I set PTR records myself or do I need my ISP?",
    answer:
      "Unless you own the IP block and manage your own in-addr.arpa delegation on your name servers, you must request PTR changes through your ISP or hosting provider. Most providers offer a control panel option; some require a support ticket.",
  },
  {
    question: "What is forward-confirmed reverse DNS (FCrDNS)?",
    answer:
      "FCrDNS is the bidirectional verification where a PTR record resolves the IP to a hostname, and a forward DNS query for that hostname returns the original IP. This two-way validation is what mail gateways use to confirm legitimacy.",
  },
  {
    question: "How long does a PTR record change take to propagate?",
    answer:
      "PTR records propagate through the same DNS hierarchy as forward records. Changes take anywhere from minutes to 48 hours depending on the TTL of the reverse zone and the caching policies of upstream resolvers.",
  },
  {
    question: "Why does my reverse DNS lookup return NXDOMAIN?",
    answer:
      "NXDOMAIN means no PTR record exists for the IP. The reverse zone may lack a PTR entry, the delegation chain from the root servers to your reverse zone may be broken, or the zone may have expired without your ISP renewing it.",
  },
  {
    question: "Can one IP address have multiple PTR records?",
    answer:
      "Technically yes, but RFC 1033 recommends a single canonical PTR per IP. Multiple PTR records cause unpredictable resolver behavior: different queries may return different hostnames, and mail filters treat this as suspicious.",
  },
  {
    question: "Do IPv6 addresses need reverse DNS too?",
    answer:
      "Yes. IPv6 uses the ip6.arpa domain with nibble-format addressing for PTR records. Many hosting providers omit IPv6 PTR by default, which causes deliverability problems from IPv6-native mail servers.",
  },
  {
    question: "How does rDNS differ from a standard DNS lookup?",
    answer:
      "A standard lookup queries forward zones (e.g., .com, .org) for A, AAAA, or MX records. rDNS queries the special-purpose in-addr.arpa domain using PTR record type. They use different zone files and different authoritative servers.",
  },
  {
    question: "Can I test rDNS from the command line?",
    answer:
      "Yes. On Linux, use dig -x IP or nslookup IP. On Windows, nslookup IP works as well. The web-based tool is useful when you lack shell access or need testing from an external network perspective.",
  },
  {
    question: "Does rDNS affect website performance?",
    answer:
      "Indirectly. Web servers like Apache and Nginx can perform rDNS on client connections for logging. A slow reverse DNS response adds 5-10 seconds of latency per request. Most production deployments disable rDNS logging or use a log resolver.",
  },
  {
    question: "What is the difference between PTR and rDNS?",
    answer:
      "They are closely related but not identical. rDNS is the process of resolving an IP to a hostname, while PTR is the specific DNS record type stored in the reverse zone that makes rDNS possible.",
  },
];

export default function ReverseDnsPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout>
          <ToolHero
            title="Reverse DNS Lookup"
            description="Verify PTR records for any IP address. Check rDNS configuration to ensure email deliverability and server authentication."
            breadcrumbs={breadcrumbs}
          >
            <ReverseDnsLookup />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            The Role of PTR Records in Email Deliverability
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Every outgoing mail server should have a matching PTR record that resolves its IP to the same hostname it uses in its EHLO or HELO greeting. Without proper reverse DNS, outbound emails hit spam folders or get rejected outright at the SMTP conversation stage. Major providers like Gmail and Outlook enforce rDNS checks during their inbound gateways. If the IP&apos;s hostname does not match the sending domain&apos;s MX infrastructure, expect a 5xx rejection.
            </p>
            <p>
              This tool queries the DNS system for PTR records at the .arpa namespace, the same mechanism mail exchangers use during message acceptance. Before configuring a new mail server or migrating an existing one, run a <Link href="/reverse-dns-lookup" className="text-blue-600 hover:underline dark:text-blue-400">Reverse DNS Lookup</Link> from the server itself to confirm the PTR value matches your forward DNS. For broader analysis, pair this with a <Link href="/dns-lookup" className="text-blue-600 hover:underline dark:text-blue-400">DNS Lookup</Link> to verify your A, MX, and TXT records are consistent. A mismatch between forward and reverse DNS is one of the most common configuration errors flagged during email security audits.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Troubleshooting PTR Record Misconfiguration
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              A poorly configured PTR record creates problems that are hard to diagnose because they appear as intermittent or provider-specific failures. If you notice that some recipients receive your email while others silently drop it, the culprit is almost always rDNS. The test is simple: take your mail server&apos;s public IP, run it through this <Link href="/reverse-dns-lookup" className="text-blue-600 hover:underline dark:text-blue-400">Reverse DNS Lookup</Link>, and compare the returned hostname to the server&apos;s FQDN. They must match. If they do not, contact your ISP&apos;s NOC to update the PTR record for your IP block.
            </p>
            <p>
              Reverse DNS failures also surface in web server access logs as prolonged delays. Many HTTP daemons perform rDNS lookups on connecting clients, and a missing or slow-to-respond PTR record adds several seconds of latency to each request. Use <Link href="/dns-propagation-checker" className="text-blue-600 hover:underline dark:text-blue-400">DNS Propagation Checker</Link> to confirm your PTR records have propagated to all authoritative name servers. When combined with a <Link href="/whois-lookup" className="text-blue-600 hover:underline dark:text-blue-400">WHOIS Lookup</Link> to confirm your IP ownership, you will have a complete picture of your server&apos;s DNS posture.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Common rDNS Mistakes That Kill Deliverability
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              The most frequent error is leaving the ISP-assigned generic PTR in place, something like pool-123-45-67-89.example.net. Receiving mail servers compare this against your EHLO hostname, and a mismatch triggers spam scoring. Another mistake is forgetting that cross-validation is required: the PTR must point to a hostname with a forward A record returning the original IP (forward-confirmed rDNS). Broken delegation of the in-addr.arpa zone for your IP range also causes silent timeouts. Finally, changing mail server IPs without updating the rDNS can blacklist your entire domain for weeks.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            When to Use Reverse DNS Lookup
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Use this tool before deploying or migrating a mail server to confirm the PTR matches the sending hostname. Run it when email deliverability drops unexpectedly, or after your ISP reassigns your IP block. Security teams rely on it during incident response to resolve suspicious IPs in mail logs. Network engineers also use rDNS when troubleshooting session timeouts in syslog aggregation or SSH connections where the server resolves the client IP before establishing the session.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Reverse DNS Lookup Frequently Asked Questions" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "🔍", title: "DNS Lookup", description: "Query all DNS record types for any domain", href: "/dns-lookup" },
              { icon: "🔍", title: "DNS Propagation Checker", description: "Verify DNS changes have propagated worldwide", href: "/dns-propagation-checker" },
              { icon: "🔍", title: "WHOIS Lookup", description: "Check domain registration and ownership info", href: "/whois-lookup" },
              { icon: "🔍", title: "IP Lookup", description: "Trace any IP address location and ISP details", href: "/ip-lookup" },
            ]}
            title="Related Network Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="reverse-dns-lookup" />
    </>
  );
}
