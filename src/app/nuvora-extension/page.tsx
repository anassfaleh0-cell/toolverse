import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Nuvora Extension — Browser Tools at Your Fingertips`,
  description: "Access Nuvora tools instantly from any browser tab. DNS lookup, security checks, and developer utilities without leaving your current page.",
  openGraph: { title: `Nuvora Extension — Browser Extension`, description: "Instant access to Nuvora tools from any browser tab.", url: `${SITE_URL}/nuvora-extension` },
  alternates: { canonical: `${SITE_URL}/nuvora-extension` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Nuvora Extension" },
];

export default function NuvoraExtensionPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: `Nuvora Extension — Browser Tools`, description: "Nuvora browser extension for instant tool access.", url: `${SITE_URL}/nuvora-extension`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-border-subtle bg-gradient-to-b from-nuvora-50/30 to-surface dark:from-nuvora-950/20">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-32">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-xs font-medium text-purple-700 dark:border-purple-800 dark:bg-purple-950/50 dark:text-purple-300">
            Coming soon
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            Nuvora <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Extension</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary">
            The power of Nuvora, right in your browser toolbar. Run tools, check domains, and analyze results without leaving your current page.
          </p>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-24">
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              { title: "One-Click Access", desc: "Open any Nuvora tool directly from your browser toolbar — no new tabs needed." },
              { title: "Context-Aware", desc: "Right-click any domain or IP to instantly run DNS lookup, WHOIS, or SSL check." },
              { title: "Offline Mode", desc: "Previously viewed results are cached and available even without internet." },
              { title: "Quick Actions", desc: "Customize your toolbar with your most-used tools for instant access." },
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
