import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Collections — ${SITE_NAME}`,
  description: "Organize your favorite tools into custom collections.",
  openGraph: { title: `Collections — ${SITE_NAME}`, description: "Organize your favorite tools into custom collections.", url: `${SITE_URL}/collections`, siteName: SITE_NAME },
  twitter: { card: "summary_large_image", title: `Collections — ${SITE_NAME}`, description: "Organize your favorite tools into custom collections." },
  alternates: { canonical: `${SITE_URL}/collections` },
};

export default function CollectionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}