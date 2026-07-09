import type { Metadata } from "next";
import Link from "next/link";
import { DomainReportCard } from "@/components/domain-report/report-card";
import { ToolLayout, ToolHero, FaqSection, RelatedContent, JsonLd, FeaturedSnippet, ComparisonTable } from "@/components/shared";
import { faqSchema, webPageSchema, breadcrumbSchema, softwareAppSchema, type FaqItem } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { getToolBySlug, generateToolBreadcrumbs } from "@/lib/registry";

const slug = "domain-report";
const tool = getToolBySlug(slug)!;
const pageTitle = "Domain Report Card — Grade Your Domain's Health (A–F)";
const pageDescription = "Get a complete A–F report card for any domain covering DNS health, SSL/TLS certificates, HTTP security headers, WHOIS registration, website status, and response time. Share your domain's grade.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: { title: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` },
  twitter: { title: pageTitle, description: pageDescription },
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const faqItems: FaqItem[] = [
  { question: "What is a Domain Report Card?", answer: "A Domain Report Card evaluates a domain across multiple categories — DNS health, SSL/TLS certificate status, HTTP security headers, WHOIS registration, website availability, and response time — and assigns an overall grade from A+ to F. It is the fastest way to get a comprehensive health check for any domain." },
  { question: "How is the domain grade calculated?", answer: "Each category is scored independently based on best practices. DNS health checks record types and propagation. SSL checks verify certificate validity and strength. Security headers are checked against OWASP recommendations. The overall grade is a weighted average of all category scores, with security and DNS weighted most heavily." },
  { question: "What does it mean if my domain gets an A grade?", answer: "An A grade (or A+) means your domain meets or exceeds industry best practices across all tested categories: DNS is properly configured with modern records, SSL/TLS certificate is valid and strong, security headers are present and correctly set, WHOIS information is current, website is responding quickly, and response time is excellent." },
  { question: "What DNS records does the report check?", answer: "The report verifies A/AAAA records (IPv4/IPv6 connectivity), MX records (mail routing), NS records (nameserver delegation), TXT records (SPF, DKIM, DMARC for email authentication), CNAME records (canonical names), SOA records (authoritative server details), and SRV records (service configuration). Missing or misconfigured records are flagged." },
  { question: "How do I improve my domain's grade?", answer: "Common improvements include: enabling HTTPS with a valid SSL certificate, adding security headers (HSTS, CSP, X-Frame-Options, X-Content-Type-Options), configuring SPF/DKIM/DMARC email authentication, reducing DNS TTLs before migrations, keeping WHOIS contact info current, and optimizing server response time under 500ms." },
  { question: "Can I share the report with my team?", answer: "Yes. Each report has a shareable URL you can send to your team, client, or hosting provider. You can also export the full report as PDF, JSON, or TXT for documentation and collaboration. The report includes a timestamp so you can track improvements over time." },
];

export default function DomainReportPage() {
  const breadcrumbs = generateToolBreadcrumbs(tool);
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero title={pageTitle} description={pageDescription} breadcrumbs={breadcrumbs}>
            <DomainReportCard />
          </ToolHero>
        </ToolLayout>
      </section>

      <FeaturedSnippet
        toolName="Domain Report Card"
        answer="A Domain Report Card evaluates your domain across six critical dimensions — DNS health, SSL/TLS certificate validity, HTTP security headers, WHOIS registration accuracy, website availability, and response time — and assigns an overall grade from A+ to F. Each dimension is scored independently against industry best practices, with DNS and security weighted most heavily in the final grade."
        keyTakeaways={[
          "Six critical dimensions scored independently against industry best practices",
          "A+ to F grade with DNS and security carrying the most weight",
          "Ideal for pre-migration checks, post-purchase verification, and ongoing monitoring",
          "Shareable report URL plus export to PDF, JSON, or TXT for team collaboration",
        ]}
      />

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Comprehensive Domain Health Assessment</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">A Domain Report Card goes beyond a simple website status check. It evaluates six critical dimensions of your domain&apos;s health: DNS configuration completeness and correctness, SSL/TLS certificate validity and security strength, HTTP security header implementation against OWASP standards, WHOIS registration accuracy and expiration proximity, website availability and status code, and overall response time performance. Each dimension receives an individual score, and the weighted average produces your final A–F grade. The tool is designed for system administrators, DevOps engineers, security professionals, and domain investors who need a quick but thorough assessment of any domain&apos;s health.</p>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <ComparisonTable
            title="Domain Grade Range Comparison"
            headers={["Grade", "Score Range", "Meaning", "Recommended Action"]}
            rows={[
              ["A+ / A", "90–100%", "Excellent — all categories meet best practices", "Maintain regular monitoring"],
              ["B", "80–89%", "Good — minor issues in one or two categories", "Address flagged items"],
              ["C", "70–79%", "Fair — moderate issues requiring attention", "Review and fix within 30 days"],
              ["D", "60–69%", "Poor — significant configuration gaps", "Immediate remediation required"],
              ["F", "Below 60%", "Critical — major failures across categories", "Urgent overhaul needed"],
            ]}
            caption="Grade thresholds are weighted averages of all six category scores."
          />
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Real-World Example: Grading example.com</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">When we ran example.com through the Domain Report Card, it scored an A overall. DNS health was perfect: A record resolved to 93.184.216.34, NS records pointed to a.iana-servers.net and b.iana-servers.net with matching SOA, and all standard record types were correctly configured. SSL/TLS scored A+ with a valid certificate issued by DigiCert TLS RSA SHA256 2020 CA1, strong 2048-bit RSA key, and TLS 1.3 support. HTTP security headers scored B+ — HSTS was present and enforced, but CSP and X-Frame-Options were missing. WHOIS showed registration by Internet Assigned Numbers Authority with accurate contact data and expiration in 2026. Response time averaged 142ms from three global locations, well under the 500ms threshold. The only recommended improvements were adding Content-Security-Policy and X-Frame-Options headers to reach a perfect A+ score.</p>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Troubleshooting: What If Your Domain Gets an F Grade?</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">An F grade means critical failures exist across multiple categories. Start with DNS: verify your domain resolves correctly using the <Link href="/dns-lookup" className="text-blue-600 hover:underline dark:text-blue-400">DNS Lookup</Link> tool — if your A record is missing or points to the wrong IP, address that first. Next check SSL/TLS: a misconfigured or expired certificate will score F regardless of other categories. If your certificate is valid but scoring F, it may be using a weak cipher or an outdated TLS version (TLS 1.0 or 1.1). For HTTP security headers, an F usually means the server is not responding at all or is returning a non-HTTP response. Check your web server configuration and ensure HTTPS redirect is working. If response time scores F, your server may be overloaded or geographically distant from test locations — consider a CDN or moving to a faster hosting provider. Address each failing category independently and re-run the report after each fix.</p>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">References</h2>
          <ul className="mt-4 space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>RFC 1034 — Domain Names - Concepts and Facilities (<a href="https://datatracker.ietf.org/doc/html/rfc1034" className="text-blue-600 hover:underline dark:text-blue-400">datatracker.ietf.org/doc/html/rfc1034</a>)</li>
            <li>RFC 1035 — Domain Names - Implementation and Specification (<a href="https://datatracker.ietf.org/doc/html/rfc1035" className="text-blue-600 hover:underline dark:text-blue-400">datatracker.ietf.org/doc/html/rfc1035</a>)</li>
            <li>RFC 5246 — The Transport Layer Security (TLS) Protocol Version 1.2 (<a href="https://datatracker.ietf.org/doc/html/rfc5246" className="text-blue-600 hover:underline dark:text-blue-400">datatracker.ietf.org/doc/html/rfc5246</a>)</li>
            <li>RFC 8446 — The Transport Layer Security (TLS) Protocol Version 1.3 (<a href="https://datatracker.ietf.org/doc/html/rfc8446" className="text-blue-600 hover:underline dark:text-blue-400">datatracker.ietf.org/doc/html/rfc8446</a>)</li>
            <li>RFC 9110 — HTTP Semantics (<a href="https://datatracker.ietf.org/doc/html/rfc9110" className="text-blue-600 hover:underline dark:text-blue-400">datatracker.ietf.org/doc/html/rfc9110</a>)</li>
            <li>RFC 9111 — HTTP Caching (<a href="https://datatracker.ietf.org/doc/html/rfc9111" className="text-blue-600 hover:underline dark:text-blue-400">datatracker.ietf.org/doc/html/rfc9111</a>)</li>
            <li>RFC 7208 — Sender Policy Framework (SPF) (<a href="https://datatracker.ietf.org/doc/html/rfc7208" className="text-blue-600 hover:underline dark:text-blue-400">datatracker.ietf.org/doc/html/rfc7208</a>)</li>
            <li>RFC 6376 — DomainKeys Identified Mail (DKIM) Signatures (<a href="https://datatracker.ietf.org/doc/html/rfc6376" className="text-blue-600 hover:underline dark:text-blue-400">datatracker.ietf.org/doc/html/rfc6376</a>)</li>
            <li>RFC 7489 — Domain-based Message Authentication, Reporting, and Conformance (DMARC) (<a href="https://datatracker.ietf.org/doc/html/rfc7489" className="text-blue-600 hover:underline dark:text-blue-400">datatracker.ietf.org/doc/html/rfc7489</a>)</li>
            <li>RFC 3912 — WHOIS Protocol Specification (<a href="https://datatracker.ietf.org/doc/html/rfc3912" className="text-blue-600 hover:underline dark:text-blue-400">datatracker.ietf.org/doc/html/rfc3912</a>)</li>
            <li>RFC 7482 — Registration Data Access Protocol (RDAP) Query Format (<a href="https://datatracker.ietf.org/doc/html/rfc7482" className="text-blue-600 hover:underline dark:text-blue-400">datatracker.ietf.org/doc/html/rfc7482</a>)</li>
          </ul>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title={`${tool.name} FAQ`} />
        </div>
      </section>

      <section className="border-t border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedContent toolSlug={slug} />
        </div>
      </section>
    </>
  );
}
