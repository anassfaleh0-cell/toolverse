import type { Metadata } from "next";
import { HttpHeadersChecker } from "@/components/http-headers/http-headers";
import {
  ToolLayout,
  ToolHero,
  FaqSection,
  RelatedTools,
  RelatedContent,
  JsonLd,
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

const slug = "http-headers-checker";
const pageTitle = "HTTP Headers Checker - Audit Security & Response Headers Online";
const pageDescription =
  "Inspect all HTTP response headers from any URL. Check CORS, CSP, HSTS, and cache policies. Free HTTP security header analysis tool.";

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
  { label: "Network & Internet", href: `${SITE_URL}/category/network-internet` },
  { label: "HTTP Headers Checker" },
];

const faqItems: FaqItem[] = [
  {
    question: "What is the Strict-Transport-Security header?",
    answer:
      "HSTS tells browsers to force HTTPS connections for a specified duration, even if the user types HTTP. Valid values specify max-age in seconds and optionally include includeSubDomains. A preload directive submits the domain to browser hardcoded preload lists.",
  },
  {
    question: "Why is the Content-Type header critical for security?",
    answer:
      "If Content-Type is missing or set incorrectly, browsers perform MIME sniffing and may interpret a CSS or image response as HTML, creating a vector for cross-site scripting. Modern servers should always send explicit Content-Type headers.",
  },
  {
    question: "What does the Access-Control-Allow-Origin header do?",
    answer:
      "It controls CORS policy by specifying which origins can read the resource via JavaScript. A value of * lets any domain access the response, which is acceptable for public APIs but dangerous for authenticated endpoints. Specific origins should be whitelisted.",
  },
  {
    question: "Does the Server header pose a security risk?",
    answer:
      "Yes. The Server header reveals software versions (e.g., Apache/2.4.49 or nginx/1.18.0) that attackers use to target known CVEs. Security best practice is to strip or obfuscate this header at the reverse proxy level.",
  },
  {
    question: "How do X-Content-Type-Options prevent MIME sniffing?",
    answer:
      "The value nosniff instructs the browser to trust the Content-Type header and never interpret responses as a different type. It blocks a class of attacks where an attacker uploads an image that the browser parses as HTML and executes script from.",
  },
  {
    question: "What is a redirect chain and why does it matter?",
    answer:
      "A redirect chain is the sequence of HTTP responses from the initial URL to the final destination. Multiple redirects increase latency, may leak query parameters across domains, and suppress important security headers if intermediate responses lack them.",
  },
  {
    question: "How do Cache-Control and Expires headers affect performance?",
    answer:
      "Cache-Control directives (max-age, public, no-cache, no-store, must-revalidate) subdirect the browser and CDN caching behavior. Expires is a legacy header providing an absolute expiration date. Misconfigured caching headers cause either stale content or unnecessary revalidation.",
  },
  {
    question: "Why should I check HTTP headers with an external tool?",
    answer:
      "An external checker validates what the outside world sees, not what your internal curl or browser shows. CDN rules, load balancer modifications, and WAF rewrites may add or strip headers, making the external perspective the authoritative measurement.",
  },
  {
    question: "What headers does a Content Security Policy use?",
    answer:
      "Content-Security-Policy is the modern standard; Content-Security-Policy-Report-Only logs violations without blocking. Both control which scripts, styles, fonts, and connections the browser allows. Missing CSP headers default the policy to same-origin, which is permissive.",
  },
  {
    question: "Can large Cookie headers slow down my website?",
    answer:
      "Yes. Every HTTP request includes all cookies matching the domain. If cookies exceed 8 KB, they exceed the typical header size limit and may be truncated or rejected by proxies. Oversized cookie headers also add measurable latency to every subresource request.",
  },
  {
    question: "What does the Transfer-Encoding: chunked header mean?",
    answer:
      "It indicates the server is streaming the response in chunks of varying sizes without specifying Content-Length. This is used for dynamically generated content but can interfere with network appliances that need Content-Length for inspection.",
  },
  {
    question: "How do Referrer-Policy headers affect analytics accuracy?",
    answer:
      "Referrer-Policy controls how much referrer information is sent in cross-origin requests. strict-origin-when-cross-origin (the recommended default) sends full referrer within the same site but only the origin to other sites, balancing privacy with analytics.",
  },
];

export default function HttpHeadersPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout>
          <ToolHero
            title="HTTP Headers Checker"
            description="Inspect all HTTP response headers from any URL. Check security, CORS, and cache policies from an external perspective."
            breadcrumbs={breadcrumbs}
          >
            <HttpHeadersChecker />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Security Headers Every Website Should Send
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              HTTP response headers are the frontline of web security. They tell the browser how to behave when loading your site. Strict-Transport-Security enforces HTTPS, Content-Security-Policy restricts what scripts and styles execute, X-Frame-Options prevents clickjacking, and Permissions-Policy limits access to browser APIs. Yet the majority of production sites omit at least one of these critical headers. A single missing header can expose users to downgrade attacks, data exfiltration, or UI redress attacks.
            </p>
            <p>
              This tool connects to the target URL, follows the full redirect chain, and displays every response header from the final destination as well as intermediate responses. Run your domain through this <Link href="/http-headers-checker" className="text-blue-600 hover:underline dark:text-blue-400">HTTP Headers Checker</Link> monthly as part of a security audit. If you find missing security headers, add them at the reverse proxy or application layer. Cross-reference the results with the <Link href="/website-status-checker" className="text-blue-600 hover:underline dark:text-blue-400">Website Status Checker</Link> to verify that response times and status codes align with your expected performance metrics.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Understanding the Full Redirect Chain
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              When you check HTTP headers, the tool traces redirections from the initial request to the final response. Each redirect hop adds latency and may strip security headers. HTTP to HTTPS redirects typically lose the original request headers, which is why HSTS headers must appear on the HTTPS response. Some sites chain three or more redirects through tracking domains before reaching the final destination, degrading performance and leaking referrer data. The redirect chain view reveals these intermediate hops so you can optimize them out.
            </p>
            <p>
              A long redirect chain also increases the attack surface. If any intermediate server in the chain lacks proper TLS or has permissive CORS, an attacker positioned on that path can intercept or modify the traffic. Use the <Link href="/ssl-certificate-checker" className="text-blue-600 hover:underline dark:text-blue-400">SSL Certificate Checker</Link> to verify that every hop in the chain serves a valid certificate. For a deeper audit of your domain&apos;s configuration, the <Link href="/dns-lookup" className="text-blue-600 hover:underline dark:text-blue-400">DNS Lookup</Link> tool confirms that all services resolve to the correct IPs.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Common Header Misconfigurations
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              A common mistake is setting Cache-Control: public on sensitive pages, allowing shared CDN caching of authenticated content. Another issue is omitting the Vary header on compressed responses, causing CDNs to serve gzipped content to clients that do not support compression. Many administrators also forget to set X-Content-Type-Options: nosniff, or they apply it only to HTML responses when it should apply globally. Some sites publish overly permissive CSP policies with unsafe-inline that nullify the protection intended by the header.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            When to Audit HTTP Headers
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Perform an HTTP header audit after every deployment that touches the web server configuration, reverse proxy rules, or CDN settings. Check headers when you enable a new feature like CORS, add a WAF, or migrate between hosting providers. Before a penetration test or security certification, the header audit is a required preliminary step. Developers should also check headers when debugging CORS errors, mixed content warnings, or caching mismatches reported in production monitoring.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="HTTP Headers Frequently Asked Questions" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "🔍", title: "SSL Certificate Checker", description: "Verify TLS certificates and expiration dates", href: "/ssl-certificate-checker" },
              { icon: "🔍", title: "Website Status Checker", description: "Check if a website is online and measure response time", href: "/website-status-checker" },
              { icon: "🔍", title: "DNS Lookup", description: "Query all DNS record types for any domain", href: "/dns-lookup" },
              { icon: "🔍", title: "User Agent Parser", description: "Parse any user agent string for browser and device details", href: "/user-agent-parser" },
            ]}
            title="Related Network Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="http-headers-checker" />
    </>
  );
}
