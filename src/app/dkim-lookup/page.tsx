import type { Metadata } from "next";
import { EmailAuthLookup } from "@/components/email-suite/email-auth-lookup";
import { ToolLayout, ToolHero, FaqSection, RelatedTools, RelatedContent, JsonLd } from "@/components/shared";
import { faqSchema, webPageSchema, breadcrumbSchema, softwareAppSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

const slug = "dkim-lookup";
const pageTitle = "DKIM Lookup — Check DomainKeys Identified Mail Records";
const pageDescription = "Look up DKIM records for any domain with custom selector support. Verify email signing configuration, check public key format, and validate cryptographic signatures per RFC 6376.";

export const metadata: Metadata = {
  title: pageTitle, description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { card: "summary_large_image", title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Network & Internet", href: `${SITE_URL}/category/network-internet` },
  { label: "DKIM Lookup" },
];

const beginnerGuide = [
  { title: "What is a DKIM selector?", content: "A DKIM selector is a name that identifies which public key to use for verification. Domains can have multiple DKIM keys with different selectors, allowing key rotation without disruption. Common selectors: 'google' (Google Workspace), 'selector1'/'selector2' (Microsoft 365), 'default' (many providers). The selector is stored as a subdomain like google._domainkey.example.com." },
  { title: "How DKIM signing works", content: "When you send an email, your mail server signs the message with a private key. The signature is added as a DKIM-Signature header containing the selector and domain. The receiving server looks up the public key at {selector}._domainkey.{domain}, cryptographically verifies the signature, and checks that the body hasn't been modified. If verification fails, DMARC can enforce policy." },
  { title: "DKIM key sizes and algorithms", content: "DKIM supports RSA keys (k=rsa, default) and Ed25519 (k=ed25519). RSA keys should be at least 1024 bits (~180 base64 chars). 2048-bit keys are recommended for stronger security but increase DNS response size. Ed25519 keys are shorter (~44 chars) and faster but less widely supported. Google Workspace uses 2048-bit RSA keys." },
];

const faqItems: FaqItem[] = [
  { question: "What DKIM selector should I use for Google Workspace?", answer: "Google Workspace uses the selector 'google'. Query google._domainkey.yourdomain.com. Microsoft 365 uses 'selector1' and 'selector2'. Amazon SES uses a custom selector (check your SES console). If you don't know your selector, check your email provider's documentation or your DNS zone file for records ending in _domainkey." },
  { question: "Can I have multiple DKIM selectors?", answer: "Yes. Domains can have multiple DKIM selectors simultaneously. This is normal during key rotation — the old key remains valid for verifying existing signed emails while the new key is used for signing new ones. You can have multiple selectors active at once with different key sizes or algorithms." },
  { question: "What does a DKIM record look like in DNS?", answer: "A DKIM record is a TXT record at {selector}._domainkey.{domain}. Example: v=DKIM1; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC... The p= tag contains the base64-encoded public key. Optional tags: k= (key type, default rsa), s= (service type, default * or email), h= (hash algorithm, default sha256)." },
  { question: "Why would DKIM verification fail?", answer: "Common DKIM failures: (1) The email body was modified by a mailing list or forwarding service (this breaks the signature). (2) The DNS record is missing or has the wrong selector. (3) The public key was rotated but the old key was removed too soon. (4) The signature uses SHA1 (deprecated, use SHA256). DKIM is vulnerable to 'DKIM replay' — the signature is tied to the body hash, so any modification invalidates it." },
];

export default function DkimLookupPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />
      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero title={pageTitle} description={pageDescription} breadcrumbs={breadcrumbs}>
            <EmailAuthLookup lookupType="dkim" title="DKIM Lookup" description="Check DKIM records for any domain" placeholder="example.com" showSelector selectorLabel="DKIM Selector" beginnerGuide={beginnerGuide} />
          </ToolHero>
        </ToolLayout>
      </section>
      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About DKIM Records" />
        </div>
      </section>
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "Mail", title: "SPF Lookup", description: "Check authorized mail servers", href: "/spf-lookup" },
              { icon: "Shield", title: "DMARC Lookup", description: "Verify email authentication policy", href: "/dmarc-lookup" },
              { icon: "Send", title: "MX Lookup", description: "Find mail server records", href: "/mx-lookup" },
              { icon: "Tag", title: "BIMI Lookup", description: "Check brand logo association", href: "/bimi-lookup" },
            ]}
            title="Related Email Authentication Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug={slug} />
    </>
  );
}
