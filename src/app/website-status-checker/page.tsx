import type { Metadata } from "next";
import { WebsiteStatusChecker } from "@/components/website-status/website-status";
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

const slug = "website-status-checker";
const pageTitle = "Website Status Checker — Check if a Site is Online";
const pageDescription =
  "Check if any website is online, down, or experiencing issues. Get HTTP status codes, response times, and uptime monitoring insights. Free website status checker.";

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
  { label: "Website Status Checker" },
];

const faqItems: FaqItem[] = [
  {
    question: "What do 1xx, 2xx, 3xx, 4xx, and 5xx HTTP status codes mean?",
    answer:
      "1xx are informational (continue, switching protocols). 2xx means success (200 OK, 201 Created). 3xx are redirections (301 Moved, 302 Found). 4xx are client errors (404 Not Found, 403 Forbidden). 5xx are server errors (500 Internal Server Error, 503 Service Unavailable).",
  },
  {
    question: "Can a website be up for me but down for my users?",
    answer:
      "Yes. Geographic routing, CDN edge node failures, ISP peering issues, and regional DNS resolution differences can make a site appear up locally while being unreachable from other parts of the world.",
  },
  {
    question: "What response time should I consider acceptable?",
    answer:
      "Under 200 ms is excellent for a server response. 200-500 ms is acceptable. Above 1 second indicates a performance problem. These metrics apply to the Time to First Byte (TTFB), not the full page load time.",
  },
  {
    question: "Why does the status checker show 200 when my browser shows an error page?",
    answer:
      "The server may return a 200 with an error rendered in the HTML body. The HTTP status reflects the server's protocol-level response, not the application logic. An empty API response or a database error page often returns 200 with an error message body.",
  },
  {
    question: "How often should I monitor my website?",
    answer:
      "Every 1-5 minutes for production e-commerce or SaaS platforms. Every 15-30 minutes for content sites. Monitoring intervals shorter than 60 seconds are generally unnecessary unless you serve applications with strict uptime SLAs.",
  },
  {
    question: "What does a 503 status indicate about my server?",
    answer:
      "503 Service Unavailable means the server is temporarily unable to handle requests due to maintenance, overload, or upstream dependency failure. It is a temporary condition that should resolve once the root cause is addressed.",
  },
  {
    question: "Is a 301 redirect a problem for website status?",
    answer:
      "A 301 redirect is not an error, but it indicates the resource has permanently moved. If the destination resolves correctly with a 200, the site is healthy. However, unexpected redirects may indicate a hacked site or misconfigured web server.",
  },
  {
    question: "Why would my website return different status codes on different ports?",
    answer:
      "Each port can serve a different application or virtual host. Port 80 usually serves HTTP, port 443 serves HTTPS. A site may return 200 on 443 and connection refused on 80, or vice versa if the ports serve different services.",
  },
  {
    question: "What is the difference between uptime and availability?",
    answer:
      "Uptime measures the percentage of time a server is operational. Availability includes the quality of service: accepting connections, responding within thresholds, and returning correct status codes. A running server that returns 500 errors is up but unavailable.",
  },
  {
    question: "How do CDN edge caches affect status check results?",
    answer:
      "A CDN edge returns cached content when the origin is down, masking an outage. The status check against the public URL will show 200 while the actual origin is unreachable. Monitor origin directly for true availability.",
  },
  {
    question: "Should I check HTTP and HTTPS separately?",
    answer:
      "Yes. HTTPS can fail (expired certificate, TLS mismatch) while HTTP responds normally. Ideally, HTTP should redirect to HTTPS, and HTTPS should return a 200. Monitoring only one protocol gives an incomplete picture.",
  },
  {
    question: "What causes false positives in website monitoring?",
    answer:
      "Rate limiting by your monitoring agent, ISP-level DNS failures, local network outages, or the monitoring service's IP being blocked by the WAF. Always confirm a false positive by checking from multiple independent sources.",
  },
];

export default function WebsiteStatusPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="Website Status Checker"
            description="Check if any website is online, down, or experiencing issues. See HTTP status codes and response times from an external perspective."
            breadcrumbs={breadcrumbs}
          >
            <WebsiteStatusChecker />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Reading HTTP Status Codes to Diagnose Outages
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              When a site goes down, the first step is determining what kind of failure it is experiencing. A 503 or 502 means the server is overwhelmed or an upstream service is failing. A 404 on the homepage means the web root is misconfigured or the application is not deployed. A connection timeout means the server is unreachable at the network level, possibly due to a firewall rule or hosting provider issue. The status checker performs an HTTP HEAD or GET request from the server side and returns the raw response status and timing.
            </p>
            <p>
              Use this <Link href="/website-status-checker" className="text-blue-600 hover:underline dark:text-blue-400">Website Status Checker</Link> as your first diagnostic step when users report that a site is down. If the site responds with a 200 but the content is wrong, follow up with the <Link href="/http-headers-checker" className="text-blue-600 hover:underline dark:text-blue-400">HTTP Headers Checker</Link> to inspect redirect behavior and caching policies. If you see a connection timeout, run a <Link href="/dns-lookup" className="text-blue-600 hover:underline dark:text-blue-400">DNS Lookup</Link> first to confirm the domain resolves, then use the <Link href="/ping-test" className="text-blue-600 hover:underline dark:text-blue-400">Ping Test</Link> to verify network-level reachability to the IP.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            The Difference Between Site Down and Site Slow
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              These two scenarios require different responses. A site that returns 200 in 8 seconds is not down, but has a performance problem that degrades user experience and SEO rankings. Google&apos;s Core Web Vitals penalize slow TTFB. A site that returns 503 or connection refused is down and needs immediate infrastructure investigation. The status checker captures both scenarios by reporting the HTTP status and the response time in milliseconds. This dual data point tells you whether to escalate to your hosting provider (down) or optimize your application (slow).
            </p>
            <p>
              When response times spike but the site stays up, check your <Link href="/ssl-certificate-checker" className="text-blue-600 hover:underline dark:text-blue-400">SSL Certificate Checker</Link> to rule out TLS negotiation overhead. Then run the <Link href="/dns-propagation-checker" className="text-blue-600 hover:underline dark:text-blue-400">DNS Propagation Checker</Link> to ensure DNS resolution latency is not the bottleneck. For persistent slow responses, a <Link href="/ping-test" className="text-blue-600 hover:underline dark:text-blue-400">Ping Test</Link> can help determine if the latency is network-related or application-related.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Common Website Health Monitoring Mistakes
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              The most common mistake is monitoring only the homepage. A site can serve a healthy homepage while every API endpoint returns 500. Another frequent error is ignoring SSL certificate expiry in your monitoring logic — a site with an expired certificate returns 200 to internal monitoring but shows broken padlock to users. Many teams also fail to implement synthetic transaction monitoring that simulates user logins or purchases. Without transaction checks, you miss application-layer outages that status codes alone cannot catch.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            When to Check Website Status
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Check a site&apos;s status the moment you suspect an outage or degradation. Run it after every deployment to verify the new version is serving traffic. Schedule regular checks as part of a broader monitoring strategy. Before contacting your hosting provider&apos;s support, run the status checker to document the response code, response time, and exact timestamp. This data accelerates troubleshooting. If you manage client sites, check status proactively before the client reports the issue.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Website Status Frequently Asked Questions" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "Search", title: "Ping Test", description: "Measure network latency and packet loss to any server", href: "/ping-test" },
              { icon: "Search", title: "HTTP Headers Checker", description: "Inspect all HTTP security and response headers", href: "/http-headers-checker" },
              { icon: "Search", title: "DNS Lookup", description: "Query all DNS record types for any domain", href: "/dns-lookup" },
              { icon: "Search", title: "SSL Certificate Checker", description: "Verify TLS certificates and expiration dates", href: "/ssl-certificate-checker" },
            ]}
            title="Related Network Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="website-status-checker" />
    </>
  );
}
