import type { Metadata } from "next";
import { DkimValidator } from "@/components/email-suite/dkim-validator";
import { ToolLayout, ToolHero, FaqSection, RelatedTools, RelatedContent, JsonLd } from "@/components/shared";
import { faqSchema, webPageSchema, breadcrumbSchema, softwareAppSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

const slug = "dkim-validator";
const pageTitle = "DKIM Validator — Verify DomainKeys Identified Mail Records (RFC 6376)";
const pageDescription = "Validate DKIM DNS records for correctness. Check version tag, public key format, hash algorithm, key type, and flags per RFC 6376 and RFC 8301. Includes terminal commands for verification.";

export const metadata: Metadata = {
  title: pageTitle, description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { card: "summary_large_image", title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Network & Internet", href: `${SITE_URL}/category/network-internet` },
  { label: "DKIM Validator" },
];

const faqItems: FaqItem[] = [
  { question: "What DKIM tags should every record have?", answer: "Every DKIM record (RFC 6376 section 3.4) should have: v=DKIM1 (required version tag) and p={public key} (required public key material in base64). Optional but recommended: h=sha256 (hash algorithm, per RFC 8301 section 3.2 which deprecates SHA1). The k= tag specifies key type: rsa (default) or ed25519. Use our DKIM Lookup tool to fetch records and paste them here for validation." },
  { question: "What does a valid DKIM key size look like?", answer: "A 1024-bit RSA key encoded in base64 is approximately 180 characters. A 2048-bit key is approximately 360 characters. Ed25519 keys are much shorter at ~44 characters. Our validator warns if the key is shorter than 64 characters, which likely indicates an invalid or incomplete key. Google Workspace uses 2048-bit RSA keys." },
  { question: "Why is SHA1 deprecated for DKIM?", answer: "RFC 8301 (published January 2018) deprecates SHA1 for DKIM signatures because SHA1 is cryptographically broken (SHAttered attack, 2017). All DKIM implementations should use SHA256 (h=sha256). Gmail and Yahoo enforce RFC 8301 — they reject emails signed with SHA1. If your DKIM record specifies h=sha1, update your mail server configuration immediately." },
  { question: "Can I use Ed25519 keys for DKIM?", answer: "Yes. Ed25519 (k=ed25519) is a modern elliptic curve algorithm supported by RFC 8463. Keys are much shorter (~44 base64 characters vs ~180 for 1024-bit RSA). Ed25519 is supported by Google Workspace, Mailchimp, and Fastmail. However, some receiving servers may not support it yet. RSA 2048-bit remains the safest choice for maximum compatibility." },
];

export default function DkimValidatorPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />
      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero title={pageTitle} description={pageDescription} breadcrumbs={breadcrumbs}>
            <DkimValidator />
          </ToolHero>
        </ToolLayout>
      </section>
      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About DKIM Validation" />
        </div>
      </section>
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "🔑", title: "DKIM Lookup", description: "Fetch DKIM records from DNS", href: "/dkim-lookup" },
              { icon: "📧", title: "SPF Generator", description: "Create SPF records", href: "/spf-generator" },
              { icon: "🛡️", title: "DMARC Generator", description: "Create DMARC policies", href: "/dmarc-generator" },
              { icon: "📨", title: "MX Lookup", description: "Find mail servers", href: "/mx-lookup" },
            ]}
            title="Related Email Authentication Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug={slug} />
    </>
  );
}
