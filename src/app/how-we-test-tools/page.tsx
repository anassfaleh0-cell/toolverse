import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { JsonLd } from "@/components/shared";
import { webPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: `How We Test Tools - ${SITE_NAME}`,
  description: `Our rigorous methodology for testing and evaluating network tools. Learn how we ensure accuracy, speed, and reliability.`,
  alternates: { canonical: `${SITE_URL}/how-we-test-tools` },
  openGraph: { title: `How We Test Tools - ${SITE_NAME}` },
};

export default function HowWeTestPage() {
  return (
    <>
      <JsonLd data={webPageSchema({
        name: `How We Test Tools - ${SITE_NAME}`,
        description: `Our rigorous methodology for testing and evaluating network tools.`,
        url: `${SITE_URL}/how-we-test-tools`,
        breadcrumbs: [
          { label: "Home", href: SITE_URL },
          { label: "How We Test Tools" },
        ],
      })} />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">How We Test Tools</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Last updated: January 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Accuracy Verification</h2>
            <p className="mt-2">
              Every tool on {SITE_NAME} is tested against known reference values. DNS lookups are verified 
              against authoritative name servers. WHOIS data is cross-referenced with registries. SSL 
              certificate details are validated against the certificate itself. We maintain a test suite 
              that runs on every deployment.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Performance Benchmarks</h2>
            <p className="mt-2">
              We measure response times, uptime, and reliability for every tool. Our benchmarks are 
              published transparently. We aim for under 2-second response times for all queries and 
              99.9% uptime for our API endpoints.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Security Audits</h2>
            <p className="mt-2">
              All tools undergo security review. We ensure no sensitive data is logged, stored, or 
              transmitted to third parties. Connections to external DNS servers and registries are 
              encrypted. We follow OWASP guidelines for web application security.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Cross-Browser Testing</h2>
            <p className="mt-2">
              Every tool is tested on Chrome, Firefox, Safari, and Edge across desktop and mobile 
              viewports. We ensure consistent functionality and appearance across all modern browsers.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Continuous Monitoring</h2>
            <p className="mt-2">
              We monitor tool performance and accuracy in production. Automated alerts notify our team 
              of any degradation or failures, allowing us to respond quickly to maintain quality.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
