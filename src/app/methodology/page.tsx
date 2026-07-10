import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd, SocialShare } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: `How We Test and Review Tools — Our Methodology | ${SITE_NAME}`,
  description: `${SITE_NAME} explains how our free online tools are built, tested, and maintained — including tool selection, testing methodology, data sources, privacy, accuracy, and update frequency.`,
  alternates: { canonical: `${SITE_URL}/methodology` },
  openGraph: {
    title: `How We Test and Review Tools — Our Methodology | ${SITE_NAME}`,
    description: `Learn about ${SITE_NAME}'s rigorous approach to building, testing, and maintaining free online network diagnostic tools and developer utilities.`,
  },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Methodology" },
];

const sections = [
  {
    id: "tool-selection",
    title: "Tool Selection Process",
    content: [
      "Every tool on Nuvora goes through a structured selection process before it is built. We evaluate potential tools based on five criteria: user demand, technical feasibility, accuracy requirements, maintenance complexity, and uniqueness.",
      "We monitor user feedback, search trends, and community discussions to identify which tools would be most valuable to developers, sysadmins, and IT professionals. We prioritize tools that solve real, recurring problems — like DNS lookups, SSL certificate checks, and network diagnostics — over niche or single-use utilities.",
      "Once a tool is selected, we research existing implementations to understand the underlying protocols, APIs, and standards. We reference official RFCs, IANA registries, and W3C specifications to ensure our implementations are correct. For network tools, this means consulting RFC 1035 for DNS, RFC 8446 for TLS 1.3, and RFC 792 for ICMP.",
    ],
  },
  {
    id: "testing-methodology",
    title: "Testing Methodology",
    content: [
      "Every tool on Nuvora undergoes a multi-layered testing process before launch and continues to be tested after deployment. Our testing pyramid includes three levels:",
      "Unit tests validate individual functions and utility modules in isolation. Each tool's core logic — such as DNS query parsing, SSL certificate chain validation, or JSON formatting — is tested against known inputs and expected outputs. We use Jest for unit testing with target coverage of at least 90% for all utility functions.",
      "Integration tests verify that tools work correctly within the application stack. These tests exercise the full request-response cycle, including API route handlers, server-side validation, and response formatting. For tools that make external network requests (e.g., DNS lookups, WHOIS queries), integration tests include mocking to simulate various network conditions and error states.",
      "Manual verification is performed before every deployment. Each tool is tested against known reference values using standard command-line tools. For example, DNS Lookup results are compared against dig and nslookup; Ping Test results are verified against the system ping utility; SSL Certificate Checker results are validated against openssl s_client. This dual-verification approach ensures that our tools produce results consistent with industry-standard implementations.",
    ],
  },
  {
    id: "data-sources",
    title: "Data Sources",
    content: [
      "Nuvora tools rely on a combination of direct network queries, authoritative data sources, and carefully curated reference data. We prioritize real-time queries over cached or third-party data to ensure accuracy.",
      "IP geolocation data is sourced from ip-api.com and cross-validated against Regional Internet Registry (RIR) data from ARIN, RIPE NCC, APNIC, LACNIC, and AFRINIC. WHOIS lookups query registry WHOIS servers and RDAP endpoints directly — we do not use third-party WHOIS aggregators or caches.",
      "DNS resolution is performed by querying authoritative name servers directly, using system resolvers and public resolvers (Cloudflare 1.1.1.1, Google 8.8.8.8) as fallbacks. SSL/TLS certificate data is obtained through raw TLS connections using the Node.js TLS library, with results validated against OpenSSL.",
      "Reference pages such as HTTP Status Codes, DNS Record Types, Port Numbers, and TLS Versions are compiled from IETF RFCs, IANA registries, and W3C specifications. These reference pages are updated whenever relevant standards are revised or new standards are published.",
    ],
  },
  {
    id: "privacy-and-security",
    title: "Privacy & Security",
    content: [
      "Privacy is a core principle at Nuvora. We design every tool to process data with minimal exposure and maximum transparency.",
      "All data processing happens on the server side during a single request-response cycle. IP addresses, domain names, and other inputs entered into our tools are used only for the immediate lookup or check and are not logged, stored, or persisted after the response is sent. We do not write tool inputs to databases, log files, or analytics systems.",
      "We do not use tracking cookies, fingerprinting scripts, or third-party analytics that capture personal data. Our analytics implementation (if present) is privacy-focused and anonymized. All tool queries are served exclusively over encrypted HTTPS connections.",
      "For tools that make external network requests (DNS lookups, WHOIS queries, TLS connections), we do not cache or share query data with third parties. Each request is independent and ephemeral. We recommend users avoid entering sensitive or personal information into any online tool, including Nuvora.",
    ],
  },
  {
    id: "accuracy-verification",
    title: "Accuracy Verification",
    content: [
      "Accuracy is verified at multiple stages throughout a tool's lifecycle. Before launch, every tool is benchmarked against reference implementations and known correct values.",
      "For network diagnostic tools, we maintain a test suite of known hosts and expected results. For example, our DNS Lookup tool is tested against domains with well-known DNS configurations (google.com, cloudflare.com, Nuvora.dev) and the results are compared against dig output. Our SSL Certificate Checker is tested against sites with various certificate configurations, including standard DV certificates, EV certificates, wildcard certificates, and expired certificates.",
      "After launch, automated integration tests run on every deployment to catch regressions. We monitor tool performance and accuracy through synthetic monitoring that periodically checks each tool against reference values. If a discrepancy is detected, an alert is triggered and the engineering team investigates and deploys a fix.",
      "We also rely on user feedback to identify accuracy issues. If a user reports a result that seems incorrect, we investigate promptly, reproduce the issue, and deploy a correction if needed. All corrections are noted in our changelog.",
    ],
  },
  {
    id: "update-frequency",
    title: "Update Frequency",
    content: [
      "Tools on Nuvora are updated and reviewed on an ongoing basis. The update frequency depends on the type of tool and its underlying data sources.",
      "Network diagnostic tools that rely on real-time queries (DNS Lookup, Ping Test, SSL Certificate Checker) are updated continuously by nature — each query returns current data. The tool implementations themselves are reviewed quarterly to ensure compatibility with evolving protocols and standards.",
      "Reference pages (HTTP Status Codes, DNS Record Types, Port Numbers, TLS Versions) are updated within one week of any relevant standard change. We monitor IANA registries, IETF RFC publications, and W3C specification updates to stay current.",
      "Content pages including guides, articles, and learning resources are reviewed and updated quarterly. Each content piece displays its publication date and last-updated date so readers can assess recency. When significant protocol changes occur (e.g., a new TLS version, a new HTTP status code category), relevant content is updated within one week.",
      "All tool dependencies and libraries are updated regularly as part of our maintenance cycle. Security patches are applied within 48 hours of disclosure. Feature updates and improvements are released on an ongoing basis and documented in our changelog.",
    ],
  },
];

export default function MethodologyPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: `How We Test and Review Tools — Our Methodology | ${SITE_NAME}`, description: `${SITE_NAME}'s rigorous approach to building, testing, and maintaining free online tools.`, url: `${SITE_URL}/methodology`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            How We Test and Review Tools
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            {SITE_NAME} is committed to building tools that are accurate, reliable, and privacy-respecting. This page explains how we select, build, test, and maintain every tool on our platform.
          </p>
          <div className="mt-6">
            <SocialShare url={`${SITE_URL}/methodology`} title={`How We Test and Review Tools — Our Methodology | ${SITE_NAME}`} />
          </div>
        </div>
      </section>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <nav className="mb-12 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Table of Contents
            </h2>
            <ul className="mt-2 space-y-1">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-sm text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-12">
            {sections.map((section) => (
              <section key={section.id} id={section.id}>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                  {section.content.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
