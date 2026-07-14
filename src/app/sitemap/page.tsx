import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { getAllTools, getCategories } from "@/lib/registry";
import { getArticles, getGuides } from "@/lib/content/registry";

export const metadata: Metadata = {
  title: `Sitemap â€” ${SITE_NAME}`,
  description: `Complete sitemap for ${SITE_NAME}. Browse all tools, categories, blog posts, guides, and resources in one place.`,
  openGraph: { title: `Sitemap â€” ${SITE_NAME}`, description: `Browse every page on ${SITE_NAME} from one convenient sitemap.`, url: `${SITE_URL}/sitemap` },
  alternates: { canonical: `${SITE_URL}/sitemap` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Sitemap" },
];

export default function SitemapPage() {
  const tools = getAllTools().filter((t) => t.url.startsWith("/"));
  const categories = getCategories();
  const articles = getArticles();
  const guides = getGuides();

  return (
    <>
      <JsonLd data={webPageSchema({ name: `Sitemap â€” ${SITE_NAME}`, description: `Complete sitemap for ${SITE_NAME}.`, url: `${SITE_URL}/sitemap`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-border-subtle bg-gradient-to-b from-nuvora-50/30 to-surface dark:from-nuvora-950/20">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
            Sitemap
          </h1>
          <p className="mt-4 text-xl text-text-secondary">
            Browse all pages on {SITE_NAME}.
          </p>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="grid gap-12 sm:grid-cols-2">
            <div>
              <h2 className="text-lg font-bold text-text-primary">Tools</h2>
              <ul className="mt-4 space-y-2">
                {tools.map((t) => (
                  <li key={t.id}>
                    <Link href={t.url} className="text-sm text-nuvora-600 hover:text-nuvora-700 dark:text-nuvora-400 dark:hover:text-nuvora-600">
                      {t.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-text-primary">Categories</h2>
              <ul className="mt-4 space-y-2">
                {categories.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/category/${c.slug}`} className="text-sm text-nuvora-600 hover:text-nuvora-700 dark:text-nuvora-400 dark:hover:text-nuvora-600">
                      {c.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/categories" className="text-sm text-nuvora-600 hover:text-nuvora-700 dark:text-nuvora-400 dark:hover:text-nuvora-600">
                    All Categories
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-text-primary">Blog Posts</h2>
              <ul className="mt-4 space-y-2">
                {articles.map((a) => (
                  <li key={a.slug}>
                    <Link href={`/blog/${a.slug}`} className="text-sm text-nuvora-600 hover:text-nuvora-700 dark:text-nuvora-400 dark:hover:text-nuvora-600">
                      {a.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-text-primary">Guides</h2>
              <ul className="mt-4 space-y-2">
                {guides.map((g) => (
                  <li key={g.slug}>
                    <Link href={`/guides/${g.slug}`} className="text-sm text-nuvora-600 hover:text-nuvora-700 dark:text-nuvora-400 dark:hover:text-nuvora-600">
                      {g.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-lg font-bold text-text-primary">Resources</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-3">
              <li><Link href="/guides" className="text-sm text-nuvora-600 hover:text-nuvora-700 dark:text-nuvora-400 dark:hover:text-nuvora-600">All Guides</Link></li>
              <li><Link href="/learn" className="text-sm text-nuvora-600 hover:text-nuvora-700 dark:text-nuvora-400 dark:hover:text-nuvora-600">Learn</Link></li>
              <li><Link href="/blog" className="text-sm text-nuvora-600 hover:text-nuvora-700 dark:text-nuvora-400 dark:hover:text-nuvora-600">Blog</Link></li>
              <li><Link href="/compare" className="text-sm text-nuvora-600 hover:text-nuvora-700 dark:text-nuvora-400 dark:hover:text-nuvora-600">Comparisons</Link></li>
              <li><Link href="/glossary" className="text-sm text-nuvora-600 hover:text-nuvora-700 dark:text-nuvora-400 dark:hover:text-nuvora-600">Glossary</Link></li>
              <li><Link href="/about-nuvora" className="text-sm text-nuvora-600 hover:text-nuvora-700 dark:text-nuvora-400 dark:hover:text-nuvora-600">About</Link></li>
              <li><Link href="/contact" className="text-sm text-nuvora-600 hover:text-nuvora-700 dark:text-nuvora-400 dark:hover:text-nuvora-600">Contact</Link></li>
              <li><Link href="/privacy" className="text-sm text-nuvora-600 hover:text-nuvora-700 dark:text-nuvora-400 dark:hover:text-nuvora-600">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-nuvora-600 hover:text-nuvora-700 dark:text-nuvora-400 dark:hover:text-nuvora-600">Terms of Service</Link></li>
              <li><Link href="/widgets" className="text-sm text-nuvora-600 hover:text-nuvora-700 dark:text-nuvora-400 dark:hover:text-nuvora-600">Widgets</Link></li>
              <li><Link href="/press" className="text-sm text-nuvora-600 hover:text-nuvora-700 dark:text-nuvora-400 dark:hover:text-nuvora-600">Press Kit</Link></li>
              <li><Link href="/brand" className="text-sm text-nuvora-600 hover:text-nuvora-700 dark:text-nuvora-400 dark:hover:text-nuvora-600">Brand Guidelines</Link></li>
              <li><Link href="/pro" className="text-sm text-nuvora-600 hover:text-nuvora-700 dark:text-nuvora-400 dark:hover:text-nuvora-600">Nuvora Pro</Link></li>
              <li><Link href="/api" className="text-sm text-nuvora-600 hover:text-nuvora-700 dark:text-nuvora-400 dark:hover:text-nuvora-600">Nuvora API</Link></li>
              <li><Link href="/link-to-us" className="text-sm text-nuvora-600 hover:text-nuvora-700 dark:text-nuvora-400 dark:hover:text-nuvora-600">Link to Us</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
