import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/constants";
import { LANDING_PAGES, getLandingPage, getAllLandingSlugs, getRelatedLandingPages } from "@/lib/seo/landing-pages";
import { getAllTools, getToolBySlug, generateToolBreadcrumbs, generateToolMetadata, generateToolFaq, getRelatedTools } from "@/lib/registry";
import { getContentForTool } from "@/lib/content/registry";
import { JsonLd, Breadcrumbs, SuggestedNextTool, RelatedContent, ToolLayout, FaqSection } from "@/components/shared";
import { getToolComponent } from "@/lib/tools-registry";
import { ToolComponent as GenericToolComponent } from "@/components/tools/ToolComponent";
import { webPageSchema, breadcrumbSchema, faqSchema, softwareAppSchema } from "@/lib/seo";
import type { FaqItem } from "@/lib/seo";

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

export const dynamicParams = false;

export function generateStaticParams() {
  const landingSlugs = getAllLandingSlugs();
  const toolSlugs = getAllTools().map((t) => t.slug);
  const allSlugs = [...new Set([...landingSlugs, ...toolSlugs])];
  return allSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getLandingPage(slug);
  if (page) {
    return {
      title: page.getTitle(),
      description: page.getDescription(),
      alternates: { canonical: `${SITE_URL}/${page.slug}` },
      openGraph: { title: page.getTitle(), description: page.getDescription(), url: `${SITE_URL}/${page.slug}` },
      twitter: { card: "summary_large_image", title: page.getTitle(), description: page.getDescription() },
    };
  }
  const tool = getToolBySlug(slug);
  if (tool) return generateToolMetadata(tool);
  return {};
}

function LandingPageContent({ slug }: { slug: string }) {
  const page = getLandingPage(slug);
  if (!page) return null;

  const tools = page.getTools();
  const faqs = page.getFaqs();
  const currentTool = getAllTools().find((t) => t.slug === slug);
  const relatedLandingPages = getRelatedLandingPages(slug);
  const allFaqs: FaqItem[] = faqs;
  const allToolSlugs = [...new Set(tools.map((t) => t.slug))];

  const breadcrumbs = [
    { label: "Home", href: SITE_URL },
    { label: page.getH1() },
  ];

  const relatedContent = allToolSlugs.length > 0
    ? [...new Set(allToolSlugs.flatMap((ts) => getContentForTool(ts)))].slice(0, 4)
    : [];

  return (
    <>
      <JsonLd data={webPageSchema({
        name: page.getTitle(),
        description: page.getDescription(),
        url: `${SITE_URL}/${page.slug}`,
        breadcrumbs,
      })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      {allFaqs.length > 0 && <JsonLd data={faqSchema(allFaqs)} />}
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <Breadcrumbs items={breadcrumbs} />

        <div className="mt-6">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{page.getH1()}</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{page.getSubtitle()}</p>
        </div>

        <p className="mt-6 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {page.getIntro()}
        </p>

        {tools.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Tools ({tools.length})
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={tool.url}
                  className="group rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                >
                  <h3 className="text-sm font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
                    {tool.name}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                    {tool.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {currentTool && (
          <div className="mt-12">
            <SuggestedNextTool currentSlug={slug} />
          </div>
        )}

        {relatedContent.length > 0 && (
          <section className="mt-12 border-t border-zinc-200 pt-10 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Related Guides & Resources
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {relatedContent.map((piece) => {
                const resolvedRoute = TYPE_ROUTE[piece.type] ?? piece.type;
                const typeColor: Record<string, string> = {
                  guide: "text-blue-600 dark:text-blue-400",
                  article: "text-purple-600 dark:text-purple-400",
                  comparison: "text-amber-600 dark:text-amber-400",
                  learn: "text-emerald-600 dark:text-emerald-400",
                };
                return (
                  <Link
                    key={piece.slug}
                    href={`/${resolvedRoute}/${piece.slug}`}
                    className="rounded-lg border border-zinc-200 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                  >
                    <span className={`text-xs font-medium uppercase tracking-wider ${typeColor[piece.type] || "text-zinc-500"}`}>
                      {piece.type === "learn" ? "Beginner Guide" : piece.type.charAt(0).toUpperCase() + piece.type.slice(1)}
                    </span>
                    <h3 className="mt-1 font-semibold text-zinc-900 dark:text-zinc-50">{piece.title}</h3>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">{piece.description}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {relatedLandingPages.length > 0 && (
          <section className="mt-12 border-t border-zinc-200 pt-10 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Related Collections
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {relatedLandingPages.map((lp) => (
                <Link
                  key={lp.slug}
                  href={`/${lp.slug}`}
                  className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                  {lp.getH1()}
                </Link>
              ))}
            </div>
          </section>
        )}

        {allFaqs.length > 0 && (
          <section className="mt-12 border-t border-zinc-200 pt-10 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Frequently Asked Questions
            </h2>
            <dl className="mt-4 space-y-4">
              {allFaqs.map((faq) => (
                <div key={faq.question}>
                  <dt className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {faq.question}
                  </dt>
                  <dd className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <section className="mt-12 border-t border-zinc-200 pt-10 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Explore More
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {LANDING_PAGES.filter((lp) => lp.slug !== page.slug).slice(0, 12).map((lp) => (
              <Link
                key={lp.slug}
                href={`/${lp.slug}`}
                className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                {lp.getH1()}
              </Link>
            ))}
          </div>
        </section>
      </main>

      {allToolSlugs.length > 0 && (
        <RelatedContent toolSlug={allToolSlugs[0]} />
      )}
    </>
  );
}

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getLandingPage(slug);
  if (page) return <LandingPageContent slug={slug} />;
  const tool = getToolBySlug(slug);
  if (tool) return <ToolGenericPage slug={slug} />;
  notFound();
}

function ToolGenericPage({ slug }: { slug: string }) {
  const tool = getToolBySlug(slug);
  if (!tool) return null;

  const breadcrumbs = generateToolBreadcrumbs(tool);
  const faqItems = generateToolFaq(tool);
  const relatedTools = getRelatedTools(tool, 6);
  const ToolComponent = getToolComponent(slug);

  return (
    <>
      <JsonLd data={webPageSchema({ name: tool.name, description: tool.description, url: `${SITE_URL}/${tool.slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: tool.name, description: tool.description, url: `${SITE_URL}/${tool.slug}` })} />

      <ToolLayout toolSlug={slug}>
        {ToolComponent ? <ToolComponent /> : <GenericToolComponent slug={slug} />}
      </ToolLayout>

      <section className="border-t border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title={`${tool.name} FAQ`} />
        </div>
      </section>

      {relatedTools.length > 0 && (
        <section className="border-t border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedTools.map((rt) => (
                <Link key={rt.slug} href={rt.url} className="group rounded-xl border border-zinc-200 p-5 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900">
                  <h3 className="font-semibold text-zinc-900 group-hover:text-nuvora-600 dark:text-zinc-50 dark:group-hover:text-nuvora-400">{rt.name}</h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">{rt.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-zinc-200 py-12 dark:border-zinc-800 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedContent toolSlug={slug} />
        </div>
      </section>
    </>
  );
}
