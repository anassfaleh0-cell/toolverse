import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd, SocialShare } from "@/components/shared";
import { breadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: `James Wilson — Full-Stack Developer at ${SITE_NAME} | ${SITE_NAME}`,
  description: `James Wilson is a Full-Stack Developer at ${SITE_NAME} with 10 years of experience, open-source maintainer. He builds JSON Formatter, Base64 Encoder, URL Encoder, and developer utilities.`,
  alternates: { canonical: `${SITE_URL}/authors/james-wilson` },
  openGraph: {
    title: `James Wilson — Full-Stack Developer at ${SITE_NAME}`,
    description: `Learn about James Wilson, the developer behind ${SITE_NAME}'s developer utility tools and formatters.`,
  },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Authors", href: `${SITE_URL}/authors` },
  { label: "James Wilson" },
];

const contributions = [
  { name: "JSON Formatter", href: "/json-formatter" },
  { name: "Base64 Encoder", href: "/base64-encoder" },
  { name: "URL Encoder", href: "/url-encoder" },
  { name: "HTML Minifier", href: "/html-minifier" },
  { name: "CSS Minifier", href: "/css-minifier" },
];

export default function JamesWilsonPage() {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Person",
        name: "James Wilson",
        jobTitle: "Full-Stack Developer",
        worksFor: {
          "@type": "Organization",
          name: SITE_NAME,
        },
        url: `${SITE_URL}/authors/james-wilson`,
        description: "Full-Stack Developer at ToolVerse with 10 years of experience, open-source maintainer. Builds developer utility tools, formatters, and minifiers.",
        knowsAbout: ["JavaScript", "TypeScript", "React", "Node.js", "Open Source"],
      }} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <div className="mt-6 flex items-start gap-6">
            <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-purple-100 text-2xl font-bold text-purple-600 dark:bg-purple-900 dark:text-purple-400">
              JW
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                James Wilson
              </h1>
              <p className="mt-1 text-lg font-medium text-purple-600 dark:text-purple-400">
                Full-Stack Developer
              </p>
              <div className="mt-4">
                <SocialShare url={`${SITE_URL}/authors/james-wilson`} title={`James Wilson — Full-Stack Developer at ${SITE_NAME}`} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="space-y-6 text-zinc-600 dark:text-zinc-400">
            <p>
              James Wilson is a Full-Stack Developer at ToolVerse with 10 years of experience building web applications, developer tools, and open-source software. He is the maintainer of several popular open-source projects on GitHub, including a widely used React component library and a TypeScript utility toolkit that collectively receive millions of monthly downloads on npm.
            </p>
            <p>
              James&apos;s career spans startups and established tech companies, where he has led frontend architecture, designed RESTful and GraphQL APIs, and built developer tooling that improved team productivity. He is proficient in JavaScript, TypeScript, React, Node.js, and modern CSS, and he brings deep expertise in web performance optimization, accessibility, and cross-browser compatibility to every project he undertakes.
            </p>
            <p>
              At ToolVerse, James develops and maintains the developer utility tools. He built the JSON Formatter, which handles deeply nested JSON structures with syntax highlighting and error detection, and the Base64 Encoder, which supports both encoding and decoding with Unicode and binary data handling. He also developed the URL Encoder, HTML Minifier, and CSS Minifier — each tool designed to provide instant, accurate results that match the behavior of standard command-line utilities.
            </p>
            <p>
              James is a strong advocate for the open-source community. He believes that developer tools should be freely available, well-documented, and built to the highest standards of quality. At ToolVerse, he channels this philosophy into every tool he creates, ensuring they are fast, reliable, and accessible to developers of all skill levels.
            </p>
          </div>
          <div className="mt-12">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Contributions
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
              Tools built and maintained by James at ToolVerse:
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {contributions.map((tool) => (
                <Link
                  key={tool.name}
                  href={tool.href}
                  className="rounded-lg border border-zinc-200 p-4 text-sm transition-colors hover:border-purple-300 dark:border-zinc-800 dark:hover:border-purple-700"
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
