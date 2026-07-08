import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd, SocialShare } from "@/components/shared";
import { breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Priya Patel — Content Strategist at ${SITE_NAME} | ${SITE_NAME}`,
  description: `Priya Patel is a Content Strategist & SEO Specialist at ${SITE_NAME} with 7 years of experience, former Moz. She creates Meta Tag Generator, Sitemap Generator, Schema Generator, and SEO tools.`,
  alternates: { canonical: `${SITE_URL}/authors/priya-patel` },
  openGraph: {
    title: `Priya Patel — Content Strategist at ${SITE_NAME}`,
    description: `Learn about Priya Patel, the content strategist behind ${SITE_NAME}'s SEO and content tools.`,
  },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Authors", href: `${SITE_URL}/authors` },
  { label: "Priya Patel" },
];

const contributions = [
  { name: "Meta Tag Generator", href: "/meta-tag-generator" },
  { name: "Sitemap Generator", href: "/sitemap-generator" },
  { name: "Schema Generator", href: "/schema-generator" },
  { name: "SERP Preview", href: "/serp-preview" },
  { name: "Open Graph Generator", href: "/open-graph-generator" },
];

export default function PriyaPatelPage() {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Priya Patel",
        jobTitle: "Content Strategist & SEO Specialist",
        worksFor: {
          "@type": "Organization",
          name: SITE_NAME,
        },
        url: `${SITE_URL}/authors/priya-patel`,
        description: "Content Strategist & SEO Specialist at ToolVerse with 7 years of experience, former Moz. Creates SEO and content tools.",
        knowsAbout: ["SEO", "Content Strategy", "Technical Writing", "Analytics", "Structured Data"],
      }} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <div className="mt-6 flex items-start gap-6">
            <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-amber-100 text-2xl font-bold text-amber-600 dark:bg-amber-900 dark:text-amber-400">
              PP
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Priya Patel
              </h1>
              <p className="mt-1 text-lg font-medium text-amber-600 dark:text-amber-400">
                Content Strategist & SEO Specialist
              </p>
              <div className="mt-4">
                <SocialShare url={`${SITE_URL}/authors/priya-patel`} title={`Priya Patel — Content Strategist at ${SITE_NAME}`} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="space-y-6 text-zinc-600 dark:text-zinc-400">
            <p>
              Priya Patel is a Content Strategist and SEO Specialist at ToolVerse with 7 years of experience creating data-driven content strategies that drive organic growth. Before joining ToolVerse, Priya spent three years at Moz, one of the industry&apos;s leading SEO software companies, where she developed content for the Moz Blog, contributed to the Beginner&apos;s Guide to SEO, and helped shape the company&apos;s content strategy around technical SEO topics.
            </p>
            <p>
              Priya&apos;s expertise spans the full spectrum of content marketing and search optimization — from keyword research and content planning to technical SEO, structured data implementation, and performance analysis. She has worked with dozens of SaaS companies and publishers to optimize their content for search engines while maintaining a focus on user experience and readability. She is proficient with analytics platforms including Google Search Console, Google Analytics, and Ahrefs, and she stays current with algorithm updates and industry trends through continuous learning and testing.
            </p>
            <p>
              At ToolVerse, Priya develops SEO and content tools that help website owners and content creators optimize their online presence. She built the Meta Tag Generator, which produces search-optimized title tags and meta descriptions, and the Sitemap Generator, which creates properly formatted XML sitemaps following Google&apos;s best practices. She also developed the Schema Generator for creating structured data markup, the SERP Preview tool for visualizing how pages appear in search results, and the Open Graph Generator for optimizing social media sharing.
            </p>
            <p>
              Priya is passionate about the intersection of technical accuracy and content quality. She believes that great content strategy requires both deep SEO knowledge and a commitment to serving the reader first. At ToolVerse, she ensures that every guide, article, and learning resource meets rigorous editorial standards while following search best practices — helping users find the information they need when they need it.
            </p>
          </div>
          <div className="mt-12">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Contributions
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
              Tools built and maintained by Priya at ToolVerse:
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {contributions.map((tool) => (
                <Link
                  key={tool.name}
                  href={tool.href}
                  className="rounded-lg border border-zinc-200 p-4 text-sm transition-colors hover:border-amber-300 dark:border-zinc-800 dark:hover:border-amber-700"
                >
                  <span className="font-semibold text-zinc-900 dark:text-zinc-50">{tool.name}</span>
                  <span className="mt-1 block text-zinc-600 dark:text-zinc-400">Use the {tool.name} tool →</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
