import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { getAllTools } from "@/lib/registry";

export const metadata: Metadata = {
  title: `Alternatives — Compare Free Online Tools | ${SITE_NAME}`,
  description: `Browse all alternative tool comparisons on ${SITE_NAME}. Find the best free alternative for every online tool.`,
  alternates: { canonical: `${SITE_URL}/alternatives` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Alternatives" },
];

export default function AlternativesPage() {
  const tools = getAllTools().filter((t) => t.url.startsWith("/"));

  return (
    <>
      <JsonLd data={webPageSchema({ name: `Alternatives — Compare Free Online Tools | ${SITE_NAME}`, description: `Browse all alternative tool comparisons.`, url: `${SITE_URL}/alternatives`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-border-subtle bg-gradient-to-b from-nuvora-50/30 to-surface dark:from-nuvora-950/20">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">Alternatives</h1>
          <p className="mt-4 text-lg text-text-secondary">Find the best free alternative for every tool.</p>
        </div>
      </section>
      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <Link
                key={tool.id}
                href={`/alternatives/${tool.id}`}
                className="rounded-xl border border-border-subtle bg-surface p-5 transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <h2 className="font-semibold text-text-primary">{tool.name} Alternatives</h2>
                <p className="mt-1 text-sm text-text-tertiary line-clamp-2">{tool.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
