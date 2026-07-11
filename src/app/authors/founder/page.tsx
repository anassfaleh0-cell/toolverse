import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema } from "@/lib/seo";
import { AUTHORS } from "@/lib/content/authors";

export const metadata: Metadata = {
  title: `Founder — ${SITE_NAME}`,
  description: `Meet the founder and developer behind ${SITE_NAME}.`,
  alternates: { canonical: `${SITE_URL}/authors/founder` },
  openGraph: {
    title: `Founder — ${SITE_NAME}`,
    description: `Learn about the person building ${SITE_NAME}.`,
  },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Authors", href: `${SITE_URL}/authors` },
  { label: "Founder" },
];

export default function FounderPage() {
  const author = AUTHORS.founder;

  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Person",
        name: author.name,
        jobTitle: author.title,
        worksFor: {
          "@type": "Organization",
          name: SITE_NAME,
        },
        url: `${SITE_URL}/authors/founder`,
        description: author.bio,
      }} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <div className="mt-6 flex items-start gap-6">
            <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
              {author.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {author.name}
              </h1>
              <p className="mt-1 text-lg font-medium text-blue-600 dark:text-blue-400">
                {author.title}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="space-y-6 text-zinc-600 dark:text-zinc-400">
            <p>{author.bio}</p>
            <p className="italic text-zinc-500 dark:text-zinc-500 border-t border-zinc-200 dark:border-zinc-800 pt-6">
              A detailed bio will be added here once provided by the founder.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
