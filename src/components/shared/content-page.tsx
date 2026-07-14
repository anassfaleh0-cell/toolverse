import Link from "next/link";
import Image from "next/image";
import type { ContentPiece } from "@/lib/content/types";
import {
  Breadcrumbs,
  JsonLd,
  ComparisonMatrix,
  Icon,
} from "@/components/shared";
import { Badge, Callout } from "@/components/ui";
import {
  breadcrumbSchema,
  webPageSchema,
  articleSchema,
} from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import { getRelatedContent } from "@/lib/content/registry";
import { getToolBySlug } from "@/lib/registry";
import { AUTHORS } from "@/lib/content/authors";
import { ContentTracker } from "./content-tracker";
import { CrossLinks } from "./cross-links";

function resolveSchema(obj: Record<string, unknown>, siteUrl: string): Record<string, unknown> {
  return JSON.parse(JSON.stringify(obj).replace(/\{DOMAIN\}/g, siteUrl));
}

const TYPE_ROUTE: Record<string, string> = {
  guide: "guides",
  article: "blog",
  tutorial: "learn",
  comparison: "compare",
  "cheat-sheet": "cheat-sheets",
  examples: "examples",
  errors: "errors",
  reference: "reference",
  "best-practices": "best-practices",
  commands: "commands",
  "use-cases": "use-cases",
};

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
  return [
    { label: "Home", href: SITE_URL },
    {
      label: typeLabel[piece.type] || "Resources",
      href: `${SITE_URL}/${TYPE_ROUTE[piece.type] ?? piece.type}`,
    },
    { label: piece.title },
  ];
}

function AuthorCard({ piece }: { piece: ContentPiece }) {
  const authorName = piece.author?.name ?? AUTHORS.founder.name;
  const avatarUrl = AUTHORS.founder.avatarUrl;
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border-subtle bg-surface-secondary/50 p-4">
      {avatarUrl ? (
        <Image src={avatarUrl} alt={authorName} width={40} height={40} className="size-10 shrink-0 rounded-full object-cover" />
      ) : (
        <div className="flex size-10 items-center justify-center rounded-full bg-nuvora-100 text-xs font-bold text-nuvora-600 dark:bg-nuvora-900/50 dark:text-nuvora-400">
          {authorName.split(" ").map(n => n[0]).join("").slice(0, 2)}
        </div>
      )}
      <div>
        <p className="text-sm font-semibold text-text-primary">{authorName}</p>
        <p className="text-xs text-text-tertiary">
          Published {new Date(piece.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          {piece.updatedAt !== piece.publishedAt && ` · Updated ${new Date(piece.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`}
        </p>
      </div>
    </div>
  );
}

export function ContentPage({ piece }: { piece: ContentPiece }) {
  const breadcrumbs = getContentBreadcrumbs(piece);
  const related = getRelatedContent(piece, 4);
  const typeUrl = TYPE_ROUTE[piece.type] ?? piece.type;
  const typeLabel =
    piece.type.charAt(0).toUpperCase() + piece.type.slice(1);
  const readingMins = Math.max(1, Math.round(piece.sections.reduce((acc, s) => acc + s.body.split(/\s+/).length, 0) / 200));

  return (
    <>
      <ContentTracker slug={piece.slug} title={piece.title} url={`/${typeUrl}/${piece.slug}`} type={piece.type} typeLabel={typeLabel} readingTimeMinutes={readingMins} />
      <JsonLd data={webPageSchema({ name: piece.title, description: piece.description, url: `${SITE_URL}/${typeUrl}/${piece.slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={articleSchema({
        type: piece.type === "article" ? "Article" : "TechArticle",
        headline: piece.title,
        description: piece.description,
        url: `${SITE_URL}/${typeUrl}/${piece.slug}`,
        publishedAt: piece.publishedAt,
        updatedAt: piece.updatedAt,
        authorName: piece.author?.name ?? AUTHORS.founder.name,
        authorUrl: piece.author?.url ?? `${SITE_URL}/authors/founder`,
        imageUrl: piece.sections.length > 0 ? `${SITE_URL}/og-image.svg` : undefined,
      })} />
      {piece.schema && <JsonLd data={resolveSchema(piece.schema, SITE_URL)} />}

      <article>
        <header className="border-b border-border-subtle bg-surface-secondary/30 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <Breadcrumbs items={breadcrumbs} />
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Badge variant="info">{typeLabel}</Badge>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-secondary px-3 py-1 text-xs font-medium text-text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-3.5" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {readingMins} min read
              </span>
              <Badge variant="neutral">{piece.difficulty}</Badge>
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
              {piece.title}
            </h1>
            <p className="mt-4 text-lg text-text-secondary leading-relaxed">
              {piece.description}
            </p>
            <div className="mt-6">
              <AuthorCard piece={piece} />
            </div>
            {piece.toolSlugs.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {piece.toolSlugs.map((slug) => {
                  const tool = getToolBySlug(slug);
                  return tool ? (
                    <Link
                      key={slug}
                      href={tool.url}
                      className="inline-flex items-center gap-1 rounded-full bg-nuvora-100 px-3 py-1 text-xs font-medium text-nuvora-600 hover:bg-nuvora-200 dark:bg-nuvora-900/50 dark:text-nuvora-400 dark:hover:bg-nuvora-900/70"
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
          <div className="mx-auto max-w-3xl px-4 sm:px-6 -mt-4">
            <nav className="mb-12 rounded-2xl border border-border-subtle bg-surface p-5 shadow-sm hidden md:block">
              <div className="flex items-center gap-2 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4 text-nuvora-600 dark:text-nuvora-400">
                  <path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" />
                </svg>
                <h2 className="text-sm font-semibold text-text-primary">
                  Table of Contents
                </h2>
              </div>
              <ul className="space-y-1.5">
                {piece.sections.map((section, i) => (
                  <li key={i}>
                    <a
                      href={`#section-${i}`}
                      className="text-sm text-text-secondary hover:text-nuvora-600 dark:hover:text-nuvora-400 transition-colors"
                    >
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
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
                  <h2 className="text-2xl font-bold tracking-tight text-text-primary">
                    {section.heading}
                  </h2>
                  <div className="mt-4 space-y-4 text-text-secondary leading-relaxed">
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
                  <h2 className="text-2xl font-bold tracking-tight text-text-primary">
                    {section.heading}
                  </h2>
                  <div className="mt-4 space-y-4 text-text-secondary leading-relaxed">
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
            <section className="mt-16 rounded-2xl border border-border-subtle bg-gradient-to-br from-surface to-nuvora-50/30 p-6 dark:from-surface dark:to-nuvora-950/20">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-nuvora-100 text-nuvora-600 dark:bg-nuvora-900/50 dark:text-nuvora-400">
                  <Icon name="PenSquare" className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary">
                    Try it yourself
                  </h3>
                  <p className="text-sm text-text-secondary">Use our free tools to get started right now</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {piece.toolSlugs.map((slug) => {
                  const tool = getToolBySlug(slug);
                  return tool ? (
                    <Link
                      key={slug}
                      href={tool.url}
                      className="inline-flex items-center gap-2 rounded-xl bg-nuvora-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-nuvora-700 active:scale-[0.97]"
                    >
                      {tool.name}
                      <Icon name="ArrowRight" className="size-4" />
                    </Link>
                  ) : null;
                })}
              </div>
            </section>
          )}

          {related.length > 0 && (
            <section className="mt-16">
              <h3 className="text-xl font-bold text-text-primary">
                Related Resources
              </h3>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/${TYPE_ROUTE[r.type] ?? r.type}/${r.slug}`}
                    className="group rounded-2xl border border-border-subtle bg-surface p-5 transition-all hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wider text-nuvora-600 dark:text-nuvora-400">
                      {r.type}
                    </span>
                    <h4 className="mt-2 font-semibold text-text-primary group-hover:text-nuvora-600 dark:group-hover:text-nuvora-400 transition-colors">
                      {r.title}
                    </h4>
                    <p className="mt-1.5 text-sm text-text-secondary leading-relaxed line-clamp-2">
                      {r.description}
                    </p>
                    <div className="mt-3 flex items-center gap-1 text-xs font-medium text-text-tertiary group-hover:text-nuvora-600 dark:group-hover:text-nuvora-400 transition-colors">
                      Read more
                      <Icon name="ArrowRight" className="size-3" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6 pb-12">
          <CrossLinks contentSlug={piece.slug} />
        </div>
      </article>
    </>
  );
}
