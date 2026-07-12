import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `DNS Comparison — Compare DNS Providers`,
  description: "Compare DNS resolution between two domains side by side. Analyze records, response times, and provider differences.",
  openGraph: { title: `DNS Comparison — Compare DNS Providers`, description: "Compare DNS resolution between two domains side by side.", url: `${SITE_URL}/compare-dns`, siteName: SITE_NAME },
  twitter: { card: "summary_large_image", title: `DNS Comparison — Compare DNS Providers`, description: "Compare DNS resolution between two domains side by side." },
  alternates: { canonical: `${SITE_URL}/compare-dns` },
};

export default function CompareDnsLayout({ children }: { children: React.ReactNode }) {
  return children;
}