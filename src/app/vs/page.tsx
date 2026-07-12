import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { getVsSlugs } from "@/lib/content/programmatic-slugs";
import { getAllTools } from "@/lib/registry";
import { getCategoryBySlug } from "@/lib/categories";

export const metadata: Metadata = {
  title: `Tool Comparisons — Compare Free Online Tools Side by Side`,
  description: `Browse all tool comparisons on ${SITE_NAME}. Compare features, privacy, and ease of use of free online tools side by side.`,
  alternates: { canonical: `${SITE_URL}/vs` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Comparisons" },
];

function formatLabel(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function VsIndexPage() {
  const allSlugs = getVsSlugs();
  const tools = getAllTools();
  const categories = [...new Set(tools.map((t) => t.category))];

  const categoryCounts = categories.map((cat) => {
    const catTools = tools.filter((t) => t.category === cat);
    const catSlugs = allSlugs.filter((s) => {
      const t1 = tools.find((t) => t.id === s.tool1);
      const t2 = tools.find((t) => t.id === s.tool2);
      return t1?.category === cat || t2?.category === cat;
    });
    const catLabel = getCategoryBySlug(cat)?.label ?? formatLabel(cat);
    return { slug: cat, label: catLabel, count: catSlugs.length, toolCount: catTools.length };
  }).filter((c) => c.count > 0).sort((a, b) => b.count - a.count);

  const recentSlugs = allSlugs.slice(0, 24);

  return (
    <>
      <JsonLd data={webPageSchema({ name: `Tool Comparisons — Compare Free Online Tools Side by Side | ${SITE_NAME}`, description: `Browse all tool comparisons.`, url: `${SITE_URL}/vs`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-border-subtle bg-gradient-to-b from-nuvora-50/30 to-surface dark:from-nuvora-950/20">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">Tool Comparisons</h1>
          <p className="mt-4 text-lg text-text-secondary">
            Compare free online tools side by side. We evaluate features, performance, privacy, and ease of use to help you choose the right tool.
          </p>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="text-2xl font-bold text-text-primary mb-8">Browse by Category</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryCounts.map((cat) => (
              <div key={cat.slug} className="rounded-xl border border-border-subtle bg-surface p-5">
                <h3 className="font-semibold text-text-primary">{cat.label} Comparisons</h3>
                <p className="mt-1 text-sm text-text-tertiary">
                  {cat.count} comparison{cat.count !== 1 ? "s" : ""} across {cat.toolCount} tool{cat.toolCount !== 1 ? "s" : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="text-2xl font-bold text-text-primary mb-8">Recent Comparisons</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentSlugs.map((s) => {
              const t1 = tools.find((t) => t.id === s.tool1);
              const t2 = tools.find((t) => t.id === s.tool2);
              if (!t1 || !t2) return null;
              return (
                <Link
                  key={s.slug}
                  href={`/vs/${s.slug}`}
                  className="rounded-xl border border-border-subtle bg-surface p-5 transition-all hover:shadow-md hover:-translate-y-0.5"
                >
                  <h3 className="font-semibold text-text-primary">{t1.name} vs {t2.name}</h3>
                  <p className="mt-1 text-sm text-text-tertiary line-clamp-2">
                    Compare {t1.name} and {t2.name} side by side.
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
