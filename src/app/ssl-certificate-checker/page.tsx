import type { Metadata } from "next";
import { SslCertificateChecker } from "@/components/ssl-certificate/ssl-certificate";
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

const slug = "ssl-certificate-checker";
const pageTitle = "SSL Certificate Checker — Verify TLS Cert & Expiration";
const pageDescription =
  "Check SSL/TLS certificate details for any domain. Verify expiration, issuer, SANs, and certificate chain validity. Free SSL certificate checker tool.";

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
  { label: "SSL Certificate Checker" },
];

const faqItems: FaqItem[] = [
  {
    question: "What is the difference between DV, OV, and EV certificates?",
    answer:
      "DV (Domain Validation) confirms only domain control. OV (Organization Validation) verifies the organization's legal identity. EV (Extended Validation) adds a rigorous vetting process. All three provide equivalent encryption strength; the difference is the identity assurance level shown in the certificate.",
  },
  {
    question: "Can a certificate be valid even though it is expired?",
    answer:
      "No. Once the notAfter date passes, the certificate is cryptographically expired and browsers will display a security warning. There is no grace period. Expired certificates are a leading cause of production outages and failed compliance audits.",
  },
  {
    question: "What is a Subject Alternative Name (SAN)?",
    answer:
      "SAN is an X.509 extension that lists additional domain names the certificate covers. A single certificate can secure www.example.com, example.com, mail.example.com, and api.example.com by listing each in the SANs. Browsers now require all covered names to appear in SANs.",
  },
  {
    question: "Why does the certificate chain matter?",
    answer:
      "The chain (leaf -> intermediate -> root) proves the certificate's trustworthiness. If an intermediate certificate is missing or misconfigured, mobile users and some API clients may get untrusted certificate errors even though desktop browsers show a padlock.",
  },
  {
    question: "How often should I check my SSL certificate?",
    answer:
      "Check daily if you manage a high-traffic or compliance-bound domain. Many outages caused by expired certificates could have been caught with automated daily monitoring. Weekly checks are the minimum for standard production sites.",
  },
  {
    question: "Do wildcard certificates cover all subdomains?",
    answer:
      "A wildcard certificate (*.example.com) covers any single-level subdomain like blog.example.com but not deeper levels (sub.blog.example.com). Wildcard certificates also cannot be used for Certificate Transparency logging benefits per-subdomain.",
  },
  {
    question: "What is Certificate Transparency and why does it matter?",
    answer:
      "CT is a framework for publicly logging all issued certificates, allowing domain owners to detect fraudulent certificates. Browsers require CT inclusion for certificates issued after April 2018. A certificate without CT logs may show as untrusted in some environments.",
  },
  {
    question: "Can I use a self-signed certificate in production?",
    answer:
      "You can, but browsers will show untrusted warnings to every visitor. Self-signed certificates are acceptable for internal development and staging environments where you control trust stores. Production public-facing services must use CA-signed certificates.",
  },
  {
    question: "What is the maximum validity period for SSL certificates?",
    answer:
      "As of September 2020, the CA/Browser Forum mandates a maximum of 398 days (about 13 months). Certificates issued before this date may have 825-day validity. Apple and Google enforce the 398-day cap through their trust store policies.",
  },
  {
    question: "How do I know if my certificate uses SHA-1 or SHA-256?",
    answer:
      "The Signature Algorithm field in the certificate indicates the hash used. SHA-1 signatures are deprecated and present as broken padlock in modern browsers. SHA-256 is the minimum standard. All major CAs stopped issuing SHA-1 certificates in 2016.",
  },
  {
    question: "What happens to TLS 1.0 and 1.1 certificates?",
    answer:
      "TLS 1.0 and 1.1 have been deprecated by all major browsers and payment industry standards (PCI DSS). Servers supporting only these protocol versions will fail to connect from modern clients, regardless of certificate validity.",
  },
  {
    question: "Does the key size affect certificate security?",
    answer:
      "Yes. RSA 2048-bit is the current minimum standard. 4096-bit offers more cryptographic margin but increases handshake overhead. ECDSA P-256 keys provide equivalent security to RSA 3072 with significantly smaller handshake payloads.",
  },
];

export default function SslCertificatePage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="SSL Certificate Checker"
            description="Check SSL/TLS certificate details for any domain. Verify expiration, issuer, SANs, and the full certificate chain."
            breadcrumbs={breadcrumbs}
          >
            <SslCertificateChecker />
          </ToolHero>
        </ToolLayout>
      </section>

      <FeaturedSnippet
        toolName="SSL Certificate Checker"
        answer="An SSL/TLS certificate check connects directly to a domain over TLS, retrieves the certificate in real time, and parses all cryptographic fields including issuer, validity period, Subject Alternative Names (SANs), certificate chain, and fingerprint. Key factors to verify include expiration date (maximum 398 days under CA/Browser Forum rules), SAN coverage for all expected hostnames, complete intermediate chain, and SHA-256 signature algorithm."
        keyTakeaways={[
          "Expired certificates are the leading cause of TLS-related production outages",
          "SAN field must list every hostname the certificate secures — host mismatch is the #1 handshake failure",
          "Missing intermediate certificate chain causes mobile and API clients to fail trust validation",
          "Maximum certificate validity is 398 days — check expiration regularly with automated monitoring",
        ]}
      />

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Anatomy of an SSL Certificate: What You Are Really Checking
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              An SSL certificate is more than just a padlock icon. It contains the subject organization, the issuing CA, the serial number, the validity period, the public key algorithm, the Subject Alternative Names (SANs), and the fingerprints. Each field matters. The issuer field tells you which Certificate Authority vouched for the domain. The notBefore and notAfter fields define the validity window, and if the server clock is skewed or the certificate&apos;s validity bounds are wrong, clients reject the connection. The SAN field enumerates every hostname the certificate covers, and a host mismatch is the most common TLS handshake failure.
            </p>
            <p>
              This tool connects directly to the target host using TLS, retrieves the certificate in real time, and parses all the cryptographic fields visible to an external client. Use the <Link href="/ssl-certificate-checker" className="text-blue-600 hover:underline dark:text-blue-400">SSL Certificate Checker</Link> before renewing a certificate, after deploying a new one, or when integrating with third-party services that will open TLS connections to your servers. Pair it with the <Link href="/http-headers-checker" className="text-blue-600 hover:underline dark:text-blue-400">HTTP Headers Checker</Link> to verify that HSTS and other TLS-related headers are configured correctly alongside the certificate.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Why Certificate Validation Differs Across Clients
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              A certificate that shows as valid in your browser may be rejected by a mobile app, curl, or a mail server. Each client maintains its own trust store. Mobile devices may miss CA bundles that desktop browsers include. Operating system updates can pull or push root certificates. Some environments also enforce additional checks like Certificate Revocation List (CRL) and Online Certificate Status Protocol (OCSP) stapling. The checker simulates an external TLS handshake, giving you the same view a remote server or third-party API would see when connecting to your domain.
            </p>
            <p>
              When a third-party API reports an SSL error with your server, take the domain through this checker to pull the exact certificate presented. Compare the fingerprint against the certificate you installed. A mismatch means a proxy or load balancer is terminating TLS with a different certificate. The <Link href="/website-status-checker" className="text-blue-600 hover:underline dark:text-blue-400">Website Status Checker</Link> can verify whether the site is reachable at all, and the <Link href="/dns-lookup" className="text-blue-600 hover:underline dark:text-blue-400">DNS Lookup</Link> confirms the domain resolves to the expected IP where your certificate is installed.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Critical Certificate Management Mistakes
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              The most expensive mistake is letting a certificate expire without automated monitoring. The Let&apos;s Encrypt outage in 2020 demonstrated that even well-managed renewals fail if the automation depends on unreachable endpoints. Another common error is installing only the leaf certificate without the intermediate chain, causing mobile connections to fail. Some administrators also forget that wildcard certificates do not cover the bare domain (example.com) unless explicitly listed in the SANs. Using a certificate issued to an older domain name after rebranding causes hostname mismatch errors that are difficult to trace.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            When to Check SSL Certificates
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Check your certificates immediately after installing a new one, after any change to your TLS termination layer (load balancer, reverse proxy, CDN), and on a recurring schedule via automated monitoring. Run a check before any compliance audit or security review. If users report certificate warnings, check from multiple geographic locations to differentiate between a legitimate certificate issue and a MITM proxy. E-commerce and banking sites should check certificates hourly because an expired certificate during peak traffic translates directly to revenue loss.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="SSL Certificate Frequently Asked Questions" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "Search", title: "HTTP Headers Checker", description: "Inspect security and response headers from any URL", href: "/http-headers-checker" },
              { icon: "Search", title: "Website Status Checker", description: "Check if a website is online and measure response time", href: "/website-status-checker" },
              { icon: "Search", title: "DNS Lookup", description: "Query all DNS record types for any domain", href: "/dns-lookup" },
              { icon: "Search", title: "Port Checker", description: "Test if a port is open or closed from outside the network", href: "/port-checker" },
            ]}
            title="Related Network Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="ssl-certificate-checker" />
    </>
  );
}
