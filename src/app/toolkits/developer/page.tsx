import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/constants";
import { JsonLd, Breadcrumbs, FaqSection } from "@/components/shared";
import { webPageSchema, breadcrumbSchema, faqSchema, type FaqItem } from "@/lib/seo";

const slug = "toolkits/developer";
const pageTitle = "Developer Toolkit \u2014 Essential Developer Tools \u2014 ToolVerse";
const pageDescription =
  "Curated collection of free online developer tools for debugging, encoding, formatting, and security. Everything a software engineer needs in one place.";

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
  alternates: { canonical: `${SITE_URL}/${slug}` },
};

const icons: Record<string, string> = {
  "dns-lookup": "\uD83C\uDF10",
  "reverse-dns-lookup": "\uD83D\uDD04",
  "ping-test": "\uD83D\uDCE1",
  "port-checker": "\uD83D\uDD0C",
  "json-formatter": "\uD83D\uDCD1",
  "regex-tester": "\uD83D\uDD0D",
  "jwt-decoder": "\uD83D\uDD11",
  "case-converter": "\uD83D\uDD20",
  "sql-formatter": "\uD83D\uDCD2",
  "ssl-certificate-checker": "\uD83D\uDD12",
  "http-headers-checker": "\uD83D\uDCE7",
  "website-status-checker": "\uD83D\uDCA1",
  "html-preview": "\uD83C\uDFA8",
  "markdown-preview": "\uD83D\uDCDD",
  "base64-encoder": "\uD83D\uDD22",
  "url-encoder": "\uD83D\uDD17",
  "html-entity-encoder": "\uD83D\uDDC4\uFE0F",
  "text-to-slug": "\uD83D\uDD79\uFE0F",
  "url-parser": "\uD83D\uDD0D",
  "password-generator": "\uD83D\uDD11",
  "js-minifier": "\uD83D\uDCD6",
  "css-minifier": "\uD83C\uDFA8",
  "html-minifier": "\uD83C\uDF10",
};

const tools = [
  {
    id: "dns-lookup",
    name: "DNS Lookup",
    description:
      "Look up DNS records for any domain including A, AAAA, CNAME, MX, NS, TXT, SOA, SRV, and CAA records.",
    href: "/dns-lookup",
  },
  {
    id: "reverse-dns-lookup",
    name: "Reverse DNS Lookup",
    description:
      "Find the hostname associated with an IP address using reverse DNS PTR record lookup.",
    href: "/reverse-dns-lookup",
  },
  {
    id: "ping-test",
    name: "Ping Test",
    description:
      "Test network latency and packet loss with min, average, and max response time measurements.",
    href: "/ping-test",
  },
  {
    id: "port-checker",
    name: "Port Checker",
    description:
      "Check if a network port is open on any host. Scan common ports or test a specific port.",
    href: "/port-checker",
  },
  {
    id: "json-formatter",
    name: "JSON Formatter",
    description:
      "Format, validate, and minify JSON data with syntax highlighting and error detection.",
    href: "/json-formatter",
  },
  {
    id: "regex-tester",
    name: "Regex Tester",
    description:
      "Test regular expressions against sample text in real time with match highlighting and capture groups.",
    href: "/regex-tester",
  },
  {
    id: "jwt-decoder",
    name: "JWT Decoder",
    description:
      "Decode and inspect JSON Web Tokens. View header, payload, signature, and expiration status.",
    href: "/jwt-decoder",
  },
  {
    id: "case-converter",
    name: "Case Converter",
    description:
      "Convert text between camelCase, PascalCase, snake_case, kebab-case, title case, and more.",
    href: "/case-converter",
  },
  {
    id: "sql-formatter",
    name: "SQL Formatter",
    description:
      "Format and beautify SQL queries including SELECT, INSERT, UPDATE, and DELETE statements.",
    href: "/sql-formatter",
  },
  {
    id: "ssl-certificate-checker",
    name: "SSL Certificate Checker",
    description:
      "Check SSL/TLS certificate details including issuer, validity period, and days until expiration.",
    href: "/ssl-certificate-checker",
  },
  {
    id: "http-headers-checker",
    name: "HTTP Headers Checker",
    description:
      "Check HTTP response headers for any URL. View status codes, cache policies, and security headers.",
    href: "/http-headers-checker",
  },
  {
    id: "website-status-checker",
    name: "Website Status Checker",
    description:
      "Check if a website is online. Get HTTP status code, response time, and detailed status reports.",
    href: "/website-status-checker",
  },
  {
    id: "html-preview",
    name: "HTML Preview",
    description:
      "Write and preview HTML code in real time with live rendering of HTML, CSS, and JavaScript.",
    href: "/html-preview",
  },
  {
    id: "markdown-preview",
    name: "Markdown Preview",
    description:
      "Write and preview Markdown in real time. Supports headings, lists, code blocks, and tables.",
    href: "/markdown-preview",
  },
  {
    id: "base64-encoder",
    name: "Base64 Encoder",
    description:
      "Encode and decode Base64 strings instantly. Supports Unicode text and URL-safe mode.",
    href: "/base64-encoder",
  },
  {
    id: "url-encoder",
    name: "URL Encoder",
    description:
      "Encode and decode URLs and query strings. Convert special characters to percent-encoded format.",
    href: "/url-encoder",
  },
  {
    id: "html-entity-encoder",
    name: "HTML Entity Encoder",
    description:
      "Encode and decode HTML entities. Escape special characters for safe HTML rendering.",
    href: "/html-entity-encoder",
  },
  {
    id: "text-to-slug",
    name: "Text to Slug Converter",
    description:
      "Convert any text to a URL-friendly slug. Remove special characters and generate SEO-friendly URLs.",
    href: "/text-to-slug",
  },
  {
    id: "url-parser",
    name: "URL Parser",
    description:
      "Parse any URL and view its components: protocol, hostname, path, query parameters, and fragment.",
    href: "/url-parser",
  },
  {
    id: "password-generator",
    name: "Password Generator",
    description:
      "Generate strong, random passwords with customizable length and character types.",
    href: "/password-generator",
  },
  {
    id: "js-minifier",
    name: "JS Minifier",
    description:
      "Minify and beautify JavaScript code. Reduce file size by stripping whitespace and comments.",
    href: "/js-minifier",
  },
  {
    id: "css-minifier",
    name: "CSS Minifier",
    description:
      "Minify and beautify CSS stylesheets. Compress CSS by removing whitespace and redundant rules.",
    href: "/css-minifier",
  },
  {
    id: "html-minifier",
    name: "HTML Minifier",
    description:
      "Minify and beautify HTML code. Remove whitespace, comments, and optional tags to reduce file size.",
    href: "/html-minifier",
  },
];

const sections = [
  {
    title: "Network Debugging",
    description:
      "Diagnose network issues with DNS resolution, connectivity checks, and port scanning. Every developer needs these basics in their toolbox for quick troubleshooting.",
    tools: tools.filter((t) =>
      ["dns-lookup", "reverse-dns-lookup", "ping-test", "port-checker"].includes(t.id),
    ),
  },
  {
    title: "Code Utilities",
    description:
      "Format, inspect, and transform code across multiple languages. From JSON to SQL, these tools help you clean up and understand your data structures quickly.",
    tools: tools.filter((t) =>
      ["json-formatter", "regex-tester", "jwt-decoder", "case-converter", "sql-formatter"].includes(t.id),
    ),
  },
  {
    title: "Web Tools",
    description:
      "Inspect web infrastructure and preview content before going live. Check certificates, headers, and see how your markup renders across formats.",
    tools: tools.filter((t) =>
      [
        "ssl-certificate-checker",
        "http-headers-checker",
        "website-status-checker",
        "html-preview",
        "markdown-preview",
      ].includes(t.id),
    ),
  },
  {
    title: "Encoding & Conversion",
    description:
      "Encode, decode, and transform text between various formats. Essential for working with APIs, databases, and content management workflows.",
    tools: tools.filter((t) =>
      ["base64-encoder", "url-encoder", "html-entity-encoder", "text-to-slug", "url-parser"].includes(t.id),
    ),
  },
  {
    title: "Security & Optimization",
    description:
      "Generate secure credentials and optimize your frontend assets. These tools help you ship faster with smaller bundles and stronger passwords.",
    tools: tools.filter((t) =>
      ["password-generator", "js-minifier", "css-minifier", "html-minifier"].includes(t.id),
    ),
  },
];

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Toolkits" },
  { label: "Developer Toolkit" },
];

const faqItems: FaqItem[] = [
  {
    question: "What is the Developer Toolkit?",
    answer:
      "The Developer Toolkit is a curated collection of free online tools designed for software engineers. It covers network debugging, code formatting, web inspection, encoding, and security optimization in one convenient location.",
  },
  {
    question: "Are all tools in the Developer Toolkit free?",
    answer:
      "Yes, every tool listed in the Developer Toolkit is completely free to use. There are no hidden charges, usage limits, or subscription requirements.",
  },
  {
    question: "Do I need to install anything to use these tools?",
    answer:
      "No installation is required. All tools run directly in your browser. Simply visit any tool page and start using it immediately.",
  },
  {
    question: "Can I use these tools for commercial projects?",
    answer:
      "Absolutely. All tools on ToolVerse are free for personal and commercial use. There are no licensing restrictions on the output generated by these tools.",
  },
  {
    question: "How often are new tools added to the Developer Toolkit?",
    answer:
      "We regularly add new tools based on community requests and emerging developer needs. Check back often or suggest a tool through our contact page.",
  },
  {
    question: "Is my data safe when using these tools?",
    answer:
      "Yes. Most processing happens directly in your browser. For server-side operations, data is never stored or shared with third parties. Your privacy is our priority.",
  },
];

export default function DeveloperToolkitPage() {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          name: pageTitle,
          description: pageDescription,
          url: `${SITE_URL}/${slug}`,
          breadcrumbs,
        })}
      />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <Breadcrumbs items={breadcrumbs} />

        <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          Developer Toolkit
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          {pageDescription}
        </p>

        {sections.map((section) => (
          <section key={section.title} className="mt-16">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              {section.title}
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              {section.description}
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {section.tools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group rounded-xl border border-zinc-200 p-5 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">
                      {icons[tool.id] ?? "\uD83D\uDD27"}
                    </span>
                    <div>
                      <h3 className="font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
                        {tool.name}
                      </h3>
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <section className="mt-16">
          <FaqSection items={faqItems} />
        </section>
      </div>
    </>
  );
}
