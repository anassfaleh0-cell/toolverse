import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { JsonLd } from "@/components/shared";
import { webPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Editorial Guidelines - ${SITE_NAME}`,
  description: `How ${SITE_NAME} selects, reviews, and updates tools. Our editorial standards ensure accuracy, relevance, and independence.`,
  alternates: { canonical: `${SITE_URL}/editorial-guidelines` },
  openGraph: { title: `Editorial Guidelines - ${SITE_NAME}` },
};

export default function EditorialGuidelinesPage() {
  return (
    <>
      <JsonLd data={webPageSchema({
        name: `Editorial Guidelines - ${SITE_NAME}`,
        description: `How ${SITE_NAME} selects, reviews, and updates tools.`,
        url: `${SITE_URL}/editorial-guidelines`,
        breadcrumbs: [
          { label: "Home", href: SITE_URL },
          { label: "Editorial Guidelines" },
        ],
      })} />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Editorial Guidelines</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Last updated: January 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Our Commitment</h2>
            <p className="mt-2">
              {SITE_NAME} is committed to providing accurate, unbiased, and up-to-date information about 
              online tools and utilities. Our editorial team follows strict guidelines to ensure every 
              piece of content meets our quality standards.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Tool Selection Process</h2>
            <p className="mt-2">
              We evaluate tools based on functionality, usability, reliability, performance, and user feedback. 
              Only tools that pass our assessment thresholds are featured. We do not accept payment for 
              inclusion in our directory.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Content Accuracy</h2>
            <p className="mt-2">
              All guides, tutorials, and comparisons are researched and verified by our team. We cite sources 
              where applicable and review content quarterly for accuracy. If you find an error, please 
              contact us so we can correct it promptly.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Independence & Objectivity</h2>
            <p className="mt-2">
              Our editorial content is independent of any commercial relationships. Sponsored content or 
              affiliate links are clearly labeled. Our rankings and recommendations are never influenced 
              by financial arrangements.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Updates & Corrections</h2>
            <p className="mt-2">
              We regularly review and update our content to reflect changes in tools, technologies, and 
              best practices. When we make significant updates, we note the change date. Corrections are 
              applied promptly and transparently.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
