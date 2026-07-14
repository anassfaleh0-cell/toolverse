import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd, CopyCode } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Share ${SITE_NAME} â€” Spread the Word`,
  description: `Help others discover free online tools. Share ${SITE_NAME} on Reddit, Twitter, LinkedIn, Facebook, WhatsApp, and more.`,
  openGraph: {
    title: `Share ${SITE_NAME}`,
    description: "Help others discover free online tools.",
    url: `${SITE_URL}/share`,
  },
  alternates: { canonical: `${SITE_URL}/share` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Share" },
];

const postTemplates = [
  {
    platform: "Reddit",
    text: `Check out ${SITE_NAME} â€” 200+ free online tools for developers, designers, and everyday users. No signup, no tracking, just results.\n\n${SITE_URL}`,
  },
  {
    platform: "Twitter / X",
    text: `Need a free online tool? ${SITE_NAME} has 200+ browser-based tools â€” DNS lookup, PDF conversion, image editing & more. All free, no signup.\n\n${SITE_URL}`,
  },
  {
    platform: "LinkedIn",
    text: `Free online tools shouldn't come with trade-offs. That's why I use ${SITE_NAME} â€” 200+ browser-based utilities that respect your privacy. No signup, no tracking, just tools that work.\n\n${SITE_URL}`,
  },
  {
    platform: "Facebook",
    text: `Discover ${SITE_NAME} â€” 200+ free online tools for everyone! From DNS lookups to PDF compression, image editing to text utilities. All tools run in your browser, nothing leaves your device. Free, no signup needed.\n\n${SITE_URL}`,
  },
];

const subreddits = [
  { name: "r/InternetIsBeautiful", url: "https://reddit.com/r/InternetIsBeautiful" },
  { name: "r/freebies", url: "https://reddit.com/r/freebies" },
  { name: "r/UsefulWebsites", url: "https://reddit.com/r/UsefulWebsites" },
  { name: "r/productivity", url: "https://reddit.com/r/productivity" },
  { name: "r/privacy", url: "https://reddit.com/r/privacy" },
  { name: "r/webdev", url: "https://reddit.com/r/webdev" },
];

export default function SharePage() {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          name: `Share ${SITE_NAME} â€” Spread the Word`,
          description: "Help others discover free online tools.",
          url: `${SITE_URL}/share`,
          breadcrumbs,
        })}
      />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />

      <section className="border-b border-border-subtle bg-gradient-to-b from-nuvora-50/30 to-surface dark:from-nuvora-950/20">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
            Share {SITE_NAME}
          </h1>
          <p className="mt-4 text-xl text-text-secondary">
            Help others discover free online tools. Every share makes a difference.
          </p>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="text-2xl font-bold text-text-primary">Post Templates</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Copy and paste these pre-written posts to share {SITE_NAME} on your favorite platforms.
          </p>
          <div className="mt-8 space-y-6">
            {postTemplates.map((post) => (
              <div key={post.platform} className="rounded-2xl border border-border-subtle bg-surface p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-text-primary">{post.platform}</h3>
                  <CopyCode code={post.text} />
                </div>
                <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-zinc-900 p-4 text-sm text-zinc-600 dark:bg-zinc-950">
                  {post.text}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="text-2xl font-bold text-text-primary">Suggested Subreddits</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Communities on Reddit where {SITE_NAME} would be a great fit.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subreddits.map((sub) => (
              <a
                key={sub.name}
                href={sub.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-border-subtle bg-surface p-4 transition-all hover:bg-surface-secondary"
              >
                <span className="font-semibold text-text-primary">{sub.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 className="text-2xl font-bold text-text-primary">Share a Tool</h2>
          <p className="mt-4 leading-relaxed text-text-secondary">
            We have 200+ free tools to share. Browse our collection and share individual tools with
            your audience.
          </p>
          <div className="mt-6">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 rounded-xl bg-nuvora-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-nuvora-700 active:scale-[0.97]"
            >
              Browse All Tools
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
