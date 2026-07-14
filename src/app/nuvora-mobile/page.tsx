import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Nuvora Mobile — Native Apps for iOS & Android`,
  description: "Take Nuvora on the go with native iOS and Android apps. DNS diagnostics, security checks, and developer tools optimized for mobile.",
  openGraph: { title: `Nuvora Mobile — iOS & Android Apps`, description: "Native Nuvora mobile apps with offline support.", url: `${SITE_URL}/nuvora-mobile` },
  alternates: { canonical: `${SITE_URL}/nuvora-mobile` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Nuvora Mobile" },
];

export default function NuvoraMobilePage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: `Nuvora Mobile — iOS & Android`, description: "Nuvora mobile apps for iOS and Android.", url: `${SITE_URL}/nuvora-mobile`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-border-subtle bg-gradient-to-b from-nuvora-50/30 to-surface dark:from-nuvora-950/20">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-32">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-1.5 text-xs font-medium text-rose-700 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-300">
            Coming soon
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            Nuvora <span className="bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">Mobile</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary">
            All the power of Nuvora, optimized for your pocket. Native iOS and Android apps with offline support and mobile-first tool interfaces.
          </p>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-24">
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              { title: "Offline First", desc: "Run tools and access cached results even without an internet connection." },
              { title: "Mobile Optimized", desc: "Touch-optimized interfaces designed for phone screens without sacrificing power." },
              { title: "Widget Support", desc: "Home screen widgets for quick DNS lookups, IP info, and tool access." },
              { title: "Cross-Device Sync", desc: "Seamless sync of bookmarks, history, and settings across all your devices." },
            ].map(({ title, desc }) => (
              <div key={title} className="rounded-2xl border border-border-subtle bg-surface p-6">
                <h2 className="text-base font-semibold text-text-primary">{title}</h2>
                <p className="mt-2 text-sm text-text-secondary">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
