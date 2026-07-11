import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { getAllTools } from "@/lib/registry";
import { getAllContent } from "@/lib/content/registry";

export const metadata: Metadata = {
  title: `About ${SITE_NAME} — Editorial Standards & Mission`,
  description: `Learn about ${SITE_NAME}'s editorial policy, content methodology, accuracy standards, and how we research and test every tool and guide.`,
  openGraph: { title: `About ${SITE_NAME}`, description: `${SITE_NAME} is a free online platform providing network diagnostic tools, security checkers, and educational content.`, url: `${SITE_URL}/about` },
  twitter: { card: "summary_large_image", title: `About ${SITE_NAME}`, description: `${SITE_NAME} is a free online platform providing network diagnostic tools.` },
  alternates: { canonical: `${SITE_URL}/about` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "About" },
];

export default function About() {
  const toolCount = getAllTools().filter((t) => t.url.startsWith("/")).length;
  const contentCount = getAllContent().length;

  return (
    <>
      <JsonLd data={webPageSchema({ name: `About ${SITE_NAME}`, description: `Learn about ${SITE_NAME}'s editorial policy and methodology.`, url: `${SITE_URL}/about`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            About {SITE_NAME}
          </h1>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-zinc-200 bg-white p-4 text-center dark:border-zinc-800 dark:bg-zinc-900">
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{toolCount}+</div>
              <div className="mt-1 text-xs text-zinc-500">Free Tools</div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4 text-center dark:border-zinc-800 dark:bg-zinc-900">
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{contentCount}+</div>
              <div className="mt-1 text-xs text-zinc-500">Guides & Articles</div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4 text-center dark:border-zinc-800 dark:bg-zinc-900">
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">100%</div>
              <div className="mt-1 text-xs text-zinc-500">Free to Use</div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-4 text-center dark:border-zinc-800 dark:bg-zinc-900">
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">No</div>
              <div className="mt-1 text-xs text-zinc-500">Signup Required</div>
            </div>
          </div>

          <div className="mt-12 space-y-6 text-zinc-600 dark:text-zinc-400">
            <p>
              {SITE_NAME} is a free online platform providing network diagnostic tools, security checkers, and educational content for developers, sysadmins, and IT professionals. Every tool runs directly in your browser — no downloads, no signups, no data stored on our servers.
            </p>
          </div>

          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Our Mission</h2>
            <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
              <p>To provide accurate, privacy-respecting, and freely accessible network diagnostic tools and educational content. We believe that high-quality technical resources should be available to everyone, regardless of budget.</p>
            </div>
          </div>

          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Our Values</h2>
            <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
              <ul className="list-disc space-y-2 pl-6">
                <li><strong>Accuracy:</strong> All tools and content are verified against authoritative sources before publication.</li>
                <li><strong>Privacy:</strong> No tracking, no logging of personal data, no third-party sharing.</li>
                <li><strong>Transparency:</strong> We clearly document our methodologies, data sources, and limitations.</li>
                <li><strong>Accessibility:</strong> All tools are free, require no registration, and work on all modern browsers.</li>
                <li><strong>Independence:</strong> We accept no payment for tool inclusion. Sponsored content is always labeled.</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">About the Founder</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {SITE_NAME} was created by a solo developer.{" "}
              <Link href="/authors/founder" className="text-blue-600 hover:underline dark:text-blue-400">
                Learn more about the founder &rarr;
              </Link>
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">
              A detailed bio will be added here once provided.
            </p>
          </div>

          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">How Tools Are Tested</h2>
            <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
              <p>Every tool on {SITE_NAME} undergoes rigorous testing before and after launch:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li><strong>Accuracy verification:</strong> Each tool is tested against known reference values (e.g., DNS lookups verified against <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">dig</code>, SSL certificates against <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">openssl</code>).</li>
                <li><strong>Cross-browser testing:</strong> Every tool is tested on Chrome, Firefox, Safari, and Edge across desktop and mobile viewports.</li>
                <li><strong>Performance benchmarks:</strong> We measure response times and aim for under 2-second responses for all queries.</li>
                <li><strong>Security review:</strong> All tools undergo security audit to ensure no data is logged or transmitted to third parties.</li>
                <li><strong>Continuous monitoring:</strong> Automated tests run on every deployment to catch regressions.</li>
              </ul>
              <p className="mt-4">
                For a detailed methodology, see <Link href="/how-we-test-tools" className="text-blue-600 hover:underline dark:text-blue-400">How We Test Tools</Link>.
              </p>
            </div>
          </div>

          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Data Sources</h2>
            <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
              <ul className="list-disc space-y-2 pl-6">
                <li><strong>IP geolocation:</strong> ip-api.com, validated against RIR registration data (ARIN, RIPE, APNIC, LACNIC, AFRINIC).</li>
                <li><strong>WHOIS data:</strong> Queried directly from registry WHOIS servers and RDAP endpoints — no third-party caching.</li>
                <li><strong>DNS resolution:</strong> Direct queries to authoritative name servers using system resolver and public resolvers.</li>
                <li><strong>SSL/TLS certificate data:</strong> Raw TLS connections using Node.js TLS library, validated against OpenSSL.</li>
                <li><strong>Reference pages:</strong> Content compiled from IETF RFCs (RFC 1035, RFC 5246, RFC 8446, etc.), IANA registries, W3C specifications, and industry standards.</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Editorial Standards</h2>
            <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
              <p>Our guides, articles, comparisons, and learning resources follow strict editorial standards:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li><strong>Accuracy first:</strong> Every technical claim is verified against official documentation (RFCs, IETF standards, W3C specifications) before publication.</li>
                <li><strong>Regular updates:</strong> All content includes publication and last-updated dates. We review and update every piece quarterly or when underlying standards change.</li>
                <li><strong>No fluff:</strong> Every article must include real examples, actionable steps, and references to relevant tools. AI-generated filler content is not accepted.</li>
                <li><strong>Source attribution:</strong> Where we reference external data, standards, or research, we link to the original source so readers can verify claims independently.</li>
                <li><strong>Correction policy:</strong> If an error is identified, we correct it promptly and note the correction date. Report issues through our <Link href="/contact" className="text-blue-600 hover:underline dark:text-blue-400">contact page</Link>.</li>
              </ul>
              <p className="mt-4">
                See our full <Link href="/editorial-guidelines" className="text-blue-600 hover:underline dark:text-blue-400">Editorial Guidelines</Link> and <Link href="/how-we-test-tools" className="text-blue-600 hover:underline dark:text-blue-400">Testing Methodology</Link>.
              </p>
            </div>
          </div>

          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Reference Pages</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              We maintain comprehensive reference pages designed to be linkable resources for the developer community:
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Link href="/http-status-codes" className="rounded-lg border border-zinc-200 p-4 text-sm transition-colors hover:border-blue-300 dark:border-zinc-800 dark:hover:border-blue-700">
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">HTTP Status Codes</span>
                <span className="mt-1 block text-zinc-600 dark:text-zinc-400">Complete reference of all 60+ HTTP status codes organized by category.</span>
              </Link>
              <Link href="/dns-record-types" className="rounded-lg border border-zinc-200 p-4 text-sm transition-colors hover:border-blue-300 dark:border-zinc-800 dark:hover:border-blue-700">
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">DNS Record Types</span>
                <span className="mt-1 block text-zinc-600 dark:text-zinc-400">All DNS record types with purpose, format, examples, and use cases.</span>
              </Link>
              <Link href="/port-numbers" className="rounded-lg border border-zinc-200 p-4 text-sm transition-colors hover:border-blue-300 dark:border-zinc-800 dark:hover:border-blue-700">
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">Port Numbers</span>
                <span className="mt-1 block text-zinc-600 dark:text-zinc-400">Well-known TCP/UDP ports organized by service category.</span>
              </Link>
              <Link href="/tls-versions" className="rounded-lg border border-zinc-200 p-4 text-sm transition-colors hover:border-blue-300 dark:border-zinc-800 dark:hover:border-blue-700">
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">TLS/SSL Versions</span>
                <span className="mt-1 block text-zinc-600 dark:text-zinc-400">Timeline of SSL/TLS versions with security status and features.</span>
              </Link>
              <Link href="/hash-algorithms" className="rounded-lg border border-zinc-200 p-4 text-sm transition-colors hover:border-blue-300 dark:border-zinc-800 dark:hover:border-blue-700">
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">Hash Algorithms</span>
                <span className="mt-1 block text-zinc-600 dark:text-zinc-400">Comparison of MD5, SHA-1, SHA-256, SHA-384, and SHA-512.</span>
              </Link>
              <Link href="/color-names" className="rounded-lg border border-zinc-200 p-4 text-sm transition-colors hover:border-blue-300 dark:border-zinc-800 dark:hover:border-blue-700">
                <span className="font-semibold text-zinc-900 dark:text-zinc-50">CSS Color Names</span>
                <span className="mt-1 block text-zinc-600 dark:text-zinc-400">All 147+ CSS named colors with hex and RGB values.</span>
              </Link>
            </div>
          </div>

          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Data Privacy</h2>
            <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
              <ul className="list-disc space-y-2 pl-6">
                <li>IP addresses entered into our tools are used only for the lookup and are not logged or stored.</li>
                <li>We do not use tracking cookies or fingerprinting scripts.</li>
                <li>We do not sell or share personal data with third parties.</li>
                <li>All tool queries are processed over encrypted HTTPS connections.</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Contact & Corrections</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Found an error? Have a suggestion? Contact us through our <Link href="/contact" className="text-blue-600 hover:underline dark:text-blue-400">contact page</Link>. We review every submission and respond within 2 business days.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
