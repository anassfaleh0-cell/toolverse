import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Sitemap — ${SITE_NAME}`,
  description: "Complete site map of all tools, guides, and resources available on Nuvora.",
  openGraph: { title: `Sitemap — ${SITE_NAME}`, description: "Complete site map of all tools, guides, and resources available on Nuvora.", url: `${SITE_URL}/sitemap`, siteName: SITE_NAME },
  twitter: { card: "summary_large_image", title: `Sitemap — ${SITE_NAME}`, description: "Complete site map of all tools, guides, and resources available on Nuvora." },
  alternates: { canonical: `${SITE_URL}/sitemap` },
};

export default function SitemapLayout({ children }: { children: React.ReactNode }) {
  return children;
}