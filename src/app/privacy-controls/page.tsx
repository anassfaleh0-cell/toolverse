import type { Metadata } from "next";
import { Breadcrumbs, JsonLd, SocialShare } from "@/components/shared";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";
import { PrivacyControls } from "./privacy-controls";

export const metadata: Metadata = {
  title: `Privacy Controls — ${SITE_NAME}`,
  description: "Manage your privacy preferences, consent, bookmarks, and local data.",
  openGraph: { title: `Privacy Controls — ${SITE_NAME}`, description: "Manage your privacy preferences, consent, bookmarks, and local data.", url: `${SITE_URL}/privacy-controls`, siteName: SITE_NAME, images: [{ url: `${SITE_URL}/og-image.svg`, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: `Privacy Controls — ${SITE_NAME}`, description: "Manage your privacy preferences, consent, bookmarks, and local data.", images: [`${SITE_URL}/og-image.svg`] },
  alternates: { canonical: `${SITE_URL}/privacy-controls` },
};

const breadcrumbs = [{ href: "/", label: "Home" }, { href: "/privacy-controls", label: "Privacy Controls" }];

export default function PrivacyControlsPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: `Privacy Controls — ${SITE_NAME}`, description: "Manage your privacy preferences, consent, bookmarks, and local data.", url: `${SITE_URL}/privacy-controls`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">Privacy Controls</h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">Manage your data, consent preferences, and local storage.</p>
        </div>
      </section>
      <PrivacyControls />
      <SocialShare title={`Privacy Controls — ${SITE_NAME}`} url={`${SITE_URL}/privacy-controls`} />
    </>
  );
}