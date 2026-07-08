import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Bookmarks — ${SITE_NAME}`,
  description: "Your saved bookmarks for quick access to your favorite tools.",
  openGraph: { title: `Bookmarks — ${SITE_NAME}`, description: "Your saved bookmarks for quick access to your favorite tools.", url: `${SITE_URL}/bookmarks`, siteName: SITE_NAME },
  twitter: { card: "summary_large_image", title: `Bookmarks — ${SITE_NAME}`, description: "Your saved bookmarks for quick access to your favorite tools." },
  alternates: { canonical: `${SITE_URL}/bookmarks` },
};

export default function BookmarksLayout({ children }: { children: React.ReactNode }) {
  return children;
}