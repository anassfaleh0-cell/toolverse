import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import type { Thing, WithContext } from "schema-dts";

export const metadata: Metadata = {
  title: `Nuvora on YouTube`,
  description: `Free ${SITE_NAME} tools tutorials, tips, and guides. New videos weekly.`,
  openGraph: {
    title: `Nuvora on YouTube`,
    description: `Free ${SITE_NAME} tools tutorials. New videos weekly.`,
    url: `${SITE_URL}/youtube`,
  },
  alternates: { canonical: `${SITE_URL}/youtube` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "YouTube" },
];

const videoDurations = [
  "5 min", "7 min", "10 min", "12 min",
  "8 min", "15 min", "6 min", "11 min", "9 min",
];

export default function YouTubePage() {
  const organizationSchema: WithContext<Thing> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    sameAs: ["https://youtube.com/@NuvoraHQ"],
  };

  return (
    <>
      <JsonLd
        data={webPageSchema({
          name: `${SITE_NAME} on YouTube`,
          description: "Free online tools tutorials.",
          url: `${SITE_URL}/youtube`,
          breadcrumbs,
        })}
      />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={organizationSchema} />

      <section className="border-b border-border-subtle bg-gradient-to-b from-nuvora-50/30 to-surface dark:from-nuvora-950/20">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
            {SITE_NAME} on YouTube
          </h1>
          <p className="mt-4 text-xl text-text-secondary">
            Free online tools tutorials, tips, and guides. New videos weekly.
          </p>
          <div className="mt-8">
            <Link
              href="https://youtube.com/@NuvoraHQ"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-500 transition-all active:scale-[0.97]"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              Subscribe on YouTube
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="text-2xl font-bold text-text-primary">Latest Videos</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Tutorials and guides coming soon.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videoDurations.map((duration, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-border-subtle bg-surface"
              >
                <div className="flex aspect-video items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="size-12 text-zinc-300 dark:text-zinc-600"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <polygon points="10 9 15 12 10 15 10 9" fill="currentColor" stroke="none" />
                  </svg>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-text-primary">Video Coming Soon</h3>
                  <span className="mt-1 inline-block rounded bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                    {duration}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-text-primary">Learn with {SITE_NAME}</h2>
            <p className="mt-4 leading-relaxed text-text-secondary">
              Learn how to use {SITE_NAME} tools with our free video tutorials. From PDF
              compression to DNS lookups, we cover everything.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="text-center text-sm text-text-secondary">
            New videos every Tuesday and Thursday. Subscribe and hit the bell to stay updated.
          </p>
        </div>
      </section>
    </>
  );
}
