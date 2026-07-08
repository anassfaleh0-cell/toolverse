import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd, SocialShare, ComparisonMatrix, FaqSection } from "@/components/shared";
import { breadcrumbSchema, webPageSchema, faqSchema } from "@/lib/seo";
import type { FaqItem } from "@/lib/seo";

export const metadata: Metadata = {
  title: `The Ultimate HTTP Guide — Headers, Status Codes, and Protocols - ${SITE_NAME}`,
  description: "A comprehensive guide to the HTTP protocol covering all HTTP methods, status codes (1xx–5xx), request and response headers, HTTP/1.1 vs HTTP/2 vs HTTP/3 comparison, security headers, and HTTPS vs HTTP differences.",
  openGraph: {
    title: "The Ultimate HTTP Guide — Headers, Status Codes, and Protocols",
    description: "Master the HTTP protocol from methods to status codes, headers to protocol versions. Complete coverage of HTTP/1.1, HTTP/2, HTTP/3, and security headers.",
    url: `${SITE_URL}/ultimate-guides/http`,
  },
  twitter: {
    title: "The Ultimate HTTP Guide — Headers, Status Codes, and Protocols",
    description: "Master the HTTP protocol from methods to status codes, headers to protocol versions. Complete coverage of HTTP/1.1, HTTP/2, HTTP/3, and security headers.",
  },
  alternates: { canonical: `${SITE_URL}/ultimate-guides/http` },
};

const pageUrl = `${SITE_URL}/ultimate-guides/http`;
const pageTitle = "The Ultimate HTTP Guide — Headers, Status Codes, and Protocols";
const pageDescription = "A comprehensive guide to the HTTP protocol covering all HTTP methods, status codes (1xx–5xx), request and response headers, HTTP/1.1 vs HTTP/2 vs HTTP/3 comparison, security headers, and HTTPS vs HTTP differences.";

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Guides", href: `${SITE_URL}/guides` },
  { label: "Ultimate HTTP Guide" },
];

const faqItems: FaqItem[] = [
  {
    question: "What is the difference between HTTP and HTTPS?",
    answer: "HTTP (Hypertext Transfer Protocol) transmits data in plaintext, meaning anyone on the network can read it. HTTPS (HTTP Secure) adds TLS encryption on top of HTTP, ensuring that data is encrypted, authenticated, and tamper-proof. Every website should use HTTPS to protect user data and maintain trust."
  },
  {
    question: "What is the most secure HTTP method?",
    answer: "GET and HEAD are considered safe (read-only) methods. POST, PUT, PATCH, and DELETE modify server state and require proper authentication and CSRF protection. OPTIONS and TRACE can leak server information if not configured correctly."
  },
  {
    question: "What does a 404 status code mean?",
    answer: "404 Not Found means the server could not find the requested resource. This is a client error — the URL doesn't correspond to any existing resource on the server. Common causes include broken links, moved pages without redirects, or typos in the URL."
  },
  {
    question: "What is the difference between HTTP/2 and HTTP/3?",
    answer: "HTTP/2 uses TCP with multiplexed streams, header compression (HPACK), and server push. HTTP/3 uses QUIC (based on UDP) instead of TCP, which reduces connection establishment time, eliminates head-of-line blocking, and provides better performance on lossy networks."
  },
  {
    question: "What are security headers and why are they important?",
    answer: "Security headers are HTTP response headers that enable browser security features. Key headers include Content-Security-Policy (CSP) to prevent XSS, Strict-Transport-Security (HSTS) to enforce HTTPS, X-Frame-Options to prevent clickjacking, and X-Content-Type-Options to prevent MIME type sniffing."
  }
];

export default function UltimateHttpGuidePage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: pageUrl, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />

      <article>
        <header className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <Breadcrumbs items={breadcrumbs} />
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">{pageTitle}</h1>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">{pageDescription}</p>
            <div className="mt-6">
              <SocialShare url={pageUrl} title={pageTitle} />
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="space-y-16">
            <section id="what-is-http">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">1. What is HTTP?</h2>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>The Hypertext Transfer Protocol (HTTP) is the foundation of data communication on the World Wide Web. It is an application-layer protocol that defines how messages are formatted and transmitted between web clients (browsers) and web servers. When you visit a website, your browser sends an HTTP request to the server, and the server responds with the requested resource (HTML, images, JSON, etc.).</p>
                <p>HTTP was first standardized in 1991 as HTTP/0.9 by Tim Berners-Lee. HTTP/1.0 (1996) introduced headers and status codes. HTTP/1.1 (1997) added persistent connections, chunked transfer encoding, and caching. HTTP/2 (2015) introduced multiplexing and header compression. HTTP/3 (2022) uses QUIC over UDP for even better performance. Each iteration has improved speed, security, and efficiency.</p>
                <p>HTTP is a stateless protocol, meaning each request is independent and the server doesn&apos;t retain information about previous requests. Session state is managed through mechanisms like cookies, tokens, and server-side sessions. HTTP follows a client-server model where the client initiates requests and the server responds.</p>
              </div>
            </section>

            <section id="http-methods">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">2. HTTP Methods</h2>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>HTTP methods (also called verbs) define the action to be performed on a resource. RESTful APIs rely on these methods to implement CRUD operations.</p>
              </div>
              <ComparisonMatrix
                title="HTTP Methods Overview"
                headers={["Idempotent", "Safe (Read-Only)", "Request Body", "Response Body"]}
                rows={[
                  { feature: "GET", values: ["Yes", "Yes", "No", "Yes"], highlight: false },
                  { feature: "POST", values: ["No", "No", "Yes", "Yes"], highlight: false },
                  { feature: "PUT", values: ["Yes", "No", "Yes", "Yes"], highlight: false },
                  { feature: "PATCH", values: ["No", "No", "Yes", "Yes"], highlight: false },
                  { feature: "DELETE", values: ["Yes", "No", "Optional", "Yes"], highlight: false },
                  { feature: "HEAD", values: ["Yes", "Yes", "No", "No (headers only)"], highlight: false },
                  { feature: "OPTIONS", values: ["Yes", "Yes", "No", "Yes (allowed methods)"], highlight: false },
                ]}
              />
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p><strong>GET</strong> retrieves a resource. It is the most common method. <strong>POST</strong> submits data to create a resource. <strong>PUT</strong> replaces an existing resource entirely. <strong>PATCH</strong> applies partial modifications. <strong>DELETE</strong> removes a resource. <strong>HEAD</strong> is like GET but returns only headers (useful for checking resource existence or metadata). <strong>OPTIONS</strong> returns the supported HTTP methods for a resource (used for CORS preflight requests).</p>
                <p>Idempotent methods (GET, PUT, DELETE, HEAD, OPTIONS) produce the same result regardless of how many times they are executed. Safe methods (GET, HEAD, OPTIONS) don&apos;t modify server state. These distinctions are important for building reliable APIs.</p>
              </div>
            </section>

            <section id="http-status-codes">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">3. HTTP Status Codes</h2>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>HTTP status codes are three-digit numbers returned by servers indicating the result of the request. They are grouped into five classes.</p>
              </div>
              <ComparisonMatrix
                title="HTTP Status Code Classes"
                headers={["Category", "Meaning", "Common Examples"]}
                rows={[
                  { feature: "1xx Informational", values: ["Request received, continuing", "100 Continue, 101 Switching Protocols, 103 Early Hints"], highlight: false },
                  { feature: "2xx Success", values: ["Request successful", "200 OK, 201 Created, 204 No Content, 206 Partial Content"], highlight: true },
                  { feature: "3xx Redirection", values: ["Further action needed", "301 Moved Permanently, 302 Found, 304 Not Modified, 307 Temporary Redirect, 308 Permanent Redirect"], highlight: false },
                  { feature: "4xx Client Error", values: ["Request has an issue", "400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests"], highlight: false },
                  { feature: "5xx Server Error", values: ["Server failed to process", "500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout"], highlight: false },
                ]}
              />
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p><strong>2xx Success</strong> codes indicate the request was accepted and processed. <strong>3xx Redirection</strong> tells the client to take additional action, usually following a redirect. <strong>4xx Client Error</strong> means the request was malformed or unauthorized — the client needs to fix something. <strong>5xx Server Error</strong> indicates a server-side failure. For a complete reference, see <Link href="/http-status-codes" className="text-blue-600 hover:underline dark:text-blue-400">ToolVerse HTTP Status Codes</Link>.</p>
              </div>
            </section>

            <section id="http-headers">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">4. HTTP Headers</h2>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>HTTP headers let the client and server pass additional information with requests and responses. They control caching, authentication, content negotiation, security, and more.</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Request Headers</h3>
                <p>Sent by the client: <strong>Host</strong> (target domain), <strong>User-Agent</strong> (browser identifier), <strong>Accept</strong> (content types the client accepts), <strong>Authorization</strong> (credentials for authentication), <strong>Cookie</strong> (stored session data), <strong>Content-Type</strong> (media type of the request body), <strong>Referer</strong> (previous page URL), <strong>Cache-Control</strong> (caching directives).</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Response Headers</h3>
                <p>Sent by the server: <strong>Content-Type</strong> (media type of response), <strong>Content-Length</strong> (response size), <strong>Set-Cookie</strong> (set cookies), <strong>Cache-Control</strong> (caching policies), <strong>Server</strong> (server software), <strong>Location</strong> (redirect URL), <strong>WWW-Authenticate</strong> (authentication challenge).</p>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Security Headers</h3>
                <p>These headers enable browser security features and protect against common attacks. See the dedicated section below.</p>
                <p>Inspect any website&apos;s HTTP headers using <Link href="/http-headers-checker" className="text-blue-600 hover:underline dark:text-blue-400">ToolVerse HTTP Headers Checker</Link>. Browse our complete <Link href="/http-headers" className="text-blue-600 hover:underline dark:text-blue-400">HTTP Headers Reference</Link> for detailed documentation.</p>
              </div>
            </section>

            <section id="http-versions">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">5. HTTP/1.1 vs HTTP/2 vs HTTP/3</h2>
              <ComparisonMatrix
                title="HTTP Protocol Version Comparison"
                headers={["HTTP/1.1", "HTTP/2", "HTTP/3"]}
                rows={[
                  { feature: "Transport", values: ["TCP", "TCP", "QUIC (UDP)"], highlight: false },
                  { feature: "Multiplexing", values: ["No (one request per connection)", "Yes (stream multiplexing)", "Yes (native multiplexing)"], highlight: false },
                  { feature: "Header Compression", values: ["None", "HPACK", "QPACK"], highlight: false },
                  { feature: "Server Push", values: ["No", "Yes", "Yes"], highlight: false },
                  { feature: "Head-of-Line Blocking", values: ["Yes (TCP + HTTP level)", "No (HTTP level)", "No (neither level)"], highlight: true },
                  { feature: "Connection Establishment", values: ["3-way TCP handshake", "3-way TCP handshake", "0–1 RTT (QUIC)"], highlight: false },
                  { feature: "Encryption", values: ["Optional (via HTTPS)", "Optional (via HTTPS, but browsers require TLS)", "Required (always encrypted)"], highlight: false },
                  { feature: "Browser Support", values: ["Universal", "97%+", "95%+"], highlight: false },
                ]}
              />
              <div className="mt-4 text-zinc-600 dark:text-zinc-400">
                <p>HTTP/3 is the latest major version, built on QUIC (Quick UDP Internet Connections). It eliminates head-of-line blocking at both the transport and application layers, reduces connection establishment time, and handles network changes seamlessly (connection migration). Read more in our <Link href="/protocols/http-versus-https" className="text-blue-600 hover:underline dark:text-blue-400">HTTP vs HTTPS comparison</Link>.</p>
              </div>
            </section>

            <section id="https-vs-http">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">6. HTTPS vs HTTP</h2>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>The difference between HTTP and HTTPS is TLS encryption. HTTPS (HTTP Secure) wraps HTTP traffic in TLS, providing three critical security properties:</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li><strong>Encryption:</strong> All data between the client and server is encrypted, preventing eavesdropping by ISPs, Wi-Fi hotspot operators, network administrators, and attackers.</li>
                  <li><strong>Authentication:</strong> The server presents a TLS certificate issued by a trusted Certificate Authority, proving its identity. This prevents man-in-the-middle attacks.</li>
                  <li><strong>Integrity:</strong> Data cannot be modified in transit without detection. TLS includes message authentication codes (MACs) that verify data integrity.</li>
                </ul>
                <p>Google has used HTTPS as a ranking signal since 2014, and modern browsers mark HTTP pages as &quot;Not Secure.&quot; There is no reason to run a website without HTTPS today. Services like Let&apos;s Encrypt provide free TLS certificates with automated renewal. Check your site&apos;s HTTPS configuration with <Link href="/ssl-certificate-checker" className="text-blue-600 hover:underline dark:text-blue-400">ToolVerse SSL Certificate Checker</Link>.</p>
              </div>
            </section>

            <section id="security-headers">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">7. Security Headers</h2>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>Security headers are HTTP response headers that protect your website against common attacks. They tell browsers how to behave when handling your site&apos;s content.</p>
              </div>
              <ComparisonMatrix
                title="Essential Security Headers"
                headers={["Purpose", "Example Value", "Risk if Missing"]}
                rows={[
                  { feature: "Content-Security-Policy (CSP)", values: ["Controls allowed content sources", "default-src 'self'; script-src 'self'", "XSS attacks, data injection"], highlight: true },
                  { feature: "Strict-Transport-Security (HSTS)", values: ["Enforces HTTPS connections", "max-age=31536000; includeSubDomains", "SSL stripping attacks"], highlight: true },
                  { feature: "X-Frame-Options", values: ["Prevents clickjacking", "DENY", "UI redressing attacks"], highlight: false },
                  { feature: "X-Content-Type-Options", values: ["Prevents MIME sniffing", "nosniff", "MIME confusion attacks"], highlight: false },
                  { feature: "Referrer-Policy", values: ["Controls referrer header", "strict-origin-when-cross-origin", "Referrer leakage"], highlight: false },
                  { feature: "Permissions-Policy", values: ["Controls browser features", "camera=(), microphone=()", "Unrestricted API access"], highlight: false },
                ]}
              />
              <div className="mt-4 text-zinc-600 dark:text-zinc-400">
                <p>Audit your security headers with <Link href="/http-headers-checker" className="text-blue-600 hover:underline dark:text-blue-400">ToolVerse HTTP Headers Checker</Link>. Our tool checks for all essential security headers and provides recommendations.</p>
              </div>
            </section>

            <section id="http-tools">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">8. HTTP Tools</h2>
              <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>ToolVerse offers a comprehensive suite of HTTP diagnostic tools:</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li><Link href="/http-headers-checker" className="text-blue-600 hover:underline dark:text-blue-400">HTTP Headers Checker</Link> — Inspect all request and response headers, including security headers, cache policies, and server information.</li>
                  <li><Link href="/redirect-checker" className="text-blue-600 hover:underline dark:text-blue-400">Redirect Checker</Link> — Trace redirect chains and identify redirect loops, broken URLs, and non-optimal redirect types.</li>
                  <li><Link href="/website-status-checker" className="text-blue-600 hover:underline dark:text-blue-400">Website Status Checker</Link> — Check if a website is online, get HTTP status codes, response times, and server information.</li>
                  <li><Link href="/domain-report" className="text-blue-600 hover:underline dark:text-blue-400">Domain Report Card</Link> — Comprehensive audit including HTTP headers, SSL, DNS, and performance metrics.</li>
                </ul>
              </div>
            </section>
          </div>

          <section className="mt-16">
            <FaqSection items={faqItems} title="HTTP Frequently Asked Questions" />
          </section>

          <section className="mt-16 rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Related Resources</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Link href="/http-status-codes" className="rounded-lg border border-zinc-200 p-3 text-sm hover:border-blue-300 dark:border-zinc-700 dark:hover:border-blue-700">
                <span className="font-medium text-zinc-900 dark:text-zinc-50">HTTP Status Codes Reference</span>
                <span className="block text-zinc-600 dark:text-zinc-400">Complete list of all HTTP status codes</span>
              </Link>
              <Link href="/http-headers" className="rounded-lg border border-zinc-200 p-3 text-sm hover:border-blue-300 dark:border-zinc-700 dark:hover:border-blue-700">
                <span className="font-medium text-zinc-900 dark:text-zinc-50">HTTP Headers Reference</span>
                <span className="block text-zinc-600 dark:text-zinc-400">Detailed documentation of HTTP headers</span>
              </Link>
              <Link href="/protocols/http-versus-https" className="rounded-lg border border-zinc-200 p-3 text-sm hover:border-blue-300 dark:border-zinc-700 dark:hover:border-blue-700">
                <span className="font-medium text-zinc-900 dark:text-zinc-50">HTTP vs HTTPS</span>
                <span className="block text-zinc-600 dark:text-zinc-400">Detailed protocol comparison</span>
              </Link>
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
