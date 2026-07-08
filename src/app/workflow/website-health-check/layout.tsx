import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Website Health Check — Full Website Audit | ${SITE_NAME}`,
  description: "Run a comprehensive website health check including DNS, SSL, headers, and performance analysis.",
  openGraph: { title: `Website Health Check — Full Website Audit | ${SITE_NAME}`, description: "Run a comprehensive website health check including DNS, SSL, headers, and performance.", url: `${SITE_URL}/workflow/website-health-check`, siteName: SITE_NAME },
  twitter: { card: "summary_large_image", title: `Website Health Check — Full Website Audit | ${SITE_NAME}`, description: "Run a comprehensive website health check including DNS, SSL, headers, and performance." },
  alternates: { canonical: `${SITE_URL}/workflow/website-health-check` },
};

export default function HealthCheckLayout({ children }: { children: React.ReactNode }) {
  return children;
}