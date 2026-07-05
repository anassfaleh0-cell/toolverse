import Link from "next/link";
import type { ContentPiece } from "@/lib/content/types";
import {
  Breadcrumbs,
  JsonLd,
} from "@/components/shared";
import {
  faqSchema,
  breadcrumbSchema,
  webPageSchema,
  type FaqItem,
} from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { getRelatedContent } from "@/lib/content/registry";
import { getToolBySlug } from "@/lib/registry";

function getContentBreadcrumbs(piece: ContentPiece) {
  const typeLabel: Record<string, string> = {
    guide: "Guides",
    tutorial: "Tutorials",
    article: "Blog",
    learn: "Learn",
    comparison: "Comparisons",
  };
  return [
    { label: "Home", href: SITE_URL },
    {
      label: typeLabel[piece.type] || "Resources",
      href: `${SITE_URL}/${piece.type === "article" ? "blog" : piece.type}`,
    },
    { label: piece.title },
  ];
}

export function ContentPage({ piece }: { piece: ContentPiece }) {
  const breadcrumbs = getContentBreadcrumbs(piece);
  const related = getRelatedContent(piece, 4);
  const schemaFaq: FaqItem[] = piece.sections
    .filter((s) => s.body.length > 50)
    .slice(0, 5)
    .map((s) => ({ question: s.heading, answer: s.body.slice(0, 300) }));

  const typeUrl = piece.type === "article" ? "blog" : piece.type;
  const typeLabel =
    piece.type.charAt(0).toUpperCase() + piece.type.slice(1);

  return (
    <>
      <JsonLd data={webPageSchema({ name: piece.title, description: piece.description, url: `${SITE_URL}/${typeUrl}/${piece.slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      {schemaFaq.length > 1 && <JsonLd data={faqSchema(schemaFaq)} />}

      <article>
        <header className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <Breadcrumbs items={breadcrumbs} />
            <span className="mt-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              {typeLabel}
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              {piece.title}
            </h1>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              {piece.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-500 dark:text-zinc-500">
              <span>
                {piece.readingTimeMinutes} min read
              </span>
              <span>
                Published: {new Date(piece.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </span>
              <span className="rounded bg-zinc-200 px-2 py-0.5 text-xs dark:bg-zinc-700">
                {piece.difficulty}
              </span>
            </div>
            {piece.toolSlugs.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {piece.toolSlugs.map((slug) => {
                  const tool = getToolBySlug(slug);
                  return tool ? (
                    <Link
                      key={slug}
                      href={tool.url}
                      className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-400 dark:hover:bg-blue-900"
                    >
                      {tool.name}
                    </Link>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="space-y-10">
            {piece.sections.map((section, i) => (
              <section key={i}>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                  {section.body.split("\n").map((paragraph, j) => (
                    <p key={j}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {piece.toolSlugs.length > 0 && (
            <section className="mt-16 rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                Use Our Tools
              </h3>
              <div className="mt-4 flex flex-wrap gap-3">
                {piece.toolSlugs.map((slug) => {
                  const tool = getToolBySlug(slug);
                  return tool ? (
                    <Link
                      key={slug}
                      href={tool.url}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      {tool.name} →
                    </Link>
                  ) : null;
                })}
              </div>
            </section>
          )}

          {related.length > 0 && (
            <section className="mt-16">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                Related Resources
              </h3>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/${r.type === "article" ? "blog" : r.type}/${r.slug}`}
                    className="rounded-lg border border-zinc-200 p-4 transition-colors hover:border-blue-300 dark:border-zinc-800 dark:hover:border-blue-700"
                  >
                    <span className="text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      {r.type}
                    </span>
                    <h4 className="mt-1 font-semibold text-zinc-900 dark:text-zinc-50">
                      {r.title}
                    </h4>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                      {r.description}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  );
}
