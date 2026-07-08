import type { Metadata } from "next";
import { UrlParser } from "@/components/url-parser/url-parser";
import {
  ToolLayout,
  ToolHero,
  FaqSection,
  RelatedTools,
  RelatedContent,
  JsonLd,
} from "@/components/shared";
import {
  faqSchema,
  webPageSchema,
  breadcrumbSchema,
  softwareAppSchema,
  type FaqItem,
} from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import Link from "next/link";

const slug = "url-parser";
const pageTitle = "URL Parser & Builder - Parse, Analyze and Build URLs Online";
const pageDescription =
  "Parse any URL to view its components (protocol, hostname, path, query parameters, hash) or build a URL from individual parts. Free online URL analysis tool for developers.";

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

const breadcrumbs = [
  { label: "Home", href: SITE_URL },
  { label: "Code & Development", href: `${SITE_URL}/category/code-dev` },
  { label: "URL Parser & Builder" },
];

const faqItems: FaqItem[] = [
  {
    question: "What components make up a URL?",
    answer:
      "A URL consists of several components: the protocol (or scheme) indicates how to access the resource (https, http, ftp); the hostname identifies the server (example.com); the port specifies the network port (defaults to 443 for HTTPS); the pathname locates the resource on the server (/path/to/page); the search (or query string) contains key-value parameters (?key=value); and the hash (or fragment) points to a section within the page (#section).",
  },
  {
    question: "How do I parse a URL to extract query parameters?",
    answer:
      "Enter any complete URL into the parser input and click Parse. The tool will break it down into all its components and display each one in a structured table. The query parameters are shown in a separate table with each key-value pair on its own row, making it easy to inspect, debug, or document API endpoint URLs.",
  },
  {
    question: "Can I build a URL from scratch using this tool?",
    answer:
      "Yes. Switch to the Build mode to construct a URL from individual components. Select the protocol, enter the hostname and port, specify the pathname, add query parameters one by one, and optionally include a hash fragment. The built URL updates immediately and can be copied with one click.",
  },
  {
    question: "What is the difference between URL encoding and URL parsing?",
    answer:
      "URL parsing breaks a URL into its structural components for analysis. URL encoding (percent-encoding) converts special characters into a format that can be transmitted safely in URLs. Use the <Link href=\"/url-encoder\" className=\"text-blue-600 hover:underline dark:text-blue-400\">URL Encoder</Link> for encoding, and this tool for parsing and building URL structures.",
  },
  {
    question: "Why would I need to analyze a URL's components?",
    answer:
      "URL analysis is essential for debugging API integrations, understanding redirect chains, inspecting third-party tracking parameters, documenting webhook endpoints, and testing URL routing rules. Breaking a URL into its components helps identify malformed queries, incorrect protocol schemes, or unexpected parameters that might break your application.",
  },
  {
    question: "How does the URL builder handle special characters in parameters?",
    answer:
      "The builder automatically percent-encodes special characters in query parameter keys and values, ensuring the generated URL is valid and safe to use. This prevents issues with spaces, Unicode characters, and reserved characters that would otherwise break the URL syntax.",
  },
  {
    question: "What is the difference between URL, URI, and URN?",
    answer:
      "A URL (Uniform Resource Locator) specifies both the name and the method to access a resource. A URI (Uniform Resource Identifier) is a broader term that includes both URLs and URNs. A URN (Uniform Resource Name) identifies a resource by name within a specific namespace without specifying how to access it. Every URL is a URI, but not every URI is a URL.",
  },
  {
    question: "Can this parser handle internationalized domain names (IDN)?",
    answer:
      "Yes. The parser uses the browser's built-in URL constructor, which supports internationalized domain names. Non-ASCII characters in the hostname are handled according to the Punycode encoding standard. The parsed components will display the decoded Unicode form where applicable.",
  },
];

export default function UrlParserPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="URL Parser & Builder"
            description="Parse any URL into its individual components or build a URL from scratch. Inspect query parameters, protocol, hostname, path, and hash fragments with ease."
            breadcrumbs={breadcrumbs}
          >
            <UrlParser />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Understanding URL Structure for Web Development
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Every web developer works with URLs daily, but understanding their anatomy is critical for building robust web applications. A well-structured URL follows RFC 3986, which defines the standard syntax. The protocol tells the browser how to communicate (HTTPS with TLS encryption, HTTP without, FTP for file transfers). The hostname can be a registered domain, a subdomain, or even an IP address. The port number, when omitted, defaults to 80 for HTTP and 443 for HTTPS, but custom ports are common in development environments and internal services.
            </p>
            <p>
              The query string is where most complexity arises. Multiple parameters are separated by ampersands, values must be properly percent-encoded, and the order of parameters can sometimes matter. For APIs, query parameters control pagination, filtering, sorting, and authentication. For analytics, tracking parameters like UTM codes are appended to marketing URLs. A URL parser helps you see exactly what each part of a URL means, which is invaluable when debugging why a request failed or a page is not behaving as expected. When you need to submit URLs as part of query parameters, use the <Link href="/url-encoder" className="text-blue-600 hover:underline dark:text-blue-400">URL Encoder</Link> to safely nest them.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Parsing and Building URLs for API Development
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              API development involves constant URL manipulation. RESTful endpoints follow specific path patterns like /api/v1/users/123/posts, with query parameters for filtering and pagination. A URL parser helps you verify that your endpoint URLs are correctly structured before writing client code. When building webhook integrations, you need to construct callback URLs that include verification tokens, event types, and return paths — all as properly formatted query parameters.
            </p>
            <p>
              The Build mode of this tool is particularly useful for testing URL construction logic. Instead of writing code and debugging string concatenation errors, you can visually assemble the URL and verify each component. Once the URL structure is correct, you can replicate the pattern in your application code confidently. For inspecting the authentication tokens that often appear in URLs, pair this with the <Link href="/jwt-decoder" className="text-blue-600 hover:underline dark:text-blue-400">JWT Decoder</Link> to decode and verify JWT tokens embedded in authorization URLs or query parameters.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About URL Parsing" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "🔗", title: "URL Encoder", description: "Percent-encode and decode URLs and query string parameters", href: "/url-encoder" },
              { icon: "🪙", title: "JWT Decoder", description: "Decode and inspect JSON Web Token headers and payloads", href: "/jwt-decoder" },
              { icon: "🌐", title: "HTML Preview", description: "Write and preview HTML code in real time", href: "/html-preview" },
              { icon: "📋", title: "JSON Formatter", description: "Validate, beautify, and minify JSON data", href: "/json-formatter" },
            ]}
            title="Related Developer Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="url-parser" />
    </>
  );
}
