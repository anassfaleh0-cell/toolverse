import type { Metadata } from "next";
import { DomainReportCard } from "@/components/domain-report/report-card";
import { SITE_URL } from "@/lib/constants";

const slug = "domain-report";
const pageTitle = "Domain Report Card — Grade Your Domain's Health (A–F)";
const pageDescription =
  "Get a complete A–F report card for any domain covering DNS health, SSL/TLS certificates, HTTP security headers, WHOIS registration, website status, and response time. Share your domain's grade.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: `${SITE_URL}/${slug}`,
  },
  twitter: {
    title: pageTitle,
    description: pageDescription,
  },
  alternates: {
    canonical: `${SITE_URL}/${slug}`,
  },
};

export default function DomainReportPage() {
  return <DomainReportCard />;
}
