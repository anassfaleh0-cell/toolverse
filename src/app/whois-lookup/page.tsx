import type { Metadata } from "next";
import { WhoisLookup } from "@/components/whois/whois-lookup";
import {
  ToolLayout,
  ToolHero,
  FaqSection,
  RelatedTools,
  RelatedContent,
  JsonLd,
  FeaturedSnippet,
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

const slug = "whois-lookup";
const pageTitle = "WHOIS Lookup — Check Domain Registration & Ownership Info";
const pageDescription =
  "Look up WHOIS records for any domain. See registrar, registration dates, name servers, and contact info. Verify domain ownership and detect expiry risks.";

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
  { label: "WHOIS Lookup" },
];

const faqItems: FaqItem[] = [
  {
    question: "What is the difference between a registrar and a registry?",
    answer:
      "A registry (Verisign for .com, PIR for .org) maintains the authoritative database of all domains under a TLD and operates the name servers answering WHOIS or RDAP queries. A registrar (GoDaddy, Namecheap, Cloudflare) is an ICANN-accredited intermediary that sells registrations to the public and submits data to the registry.",
  },
  {
    question: "Why do some WHOIS results show redacted for privacy?",
    answer:
      "Under GDPR and similar laws, registrars must redact personal data of natural persons from public WHOIS output: name, street address, phone, and email. Only state or province, country, and organization name (if applicable) remain visible. Corporate registrations may show full details unless privacy services are also applied.",
  },
  {
    question: "Can I find the real owner of a privacy-protected domain?",
    answer:
      "Generally no. The registrar replaces the registrant's contact with their privacy service details. However, the registrar stores the actual data and must disclose it to law enforcement with a valid subpoena. ICANN also requires registrars to respond to legitimate abuse reports within a reasonable timeframe through anonymized forwarding.",
  },
  {
    question: "How quickly does WHOIS update after a domain transfer?",
    answer:
      "WHOIS data updates immediately at the registry level when a transfer completes. However, RDAP and legacy WHOIS caching can cause stale data to persist for up to 48 hours. The registrar and name server fields update first; the creation date always reflects original registration, not the transfer date.",
  },
  {
    question: "What does clientTransferProhibited status mean?",
    answer:
      "Also called registrar lock, this status prevents unauthorized domain transfers. It is a security feature enabled by default on most registrars. You must disable it through your registrar's control panel before initiating a transfer. It is set by the registrar and can be toggled at any time by the domain owner.",
  },
  {
    question: "How do I detect fake WHOIS registration data?",
    answer:
      "Cross-reference the registrant organization against business records and DNS history. Check if name servers point to a legitimate hosting provider. Compare the registrant email domain against known disposable email providers. Look for mismatches between the registrant country and name server geolocation. Multiple flags warrant deeper investigation.",
  },
  {
    question: "What is RDAP and how is it different from legacy WHOIS?",
    answer:
      "RDAP (Registration Data Access Protocol) is the IETF-standardized WHOIS replacement (RFC 7480-7484). It returns structured JSON instead of free-text, supports internationalized domain names natively, and provides standardized error codes. ICANN now mandates RDAP for all gTLDs, though many ccTLDs still rely on legacy WHOIS.",
  },
  {
    question: "Can a domain's WHOIS record expire before the domain does?",
    answer:
      "No. The WHOIS record exists as long as the domain is registered. The expiration date shown is the domain registration expiration. After expiry, the domain enters a grace period (30-45 days for .com), during which WHOIS may show REDEMPTION PERIOD or PENDING DELETE status codes.",
  },
  {
    question: "Why do some TLDs show less WHOIS data than others?",
    answer:
      "Each TLD registry operates under independent policies. ccTLDs like .de and .uk have their own data requirements, often showing less than gTLDs. Newer gTLDs (.xyz, .online) may differ from legacy gTLDs. Some TLDs like .io have minimal requirements compared to ICANN-regulated extensions.",
  },
  {
    question: "What is the difference between WHOIS and DNS information?",
    answer:
      "WHOIS describes domain registration metadata: ownership, dates, and registrar. DNS describes how the domain resolves: A, AAAA, MX, NS, and TXT records. A domain can have valid DNS resolution but expired or incorrect WHOIS, and vice versa. They serve entirely different diagnostic purposes and should be used together.",
  },
  {
    question: "How do I correct inaccurate WHOIS data for my domain?",
    answer:
      "Correct it through your registrar's domain management panel, which pushes updates to the registry within minutes to hours. If another domain has incorrect WHOIS infringing on your rights, file an ICANN Whois Inaccuracy Complaint or pursue a UDRP proceeding for trademark violations.",
  },
  {
    question: "What is domain age and why does it matter?",
    answer:
      "Domain age is time since the original creation date in WHOIS records. Older domains often rank better in search because they are perceived as more established. However, age is a minor SEO factor compared to content quality, backlinks, and user experience. New domains can rank well with strong content and proper technical SEO.",
  },
];

export default function WhoisLookupPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="WHOIS Lookup"
            description="Look up WHOIS records for any domain. See registrar, registration dates, name servers, and contact info. Verify domain ownership and detect expiry risks."
            breadcrumbs={breadcrumbs}
          >
            <WhoisLookup />
          </ToolHero>
        </ToolLayout>
      </section>

      <FeaturedSnippet
        toolName="WHOIS Lookup"
        answer="WHOIS lookup retrieves domain registration metadata including registrar, creation and expiration dates, name server delegation, and registrant contact information. Under GDPR, personal data for natural persons is redacted, but organization names, registrar details, and registration dates remain public. WHOIS is essential for verifying domain ownership, detecting expiry risks, investigating suspicious domains, and brand protection monitoring."
        keyTakeaways={[
          "WHOIS reveals registrar, registration dates, name servers, and domain status codes",
          "GDPR mandates redaction of personal data — organization and registrar info remain visible",
          "Cross-reference WHOIS with DNS to detect compromised domains or typo-squatting",
          "RDAP is the modern JSON-based replacement for the legacy WHOIS protocol",
        ]}
      />

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Decoding WHOIS Records for Domain Intelligence
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Every domain registration generates a WHOIS record stored at the registry operator: Verisign for .com and .net, Public Interest Registry for .org, and dozens of other operators for TLDs like .io, .co, and country codes. When you run a <Link href="/whois-lookup" className="text-blue-600 hover:underline dark:text-blue-400">WHOIS Lookup</Link>, you are querying these registries through RDAP (Registration Data Access Protocol), the modern JSON-based replacement for the legacy WHOIS protocol. The raw response contains creation, update, and expiration dates, the sponsoring registrar, name server delegation, and registrant contact information or its redacted equivalent.
            </p>
            <p>
              The real value is in pattern analysis. A domain registered six years ago with consistent name server history and a verified registrant organization signals legitimacy. A domain registered three weeks ago with WHOIS privacy enabled, a throwaway registrar, and name servers pointing to a suspicious ASN warrants immediate investigation. Comparing registration dates against certificate transparency logs and DNS history builds a complete ownership timeline invaluable for threat hunting and brand protection. Combining WHOIS data with a <Link href="/dns-lookup" className="text-blue-600 hover:underline dark:text-blue-400">DNS Lookup</Link> on the same domain reveals whether registration metadata aligns with actual resolution patterns, and mismatches often indicate compromised domains or typo-squatting.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            WHOIS Privacy and GDPR: What You Can and Cannot See
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              The WHOIS data landscape changed dramatically with GDPR enforcement in May 2018. Before GDPR, any WHOIS query returned full registrant name, address, phone, and email, making WHOIS a primary tool for spam reporting and domain disputes. Today, ICANN&apos;s Temporary Specification requires registrars to redact personal data for natural persons, displaying only the registrant organization (if any), state or province, and country.
            </p>
            <p>
              This does not render WHOIS useless. The administrative contact email is often replaced by an anonymized forwarding address that still works for abuse reports. Registrar information remains fully visible, which is critical for understanding who to contact for suspension or transfer issues. Creation and expiration dates are always public, enabling domain age analysis and expiry monitoring. For legal entities, organization names and addresses remain visible unless the entity also uses privacy services. Cross-reference WHOIS results with <Link href="/reverse-dns-lookup" className="text-blue-600 hover:underline dark:text-blue-400">Reverse DNS Lookup</Link> to verify PTR records match the registrant&apos;s stated hosting provider, another verification layer that privacy protections do not obscure.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="WHOIS Lookup Frequently Asked Questions" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "🔍", title: "DNS Lookup", description: "Query all DNS record types for any domain", href: "/dns-lookup" },
              { icon: "🔍", title: "Reverse DNS Lookup", description: "Find hostnames from IP addresses via PTR records", href: "/reverse-dns-lookup" },
              { icon: "🔍", title: "DNS Propagation Checker", description: "Verify DNS changes have propagated worldwide", href: "/dns-propagation-checker" },
              { icon: "🔍", title: "IP Lookup", description: "Trace any IP address location and ISP details", href: "/ip-lookup" },
            ]}
            title="Related Network Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="whois-lookup" />
    </>
  );
}
