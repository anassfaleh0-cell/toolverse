import type { Metadata } from "next";
import Link from "next/link";
import {
  ComparisonMatrix,
  Breadcrumbs,
  SocialShare,
  JsonLd,
} from "@/components/shared";
import {
  webPageSchema,
  breadcrumbSchema,
} from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

const slug = "protocols/http-versus-https";
const pageTitle = "HTTP vs HTTPS — Protocol Comparison, Security, and Performance";
const pageDescription =
  "Compare HTTP and HTTPS protocols across security, performance, and SEO. Understand port differences, TLS handshake overhead, and when each protocol is appropriate.";

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
  { label: "Protocols", href: `${SITE_URL}/protocols` },
  { label: "HTTP vs HTTPS" },
];

export default function HttpVersusHttpsPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                HTTP vs HTTPS
              </h1>
              <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
                {pageDescription}
              </p>
            </div>
            <SocialShare url={`${SITE_URL}/${slug}`} title={pageTitle} />
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            Protocol Differences
          </h2>
          <div className="mt-6 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              HTTP (Hypertext Transfer Protocol) and HTTPS (HTTP Secure) are the foundation of data communication on the web. The key difference is that HTTPS wraps HTTP traffic inside Transport Layer Security (TLS), providing encryption, data integrity, and server authentication.
            </p>
            <p>
              HTTP communicates over port 80 and transmits data in plaintext. HTTPS uses port 443 and encrypts all data between the client and server using TLS. This prevents eavesdropping, tampering, and man-in-the-middle attacks. HTTPS also ensures data integrity — if a message is modified in transit, the TLS layer detects the change and rejects it.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            Security Comparison
          </h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            HTTPS provides significant security advantages over HTTP across every major category.
          </p>
          <div className="mt-8">
            <ComparisonMatrix
              title="HTTP vs HTTPS Security Features"
              headers={["HTTP", "HTTPS"]}
              rows={[
                { feature: "Encryption", values: ["None (plaintext)", "TLS 1.2 / 1.3"] },
                { feature: "Default Port", values: ["80", "443"] },
                { feature: "Data Integrity", values: ["None", "Message Authentication Code (MAC)"] },
                { feature: "Server Authentication", values: ["None", "X.509 certificate validation"] },
                { feature: "Protection Against Eavesdropping", values: ["None", "Full"] },
                { feature: "Protection Against Tampering", values: ["None", "Full"] },
                { feature: "Certificate Validation", values: ["N/A", "CA-signed certificate required"] },
                { feature: "Browser Indicators", values: ["Not secure warning", "Padlock / organization name"] },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            Performance Impact
          </h2>
          <div className="mt-6 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              HTTPS introduces a TLS handshake before encrypted data transfer begins. This adds one round trip (TLS 1.3) or two round trips (TLS 1.2) compared to HTTP. The handshake involves certificate exchange, key agreement, and cipher suite negotiation.
            </p>
            <p>
              In practice, the performance overhead of HTTPS is minimal for most users — typically 100–300ms for the initial connection. This can be mitigated with session resumption, OCSP stapling, and HTTP/2. HTTP/2, which requires HTTPS, offers multiplexing, header compression, and server push that often result in faster page loads than HTTP/1.1.
            </p>
            <p>
              Use the <Link href="/http-headers-checker" className="text-blue-600 hover:underline dark:text-blue-400">HTTP Headers Checker</Link> to inspect your server&apos;s security and performance headers, including HSTS and caching directives.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            SEO Impact of HTTPS
          </h2>
          <div className="mt-6 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Google uses HTTPS as a ranking signal. Sites served over HTTPS receive a ranking boost compared to HTTP-only sites. Additionally, modern browsers mark HTTP pages with a &ldquo;Not Secure&rdquo; warning, which can deter visitors and increase bounce rates.
            </p>
            <p>
              Mixed content occurs when an HTTPS page loads resources (scripts, images, stylesheets) over HTTP. Browsers block or warn about these resources, which can break page functionality. Use the <Link href="/ssl-certificate-checker" className="text-blue-600 hover:underline dark:text-blue-400">SSL Certificate Checker</Link> to verify your HTTPS configuration and ensure all content is served securely.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            When HTTP Is Acceptable
          </h2>
          <div className="mt-6 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              While HTTPS is the standard for production websites, there are scenarios where HTTP is acceptable:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li><strong>Local development</strong> — Running a development server on localhost does not require a certificate. Tools like <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">http-server</code> or <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">python -m http.server</code> use HTTP by default.</li>
              <li><strong>Internal networks</strong> — Communication between services on a private network without exposure to the internet may not need TLS, though encryption is still a best practice.</li>
              <li><strong>Non-sensitive APIs</strong> — Public APIs serving read-only, non-sensitive data may operate over HTTP, though HTTPS is strongly recommended.</li>
              <li><strong>Temporary redirects</strong> — HTTP can be used temporarily during migration, but HTTPS should always be the final target.</li>
            </ul>
            <p className="mt-4">
              Even in these cases, using HTTPS with self-signed certificates for development or Let&apos;s Encrypt for internal services is straightforward and eliminates the security tradeoff.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 bg-zinc-50 py-16 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            Conclusion
          </h2>
          <div className="mt-6 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              HTTPS is essential for any modern website. It protects user privacy, ensures data integrity, authenticates your server, and improves SEO. The performance overhead of TLS is negligible, especially with TLS 1.3 and HTTP/2. If you have not yet migrated to HTTPS, use the <Link href="/ssl-certificate-checker" className="text-blue-600 hover:underline dark:text-blue-400">SSL Certificate Checker</Link> to verify your setup and the <Link href="/http-headers-checker" className="text-blue-600 hover:underline dark:text-blue-400">HTTP Headers Checker</Link> to audit your security headers after migration.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
