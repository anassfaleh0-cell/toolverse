import type { Metadata } from "next";
import { DnsToolLookup } from "@/components/dns/dns-tool-lookup";
import { ToolLayout, ToolHero, FaqSection, RelatedTools, RelatedContent, JsonLd } from "@/components/shared";
import { faqSchema, webPageSchema, breadcrumbSchema, softwareAppSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

const slug = "mta-sts-lookup";
const pageTitle = "MTA-STS Lookup — Check Mail Transfer Agent Strict Transport Security";
const pageDescription = "Look up MTA-STS (Mail Transfer Agent Strict Transport Security) records. Verify TLS enforcement policy for incoming email per RFC 8461.";

export const metadata: Metadata = {
  title: pageTitle, description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { card: "summary_large_image", title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Network & Internet", href: `${SITE_URL}/category/network-internet` },
  { label: "MTA-STS Lookup" },
];

const beginnerGuide = [
  { title: "What is MTA-STS?", content: "MTA-STS (Mail Transfer Agent Strict Transport Security, RFC 8461) is a security standard that ensures incoming SMTP connections use TLS encryption. It prevents downgrade attacks where an attacker forces email delivery over an unencrypted connection. MTA-STS uses a DNS TXT record at _mta-sts.yourdomain.com and a policy file hosted at https://mta-sts.yourdomain.com/.well-known/mta-sts.txt." },
  { title: "MTA-STS vs STARTTLS", content: "STARTTLS is opportunistic — if the receiving server doesn't advertise STARTTLS, the sending server falls back to plain text. MTA-STS makes TLS mandatory: if the receiving server doesn't support TLS for MTA-STS-enabled domains, the sending server rejects delivery. This prevents downgrade attacks. MTA-STS requires both a DNS record and a retrievable HTTPS policy file." },
  { title: "MTA-STS policy modes", content: "The MTA-STS policy file has three modes: 'testing' (report-only, delivery proceeds regardless), 'enforce' (TLS is required, delivery fails without it), and 'none' (MTA-STS disabled). Start with 'testing' and monitor reports using TLSRPT before moving to 'enforce'. Policy files must be served with Content-Type: text/plain and a max_age of at least 86400 seconds (1 day)." },
];

const faqItems: FaqItem[] = [
  { question: "What is the difference between MTA-STS and DANE?", answer: "MTA-STS relies on Certificate Authorities and DNS for trust anchors. DANE (RFC 7672) uses DNSSEC to authenticate TLS certificates without relying on CAs. DANE is technically stronger (DNSSEC-backed) but requires DNSSEC on the receiving domain. MTA-STS is easier to deploy but relies on the CA system. Both prevent downgrade attacks. Supporting both is ideal." },
  { question: "How do I set up MTA-STS for my domain?", answer: "(1) Create a TXT record at _mta-sts.yourdomain.com with value 'v=STSv1; id=2026070801;' (increment id on changes). (2) Create a policy file at https://mta-sts.yourdomain.com/.well-known/mta-sts.txt with version, mode, mx hostnames, and max_age. (3) Optionally set up TLSRPT for failure reporting. (4) Use this tool to verify both the DNS record and policy file." },
  { question: "Does MTA-STS affect outbound email?", answer: "No. MTA-STS only protects inbound email to your domain. For outbound email, you configure TLS on your sending mail server. Both Gmail and Outlook have supported MTA-STS as senders since 2020 — they will attempt TLS for MTA-STS-enabled receiving domains." },
];

export default function MtaStsLookupPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />
      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero title={pageTitle} description={pageDescription} breadcrumbs={breadcrumbs}>
            <DnsToolLookup lookupType="mta-sts" title="MTA-STS Lookup" description="Check MTA-STS policy for any domain" placeholder="example.com" beginnerGuide={beginnerGuide} />
          </ToolHero>
        </ToolLayout>
      </section>
      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About MTA-STS" />
        </div>
      </section>
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools tools={[
            { icon: "Mail", title: "SPF Lookup", description: "Check authorized mail servers", href: "/spf-lookup" },
            { icon: "Shield", title: "TLSRPT Lookup", description: "Check TLS reporting configuration", href: "/tlsrpt-lookup" },
            { icon: "Lock", title: "DNSSEC Checker", description: "Verify DNSSEC for DANE", href: "/dnssec-checker" },
            { icon: "Send", title: "MX Lookup", description: "Check mail server records", href: "/mx-lookup" },
          ]} title="Related Email Security Tools" />
        </div>
      </section>
      <RelatedContent toolSlug={slug} />
    </>
  );
}
