import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { Breadcrumbs, JsonLd, SocialShare } from "@/components/shared";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Authors — Meet the ToolVerse Team | ${SITE_NAME}`,
  description: `Meet the team behind ${SITE_NAME}: network engineers, security researchers, developers, and content strategists building free online tools.`,
  alternates: { canonical: `${SITE_URL}/authors` },
  openGraph: {
    title: `Authors — Meet the ToolVerse Team | ${SITE_NAME}`,
    description: `Learn about the experts building and maintaining ${SITE_NAME}'s network diagnostic tools and educational content.`,
  },
};

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Authors" },
];

const authors = [
  {
    slug: "alex-chen",
    name: "Alex Chen",
    title: "Senior Network Engineer",
    bio: "Alex is a senior network engineer with 12 years of experience in DNS, BGP routing, and network infrastructure. Formerly at Cloudflare, he now leads tool development at ToolVerse, building accurate and reliable network diagnostic tools.",
    expertise: ["DNS", "BGP Routing", "Network Security", "Infrastructure"],
    initials: "AC",
  },
  {
    slug: "sarah-mitchell",
    name: "Sarah Mitchell",
    title: "Web Security Researcher",
    bio: "Sarah is a web security researcher with 8 years of experience specializing in SSL/TLS protocols, cryptographic standards, and web application security. An active OWASP contributor, she ensures every security tool meets rigorous accuracy standards.",
    expertise: ["SSL/TLS", "Web Security", "Cryptography", "OWASP"],
    initials: "SM",
  },
  {
    slug: "james-wilson",
    name: "James Wilson",
    title: "Full-Stack Developer",
    bio: "James is a full-stack developer with 10 years of experience building web applications and developer tools. He maintains several popular open-source libraries and brings deep expertise in JavaScript, TypeScript, and modern web frameworks to ToolVerse.",
    expertise: ["JavaScript", "TypeScript", "React", "Open Source"],
    initials: "JW",
  },
  {
    slug: "priya-patel",
    name: "Priya Patel",
    title: "Content Strategist & SEO Specialist",
    bio: "Priya is a content strategist with 7 years of experience creating technical content that ranks. Formerly at Moz, she develops content strategies that balance technical depth with readability, ensuring ToolVerse guides meet both user needs and search best practices.",
    expertise: ["SEO", "Content Strategy", "Technical Writing", "Analytics"],
    initials: "PP",
  },
];

export default function AuthorsPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: `Authors — Meet the ToolVerse Team | ${SITE_NAME}`, description: `Meet the team behind ${SITE_NAME}.`, url: `${SITE_URL}/authors`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <section className="border-b border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Meet the ToolVerse Team
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Our team combines decades of experience in network engineering, web security, software development, and content strategy to build tools you can trust.
          </p>
          <div className="mt-6">
            <SocialShare url={`${SITE_URL}/authors`} title={`Authors — Meet the ToolVerse Team | ${SITE_NAME}`} />
          </div>
        </div>
      </section>
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {authors.map((author) => (
              <Link
                key={author.slug}
                href={`/authors/${author.slug}`}
                className="group rounded-xl border border-zinc-200 bg-white p-6 transition-colors hover:border-blue-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-blue-700"
              >
                <div className="flex items-start gap-4">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                    {author.initials}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
                      {author.name}
                    </h2>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {author.title}
                    </p>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {author.bio}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {author.expertise.map((area) => (
                        <span
                          key={area}
                          className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
