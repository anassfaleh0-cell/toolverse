import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { Callout } from "@/components/ui";

export const metadata: Metadata = {
  title: `Editorial Guidelines`,
  description: `How ${SITE_NAME} selects, reviews, and updates tools. Our editorial standards ensure accuracy, relevance, and independence in all content.`,
  openGraph: { title: `Editorial Guidelines`, description: `${SITE_NAME}'s editorial standards for tool selection, content accuracy, and independence.`, url: `${SITE_URL}/editorial-guidelines` },
  twitter: { card: "summary_large_image", title: `Editorial Guidelines`, description: `${SITE_NAME}'s editorial standards for tool selection.` },
  alternates: { canonical: `${SITE_URL}/editorial-guidelines` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Editorial Guidelines" },
];

export default function EditorialGuidelinesPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: `Editorial Guidelines — ${SITE_NAME}`, description: `${SITE_NAME}'s editorial standards.`, url: `${SITE_URL}/editorial-guidelines`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50">Editorial Guidelines</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Last updated: July 2026</p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="space-y-8 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            <section>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Our Commitment</h2>
              <p className="mt-2">
                {SITE_NAME} is committed to providing accurate, unbiased, and up-to-date information about online tools, network utilities, and technical reference material. Our editorial team follows strict guidelines to ensure every piece of content meets our quality standards. We prioritize accuracy, transparency, and reader trust above all else.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Tool Selection Process</h2>
              <p className="mt-2">
                We evaluate tools based on the following criteria:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-zinc-600 dark:text-zinc-400">
                <li><strong>Functionality:</strong> Does the tool perform its intended function correctly and reliably?</li>
                <li><strong>Usability:</strong> Is the interface intuitive? Can users accomplish their goals without confusion?</li>
                <li><strong>Reliability:</strong> Does the tool produce consistent, accurate results across repeated use?</li>
                <li><strong>Performance:</strong> Is the tool fast and responsive? Does it have unacceptable latency?</li>
                <li><strong>User feedback:</strong> What do actual users say about the tool? Are there recurring complaints?</li>
                <li><strong>Privacy & security:</strong> Does the tool respect user privacy? Does it handle data securely?</li>
              </ul>
              <p className="mt-3">
                Only tools that pass our assessment thresholds are featured. <strong>We do not accept payment for inclusion</strong> in our directory or reference pages. Sponsored content or affiliate links are always clearly labeled to maintain editorial independence.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Content Accuracy</h2>
              <p className="mt-2">
                All guides, tutorials, comparisons, and reference pages are researched and verified by our team before publication:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-zinc-600 dark:text-zinc-400">
                <li>Technical claims are cross-referenced against authoritative sources: IETF RFCs, IANA registries, W3C specifications, NIST publications, and vendor documentation.</li>
                <li>Code examples and command-line references are tested against actual tool output.</li>
                <li>Reference data (status codes, port numbers, DNS record types) is verified against official IANA registries.</li>
                <li>Dates, version numbers, and factual claims are sourced from primary sources, never secondary hearsay.</li>
                <li>Each piece of content is reviewed by at least one team member other than the author before publication.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Independence & Objectivity</h2>
              <p className="mt-2">Maintaining editorial independence is fundamental to our mission:</p>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-zinc-600 dark:text-zinc-400">
                <li>No commercial relationship influences our rankings, recommendations, or editorial coverage.</li>
                <li>Sponsored content, affiliate links, and promotional materials are clearly and conspicuously labeled.</li>
                <li>Our tool directory includes both well-known and lesser-known tools — popularity is not a selection criterion.</li>
                <li>We disclose any conflicts of interest, business relationships, or financial arrangements that could affect our content.</li>
                <li>Our reference pages (HTTP status codes, DNS record types, port numbers) are purely factual and not influenced by any commercial interest.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Updates & Corrections</h2>
              <p className="mt-2">
                We maintain a proactive content update schedule:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-zinc-600 dark:text-zinc-400">
                <li><strong>Quarterly reviews:</strong> Reference pages, guides, and comparison content are reviewed every 3 months for accuracy and relevance.</li>
                <li><strong>Event-driven updates:</strong> When a new RFC deprecates a protocol version, updates IANA registries, or introduces new standards, we update affected content within 7 days.</li>
                <li><strong>Error corrections:</strong> When an error is reported and verified, we correct it within 48 hours. The correction date and nature of the change are noted at the bottom of the page.</li>
                <li><strong>Version tracking:</strong> All content pages display both the original publication date and the last-updated date so readers can assess timeliness.</li>
              </ul>
              <p className="mt-3">
                To report an error, please <Link href="/contact" className="text-blue-600 hover:underline dark:text-blue-400">contact us</Link> with the page URL, a description of the error, and (if possible) a reference to the correct information.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Reference Pages Standards</h2>
              <p className="mt-2">
                Our reference pages (HTTP status codes, DNS record types, port numbers, TLS/SSL versions, hash algorithms, and CSS color names) are held to the highest standard of accuracy:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-zinc-600 dark:text-zinc-400">
                <li>Every data point is sourced from the official IANA registry or the governing RFC/specification.</li>
                <li>Entries include source references (RFC numbers, specification names) so readers can verify independently.</li>
                <li>Security status assessments (e.g., &ldquo;insecure&rdquo; for SSL 2.0, &ldquo;deprecated&rdquo; for TLS 1.2) are based on current IETF guidance and industry consensus.</li>
                <li>When multiple standards exist (e.g., DNS record types defined across many RFCs), we consult the master IANA registry as the authoritative source.</li>
                <li>We link to related tools on {SITE_NAME} where applicable to provide practical, hands-on utility alongside reference information.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Data Sources for Reference Pages</h2>
              <div className="mt-3 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                      <th className="px-4 py-2 text-left font-semibold text-zinc-900 dark:text-zinc-50">Reference Page</th>
                      <th className="px-4 py-2 text-left font-semibold text-zinc-900 dark:text-zinc-50">Primary Sources</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    <tr><td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">HTTP Status Codes</td><td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">IANA HTTP Status Code Registry, RFC 7231, RFC 7230, RFC 6585, RFC 7725, RFC 7540</td></tr>
                    <tr><td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">DNS Record Types</td><td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">IANA DNS Parameters, RFC 1035, RFC 3596, RFC 2782, RFC 6844, RFC 4034, RFC 5155, RFC 4255</td></tr>
                    <tr><td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">Port Numbers</td><td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">IANA Service Name and Transport Protocol Port Number Registry</td></tr>
                    <tr><td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">TLS/SSL Versions</td><td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">RFC 2246, RFC 4346, RFC 5246, RFC 8446, RFC 6176, RFC 7568, RFC 8996</td></tr>
                    <tr><td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">Hash Algorithms</td><td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">NIST FIPS PUB 180-4, RFC 1321 (MD5), RFC 3174 (SHA-1)</td></tr>
                    <tr><td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">CSS Color Names</td><td className="px-4 py-2 text-zinc-600 dark:text-zinc-400">W3C CSS Color Module Level 4, SVG 1.1 specification</td></tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <Callout variant="tip" className="mt-12">
            <p className="text-sm">Want to know how we test the accuracy of our tools? Read our <Link href="/how-we-test-tools" className="text-blue-600 hover:underline dark:text-blue-400">testing methodology</Link> for detailed information about tool verification processes.</p>
          </Callout>
        </div>
      </section>
    </>
  );
}
