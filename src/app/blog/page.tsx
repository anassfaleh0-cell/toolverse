import type { Metadata } from "next";
import Link from "next/link";
import { getArticles } from "@/lib/content/registry";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Blog - ${SITE_NAME}`,
  description: `Technical articles and guides about network diagnostics, DNS management, SSL/TLS, web security, and performance optimization. ${SITE_DESCRIPTION}`,
  openGraph: { title: `Blog - ${SITE_NAME}`, description: `Technical articles about network diagnostics, DNS management, SSL/TLS, web security, and performance optimization.`, url: `${SITE_URL}/blog` },
  twitter: { card: "summary_large_image", title: `Blog - ${SITE_NAME}`, description: `Technical articles about network diagnostics, DNS management, SSL/TLS, and web security.` },
  alternates: { canonical: `${SITE_URL}/blog` },
};

const breadcrumbs = [{ label: "Home", href: SITE_URL }, { label: "Blog" }];

export default function BlogPage() {
  const articles = getArticles();
  return (
    <>
      <JsonLd data={webPageSchema({ name: `Blog - ${SITE_NAME}`, description: "Network diagnostics and security articles.", url: `${SITE_URL}/blog`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Blog</h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">Technical articles about network diagnostics, DNS, SSL/TLS, web security, and performance optimization.</p>
        </div>
      </section>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group rounded-lg border border-zinc-200 p-5 transition-colors hover:border-blue-300 dark:border-zinc-800 dark:hover:border-blue-700"
              >
                <span className="text-xs font-medium uppercase tracking-wider text-purple-600 dark:text-purple-400">{article.difficulty}</span>
                <h2 className="mt-2 font-semibold text-zinc-900 transition-colors group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
                  {article.title}
                </h2>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">{article.description}</p>
                <span className="mt-3 block text-sm text-zinc-500">{article.readingTimeMinutes} min read · {new Date(article.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
