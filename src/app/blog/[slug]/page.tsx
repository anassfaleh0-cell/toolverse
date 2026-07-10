import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContentBySlug, getAllContent, getRelatedContent } from "@/lib/content/registry";
import { SITE_URL } from "@/lib/constants";
import { ContentPage } from "@/components/shared/content-page";
import { ReadingProgress } from "@/components/shared/reading-progress";
import { SocialShare } from "@/components/shared/social-share";
import { FeaturedImage } from "@/components/shared/featured-image";
import { JsonLd } from "@/components/shared/json-ld";
import { faqSchema, videoSchema, articleSchema } from "@/lib/seo";
import { AUTHORS } from "@/lib/content/authors";
import Link from "next/link";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllContent().filter((c) => c.type === "article").map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const piece = getContentBySlug(slug);
  if (!piece || piece.type !== "article") return {};
  return {
    title: piece.title,
    description: piece.description,
    openGraph: { title: piece.title, description: piece.description, url: `${SITE_URL}/blog/${slug}`, images: [`${SITE_URL}/og-image.svg`] },
    twitter: { card: "summary_large_image", title: piece.title, description: piece.description },
    alternates: { canonical: `${SITE_URL}/blog/${slug}` },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const piece = getContentBySlug(slug);
  if (!piece || piece.type !== "article") notFound();

  const readingMins = piece.readingTimeMinutes || Math.max(1, Math.round(piece.sections.reduce((acc, s) => acc + s.body.split(/\s+/).length, 0) / 200));
  const related = getRelatedContent(piece, 3);
  const featuredImage = `${SITE_URL}/og-image.svg`;
  const canonicalUrl = `${SITE_URL}/blog/${slug}`;

  const faqItems = piece.sections
    .filter((s) => s.body.length > 80)
    .slice(0, 5)
    .map((s) => ({ question: s.heading, answer: s.body.slice(0, 300) }));

  const authorId = piece.author?.name.toLowerCase().replace(/\s+/g, "");
  const author = authorId && AUTHORS[authorId] ? AUTHORS[authorId] : {
    name: piece.author?.name ?? AUTHORS.team.name,
    title: "Contributor",
    bio: AUTHORS.team.bio,
    url: piece.author?.url ?? AUTHORS.team.url,
  };

  const isPillar = slug.startsWith("ultimate-guide") || piece.title.startsWith("Ultimate Guide");
  const articleSchemaData = articleSchema({
    type: isPillar ? "TechArticle" : "Article",
    headline: piece.title,
    description: piece.description,
    url: canonicalUrl,
    publishedAt: piece.publishedAt,
    updatedAt: piece.updatedAt,
    authorName: author.name,
    authorUrl: author.url,
    imageUrl: featuredImage,
  });

  const videoSchemaData = isPillar ? videoSchema({
    name: piece.title,
    description: `Video guide: ${piece.description}`,
    url: canonicalUrl,
    thumbnailUrl: featuredImage,
    duration: `PT${readingMins}M`,
    uploadDate: piece.publishedAt,
  }) : null;

  return (
    <>
      <ReadingProgress />

      <div className="mx-auto flex max-w-6xl gap-8 px-4 py-8 sm:px-6">
        <aside className="hidden lg:flex lg:flex-col lg:gap-3 lg:sticky lg:top-24 lg:self-start lg:pt-[200px]">
          <SocialShare
            url={canonicalUrl}
            title={piece.title}
            description={piece.description}
          />
        </aside>

        <article className="min-w-0 flex-1">
          <header className="mb-8">
            <div className="flex items-center gap-3 text-sm text-text-tertiary mb-3">
              <span className="rounded-full bg-nuvora-100 px-2.5 py-0.5 text-xs font-medium text-nuvora-600 dark:bg-nuvora-900/50 dark:text-nuvora-400">Blog</span>
              <span className="inline-flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-3.5" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {readingMins} min read
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
              {piece.title}
            </h1>
            <p className="mt-4 text-lg text-text-secondary leading-relaxed">
              {piece.description}
            </p>
            <div className="mt-6 flex items-center gap-3 text-sm text-text-tertiary">
              <span>By {piece.author?.name ?? AUTHORS.team.name}</span>
              <span>&middot;</span>
              <time dateTime={piece.publishedAt}>
                {new Date(piece.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </time>
              {piece.updatedAt !== piece.publishedAt && (
                <>
                  <span>&middot;</span>
                  <span>Updated {new Date(piece.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                </>
              )}
            </div>
          </header>

          <FeaturedImage src={featuredImage} title={piece.title} />

          <div className="lg:hidden mb-6">
            <details className="group rounded-xl border border-border-subtle bg-surface">
              <summary className="flex cursor-pointer items-center gap-2 px-5 py-3 text-sm font-medium text-text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4"><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></svg>
                Table of Contents
              </summary>
              <div className="border-t border-border-subtle px-5 py-3">
                <ul className="space-y-2">
                  {piece.sections.map((section, i) => (
                    <li key={i}>
                      <a href={`#section-${i}`} className="text-sm text-text-secondary hover:text-nuvora-600">{section.heading}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          </div>

          <ContentPage piece={piece} />

          {faqItems.length > 1 && (
            <section className="mt-16">
              <h2 className="text-xl font-bold text-text-primary mb-4">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {faqItems.map((faq, i) => (
                  <details key={i} className="group rounded-xl border border-border-subtle bg-surface transition-all hover:shadow-sm [&[open]]:shadow-sm">
                    <summary className="flex cursor-pointer items-center justify-between px-5 py-3.5 text-sm font-medium text-text-primary">
                      {faq.question}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4 shrink-0 text-text-tertiary transition-transform group-open:rotate-180">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </summary>
                    <div className="border-t border-border-subtle px-5 pb-3.5 pt-2.5">
                      <p className="text-sm text-text-secondary leading-relaxed">{faq.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          <section className="mt-16 rounded-2xl border border-border-subtle bg-surface p-6">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-nuvora-100 text-sm font-bold text-nuvora-600 dark:bg-nuvora-900/50 dark:text-nuvora-400">
                {author.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <p className="text-base font-semibold text-text-primary">{author.name}</p>
                <p className="text-xs text-text-tertiary">{author.title}</p>
                <p className="mt-2 text-sm text-text-secondary leading-relaxed">{author.bio}</p>
              </div>
            </div>
          </section>

          {related.length > 0 && (
            <section className="mt-16">
              <h2 className="text-xl font-bold text-text-primary mb-6">Read Next</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/blog/${r.slug}`}
                    className="group rounded-xl border border-border-subtle bg-surface p-4 transition-all hover:shadow-sm hover:border-nuvora-300 dark:hover:border-nuvora-700"
                  >
                    <h3 className="font-semibold text-text-primary group-hover:text-nuvora-600 dark:group-hover:text-nuvora-400 transition-colors text-sm">
                      {r.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-text-secondary leading-relaxed line-clamp-2">
                      {r.description}
                    </p>
                    <span className="mt-2 inline-block text-xs font-medium text-nuvora-600 dark:text-nuvora-400">
                      Read more &rarr;
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="mt-8 flex lg:hidden">
            <SocialShare
              url={canonicalUrl}
              title={piece.title}
              description={piece.description}
            />
          </div>
        </article>
      </div>

      {faqItems.length > 1 && <JsonLd data={faqSchema(faqItems)} />}
      <JsonLd data={articleSchemaData} />
      {videoSchemaData && <JsonLd data={videoSchemaData} />}
    </>
  );
}
