import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { Callout } from "@/components/ui";

export const metadata: Metadata = {
  title: `How We Test Tools — ${SITE_NAME}`,
  description: `Our rigorous methodology for testing and evaluating network tools. Learn how we ensure accuracy, speed, and reliability across all tools.`,
  openGraph: { title: `How We Test Tools — ${SITE_NAME}`, description: `Detailed methodology for testing network diagnostic tools.`, url: `${SITE_URL}/how-we-test-tools` },
  twitter: { card: "summary_large_image", title: `How We Test Tools — ${SITE_NAME}`, description: `Detailed methodology for testing network diagnostic tools.` },
  alternates: { canonical: `${SITE_URL}/how-we-test-tools` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "How We Test Tools" },
];

export default function HowWeTestPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: `How We Test Tools — ${SITE_NAME}`, description: `Our rigorous methodology for testing and evaluating network tools.`, url: `${SITE_URL}/how-we-test-tools`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50">How We Test Tools</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Last updated: July 2026</p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="space-y-8 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            <section>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Accuracy Verification</h2>
              <p className="mt-2">
                Every tool on {SITE_NAME} is tested against known reference values before deployment and on an ongoing basis. We maintain a test suite that runs on every code change and deployment.
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-zinc-600 dark:text-zinc-400">
                <li><strong>DNS Lookup:</strong> Verified against <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">dig</code> output from authoritative name servers. We test A, AAAA, MX, CNAME, NS, TXT, SOA, and CAA records against known domain configurations.</li>
                <li><strong>Reverse DNS:</strong> Cross-checked against <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">dig -x</code> output for known PTR records.</li>
                <li><strong>DNS Propagation:</strong> Results compared against multiple geographically distributed public resolvers to verify propagation state accuracy.</li>
                <li><strong>WHOIS Lookup:</strong> Queried directly from registry WHOIS servers (whois.verisign-grs.com, whois.arin.net, etc.) and RDAP endpoints, then compared against known registration data.</li>
                <li><strong>SSL Certificate Checker:</strong> Raw TLS connections established using Node.js TLS library. Certificate details (issuer, subject, SAN, validity dates, chain) verified against <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">openssl s_client</code> output.</li>
                <li><strong>HTTP Headers Checker:</strong> Server-side HTTP requests to avoid browser header modifications. Verified against <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">curl -I</code> and <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">curl -v</code> output.</li>
                <li><strong>Website Status Checker:</strong> Response codes and timing verified against <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">curl -w</code> timing output and browser dev tools.</li>
                <li><strong>Ping Test:</strong> Latency and packet loss measurements validated against system ping output wherever possible.</li>
                <li><strong>Port Checker:</strong> TCP connection attempts compared against <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">nc -zv</code> (netcat) output.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Data Sources & Reliability</h2>
              <p className="mt-2">Each tool type uses specific authoritative data sources, which we document transparently:</p>
              <div className="mt-3 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                      <th className="px-4 py-2 text-left font-semibold text-zinc-900 dark:text-zinc-50">Tool Category</th>
                      <th className="px-4 py-2 text-left font-semibold text-zinc-900 dark:text-zinc-50">Primary Data Source</th>
                      <th className="px-4 py-2 text-left font-semibold text-zinc-900 dark:text-zinc-50">Update Frequency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    <tr><td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">DNS Tools</td><td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">Authoritative NS + Google/Cloudflare resolvers</td><td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">Real-time per query</td></tr>
                    <tr><td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">IP Geolocation</td><td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">ip-api.com, RIR databases</td><td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">Daily refresh</td></tr>
                    <tr><td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">WHOIS</td><td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">Registry WHOIS + RDAP servers</td><td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">Real-time per query</td></tr>
                    <tr><td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">SSL/TLS</td><td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">Direct TLS connections</td><td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">Real-time per query</td></tr>
                    <tr><td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">HTTP Headers</td><td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">Server-side HTTP requests</td><td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">Real-time per query</td></tr>
                    <tr><td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">Reference Pages</td><td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">IANA, IETF RFCs, W3C</td><td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">Reviewed quarterly</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Performance Benchmarks</h2>
              <p className="mt-2">
                We measure and monitor response times, uptime, and reliability for every tool. Our targets:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-zinc-600 dark:text-zinc-400">
                <li>Response time under 2 seconds for all DNS queries (typical: 200-800ms).</li>
                <li>Response time under 5 seconds for WHOIS lookups (typical: 1-3s depending on TLD).</li>
                <li>99.9% uptime for all tool endpoints, measured via automated health checks every 5 minutes.</li>
                <li>Client-side tools process entirely in the browser with no network dependency after initial load.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Security Audits</h2>
              <p className="mt-2">
                All tools undergo security review before deployment:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-zinc-600 dark:text-zinc-400">
                <li>No sensitive data (IPs, domain names, queries) is logged, stored, or transmitted to third parties.</li>
                <li>Connections to external DNS servers, WHOIS registries, and target servers are encrypted where possible.</li>
                <li>OWASP guidelines are followed for web application security (input validation, output encoding, CSP headers, XSS protection).</li>
                <li>Client-side tools use Web Crypto API for sensitive operations and never transmit user data.</li>
                <li>Dependencies are audited regularly for known vulnerabilities using automated scanning.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Cross-Browser Testing</h2>
              <p className="mt-2">
                Every tool is tested across all major browsers to ensure consistent functionality and appearance:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-zinc-600 dark:text-zinc-400">
                <li><strong>Desktop:</strong> Chrome (latest 2 versions), Firefox (latest 2), Safari (latest 2), Edge (latest 2).</li>
                <li><strong>Mobile:</strong> Chrome for Android, Safari for iOS on iPhone and iPad viewports (375px, 414px, 768px widths).</li>
                <li><strong>Responsive design:</strong> All tools tested at 320px, 768px, 1024px, and 1440px viewport widths.</li>
                <li><strong>Accessibility:</strong> WCAG 2.1 AA compliance checked using automated tools and manual keyboard navigation testing.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Reference Page Methodology</h2>
              <p className="mt-2">
                Our reference pages (HTTP status codes, DNS record types, port numbers, TLS versions, hash algorithms, CSS colors) are compiled from authoritative sources:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-zinc-600 dark:text-zinc-400">
                <li><strong>HTTP status codes:</strong> IANA HTTP Status Code Registry, RFC 7231, RFC 7230, RFC 6585, RFC 7725, and related RFCs.</li>
                <li><strong>DNS record types:</strong> IANA DNS Parameters registry and the corresponding RFC for each record type (RFC 1035, RFC 3596, RFC 2782, RFC 6844, RFC 4034, etc.).</li>
                <li><strong>Port numbers:</strong> IANA Service Name and Transport Protocol Port Number Registry.</li>
                <li><strong>TLS versions:</strong> IETF RFCs (RFC 2246, RFC 4346, RFC 5246, RFC 8446) and deprecation RFCs (RFC 6176, RFC 7568, RFC 8996).</li>
                <li><strong>Hash algorithms:</strong> NIST FIPS PUB 180-4, RFC 1321 (MD5), RFC 3174 (SHA-1).</li>
                <li><strong>CSS colors:</strong> W3C CSS Color Module Level 4 specification.</li>
              </ul>
              <p className="mt-3">
                These pages are reviewed quarterly and updated when new RFCs or standards are published. If you spot an error, please <Link href="/contact" className="text-blue-600 hover:underline dark:text-blue-400">let us know</Link>.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Update Frequency Policy</h2>
              <p className="mt-2">
                Our content update schedule is based on the rate of change in each subject area:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-zinc-600 dark:text-zinc-400">
                <li><strong>Tools:</strong> Tested on every deployment. Bug fixes deployed within 24 hours.</li>
                <li><strong>Guides & tutorials:</strong> Reviewed quarterly or when underlying technology changes.</li>
                <li><strong>Reference pages:</strong> Reviewed quarterly against IANA registries and new RFC publications.</li>
                <li><strong>Blog articles:</strong> Reviewed annually or when significant changes occur in the topic area.</li>
                <li><strong>Comparison pages:</strong> Updated whenever a compared tool releases a major version or changes pricing.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Transparency & Limitations</h2>
              <p className="mt-2">
                We believe in being transparent about the limitations of our tools and data:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-zinc-600 dark:text-zinc-400">
                <li><strong>IP geolocation</strong> is never 100% accurate at city level. Providers use estimation algorithms based on IP allocation data, which can be imprecise, especially for mobile IPs and corporate VPNs.</li>
                <li><strong>WHOIS data</strong> accuracy depends on registrants keeping their contact information current. Many domains use WHOIS privacy services that mask registrant details.</li>
                <li><strong>Port checker</strong> tests only TCP connectivity from our server — it cannot detect UDP ports or firewall rules that drop (rather than reject) packets.</li>
                <li><strong>Ping test</strong> measures TCP round-trip time, not ICMP ping. Results may differ from system ping due to network path differences.</li>
                <li><strong>DNS results</strong> may vary by resolver and geographic location due to anycast routing and DNS-level load balancing (geoDNS).</li>
              </ul>
            </section>
          </div>

          <Callout variant="info" className="mt-12">
            <p className="text-sm">Have questions about our testing methodology? <Link href="/contact" className="text-blue-600 hover:underline dark:text-blue-400">Contact us</Link> or read our <Link href="/editorial-guidelines" className="text-blue-600 hover:underline dark:text-blue-400">Editorial Guidelines</Link> for more detail.</p>
          </Callout>
        </div>
      </section>
    </>
  );
}
