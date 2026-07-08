import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd, SocialShare, ComparisonMatrix, FaqSection } from "@/components/shared";
import { breadcrumbSchema, webPageSchema, faqSchema } from "@/lib/seo";
import type { FaqItem } from "@/lib/seo";

export const metadata: Metadata = {
  title: `The Ultimate SSL/TLS Guide — Certificates, Handshakes, and Security - ${SITE_NAME}`,
  description: "A comprehensive guide to SSL/TLS covering how TLS certificates work, DV vs OV vs EV certificate types, the TLS handshake step-by-step, TLS 1.2 vs 1.3 comparison, common SSL issues, and best practices.",
  openGraph: {
    title: "The Ultimate SSL/TLS Guide — Certificates, Handshakes, and Security",
    description: "Master SSL/TLS from certificates to handshakes. Complete coverage of certificate types, TLS 1.2 vs 1.3, troubleshooting, and security best practices.",
    url: `${SITE_URL}/ultimate-guides/ssl-tls`,
  },
  twitter: {
    title: "The Ultimate SSL/TLS Guide — Certificates, Handshakes, and Security",
    description: "Master SSL/TLS from certificates to handshakes. Complete coverage of certificate types, TLS 1.2 vs 1.3, troubleshooting, and security best practices.",
  },
  alternates: { canonical: `${SITE_URL}/ultimate-guides/ssl-tls` },
};

const pageUrl = `${SITE_URL}/ultimate-guides/ssl-tls`;
const pageTitle = "The Ultimate SSL/TLS Guide — Certificates, Handshakes, and Security";
const pageDescription = "A comprehensive guide to SSL/TLS covering how TLS certificates work, DV vs OV vs EV certificate types, the TLS handshake step-by-step, TLS 1.2 vs 1.3 comparison, common SSL issues, and best practices.";

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Guides", href: `${SITE_URL}/guides` },
  { label: "Ultimate SSL/TLS Guide" },
];

const faqItems: FaqItem[] = [
  {
    question: "What is the difference between SSL and TLS?",
    answer: "SSL (Secure Sockets Layer) is the predecessor of TLS (Transport Layer Security). SSL versions 2.0 and 3.0 are deprecated and insecure. TLS 1.0, 1.1, 1.2, and 1.3 are successive versions of the protocol. TLS 1.2 and 1.3 are the only secure versions in use today. Most people still say 'SSL' but technically mean 'TLS'."
  },
  {
    question: "How do I check if my SSL certificate is valid?",
    answer: "Use ToolVerse's SSL Certificate Checker to verify your certificate's validity. Enter your domain and we'll check the issuer, expiration date, subject alternative names, certificate chain completeness, and security grade. You'll also get warnings about expiring certificates and configuration issues."
  },
  {
    question: "What is the difference between DV, OV, and EV certificates?",
    answer: "DV (Domain Validation) only verifies domain ownership. OV (Organization Validation) also verifies the organization's legal existence. EV (Extended Validation) requires the most rigorous verification process and displays the organization name in the browser address bar. DV is sufficient for most websites, while OV and EV are used by businesses that need to establish trust."
  },
  {
    question: "What is a TLS handshake?",
    answer: "The TLS handshake is the process that establishes a secure connection between a client and server. It involves cipher suite negotiation, certificate exchange, key exchange (using RSA or Diffie-Hellman), and the generation of session keys. TLS 1.3 reduced the handshake from two round trips to one, significantly improving connection speed."
  },
  {
    question: "What is the most common SSL certificate issue?",
    answer: "The most common SSL issue is expired certificates. Other frequent problems include hostname mismatch (the certificate was issued for a different domain), incomplete certificate chains (missing intermediate certificates), mixed content (HTTPS page loading HTTP resources), and using outdated TLS versions."
  }
];

export default function UltimateSslTlsGuidePage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: pageUrl, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />

      <article>
        <header className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <Breadcrumbs items={breadcrumbs} />
            <div className="mt-4 flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                {pageTitle}
              </h1>
            </div>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">{pageDescription}</p>
            <div className="mt-6">
              <SocialShare url={pageUrl} title={pageTitle} />
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="space-y-16">
            <section id="what-is-ssl-tls">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">1. What is SSL/TLS?</h2>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>SSL (Secure Sockets Layer) and its successor TLS (Transport Layer Security) are cryptographic protocols that provide secure communication over a computer network. When you visit a website with HTTPS, SSL/TLS ensures that the data exchanged between your browser and the server is encrypted, authenticated, and tamper-proof.</p>
                <p>The protocol was first developed by Netscape in 1994 as SSL 2.0 (SSL 1.0 was never publicly released). After several iterations, the Internet Engineering Task Force (IETF) standardized TLS 1.0 in 1999 as an upgrade to SSL 3.0. TLS 1.1 arrived in 2006, TLS 1.2 in 2008, and TLS 1.3 in 2018. Today, TLS 1.2 and TLS 1.3 are the only secure versions; all earlier versions are deprecated due to known vulnerabilities like POODLE, BEAST, and CRIME.</p>
                <p>TLS serves three fundamental purposes: <strong>encryption</strong> (data is private and cannot be read by eavesdroppers), <strong>authentication</strong> (you are communicating with the legitimate server, verified through certificates), and <strong>integrity</strong> (data cannot be modified in transit without detection). These properties are critical for e-commerce, online banking, email, and any application handling sensitive data.</p>
                <p>Modern web browsers display a padlock icon in the address bar when a site uses HTTPS with a valid TLS certificate. This visual indicator has become a universal trust signal — users expect encryption on every website, and search engines like Google use HTTPS as a ranking signal.</p>
              </div>
            </section>

            <section id="how-tls-certificates-work">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">2. How TLS Certificates Work</h2>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>A TLS certificate is a digital document that binds a cryptographic public key to an organization or domain. Certificates are issued by Certificate Authorities (CAs) like Let&apos;s Encrypt, DigiCert, Sectigo, and GlobalSign. The CA acts as a trusted third party, verifying that the certificate requester genuinely controls the domain.</p>
                <p>Certificates follow the X.509 standard and contain: the subject domain name, the issuer (CA) name, the public key, the validity period (not before / not after), the serial number, the signature algorithm, Subject Alternative Names (SANs) for additional domains, and key usage constraints. The CA digitally signs the certificate, creating a cryptographic chain of trust.</p>
                <p>This chain of trust starts with root CA certificates that are pre-installed in your operating system and browser. Intermediate CAs are signed by root CAs, and end-entity (leaf) certificates are signed by intermediate CAs. Your browser verifies the entire chain back to a trusted root before accepting a certificate as valid. This is why installing the full certificate chain (including intermediate certificates) on your server is critical.</p>
                <p>Use <Link href="/ssl-certificate-checker" className="text-blue-600 hover:underline dark:text-blue-400">ToolVerse SSL Certificate Checker</Link> to inspect the complete certificate chain for any domain, including issuer details, SANs, and expiration dates.</p>
              </div>
            </section>

            <section id="certificate-types">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">3. Certificate Types: DV vs OV vs EV</h2>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>Not all TLS certificates are created equal. Certificate Authorities offer three validation levels, each with different verification requirements and trust indicators.</p>
              </div>
              <ComparisonMatrix
                title="SSL Certificate Validation Levels"
                headers={["Verification Level", "Issuance Time", "Browser Indicator", "Typical Cost"]}
                rows={[
                  { feature: "DV (Domain Validation)", values: ["Domain ownership only", "Minutes to hours", "Padlock only", "Free – $10/year"], highlight: false },
                  { feature: "OV (Organization Validation)", values: ["Domain + org verification", "1–3 business days", "Padlock + org info", "$50–$200/year"], highlight: false },
                  { feature: "EV (Extended Validation)", values: ["Rigorous legal verification", "3–10 business days", "Green bar / org name", "$100–$500/year"], highlight: true },
                ]}
              />
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p><strong>DV certificates</strong> are the most common and are perfectly adequate for most websites, blogs, and small businesses. Let&apos;s Encrypt provides free DV certificates with 90-day validity, encouraging automation and good security hygiene.</p>
                <p><strong>OV certificates</strong> display the organization name in the certificate details, providing an additional layer of trust for business websites. They are verified against business registries.</p>
                <p><strong>EV certificates</strong> underwent a significant change in 2019–2020 when major browsers (Chrome, Firefox, Safari) stopped displaying the organization name in the address bar. Despite this, EV certificates still undergo the most rigorous validation process and may be required by certain compliance frameworks.</p>
                <p>For a detailed comparison, see our <Link href="/compare/ssl-certificate-types" className="text-blue-600 hover:underline dark:text-blue-400">SSL Certificate Types comparison page</Link>.</p>
              </div>
            </section>

            <section id="tls-handshake">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">4. TLS Handshake Explained</h2>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>The TLS handshake is the cryptographic negotiation that happens when a client (browser) connects to a TLS-enabled server. Here is the step-by-step process for TLS 1.2 (the most widely deployed version):</p>
                <ol className="list-decimal space-y-3 pl-5">
                  <li><strong>ClientHello:</strong> The client sends a message to the server containing the TLS version it supports, a list of cipher suites, a randomly generated number (client random), and optional extensions like SNI (Server Name Indication).</li>
                  <li><strong>ServerHello:</strong> The server responds by selecting the highest mutually supported TLS version and cipher suite, sending its own random number (server random), and its session ID.</li>
                  <li><strong>Server Certificate:</strong> The server sends its TLS certificate (including intermediate certificates) so the client can verify its identity.</li>
                  <li><strong>ServerKeyExchange:</strong> For key exchange algorithms like Diffie-Hellman (DH) or Elliptic Curve Diffie-Hellman (ECDHE), the server sends its key exchange parameters.</li>
                  <li><strong>ServerHelloDone:</strong> The server signals that it&apos;s finished sending handshake messages.</li>
                  <li><strong>ClientKeyExchange:</strong> The client generates a pre-master secret (using the server&apos;s public key or DH parameters), encrypts it with the server&apos;s public key (for RSA), or computes the shared secret (for DH/ECDHE).</li>
                  <li><strong>ChangeCipherSpec + Finished:</strong> The client sends a message indicating that subsequent messages will be encrypted, followed by a finished message that authenticates the entire handshake.</li>
                  <li><strong>ChangeCipherSpec + Finished (Server):</strong> The server does the same. At this point, the secure connection is established and application data can be exchanged.</li>
                </ol>
                <p className="mt-4">TLS 1.3 simplified this to a 1-round-trip handshake (0-RTT for resumed connections) by eliminating the separate KeyExchange step and reducing the number of round trips. See <Link href="/technical-flow/ssl-tls-handshake" className="text-blue-600 hover:underline dark:text-blue-400">our TLS handshake flow diagram</Link> for a visual representation.</p>
              </div>
            </section>

            <section id="tls-1-2-vs-1-3">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">5. TLS 1.2 vs 1.3 Comparison</h2>
              <ComparisonMatrix
                title="TLS 1.2 vs TLS 1.3"
                headers={["TLS 1.2", "TLS 1.3"]}
                rows={[
                  { feature: "Handshake Round Trips", values: ["2 RTT (full handshake)", "1 RTT (0-RTT for resumption)"], highlight: false },
                  { feature: "Cipher Suites", values: ["37+ suites, many insecure", "5 AEAD-only suites, all secure"], highlight: true },
                  { feature: "Key Exchange", values: ["RSA, DH, ECDH, ECDHE", "ECDHE only (forward secrecy)"], highlight: false },
                  { feature: "Certificate Encryption", values: ["Certificates sent in plaintext", "Certificates encrypted"], highlight: false },
                  { feature: "Removed Features", values: ["N/A (baseline)", "Static RSA, CBC mode, compression, renegotiation"], highlight: false },
                  { feature: "Browser Support", values: ["99%+ (universal)", "97%+ (modern browsers)"], highlight: false },
                  { feature: "Performance", values: ["Good", "Excellent (faster handshake, 0-RTT)"], highlight: true },
                ]}
              />
              <div className="mt-4 text-zinc-600 dark:text-zinc-400">
                <p>TLS 1.3 represents a significant security and performance improvement over TLS 1.2. Every modern website should support TLS 1.3. Check which TLS versions your server supports with <Link href="/ssl-certificate-checker" className="text-blue-600 hover:underline dark:text-blue-400">ToolVerse SSL Certificate Checker</Link>. Our <Link href="/tls-versions" className="text-blue-600 hover:underline dark:text-blue-400">TLS versions reference page</Link> has more details.</p>
              </div>
            </section>

            <section id="common-ssl-issues">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">6. Common SSL Issues</h2>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Expired Certificate</h3>
                <p>The most common SSL error. Certificates have a validity period (typically 90 days to 1 year). When a certificate expires, browsers display a security warning that scares away visitors. Always set up renewal reminders or use automated tools like Certbot or ACME clients to renew Let&apos;s Encrypt certificates automatically.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Hostname Mismatch</h3>
                <p>Occurs when the domain name in the browser&apos;s address bar doesn&apos;t match any of the Subject Alternative Names (SANs) in the certificate. For example, a certificate issued for &quot;www.example.com&quot; will trigger an error if accessed via &quot;example.com&quot; (without www). Ensure your certificate covers all domains and subdomains you operate.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Incomplete Certificate Chain</h3>
                <p>If your server doesn&apos;t send intermediate certificates along with the leaf certificate, some browsers (especially older ones) may not be able to complete the chain of trust to a trusted root CA. Always install the full certificate chain on your server.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Mixed Content</h3>
                <p>A page loaded over HTTPS that includes resources (images, scripts, stylesheets) over HTTP. Modern browsers block mixed active content (scripts, iframes) by default. Use a tool like <Link href="/http-headers-checker" className="text-blue-600 hover:underline dark:text-blue-400">ToolVerse HTTP Headers Checker</Link> to audit your pages for mixed content issues.</p>
                <p>For systematic resolution, visit our <Link href="/troubleshooting/ssl-certificate" className="text-blue-600 hover:underline dark:text-blue-400">SSL Troubleshooter</Link> and <Link href="/decision-trees/ssl-troubleshooting" className="text-blue-600 hover:underline dark:text-blue-400">SSL Decision Tree</Link>.</p>
              </div>
            </section>

            <section id="ssl-best-practices">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">7. SSL Best Practices</h2>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <ul className="list-disc space-y-2 pl-5">
                  <li><strong>Use TLS 1.2 and 1.3 only:</strong> Disable SSL 2.0, SSL 3.0, TLS 1.0, and TLS 1.1. All are deprecated and vulnerable.</li>
                  <li><strong>Enable HSTS:</strong> HTTP Strict Transport Security tells browsers to always use HTTPS. Include preload directives for maximum protection.</li>
                  <li><strong>Use modern cipher suites:</strong> Prefer AEAD ciphers like AES-GCM and ChaCha20-Poly1305. Disable CBC mode ciphers and RC4.</li>
                  <li><strong>Implement forward secrecy:</strong> Use ECDHE key exchange so that compromising the server&apos;s private key doesn&apos;t compromise past sessions.</li>
                  <li><strong>Keep certificates short-lived:</strong> 90-day certificates (like those from Let&apos;s Encrypt) encourage automation and reduce the impact of key compromise.</li>
                  <li><strong>Monitor certificate expiry:</strong> Use <Link href="/ssl-certificate-checker" className="text-blue-600 hover:underline dark:text-blue-400">ToolVerse SSL Certificate Checker</Link> to regularly check your certificates and get early warnings before expiry.</li>
                  <li><strong>Use strong key sizes:</strong> 2048-bit RSA or 256-bit ECDSA keys are the minimum recommended. 4096-bit RSA or 384-bit ECDSA for higher security requirements.</li>
                </ul>
                <p className="mt-4">For more best practices, see our <Link href="/cheat-sheets/developer-ssl-tls" className="text-blue-600 hover:underline dark:text-blue-400">SSL/TLS Cheat Sheet</Link>.</p>
              </div>
            </section>

            <section id="ssl-tools">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">8. SSL Tools</h2>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>ToolVerse offers a powerful SSL certificate checker and related tools to help you manage and troubleshoot your TLS configuration:</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li><Link href="/ssl-certificate-checker" className="text-blue-600 hover:underline dark:text-blue-400">SSL Certificate Checker</Link> — Check certificate details, issuer, validity, SANs, chain completeness, and security grade for any domain.</li>
                  <li><Link href="/domain-report" className="text-blue-600 hover:underline dark:text-blue-400">Domain Report Card</Link> — Comprehensive domain audit covering SSL, DNS, HTTP headers, and WHOIS in one unified report.</li>
                  <li><Link href="/http-headers-checker" className="text-blue-600 hover:underline dark:text-blue-400">HTTP Headers Checker</Link> — Check security headers like HSTS, CSP, and X-Frame-Options to harden your HTTPS configuration.</li>
                </ul>
              </div>
            </section>
          </div>

          <section className="mt-16">
            <FaqSection items={faqItems} title="SSL/TLS Frequently Asked Questions" />
          </section>

          <section className="mt-16 rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Related Resources</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Link href="/cheat-sheets/developer-ssl-tls" className="rounded-lg border border-zinc-200 p-3 text-sm hover:border-blue-300 dark:border-zinc-700 dark:hover:border-blue-700">
                <span className="font-medium text-zinc-900 dark:text-zinc-50">SSL/TLS Cheat Sheet</span>
                <span className="block text-zinc-600 dark:text-zinc-400">Quick reference for SSL/TLS configuration</span>
              </Link>
              <Link href="/technical-flow/ssl-tls-handshake" className="rounded-lg border border-zinc-200 p-3 text-sm hover:border-blue-300 dark:border-zinc-700 dark:hover:border-blue-700">
                <span className="font-medium text-zinc-900 dark:text-zinc-50">TLS Handshake Flow</span>
                <span className="block text-zinc-600 dark:text-zinc-400">Visual diagram of the TLS handshake process</span>
              </Link>
              <Link href="/compare/ssl-certificate-types" className="rounded-lg border border-zinc-200 p-3 text-sm hover:border-blue-300 dark:border-zinc-700 dark:hover:border-blue-700">
                <span className="font-medium text-zinc-900 dark:text-zinc-50">SSL Certificate Comparison</span>
                <span className="block text-zinc-600 dark:text-zinc-400">DV vs OV vs EV comparison</span>
              </Link>
              <Link href="/tls-versions" className="rounded-lg border border-zinc-200 p-3 text-sm hover:border-blue-300 dark:border-zinc-700 dark:hover:border-blue-700">
                <span className="font-medium text-zinc-900 dark:text-zinc-50">TLS/SSL Versions</span>
                <span className="block text-zinc-600 dark:text-zinc-400">Detailed version history and differences</span>
              </Link>
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
