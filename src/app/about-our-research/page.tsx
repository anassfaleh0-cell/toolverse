import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { JsonLd } from "@/components/shared";
import { webPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: `About Our Research`,
  description: `How ${SITE_NAME} produces authoritative guides, comparisons, and tutorials through thorough research and expert analysis.`,
  alternates: { canonical: `${SITE_URL}/about-our-research` },
  openGraph: { title: `About Our Research` },
};

export default function AboutOurResearchPage() {
  return (
    <>
      <JsonLd data={webPageSchema({
        name: `About Our Research - ${SITE_NAME}`,
        description: `How ${SITE_NAME} produces authoritative guides, comparisons, and tutorials.`,
        url: `${SITE_URL}/about-our-research`,
        breadcrumbs: [
          { label: "Home", href: SITE_URL },
          { label: "About Our Research" },
        ],
      })} />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">About Our Research</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Last updated: January 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Our Research Approach</h2>
            <p className="mt-2">
              Our content is built on primary research: we use our own tools, analyze industry standards, 
              and consult authoritative sources (RFCs, IANA databases, registry WHOIS servers, CA 
              certificates). We do not rely on secondary sources or AI-generated summaries.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Technical Depth</h2>
            <p className="mt-2">
              Each guide explains not just how to use a tool, but how the underlying technology works. 
              DNS guides cover record types and propagation mechanics. SSL guides explain certificate 
              chains and validation. WHOIS guides detail RDAP and legacy protocol differences.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Comparison Methodology</h2>
            <p className="mt-2">
              When comparing tools, we evaluate them across consistent dimensions: feature set, 
              performance, ease of use, accuracy, and pricing. All comparisons include our test data 
              and methodology notes.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Expert Review</h2>
            <p className="mt-2">
              Content is reviewed by team members with hands-on experience in network engineering, 
              systems administration, and web security. We encourage feedback from the community 
              and incorporate corrections promptly.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
