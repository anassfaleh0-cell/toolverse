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

const slug = "troubleshooting/ssl-certificate";
const pageTitle = "SSL Certificate Troubleshooting — Interactive Flow";
const pageDescription =
  "Step through an interactive SSL certificate troubleshooting flow. Diagnose browser warnings, expiry issues, hostname mismatches, and incomplete certificate chains.";

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
  { label: "SSL Certificate" },
];

const steps = {
  start: {
    id: "start",
    instruction: "Is there a browser SSL warning or error visible when visiting your site?",
    detail: "Modern browsers display warnings like 'Your connection is not private', 'NET::ERR_CERT_*', or similar messages when SSL certificate issues are detected.",
    checkLabel: "I see a browser SSL warning",
    yesNext: "warningType",
    noNext: "noWarning",
  },
  warningType: {
    id: "warningType",
    instruction: "What type of SSL warning or error do you see?",
    detail: "The specific error message in the browser's security details window indicates the root cause.",
    checkLabel: "Certificate expired",
    yesNext: "certExpiredFix",
    noNext: "hostnameMismatchCheck",
  },
  hostnameMismatchCheck: {
    id: "hostnameMismatchCheck",
    instruction: "Does the error mention a hostname mismatch or name not covered by the certificate?",
    detail: "This occurs when the domain in the address bar does not match the Common Name (CN) or Subject Alternative Names (SANs) on the certificate.",
    checkLabel: "Hostname mismatch error",
    yesNext: "hostnameMismatchFix",
    noNext: "untrustedCaCheck",
  },
  untrustedCaCheck: {
    id: "untrustedCaCheck",
    instruction: "Does the error say the certificate issuer is unknown or not trusted?",
    detail: "This happens when the Certificate Authority (CA) is not in the browser's trust store, or intermediate certificates are missing.",
    checkLabel: "Untrusted or unknown CA",
    yesNext: "incompleteChainCheck",
    noNext: "otherErrors",
  },
  incompleteChainCheck: {
    id: "incompleteChainCheck",
    instruction: "Is the full certificate chain installed on your server?",
    detail: "The chain must include all intermediate certificates from your CA up to the root CA. Missing intermediates cause trust errors.",
    checkLabel: "Chain is incomplete",
    yesNext: "installIntermediatesFix",
    noNext: "checkCaTrustFix",
  },
  noWarning: {
    id: "noWarning",
    instruction: "Are users reporting SSL errors or connection issues despite no visible browser warning on your end?",
    detail: "Some SSL issues only affect specific clients, older devices, or automated services (APIs, bots).",
    checkLabel: "Users report issues",
    yesNext: "mixedContentCheck",
    noNext: "noIssueFix",
  },
  mixedContentCheck: {
    id: "mixedContentCheck",
    instruction: "Does your site load mixed content (HTTP resources on an HTTPS page)?",
    detail: "Mixed content can cause padlock indicators to disappear and may break functionality for some resources.",
    checkLabel: "Mixed content detected",
    yesNext: "mixedContentFix",
    noNext: "weakProtocolCheck",
  },
  weakProtocolCheck: {
    id: "weakProtocolCheck",
    instruction: "Is your server using outdated TLS versions (TLS 1.0 or 1.1)?",
    detail: "Many clients and compliance standards now require TLS 1.2 or higher. Outdated protocols can cause connection failures on modern browsers.",
    checkLabel: "Weak TLS protocols enabled",
    yesNext: "tlsUpgradeFix",
    noNext: "generalSslCheck",
  },
  certExpiredFix: {
    id: "certExpiredFix",
    isYesFix: true,
    checkLabel: "Renew certificate",
    yesFix: "Renew your SSL certificate with your Certificate Authority immediately. If using Let's Encrypt, run certbot renew. For other CAs, follow their renewal process. Install the new certificate on your server and verify it using the SSL Certificate Checker (Nuvora.dev/ssl-certificate-checker). Set up automatic renewal or calendar reminders to avoid future expirations.",
  },
  hostnameMismatchFix: {
    id: "hostnameMismatchFix",
    isYesFix: true,
    checkLabel: "Fix hostname match",
    yesFix: "The certificate does not cover the domain name being accessed. Obtain a new certificate that includes the correct domain in the Subject Alternative Names (SANs) list. If you manage multiple subdomains, consider a wildcard certificate (*.example.com). Note that wildcards only cover one level of subdomain. Verify the fix with the SSL Certificate Checker (Nuvora.dev/ssl-certificate-checker).",
  },
  installIntermediatesFix: {
    id: "installIntermediatesFix",
    isYesFix: true,
    checkLabel: "Install intermediate certificates",
    yesFix: "Download the CA bundle (chain certificate) from your Certificate Authority and install it on your server. For Nginx, concatenate the intermediates with your certificate file. For Apache, use SSLCertificateChainFile or SSLCACertificateFile. For IIS, import the intermediate certificates into the server's certificate store. Verify the complete chain with the SSL Certificate Checker (Nuvora.dev/ssl-certificate-checker).",
  },
  checkCaTrustFix: {
    id: "checkCaTrustFix",
    isYesFix: true,
    checkLabel: "Check certificate chain",
    yesFix: "If the chain is complete but the CA is still untrusted, your CA may not be widely trusted, or the root certificate is missing from the client's trust store. Ensure you are using a CA that is included in major browser trust stores (e.g., Let's Encrypt, DigiCert, Sectigo, GlobalSign). For private/internal CAs, distribute your root CA certificate to all clients. Use the SSL Certificate Checker (Nuvora.dev/ssl-certificate-checker) to inspect the full chain.",
  },
  mixedContentFix: {
    id: "mixedContentFix",
    isYesFix: true,
    checkLabel: "Fix mixed content",
    yesFix: "Update all resource URLs on your HTTPS pages to use HTTPS. Check for hardcoded http:// URLs in scripts, stylesheets, images, fonts, and API calls. Use relative protocol URLs (//example.com/file.js) or update to https://. Browser developer tools (F12 > Console > Mixed Content) can identify specific resources. Use the HTTP Headers Checker (Nuvora.dev/http-headers-checker) to verify Content-Security-Policy headers.",
  },
  tlsUpgradeFix: {
    id: "tlsUpgradeFix",
    isYesFix: true,
    checkLabel: "Upgrade TLS protocol",
    yesFix: "Disable TLS 1.0 and TLS 1.1 on your server. Enable only TLS 1.2 and TLS 1.3 for maximum security and compatibility. Check your web server configuration: for Nginx, set ssl_protocols TLSv1.2 TLSv1.3; for Apache, set SSLProtocol -all +TLSv1.2 +TLSv1.3. Verify the changes with the SSL Certificate Checker (Nuvora.dev/ssl-certificate-checker) which reports supported protocols.",
  },
  generalSslCheck: {
    id: "generalSslCheck",
    isYesFix: true,
    checkLabel: "Run SSL Certificate Checker",
    yesFix: "No obvious issues found from the guided questions. Run a comprehensive scan using the SSL Certificate Checker (Nuvora.dev/ssl-certificate-checker). It will validate the certificate chain, check revocation status, verify supported TLS protocols, inspect cipher suites, and identify any misconfigurations. Review the TLS Versions Guide (Nuvora.dev/tls-versions) for best practices.",
  },
  noIssueFix: {
    id: "noIssueFix",
    isYesFix: true,
    checkLabel: "Check SSL Certificate Checker",
    yesFix: "No SSL issues detected from your feedback. If problems persist, run the SSL Certificate Checker (Nuvora.dev/ssl-certificate-checker) for a detailed audit. Common issues that don't show browser warnings include weak cipher suites, certificate revocation status problems, and OCSP stapling misconfigurations.",
  },
  otherErrors: {
    id: "otherErrors",
    isYesFix: true,
    checkLabel: "Run SSL Certificate Checker",
    yesFix: "Your SSL error type was not covered in detail by this flow. Use the SSL Certificate Checker (Nuvora.dev/ssl-certificate-checker) to perform a comprehensive analysis of your certificate. Check for revoked certificates, OCSP stapling issues, certificate transparency (CT) requirements, or HPKP pinning failures. The checker will identify the specific problem and suggest a resolution.",
  },
};

export default function SslCertificateTroubleshootingPage() {
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
                SSL Certificate Troubleshooting
              </h1>
              <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400">
                Diagnose SSL certificate warnings, expiration issues, hostname mismatches, and incomplete certificate chains with this interactive guide.
              </p>
            </div>
            <SocialShare url={`${SITE_URL}/${slug}`} title={pageTitle} />
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="sr-only">Troubleshooting Flow</h2>
          <TroubleshootingFlow title="SSL Certificate Troubleshooting" steps={steps} startId="start" />
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            How to Use This Troubleshooting Flow
          </h2>
          <div className="mt-6 space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
            <p>
              Answer the yes/no questions to identify the specific SSL certificate issue affecting your website. Each answer narrows the possible causes until a targeted resolution is provided.
            </p>
            <p>
              Select <strong>Yes — I see a browser SSL warning</strong> if you see a warning, or <strong>No</strong> to diagnose non-obvious issues like mixed content or weak protocols. Use the <strong>Restart</strong> button to start over at any time.
            </p>
            <p>
              For detailed certificate analysis, use the <Link href="/ssl-certificate-checker" className="text-blue-600 hover:underline dark:text-blue-400">SSL Certificate Checker</Link> alongside this guide to verify each fix after applying it.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "Lock", title: "SSL Certificate Checker", description: "Validate SSL certificates, chain, and expiry", href: "/ssl-certificate-checker" },
              { icon: "Lock", title: "TLS Versions Guide", description: "Compare SSL/TLS protocol versions and best practices", href: "/tls-versions" },
              { icon: "Search", title: "HTTP Headers Checker", description: "Inspect security and response headers", href: "/http-headers-checker" },
              { icon: "Search", title: "Website Status Checker", description: "Check website availability and response time", href: "/website-status-checker" },
            ]}
            title="Related Security Tools"
          />
        </div>
      </section>
    </>
  );
}
