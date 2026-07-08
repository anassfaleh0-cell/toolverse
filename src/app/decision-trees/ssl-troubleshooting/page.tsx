import type { Metadata } from "next";
import Link from "next/link";
import { DecisionTree, JsonLd, Breadcrumbs, SocialShare, RelatedTools } from "@/components/shared";
import { webPageSchema, breadcrumbSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

const slug = "decision-trees/ssl-troubleshooting";
const pageTitle = "SSL Certificate Troubleshooting Decision Tree";
const pageDescription =
  "A step-by-step SSL troubleshooting guide. Answer questions about browser warnings, certificate expiry, and chain completeness to resolve SSL issues.";

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
  { label: "SSL Troubleshooting" },
];

const nodes: Record<string, { id: string; question?: string; options?: { label: string; next: string }[]; answer?: string; isFinal?: boolean }> = {
  start: {
    id: "start",
    question: "Are you seeing a browser warning or error related to the SSL certificate?",
    options: [
      { label: "Yes, there is a browser warning", next: "checkWarningType" },
      { label: "No, but users report issues", next: "notVisibleIssues" },
    ],
  },
  checkWarningType: {
    id: "checkWarningType",
    question: "What type of SSL warning do you see in the browser?",
    options: [
      { label: "Certificate expired", next: "checkExpiry" },
      { label: "Domain name mismatch", next: "finalNameMismatch" },
      { label: "Certificate not trusted / unknown issuer", next: "finalChainIssue" },
    ],
  },
  checkExpiry: {
    id: "checkExpiry",
    question: "Is the SSL certificate expired according to the browser details?",
    options: [
      { label: "Yes, it is expired", next: "finalRenewCert" },
      { label: "No, it is still valid", next: "checkChainComplete" },
    ],
  },
  checkChainComplete: {
    id: "checkChainComplete",
    question: "Is the full certificate chain (root → intermediate → your certificate) installed on your server?",
    options: [
      { label: "Yes, the chain is complete", next: "finalRevocationCheck" },
      { label: "No, the chain is incomplete", next: "finalChainFix" },
    ],
  },
  notVisibleIssues: {
    id: "notVisibleIssues",
    question: "Are users seeing errors such as 'ERR_SSL_PROTOCOL_ERROR' or connection failures?",
    options: [
      { label: "Yes, users see SSL errors", next: "mixedContentCheck" },
      { label: "No, no visible issues", next: "finalNoIssue" },
    ],
  },
  mixedContentCheck: {
    id: "mixedContentCheck",
    question: "Does your page load mixed content (HTTP resources on an HTTPS page)?",
    options: [
      { label: "Yes, mixed content detected", next: "finalMixedContent" },
      { label: "No, all resources use HTTPS", next: "finalProtocolCheck" },
    ],
  },
  finalRenewCert: {
    id: "finalRenewCert",
    isFinal: true,
    answer:
      "Your SSL certificate has expired. Renew it with your certificate authority (CA) immediately. Most CAs allow renewal up to 30 days before expiry. After renewal, install the new certificate on your server and verify using the SSL Certificate Checker (toolverse.dev/ssl-certificate-checker). Set up calendar reminders to renew before expiry next time.",
  },
  finalNameMismatch: {
    id: "finalNameMismatch",
    isFinal: true,
    answer:
      "The certificate's common name (CN) or Subject Alternative Names (SANs) do not match the domain in the browser's address bar. Obtain a new certificate that covers the correct domain name. Wildcard certificates (*.example.com) cover subdomains but not the bare domain. Verify coverage with the SSL Certificate Checker (toolverse.dev/ssl-certificate-checker).",
  },
  finalChainIssue: {
    id: "finalChainIssue",
    isFinal: true,
    answer:
      "The certificate issuer (CA) is not trusted by the browser, or intermediate certificates are missing. Ensure you installed all intermediate certificates provided by your CA. Some CAs require specific chain ordering. Use the SSL Certificate Checker (toolverse.dev/ssl-certificate-checker) to inspect the full chain. Compare with TLS/SSL Versions (toolverse.dev/tls-versions) for protocol support.",
  },
  finalChainFix: {
    id: "finalChainFix",
    isFinal: true,
    answer:
      "Your server is missing intermediate certificates. Download the CA bundle (intermediate certificates) from your certificate authority and install them on your server. For Apache, set SSLCertificateChainFile. For Nginx, concatenate intermediates with your certificate. Verify the fix using the SSL Certificate Checker (toolverse.dev/ssl-certificate-checker).",
  },
  finalRevocationCheck: {
    id: "finalRevocationCheck",
    isFinal: true,
    answer:
      "Your certificate may have been revoked by the CA. Check the certificate's revocation status via OCSP or CRL. If revoked, you must obtain a new certificate immediately. Use the SSL Certificate Checker (toolverse.dev/ssl-certificate-checker) to verify revocation status. Learn about SSL vs TLS (toolverse.dev/tls-versions) to ensure your server supports modern protocols.",
  },
  finalMixedContent: {
    id: "finalMixedContent",
    isFinal: true,
    answer:
      "Mixed content warnings occur when HTTPS pages load HTTP resources (scripts, images, stylesheets). Browsers block or warn about these resources. Update all resource URLs to use HTTPS. Use relative protocol URLs (//example.com/file.js) or update absolute URLs. The SSL Certificate Checker (toolverse.dev/ssl-certificate-checker) can help verify your setup after fixes.",
  },
  finalProtocolCheck: {
    id: "finalProtocolCheck",
    isFinal: true,
    answer:
      "Your server may support outdated TLS versions or weak cipher suites. Ensure TLS 1.2 and 1.3 are enabled and TLS 1.0/1.1 are disabled. Use the SSL Certificate Checker (toolverse.dev/ssl-certificate-checker) to check supported protocols. Review the TLS Versions Guide (toolverse.dev/tls-versions) for recommended configuration.",
  },
  finalNoIssue: {
    id: "finalNoIssue",
    isFinal: true,
    answer:
      "No SSL issues detected based on your answers. If problems persist, run a full audit using the SSL Certificate Checker (toolverse.dev/ssl-certificate-checker) and review the SSL vs TLS comparison (toolverse.dev/tls-versions) for best practices.",
  },
};

export default function SslTroubleshootingPage() {
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
                SSL Certificate Troubleshooting Decision Tree
              </h1>
              <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400">
                Diagnose SSL certificate warnings, expiry issues, chain errors, and mixed content problems by answering a few guided questions.
              </p>
            </div>
            <SocialShare url={`${SITE_URL}/${slug}`} title={pageTitle} />
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="sr-only">Decision Tree</h2>
          <DecisionTree title="SSL Certificate Troubleshooting" nodes={nodes} startId="start" />
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            How to Use This Decision Tree
          </h2>
          <div className="mt-6 space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
            <p>
              This interactive decision tree guides you through common SSL certificate problems. Select the option that matches your browser warning or user-reported issue. Each answer narrows down the root cause and provides a specific fix.
            </p>
            <p>
              Use the <strong>Back</strong> button to return to previous questions and <strong>Restart</strong> to begin a new session. Recommendations include links to our <Link href="/ssl-certificate-checker" className="text-blue-600 hover:underline dark:text-blue-400">SSL Certificate Checker</Link> for detailed verification.
            </p>
            <p>
              Issues covered include: expired certificates, domain mismatches, incomplete certificate chains, revoked certificates, mixed content warnings, and outdated TLS protocols.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "🔒", title: "SSL Certificate Checker", description: "Validate SSL certificates and expiry", href: "/ssl-certificate-checker" },
              { icon: "🔒", title: "TLS Versions Guide", description: "Compare SSL vs TLS protocols", href: "/tls-versions" },
              { icon: "🔍", title: "HTTP Headers Checker", description: "Inspect security and response headers", href: "/http-headers-checker" },
              { icon: "🔍", title: "Website Status Checker", description: "Check website availability and response time", href: "/website-status-checker" },
            ]}
            title="Related Security Tools"
          />
        </div>
      </section>
    </>
  );
}
