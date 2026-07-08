import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { JsonLd } from "@/components/shared";
import { webPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Transparency - ${SITE_NAME}`,
  description: `${SITE_NAME}'s commitment to transparency: how we operate, fund the site, handle data, and maintain independence.`,
  openGraph: { title: `Transparency - ${SITE_NAME}`, description: `${SITE_NAME}'s commitment to transparency.`, url: `${SITE_URL}/transparency` },
  twitter: { card: "summary_large_image", title: `Transparency - ${SITE_NAME}`, description: `${SITE_NAME}'s commitment to transparency.` },
  alternates: { canonical: `${SITE_URL}/transparency` },
};

export default function TransparencyPage() {
  return (
    <>
      <JsonLd data={webPageSchema({
        name: `Transparency - ${SITE_NAME}`,
        description: `Our commitment to transparency: how we operate, fund the site, handle data, and maintain independence.`,
        url: `${SITE_URL}/transparency`,
        breadcrumbs: [
          { label: "Home", href: SITE_URL },
          { label: "Transparency" },
        ],
      })} />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Transparency</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Last updated: January 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">How We Operate</h2>
            <p className="mt-2">
              {SITE_NAME} is an independent online tool directory. We provide free network utilities 
              and educational content. Our team consists of engineers and content specialists who are 
              passionate about making network diagnostics accessible to everyone.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Funding & Revenue</h2>
            <p className="mt-2">
              We currently operate as a free service. In the future, we may introduce ethical 
              advertising, affiliate partnerships with relevant services, or a premium tier for 
              advanced features. Any revenue streams will be clearly disclosed and will never 
              influence our editorial content.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Data Handling</h2>
            <p className="mt-2">
              Tool queries are processed in real time and are not stored permanently. We do not sell, 
              rent, or share personal data. IP addresses used for DNS, WHOIS, or connectivity tests 
              are not retained after the query completes. See our Privacy Policy for full details.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Independence</h2>
            <p className="mt-2">
              We have no financial relationships with the tools listed in our directory. Listings 
              are based solely on merit. Sponsored content, if any, will be clearly labeled as such. 
              Affiliate links will be disclosed per FTC guidelines.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Third-Party Services</h2>
            <p className="mt-2">
              We may use third-party services for analytics (e.g., Google Analytics), advertising, 
              or hosting. Each service is vetted for privacy and security practices. We use 
              privacy-preserving configurations where possible.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
