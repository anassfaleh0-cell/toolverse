import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Tool Finder — Choose the Right Tool`,
  description: "Find the right online tool for your needs with our interactive tool finder. Answer a few questions and get personalized recommendations.",
  openGraph: { title: `Tool Finder — Choose the Right Tool`, description: "Find the right online tool for your needs with our interactive tool finder.", url: `${SITE_URL}/choose-the-right-tool`, siteName: SITE_NAME },
  twitter: { card: "summary_large_image", title: `Tool Finder — Choose the Right Tool`, description: "Find the right online tool for your needs with our interactive tool finder." },
  alternates: { canonical: `${SITE_URL}/choose-the-right-tool` },
};

export default function ToolFinderLayout({ children }: { children: React.ReactNode }) {
  return children;
}