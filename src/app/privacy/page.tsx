import type { Metadata } from "next";
import { SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "ToolVerse Privacy Policy — how we collect, use, and protect your data when using our free online tools.",
  openGraph: { title: "Privacy Policy", description: "ToolVerse Privacy Policy — data collection, usage, and protection.", url: `${SITE_URL}/privacy` },
  twitter: { card: "summary_large_image", title: "Privacy Policy", description: "ToolVerse Privacy Policy — data collection and protection." },
  alternates: { canonical: `${SITE_URL}/privacy` },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Privacy Policy" },
];

export default function Privacy() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: "Privacy Policy", description: "ToolVerse Privacy Policy — how we collect, use, and protect your data.", url: `${SITE_URL}/privacy`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Privacy Policy
        </h1>
        <div className="mt-8 space-y-6 text-zinc-600 dark:text-zinc-400">
          <p>Your privacy matters to us. This policy outlines how ToolVerse collects, uses, and protects your information.</p>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Information We Collect</h2>
          <p>We collect information you provide directly, such as your name and email address when you contact us. We also collect anonymous usage data to improve our service.</p>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">How We Use Your Information</h2>
          <p>We use your information to respond to inquiries, improve our website, and send occasional updates if you have opted in. We never sell your data to third parties.</p>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Cookies</h2>
          <p>We use essential cookies for site functionality and preference storage (such as your theme choice). No tracking cookies are used without your consent.</p>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Contact</h2>
          <p>If you have questions about this policy, email us at hello@toolverse.dev.</p>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Changes</h2>
          <p>We may update this policy periodically. Changes will be posted on this page with an updated effective date.</p>
          <p className="text-sm text-zinc-400">Last updated: January 1, 2025</p>
        </div>
      </section>
    </>
  );
}
