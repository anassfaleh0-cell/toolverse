import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { AUTHORS } from "@/lib/content/authors";

export const metadata: Metadata = {
  title: `Anass Faleh — Founder & Developer, ${SITE_NAME}`,
  description: `Meet Anass Faleh, the software engineer and founder behind ${SITE_NAME}. 10+ years building web apps and developer tools.`,
  alternates: { canonical: `${SITE_URL}/authors` },
  openGraph: {
    title: `Anass Faleh — ${SITE_NAME}`,
    description: `Meet the founder building ${SITE_NAME}.`,
  },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Founder" },
];

export default function AuthorsPage() {
  const author = AUTHORS.founder;

  return (
    <>
      <JsonLd data={webPageSchema({ name: `Anass Faleh — Founder & Developer, ${SITE_NAME}`, description: `Meet the founder of ${SITE_NAME}.`, url: `${SITE_URL}/authors`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Meet the Founder
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            {SITE_NAME} is built by a solo developer passionate about creating free, privacy-respecting online tools.
          </p>
        </div>
      </section>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="max-w-lg">
            <Link
              href={`/authors/founder`}
              className="group rounded-xl border border-zinc-200 bg-white p-6 transition-colors hover:border-blue-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-700 block"
            >
              <div className="flex items-start gap-4">
                {author.avatarUrl ? (
                  <img
                    src={author.avatarUrl}
                    alt={author.name}
                    className="size-14 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                    {author.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                )}
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-700">
                    {author.name}
                  </h2>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {author.title}
                  </p>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {author.bio}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
