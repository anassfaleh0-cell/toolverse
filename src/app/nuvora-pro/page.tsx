import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Nuvora Pro — Advanced Features for Power Users`,
  description: "Nuvora Pro unlocks advanced features, priority support, custom integrations, and team workspaces for professionals and organizations.",
  openGraph: { title: `Nuvora Pro — Advanced Features`, description: "Premium tools for power users. Team workspaces, custom integrations, and priority support.", url: `${SITE_URL}/nuvora-pro` },
  alternates: { canonical: `${SITE_URL}/nuvora-pro` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Nuvora Pro" },
];

export default function NuvoraProPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: `Nuvora Pro — Advanced Features for Power Users`, description: "Premium Nuvora features for professionals.", url: `${SITE_URL}/nuvora-pro`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-border-subtle bg-gradient-to-b from-nuvora-50/30 to-surface dark:from-nuvora-950/20">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-32">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-medium text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
            Coming soon
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            Nuvora <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Pro</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary">
            Everything you love about Nuvora, plus advanced capabilities for teams and organizations.
          </p>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-24">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Team Workspaces", desc: "Shared tool configurations, bookmarks, and result history across your entire team." },
              { title: "Priority Support", desc: "Get help within hours, not days. Dedicated support channel for Pro subscribers." },
              { title: "Custom Branding", desc: "White-label Nuvora tools with your own brand colors, logo, and domain." },
              { title: "Advanced Analytics", desc: "Usage metrics, audit logs, and detailed reporting for your organization." },
              { title: "Bulk Operations", desc: "Run tools against thousands of inputs with batch processing and CSV export." },
              { title: "SLA Guarantee", desc: "99.99% uptime SLA with guaranteed response times for critical tools." },
            ].map(({ title, desc }) => (
              <div key={title} className="rounded-2xl border border-border-subtle bg-surface p-6">
                <h3 className="font-semibold text-text-primary">{title}</h3>
                <p className="mt-2 text-sm text-text-secondary">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
