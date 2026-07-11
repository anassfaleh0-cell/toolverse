import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema } from "@/lib/seo";
import { AUTHORS } from "@/lib/content/authors";

export const metadata: Metadata = {
  title: `Anass Faleh — Founder & Developer, ${SITE_NAME}`,
  description: `Meet Anass Faleh, the software engineer and founder behind ${SITE_NAME}. 10+ years of experience building web applications and developer tools.`,
  alternates: { canonical: `${SITE_URL}/authors/founder` },
  openGraph: {
    title: `Anass Faleh — Founder & Developer, ${SITE_NAME}`,
    description: `Meet the person building ${SITE_NAME}.`,
  },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Authors", href: `${SITE_URL}/authors` },
  { label: "Anass Faleh" },
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
        ...(author.avatarUrl ? { image: author.avatarUrl } : {}),
      }} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <div className="mt-6 flex items-start gap-6">
            {author.avatarUrl ? (
              <img
                src={author.avatarUrl}
                alt={author.name}
                className="size-20 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                {author.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
            )}
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
          </div>
        </div>
      </section>
    </>
  );
}
