import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { getUseCaseSlugs } from "@/lib/content/programmatic-slugs";

export const metadata: Metadata = {
  title: `Tools by Audience — Find the Right Tool for Your Work | ${SITE_NAME}`,
  description: `Browse ${SITE_NAME} tools curated for your role: developers, designers, writers, marketers, students, and more.`,
  alternates: { canonical: `${SITE_URL}/for` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Tools by Audience" },
];

export default function ForPage() {
  const slugs = getUseCaseSlugs();

  return (
    <>
      <JsonLd data={webPageSchema({ name: `Tools by Audience — Find the Right Tool for Your Work | ${SITE_NAME}`, description: `Browse tools curated for your role.`, url: `${SITE_URL}/for`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-border-subtle bg-gradient-to-b from-nuvora-50/30 to-surface dark:from-nuvora-950/20">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">Tools by Audience</h1>
          <p className="mt-4 text-lg text-text-secondary">Find the right tool for your role and workflow.</p>
        </div>
      </section>
      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {slugs.map((s) => (
              <Link
                key={s.slug}
                href={`/for/${s.slug}`}
                className="rounded-xl border border-border-subtle bg-surface p-5 transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <h2 className="font-semibold text-text-primary capitalize">
                  {s.useCase.replace(/-/g, " ")}
                </h2>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
