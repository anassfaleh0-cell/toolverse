import Link from "next/link";
import type { ContentPiece } from "@/lib/content/types";
import {
  Breadcrumbs,
  JsonLd,
  ComparisonMatrix,
} from "@/components/shared";
import { Badge, Callout } from "@/components/ui";
import {
  faqSchema,
  breadcrumbSchema,
  webPageSchema,
  type FaqItem,
} from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { getRelatedContent } from "@/lib/content/registry";
import { getToolBySlug } from "@/lib/registry";
import { ContentTracker } from "./content-tracker";

function getContentBreadcrumbs(piece: ContentPiece) {
  const typeLabel: Record<string, string> = {
    guide: "Guides",
    tutorial: "Tutorials",
    article: "Blog",
    learn: "Learn",
    comparison: "Comparisons",
    examples: "Examples",
    errors: "Error Guides",
    reference: "Reference",
    "cheat-sheet": "Cheat Sheets",
    "best-practices": "Best Practices",
    commands: "Commands",
    "use-cases": "Use Cases",
  };
  const typeRoute: Record<string, string> = {
    guide: "guides",
    article: "blog",
    tutorial: "learn",
    "cheat-sheet": "cheat-sheets",
  };
  return [
    { label: "Home", href: SITE_URL },
    {
      label: typeLabel[piece.type] || "Resources",
      href: `${SITE_URL}/${typeRoute[piece.type] ?? piece.type}`,
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
  const readingMins = Math.max(1, Math.round(piece.sections.reduce((acc, s) => acc + s.body.split(/\s+/).length, 0) / 200));

  return (
    <>
      <ContentTracker slug={piece.slug} title={piece.title} url={`/${typeUrl}/${piece.slug}`} type={piece.type} typeLabel={typeLabel} readingTimeMinutes={readingMins} />
      <JsonLd data={webPageSchema({ name: piece.title, description: piece.description, url: `${SITE_URL}/${typeUrl}/${piece.slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      {schemaFaq.length > 1 && <JsonLd data={faqSchema(schemaFaq)} />}
      {piece.schema && <JsonLd data={piece.schema} />}

      <article>
        <header className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <Breadcrumbs items={breadcrumbs} />
            <Badge variant="info" className="mt-4">
              {typeLabel}
            </Badge>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              {piece.title}
            </h1>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              {piece.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-500 dark:text-zinc-500">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-3.5" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {piece.readingTimeMinutes} min read
              </span>
              <span>
                Published: {new Date(piece.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </span>
              {piece.updatedAt !== piece.publishedAt && (
                <span className="text-amber-600 dark:text-amber-400">
                  Updated: {new Date(piece.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              )}
              {piece.author && (
                <span>
                  By {piece.author.url ? (
                    <a href={piece.author.url} className="text-blue-600 hover:underline dark:text-blue-400" target="_blank" rel="author noopener">{piece.author.name}</a>
                  ) : piece.author.name}
                </span>
              )}
              <Badge variant="neutral">
                {piece.difficulty}
              </Badge>
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

        {piece.sections.length > 1 && (
          <nav className="mb-12 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 hidden md:block">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Table of Contents
            </h3>
            <ul className="mt-2 space-y-1">
              {piece.sections.map((section, i) => (
                <li key={i}>
                  <a
                    href={`#section-${i}`}
                    className="text-sm text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400"
                  >
                    {section.heading}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          {piece.type === "comparison" ? (
            <div className="space-y-10">
              <ComparisonMatrix
                headers={["Comparison", "Details"]}
                rows={piece.sections.map((s) => ({
                  feature: s.heading.replace(/^vs\s+/i, ""),
                  values: [s.body.length > 300 ? s.body.slice(0, 300) + "..." : s.body],
                }))}
                title={`${piece.toolSlugs[0] ? getToolBySlug(piece.toolSlugs[0])?.name ?? "" : ""} vs Alternatives`}
              />
              {piece.sections.map((section, i) => (
                <section key={i} id={`section-${i}`}>
                  <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    {section.heading}
                  </h2>
                  <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                    {section.body.split("\n").map((paragraph, j) => {
                      const trimmed = paragraph.trim();
                      const tipMatch = trimmed.match(/^(?:tip|Tip):\s*(.*)$/);
                      const warningMatch = trimmed.match(/^(?:warning|Warning):\s*(.*)$/);
                      const noteMatch = trimmed.match(/^(?:note|Note):\s*(.*)$/);
                      if (tipMatch) {
                        return <Callout key={j} variant="tip">{tipMatch[1]}</Callout>;
                      }
                      if (warningMatch) {
                        return <Callout key={j} variant="warning">{warningMatch[1]}</Callout>;
                      }
                      if (noteMatch) {
                        return <Callout key={j} variant="note">{noteMatch[1]}</Callout>;
                      }
                      return <p key={j}>{paragraph}</p>;
                    })}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="space-y-10">
              {piece.sections.map((section, i) => (
                <section key={i} id={`section-${i}`}>
                  <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    {section.heading}
                  </h2>
                  <div className="mt-4 space-y-4 text-zinc-600 dark:text-zinc-400">
                    {section.body.split("\n").map((paragraph, j) => {
                      const trimmed = paragraph.trim();
                      const tipMatch = trimmed.match(/^(?:tip|Tip):\s*(.*)$/);
                      const warningMatch = trimmed.match(/^(?:warning|Warning):\s*(.*)$/);
                      const noteMatch = trimmed.match(/^(?:note|Note):\s*(.*)$/);
                      if (tipMatch) {
                        return <Callout key={j} variant="tip">{tipMatch[1]}</Callout>;
                      }
                      if (warningMatch) {
                        return <Callout key={j} variant="warning">{warningMatch[1]}</Callout>;
                      }
                      if (noteMatch) {
                        return <Callout key={j} variant="note">{noteMatch[1]}</Callout>;
                      }
                      return <p key={j}>{paragraph}</p>;
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}

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
                      className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
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
