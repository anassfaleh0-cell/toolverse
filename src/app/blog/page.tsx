import type { Metadata } from "next";
import Link from "next/link";
import { getArticles } from "@/lib/content/registry";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Blog — Expert Guides & Articles — ${SITE_NAME}`,
  description: `Expert guides about DNS management, SEO tools, developer utilities, AI tools, and webmaster resources. Learn from in-depth articles and tutorials.`,
  openGraph: { title: `Blog — Expert Guides & Articles — ${SITE_NAME}`, description: `Expert guides about DNS management, SEO tools, developer utilities, AI tools, and webmaster resources.`, url: `${SITE_URL}/blog` },
  twitter: { card: "summary_large_image", title: `Blog — Expert Guides & Articles — ${SITE_NAME}`, description: `Expert guides about DNS, SEO, developer tools, and AI.` },
  alternates: { canonical: `${SITE_URL}/blog` },
};

const breadcrumbs = [{ label: "Home", href: SITE_URL }, { label: "Blog" }];

export default function BlogPage() {
  const articles = getArticles();
  return (
    <>
      <JsonLd data={webPageSchema({ name: `Blog - ${SITE_NAME}`, description: "Expert guides about SEO, DNS, developer tools, AI, and calculators.", url: `${SITE_URL}/blog`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-border-subtle bg-surface-secondary/30 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">Blog</h1>
          <p className="mt-4 text-lg text-text-secondary">Expert articles and guides about SEO tools, DNS management, developer utilities, AI-powered tools, calculators, and webmaster resources.</p>
        </div>
      </section>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group rounded-xl border border-border-subtle bg-surface p-5 transition-all hover:shadow-sm hover:border-nuvora-300 dark:hover:border-nuvora-700"
              >
                <div className="mb-3 aspect-video w-full overflow-hidden rounded-lg bg-gradient-to-br from-nuvora-100 to-aurora-100 dark:from-nuvora-900/50 dark:to-aurora-900/30">
                  <div className="flex h-full items-center justify-center p-4">
                    <span className="text-center text-lg font-bold text-nuvora-600/40 dark:text-nuvora-400/40 line-clamp-2">
                      {article.title}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-medium uppercase tracking-wider text-nuvora-600 dark:text-nuvora-400">{article.difficulty}</span>
                <h2 className="mt-2 font-semibold text-text-primary transition-colors group-hover:text-nuvora-600 dark:group-hover:text-nuvora-600">
                  {article.title}
                </h2>
                <p className="mt-2 text-sm text-text-secondary leading-relaxed line-clamp-3">{article.description}</p>
                <span className="mt-3 block text-sm text-text-tertiary">{article.readingTimeMinutes} min read Â· {new Date(article.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
