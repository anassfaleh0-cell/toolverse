import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllTools } from "@/lib/registry";
import { getVsSlugs } from "@/lib/content/programmatic-slugs";
import { generateVsContent, generateMetaForComparison } from "@/lib/content/programmatic-content";
import { Breadcrumbs, JsonLd, FaqSection } from "@/components/shared";
import { breadcrumbSchema, faqSchema, webPageSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getVsSlugs().slice(0, 500).map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const vs = getVsSlugs();
  const entry = vs.find(v => v.slug === slug);
  if (!entry) return {};
  const tools = getAllTools();
  const t1 = tools.find(t => t.id === entry.tool1);
  const t2 = tools.find(t => t.id === entry.tool2);
  const meta = generateMetaForComparison(t1?.name ?? entry.tool1, t2?.name ?? entry.tool2);
  return {
    title: meta.title,
    description: meta.description,
    openGraph: { title: meta.title, description: meta.description, url: `${SITE_URL}/vs/${slug}` },
    twitter: { card: "summary_large_image", title: meta.title, description: meta.description },
    alternates: { canonical: `${SITE_URL}/vs/${slug}` },
    robots: { index: false, follow: false },
  };
}

export const dynamicParams = true;
export const revalidate = 86400;

export default async function VsPage({ params }: Props) {
  const { slug } = await params;
  const vs = getVsSlugs();
  const entry = vs.find(v => v.slug === slug);
  if (!entry) notFound();

  const tools = getAllTools();
  const t1 = tools.find(t => t.id === entry.tool1);
  const t2 = tools.find(t => t.id === entry.tool2);
  if (!t1 || !t2) notFound();

  const content = generateVsContent(entry.tool1, entry.tool2);

  const breadcrumbs = [
    { label: "Home", href: SITE_URL },
    { label: "Comparisons", href: `${SITE_URL}/vs` },
    { label: `${t1.name} vs ${t2.name}` },
  ];

  const renderWinner = (winner: 1 | 2 | "tie") => {
    if (winner === 1) return t1.name;
    if (winner === 2) return t2.name;
    return "Tie";
  };

  const winnerBadge = (winner: 1 | 2 | "tie") => {
    if (winner === "tie") return "text-amber-700 dark:text-amber-400";
    return "text-nuvora-600 dark:text-nuvora-400";
  };

  return (
    <>
      <JsonLd data={webPageSchema({ name: content.title, description: content.description, url: `${SITE_URL}/vs/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(content.faqs)} />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">{content.title}</h1>
        <p className="mt-4 text-lg text-text-secondary">{content.description}</p>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-text-primary">At a Glance</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-border-subtle bg-surface p-6 transition-all hover:shadow-lg">
              <h3 className="text-xl font-semibold text-text-primary">{content.overview.tool1.name}</h3>
              <p className="mt-2 text-text-secondary">{content.overview.tool1.desc}</p>
              <Link href={t1.url} className="mt-4 inline-flex items-center text-sm font-medium text-nuvora-600 hover:text-nuvora-700">
                Open {t1.name} &rarr;
              </Link>
            </div>
            <div className="rounded-2xl border border-border-subtle bg-surface p-6 transition-all hover:shadow-lg">
              <h3 className="text-xl font-semibold text-text-primary">{content.overview.tool2.name}</h3>
              <p className="mt-2 text-text-secondary">{content.overview.tool2.desc}</p>
              <Link href={t2.url} className="mt-4 inline-flex items-center text-sm font-medium text-nuvora-600 hover:text-nuvora-700">
                Open {t2.name} &rarr;
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-text-primary">Feature Comparison</h2>
          <div className="mt-6 overflow-hidden rounded-2xl border border-border-subtle">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border-subtle bg-surface-secondary">
                  <th className="px-6 py-4 text-sm font-semibold text-text-primary">Feature</th>
                  <th className="px-6 py-4 text-sm font-semibold text-text-primary">{t1.name}</th>
                  <th className="px-6 py-4 text-sm font-semibold text-text-primary">{t2.name}</th>
                  <th className="px-6 py-4 text-sm font-semibold text-text-primary">Winner</th>
                </tr>
              </thead>
              <tbody>
                {content.comparisonTable.map((row) => (
                  <tr key={row.feature} className="border-b border-border-subtle last:border-0">
                    <td className="px-6 py-4 text-sm font-medium text-text-primary">{row.feature}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{row.tool1}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{row.tool2}</td>
                    <td className={`px-6 py-4 text-sm font-medium ${winnerBadge(row.winner)}`}>
                      {renderWinner(row.winner)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12 grid gap-8 sm:grid-cols-2">
          <div className="rounded-2xl border border-border-subtle bg-surface p-6">
            <h3 className="text-lg font-semibold text-text-primary">{t1.name} Pros &amp; Cons</h3>
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-nuvora-600">Pros</h4>
              <ul className="mt-2 space-y-1">
                {content.prosCons.tool1.pros.map(p => <li key={p} className="text-sm text-text-secondary">+ {p}</li>)}
              </ul>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-red-700">Cons</h4>
              <ul className="mt-2 space-y-1">
                {content.prosCons.tool1.cons.map(c => <li key={c} className="text-sm text-text-secondary">- {c}</li>)}
              </ul>
            </div>
          </div>
          <div className="rounded-2xl border border-border-subtle bg-surface p-6">
            <h3 className="text-lg font-semibold text-text-primary">{t2.name} Pros &amp; Cons</h3>
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-nuvora-600">Pros</h4>
              <ul className="mt-2 space-y-1">
                {content.prosCons.tool2.pros.map(p => <li key={p} className="text-sm text-text-secondary">+ {p}</li>)}
              </ul>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-red-700">Cons</h4>
              <ul className="mt-2 space-y-1">
                {content.prosCons.tool2.cons.map(c => <li key={c} className="text-sm text-text-secondary">- {c}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-text-primary">Best Use Cases</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-border-subtle bg-surface p-6">
              <h3 className="text-lg font-semibold text-text-primary">When to Use {t1.name}</h3>
              <ul className="mt-4 space-y-3">
                {content.useCases.tool1Best.map((uc, i) => (
                  <li key={i} className="flex gap-2 text-sm text-text-secondary">
                    <span className="mt-0.5 shrink-0 text-nuvora-600">&bull;</span>
                    {uc}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border-subtle bg-surface p-6">
              <h3 className="text-lg font-semibold text-text-primary">When to Use {t2.name}</h3>
              <ul className="mt-4 space-y-3">
                {content.useCases.tool2Best.map((uc, i) => (
                  <li key={i} className="flex gap-2 text-sm text-text-secondary">
                    <span className="mt-0.5 shrink-0 text-nuvora-600">&bull;</span>
                    {uc}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-border-subtle bg-surface p-8">
          <h2 className="text-2xl font-bold text-text-primary">Verdict</h2>
          <p className="mt-4 text-text-secondary leading-relaxed">{content.verdict}</p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link href={t1.url} className="inline-flex items-center rounded-xl bg-nuvora-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-nuvora-600/20 transition-all hover:bg-nuvora-700">
              Try {t1.name}
            </Link>
            <Link href={t2.url} className="inline-flex items-center rounded-xl border border-border-subtle bg-surface px-6 py-3 text-sm font-semibold text-text-primary transition-all hover:bg-surface-secondary">
              Try {t2.name}
            </Link>
          </div>
        </section>

        {content.faqs.length > 0 && (
          <section className="mt-12">
            <FaqSection items={content.faqs} title={`${t1.name} vs ${t2.name} — FAQs`} />
          </section>
        )}

        <section className="mt-12 text-center">
          <Link
            href="/vs"
            className="inline-flex items-center rounded-xl bg-nuvora-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-nuvora-600/20 transition-all hover:bg-nuvora-700"
          >
            Explore More Comparisons
          </Link>
        </section>
      </div>
    </>
  );
}
