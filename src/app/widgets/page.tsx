import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd, CopyCode } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { getAllTools, getPopularTools } from "@/lib/registry";

export const metadata: Metadata = {
  title: `Embeddable Widgets`,
  description: `Embed ${SITE_NAME} tools on your website. Free iframe widgets for DNS lookup, SSL checker, WHOIS lookup, and more. Simple copy-paste embed codes.`,
  openGraph: { title: `Embeddable Widgets`, description: `Free embeddable widgets from ${SITE_NAME}. Add powerful tools to your site with a single iframe.`, url: `${SITE_URL}/widgets` },
  alternates: { canonical: `${SITE_URL}/widgets` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Widgets" },
];

function EmbedCard({ name, slug, widgetUrl }: { name: string; slug: string; widgetUrl?: string }) {
  const url = widgetUrl ?? `${SITE_URL}/${slug}`;
  const iframeCode = `<iframe src="${url}" width="100%" height="500" frameborder="0" allowtransparency="true" style="border:1px solid #e5e7eb;border-radius:8px;"></iframe>`;

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface p-6">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-text-primary">{name}</h3>
        <CopyCode code={iframeCode} />
      </div>
      <div className="mt-4 overflow-hidden rounded-lg border border-border-subtle">
        <iframe src={url} width="100%" height="300" className="w-full" title={`${name} widget preview`} />
      </div>
      <pre className="mt-3 overflow-x-auto rounded-lg bg-zinc-900 p-3 text-xs text-zinc-600 dark:bg-zinc-950">
        <code>{iframeCode}</code>
      </pre>
    </div>
  );
}

export default function WidgetsPage() {
  const popular = getPopularTools(10);
  const internal = popular.filter((t) => t.url.startsWith("/"));

  return (
    <>
      <JsonLd data={webPageSchema({ name: `Embeddable Widgets â€” ${SITE_NAME}`, description: `Free embeddable widgets from ${SITE_NAME}.`, url: `${SITE_URL}/widgets`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-border-subtle bg-gradient-to-b from-nuvora-50/30 to-surface dark:from-nuvora-950/20">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
            Embeddable Widgets
          </h1>
          <p className="mt-4 text-xl text-text-secondary">
            Add {SITE_NAME} tools to your website with a simple iframe. Free, no attribution required.
          </p>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="grid gap-8">
            {internal.map((t) => (
              <EmbedCard key={t.id} name={t.name} slug={t.slug} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
