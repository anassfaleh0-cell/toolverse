import Link from "next/link";
import type { ContentPiece } from "@/lib/content/types";
import { getRelatedContent } from "@/lib/content/registry";
import { getToolBySlug } from "@/lib/registry";
import { AUTHORS } from "@/lib/content/authors";
import { JsonLd } from "@/components/shared/json-ld";
import { LazySection } from "@/components/shared/lazy-section";
import { SITE_URL } from "@/lib/constants";
import { faqSchema, articleSchema, webPageSchema, breadcrumbSchema } from "@/lib/seo";
import type { FaqItem } from "@/lib/seo";

const TYPE_LABEL: Record<string, string> = { article: "Blog", guide: "Guide", tutorial: "Tutorial", comparison: "Comparison" };
const DIFFICULTY_LABEL: Record<string, string> = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" };

function generateArticleSvg(title: string): string {
  const escaped = title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const words = escaped.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    if ((current + " " + w).trim().length > 32) { lines.push(current.trim()); current = w; }
    else { current = (current ? current + " " : "") + w; }
  }
  if (current.trim()) lines.push(current.trim());
  const baseY = lines.length < 3 ? 360 : 310;
  const texts = lines.map((l, i) => `<text x="600" y="${baseY + i * 60}" font-family="system-ui,-apple-system,sans-serif" font-size="${lines.length > 2 ? 36 : 44}" font-weight="700" fill="white" text-anchor="middle" opacity="0.95">${l}</text>`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675"><defs><linearGradient id="a" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#6366f1"/><stop offset="35%" stop-color="#8b5cf6"/><stop offset="65%" stop-color="#06b6d4"/><stop offset="100%" stop-color="#22d3ee"/></linearGradient></defs><rect width="1200" height="675" fill="url(#a)"/><rect x="1080" y="620" width="90" height="28" rx="4" fill="white" opacity="0.15"/><text x="1125" y="639" font-family="system-ui,-apple-system,sans-serif" font-size="11" font-weight="600" fill="white" text-anchor="middle" opacity="0.6">NUVORA</text>${texts}</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

function renderInlineCode(text: string) {
  const parts = text.split(/(`[^`]+`)/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i} className="rounded bg-surface-secondary/80 px-1.5 py-0.5 font-mono text-sm text-nuvora-600 dark:text-nuvora-400">{part.slice(1, -1)}</code>;
    }
    return part;
  });
}

function renderPara(p: string, j: number) {
  const t = p.trim();
  if (t.startsWith("### ")) return <h3 key={j} className="text-xl font-semibold text-text-primary mt-6 -mb-2">{t.slice(4)}</h3>;
  if (t.startsWith("> ")) return <blockquote key={j} className="border-l-[3px] border-nuvora-500 bg-nuvora-50/50 pl-4 py-3 pr-4 rounded-r-xl italic text-text-secondary dark:bg-nuvora-950/30">{t.slice(2)}</blockquote>;
  if (t.startsWith("- ") || t.match(/^\d+\.\s/)) return null;
  const [, kind, msg] = t.match(/^(tip|warning|note):\s*(.*)$/i) || [];
  if (kind) {
    const c = { tip: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300", warning: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300", note: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300" }[kind.toLowerCase()] || "";
    return <div key={j} className={"rounded-xl border px-4 py-3 text-sm " + c}><strong>{kind.charAt(0).toUpperCase() + kind.slice(1)}:</strong> {msg}</div>;
  }
  const parts = t.split(/(`[^`]+`)/g);
  if (parts.length === 1) return <p key={j}>{t}</p>;
  return <p key={j}>{parts.map((pt, pi) => pt.startsWith("`") && pt.endsWith("`") ? <code key={pi} className="rounded bg-surface-secondary/80 px-1.5 py-0.5 font-mono text-sm text-nuvora-600 dark:text-nuvora-400">{pt.slice(1, -1)}</code> : pt)}</p>;
}

function ArticleBody({ sections }: { sections: ContentPiece["sections"] }) {
  return (
    <div className="space-y-8">
      {sections.map((section, i) => {
        const pars = section.body.split("\n").filter(Boolean);
        const items = pars.map((p, j) => renderPara(p, j)).filter(Boolean);
        const lists: React.ReactNode[] = [];
        const listItems = pars.filter(p => p.trim().startsWith("- "));
        if (listItems.length > 0) {
          lists.push(<ul key="ul" className="list-disc pl-6 space-y-1.5 marker:text-nuvora-500">{listItems.map((p, j) => <li key={j}>{p.trim().slice(2)}</li>)}</ul>);
        }
        const orderedItems = pars.filter(p => p.trim().match(/^\d+\.\s/));
        if (orderedItems.length > 0) {
          lists.push(<ol key="ol" className="list-decimal pl-6 space-y-1.5">{orderedItems.map((p, j) => <li key={j}>{p.trim().replace(/^\d+\.\s/, "")}</li>)}</ol>);
        }
        return (
          <section key={i} id={`section-${i}`}>
            <h2 className="group flex items-center gap-2 text-2xl font-bold tracking-tight text-text-primary mt-0">
              <a href={`#section-${i}`} className="text-nuvora-500 opacity-0 group-hover:opacity-100 transition-opacity text-xl" aria-label={`Link to ${section.heading}`}>#</a>
              {section.heading}
            </h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-text-secondary [&_a]:text-nuvora-600 [&_a:hover]:underline dark:[&_a]:text-nuvora-400">
              {items}
              {lists}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export function ArticleLayout({ piece, basePath = "blog" }: { piece: ContentPiece; basePath?: string }) {
  const readingMins = piece.readingTimeMinutes || Math.max(1, Math.round(piece.sections.reduce((a, s) => a + s.body.split(/\s+/).length, 0) / 200));
  const related = getRelatedContent(piece, 3);
  const canonicalUrl = `${SITE_URL}/${basePath}/${piece.slug}`;
  const typeLabel = TYPE_LABEL[piece.type] ?? "Article";
  const authorKey = piece.author?.name.toLowerCase().replace(/\s+/g, "");
  const author = (authorKey && AUTHORS[authorKey]) ? AUTHORS[authorKey] : { name: piece.author?.name ?? AUTHORS.founder.name, title: "Contributor", bio: AUTHORS.founder.bio, url: `${SITE_URL}/authors/founder` };
  const faqItems: FaqItem[] = piece.sections.filter(s => s.body.length > 80).slice(0, 5).map(s => ({ question: s.heading, answer: s.body.slice(0, 300) }));
  const isPillar = piece.slug.startsWith("ultimate-guide") || piece.title.startsWith("Ultimate Guide");
  const imgSrc = generateArticleSvg(piece.title);
  const relatedTools = piece.toolSlugs.map(s => getToolBySlug(s)).filter(Boolean) as NonNullable<ReturnType<typeof getToolBySlug>>[];
  const sectionLabel = basePath === "guides" ? "Guides" : "Blog";
  const breacrumbsArr = [{ label: "Home", href: SITE_URL }, { label: sectionLabel, href: `${SITE_URL}/${basePath}` }, { label: piece.title }];
  const artSchema = articleSchema({ type: isPillar ? "TechArticle" : "Article", headline: piece.title, description: piece.description, url: canonicalUrl, publishedAt: piece.publishedAt, updatedAt: piece.updatedAt, authorName: author.name, authorUrl: author.url, imageUrl: imgSrc });

  return (
    <>
      <JsonLd data={webPageSchema({ name: piece.title, description: piece.description, url: canonicalUrl, breadcrumbs: breacrumbsArr })} />
      <JsonLd data={breadcrumbSchema(breacrumbsArr)} />
      <JsonLd data={artSchema} />
      {faqItems.length > 1 && <JsonLd data={faqSchema(faqItems)} />}

      <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {/* Compact breadcrumb */}
        <nav className="mb-3 text-xs text-text-tertiary">
          <Link href="/" className="hover:text-nuvora-600 transition-colors">Home</Link>
          <span className="mx-1.5">/</span>
          <Link href={`/${basePath}`} className="hover:text-nuvora-600 transition-colors">{sectionLabel}</Link>
          <span className="mx-1.5">/</span>
          <span className="text-text-secondary">{piece.title}</span>
        </nav>

        {/* Badges row */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-nuvora-100 px-2 py-0.5 text-[11px] font-medium text-nuvora-600 dark:bg-nuvora-900/50 dark:text-nuvora-400">{typeLabel}</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-surface-secondary px-2 py-0.5 text-[11px] font-medium text-text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-3" aria-hidden="true"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            {readingMins} min read
          </span>
          <span className="rounded-full bg-surface-secondary px-2 py-0.5 text-[11px] font-medium text-text-tertiary">{DIFFICULTY_LABEL[piece.difficulty] ?? piece.difficulty}</span>
        </div>

        {/* H1 Title — compact */}
        <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">{piece.title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">{piece.description}</p>

        {/* Author + date — compact row */}
        <div className="mt-4 flex items-center gap-3 pb-5 border-b border-border-subtle">
          <div className="flex size-8 items-center justify-center rounded-full bg-nuvora-100 text-[10px] font-bold text-nuvora-600 dark:bg-nuvora-900/50 dark:text-nuvora-400">
            {author.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </div>
          <div className="text-xs text-text-tertiary">
            <span className="font-medium text-text-primary">{author.name}</span>
            <span className="mx-1.5">&middot;</span>
            <time dateTime={piece.publishedAt}>{new Date(piece.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
            {piece.updatedAt !== piece.publishedAt && <span> · Updated {new Date(piece.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>}
          </div>
        </div>

        {/* Featured Image — auto-generated aurora with article title */}
        <div className="mt-6 mb-8 overflow-hidden rounded-xl border border-border-subtle">
          <img src={imgSrc} alt={piece.title} className="aspect-video w-full object-cover" />
        </div>

        {/* Table of Contents — if multiple sections */}
        {piece.sections.length > 1 && (
          <>
            <details className="mb-6 rounded-lg border border-border-subtle bg-surface sm:hidden">
              <summary className="flex cursor-pointer items-center gap-2 px-4 py-2.5 text-sm font-medium text-text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4" aria-hidden="true"><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></svg>
                Table of Contents
              </summary>
              <div className="border-t border-border-subtle px-4 py-2">
                <ul className="space-y-1.5">{piece.sections.map((s, i) => <li key={i}><a href={`#section-${i}`} className="text-sm text-text-secondary hover:text-nuvora-600">{s.heading}</a></li>)}</ul>
              </div>
            </details>
            <nav className="mb-8 hidden rounded-lg border border-border-subtle bg-surface p-4 sm:block">
              <div className="flex items-center gap-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4 text-nuvora-600 dark:text-nuvora-400" aria-hidden="true"><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></svg>
                <h2 className="text-sm font-semibold text-text-primary">Table of Contents</h2>
              </div>
              <ul className="space-y-1">{piece.sections.map((s, i) => <li key={i}><a href={`#section-${i}`} className="text-sm text-text-secondary hover:text-nuvora-600 dark:hover:text-nuvora-400 transition-colors">{s.heading}</a></li>)}</ul>
            </nav>
          </>
        )}

        {/* Article Body — clean prose */}
        <div className="text-base leading-relaxed text-text-secondary [&_a]:text-nuvora-600 [&_a:hover]:underline dark:[&_a]:text-nuvora-400">
          <ArticleBody sections={piece.sections} />
        </div>

        {/* FAQ — lazy loaded, collapsed by default */}
        <LazySection rootMargin="300px" minHeight="200px">
          {faqItems.length > 1 && (
            <section className="mt-12">
              <h2 className="text-lg font-bold text-text-primary mb-3">Frequently Asked Questions</h2>
              <div className="space-y-2">
                {faqItems.map((faq, i) => (
                  <details key={i} className="group rounded-lg border border-border-subtle bg-surface transition-all">
                    <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-medium text-text-primary">
                      {faq.question}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4 shrink-0 text-text-tertiary transition-transform group-open:rotate-180"><path d="m6 9 6 6 6-6" /></svg>
                    </summary>
                    <div className="border-t border-border-subtle px-4 pb-3 pt-2"><p className="text-sm leading-relaxed text-text-secondary">{faq.answer}</p></div>
                  </details>
                ))}
              </div>
            </section>
          )}
        </LazySection>

        {/* Author Bio — lazy loaded */}
        <LazySection rootMargin="200px" minHeight="120px">
          <section className="mt-10 rounded-xl border border-border-subtle bg-surface p-5">
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-nuvora-100 text-xs font-bold text-nuvora-600 dark:bg-nuvora-900/50 dark:text-nuvora-400">
                {author.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text-primary">{author.name}</p>
                <p className="text-xs text-text-tertiary">{author.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{author.bio}</p>
                {author.url && <Link href={author.url} className="mt-2 inline-block text-xs font-medium text-nuvora-600 hover:underline dark:text-nuvora-400">View all articles by {author.name.split(" ")[0]} &rarr;</Link>}
              </div>
            </div>
          </section>
        </LazySection>

        {/* Related Tools — lazy loaded */}
        <LazySection rootMargin="200px" minHeight="120px">
          {relatedTools.length > 0 && (
            <section className="mt-10">
              <h2 className="text-lg font-bold text-text-primary mb-3">Related Tools</h2>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin -mx-1 px-1">
                {relatedTools.map(tool => (
                  <Link key={tool.slug} href={tool.url} className="flex shrink-0 flex-col gap-1 rounded-xl border border-border-subtle bg-surface p-3 transition-all hover:shadow-sm hover:border-nuvora-300 dark:hover:border-nuvora-700 min-w-[160px]">
                    <span className="text-sm font-semibold whitespace-nowrap text-text-primary">{tool.name}</span>
                    <span className="line-clamp-2 text-xs text-text-tertiary">{tool.description}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </LazySection>

        {/* Related Articles — lazy loaded */}
        <LazySection rootMargin="200px" minHeight="120px">
          {related.length > 0 && (
            <section className="mt-10">
              <h2 className="text-lg font-bold text-text-primary mb-4">Related Articles</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {related.map(r => (
                  <Link key={r.slug} href={`/blog/${r.slug}`} className="group rounded-xl border border-border-subtle bg-surface p-3 transition-all hover:shadow-sm hover:border-nuvora-300 dark:hover:border-nuvora-700">
                    <div className="mb-2 aspect-video w-full overflow-hidden rounded-lg bg-gradient-to-br from-nuvora-100 to-aurora-100 dark:from-nuvora-900/50 dark:to-aurora-900/30">
                      <img src={generateArticleSvg(r.title)} alt={r.title} className="h-full w-full object-cover" />
                    </div>
                    <h3 className="text-sm font-semibold text-text-primary group-hover:text-nuvora-600 dark:group-hover:text-nuvora-400 transition-colors line-clamp-2">{r.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-text-secondary line-clamp-2">{r.description}</p>
                    <span className="mt-1.5 inline-block text-xs font-medium text-nuvora-600 dark:text-nuvora-400">Read more &rarr;</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </LazySection>

        {/* Share Buttons — lazy loaded */}
        <LazySection rootMargin="200px" minHeight="50px">
          <section className="mt-8 pt-6 border-t border-border-subtle">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-text-tertiary mr-1">Share:</span>
              {[
                { name: "Twitter", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(piece.title)}&url=${encodeURIComponent(canonicalUrl)}&via=NuvoraHQ` },
                { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}` },
                { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}` },
                { name: "Reddit", href: `https://reddit.com/submit?url=${encodeURIComponent(canonicalUrl)}&title=${encodeURIComponent(piece.title)}` },
              ].map(link => (
                <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`Share on ${link.name}`}
                  className="flex size-8 items-center justify-center rounded-lg border border-border-subtle bg-surface text-text-secondary hover:bg-surface-secondary hover:text-nuvora-600 transition-all">
                  {link.name === "Twitter" && <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>}
                  {link.name === "Facebook" && <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>}
                  {link.name === "LinkedIn" && <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>}
                  {link.name === "Reddit" && <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.059l-2.295-.383v5.4h5.651a3.35 3.35 0 0 1 1.498 6.325 3.35 3.35 0 0 1-3.446-.722 3.35 3.35 0 0 1-1.08-2.347h-2.065v3.162c0 1.176-.969 2.132-2.152 2.132a2.14 2.14 0 0 1-2.152-2.132c0-1.176.969-2.132 2.152-2.132.284 0 .552.055.8.154v-2.68H9.19v.762c-.434.357-.912.64-1.446.813a2.16 2.16 0 0 1-.177-1.064 2.16 2.16 0 0 1 2.16-2.16c.484 0 .844.173 1.124.46l.196-.18a2.16 2.16 0 0 1-.42-1.224 2.16 2.16 0 0 1 2.16-2.16c.484 0 .844.173 1.124.46l.196-.18a2.16 2.16 0 0 1-.42-1.224 2.16 2.16 0 0 1 2.16-2.16z"/></svg>}
                </a>
              ))}
            </div>
          </section>
        </LazySection>
      </article>
    </>
  );
}
