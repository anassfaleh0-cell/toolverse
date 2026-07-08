import type { Metadata } from "next";
import { JsonLd } from "@/components/shared";
import { webPageSchema, breadcrumbSchema } from "@/lib/seo";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/constants";
import { ToolSuites } from "@/components/tool-suites";
import { WhyToolverse } from "@/components/why-toolverse";
import { LearningCenter } from "@/components/learning-center";
import { RecentlyViewed } from "@/components/shared/recently-viewed";
import { ContinueReading } from "@/components/shared/continue-reading";
import { PopularPaths } from "@/components/shared/popular-paths";

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  openGraph: { title: SITE_NAME, description: SITE_DESCRIPTION, url: SITE_URL },
  twitter: { card: "summary_large_image", title: SITE_NAME, description: SITE_DESCRIPTION },
  alternates: { canonical: SITE_URL },
};

const breadcrumbs = [{ label: "Home", href: SITE_URL }];

export default function Home() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: SITE_NAME, description: SITE_DESCRIPTION, url: SITE_URL, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <RecentlyViewed />
      <ContinueReading />
      <PopularPaths />
      <ToolSuites />
      <WhyToolverse />
      <LearningCenter />
    </>
  );
}
