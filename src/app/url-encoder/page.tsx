import type { Metadata } from "next";
import { UrlEncoder } from "@/components/url-encoder/url-encoder";
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

const slug = "url-encoder";
const pageTitle = "URL Encoder Decoder - Encode and Decode URLs Online";
const pageDescription =
  "Encode and decode URLs, query strings, and URI components online. Free URL percent-encoding tool for developers working with API parameters, form submissions, and web requests.";

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
  { label: "URL Encoder Decoder" },
];

const faqItems: FaqItem[] = [
  {
    question: "What is URL encoding and when is it necessary?",
    answer:
      "URL encoding, also known as percent-encoding, converts characters that are not allowed in a URL into a format that is safe for transmission. Characters like spaces, ampersands, question marks, and hash symbols have special meanings in URLs and must be encoded. A space becomes %20, an ampersand becomes %26, and so on. Encoding is necessary whenever user input or dynamic data is placed into a URL, whether in the path, query string, or fragment. Modern frameworks handle this automatically, but understanding the encoding is critical when debugging malformed requests.",
  },
  {
    question: "Which characters must always be encoded in a URL?",
    answer:
      "According to RFC 3986, the reserved characters that must be percent-encoded when they have no special purpose are: colon (:), slash (/), question mark (?), hash (#), square brackets ([ and ]), at sign (@), exclamation mark (!), dollar sign ($), ampersand (&), apostrophe ('), parentheses (( and )), asterisk (*), plus (+), comma (,), semicolon (;), and equal sign (=). The unreserved characters (A-Z, a-z, 0-9, hyphen, underscore, period, tilde) never need encoding. Spaces must always be encoded as %20.",
  },
  {
    question: "Should I use encodeURI or encodeURIComponent in JavaScript?",
    answer:
      "encodeURI encodes a complete URI while preserving characters that have special meaning in the URI structure (like ://?#). Use it for whole URLs. encodeURIComponent encodes every character except unreserved ones, making the output safe for embedding in any URI component. Use it for query parameter values, path segments, and fragments. The wrong choice is a common source of bugs: using encodeURI on a query parameter value will not encode ampersands or equals signs, breaking the URL structure.",
  },
  {
    question: "What is the difference between URL encoding and HTML encoding?",
    answer:
      "URL encoding (percent-encoding) is used to make data safe for URLs using % followed by hex codes. HTML encoding uses &entity; or &#decimal; syntax to make text safe for HTML documents. The same character may encode differently: a space is %20 in URLs but &nbsp; in HTML. An ampersand is %26 in URLs but &amp; in HTML. They serve different purposes and should not be confused. Use Nuvora&apos;s <Link href=\"/html-entity-encoder\" className=\"text-blue-600 hover:underline dark:text-blue-400\">HTML Entity Encoder</Link> when you need HTML-safe text rather than URL-safe text.",
  },
  {
    question: "Why does my URL break when it contains special characters?",
    answer:
      "URLs have strict syntax rules. Special characters like &, ?, #, and = are reserved for URL structure: & separates query parameters, ? starts the query string, # marks the fragment, and = separates parameter names from values. If your data contains these characters without encoding, the URL parser interprets them as syntax rather than data. Always encode user-generated content before appending it to URLs, especially in search queries, redirect URLs, and callback parameters.",
  },
  {
    question: "How does URL encoding handle non-ASCII characters and Unicode?",
    answer:
      "Non-ASCII characters like é, ü, or Chinese characters are first encoded as UTF-8 bytes, then each byte is percent-encoded. For example, the euro sign (€) becomes %E2%82%AC because its UTF-8 representation is three bytes: E2, 82, AC. This is why percent-encoded strings can appear longer than the original text. The receiving server must decode the percent-encoded UTF-8 bytes back into the original character, which most modern web servers and frameworks do automatically.",
  },
  {
    question: "What happens if you double-encode a URL?",
    answer:
      "Double-encoding occurs when an already percent-encoded string is encoded again. If %20 is encoded a second time, it becomes %2520 because the % character itself becomes %25. The server or framework typically decodes only once, leaving the raw %2520 intact. This causes issues like spaces appearing as the literal text %2520 in application logs and search queries. Avoid double-encoding by tracking which components are already encoded and applying encoding only once at the appropriate layer.",
  },
  {
    question: "Is a space encoded as %20 or + in URLs?",
    answer:
      "In the query string portion of a URL, spaces can be encoded as either %20 or +. The application/x-www-form-urlencoded standard uses + for spaces in form submission data. In the path and other URL components, only %20 is valid. Most modern URL parsers accept both in query strings but only %20 elsewhere. For consistent behavior, use %20 everywhere. The plus sign as a space is a legacy convention from the HTML form encoding specification.",
  },
  {
    question: "How does URL encoding affect API security?",
    answer:
      "Improper URL encoding is a common vector for injection attacks. If user input is inserted into a URL without encoding, an attacker can manipulate query parameters, redirect to malicious domains, or perform server-side request forgery. Always encode user input regardless of the source. Additionally, encode URLs within JSON payloads and redirect parameters to prevent breaking the surrounding data format. Pair this with the <Link href=\"/json-formatter\" className=\"text-blue-600 hover:underline dark:text-blue-400\">JSON Formatter</Link> to validate API payloads that contain URLs.",
  },
  {
    question: "What is the difference between URL encoding and Base64 encoding?",
    answer:
      "URL encoding makes arbitrary text safe for URLs by percent-encoding each special character individually. Base64 encodes arbitrary binary data into a compact ASCII representation. Base64 output often contains + and / characters, which need further URL encoding if placed in a URL. Base64URL is a variant that avoids this by using - and _ instead. Choose URL encoding for text going directly into a URL, and Base64 for embedding binary data in text-only contexts. Nuvora&apos;s <Link href=\"/base64-encoder\" className=\"text-blue-600 hover:underline dark:text-blue-400\">Base64 Encoder</Link> handles the latter.",
  },
];

export default function UrlEncoderPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="URL Encoder Decoder"
            description="Percent-encode or decode any URL string, query parameter, or URI component. Essential for debugging API calls, form submissions, and redirect chains."
            breadcrumbs={breadcrumbs}
          >
            <UrlEncoder />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            The Hidden Complexity of URL Encoding
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              URL encoding, defined in RFC 3986, seems simple on the surface: replace unsafe characters with a percent sign followed by their two-digit hex code. But the devil is in the details. Different parts of a URL have different encoding rules. The path, query string, and fragment each treat reserved characters differently. A forward slash in the path has structural meaning, but a forward slash in a query parameter value should be encoded as %2F. Misunderstanding this distinction is why so many API calls fail with cryptic 400 Bad Request responses.
            </p>
            <p>
              Modern web frameworks like Express, Next.js, and Django handle decoding automatically on the server side, but they expect the client to send properly encoded data. When you craft URLs manually in curl, Postman, or custom scripts, you are responsible for correct encoding. This is especially important for OAuth flows, where redirect URLs must be encoded within query parameters. A missed encoding of the redirect_uri parameter causes the entire authentication handshake to fail. For analyzing how URLs behave in practice, you can also inspect the full request details using the <Link href="/http-headers-checker" className="text-blue-600 hover:underline dark:text-blue-400">HTTP Headers Checker</Link> to see exactly what your browser sends.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Query Strings and Form Data: Encoding Pitfalls
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Query strings follow the application/x-www-form-urlencoded specification, which has a few quirks that differ from general URL encoding. Spaces should be encoded as + instead of %20 (though %20 is also widely accepted). Key-value pairs are separated by &, and the key and value within each pair are separated by =. If your data contains these characters, they must be encoded to avoid breaking the parameter boundary. Nested data structures like arrays and objects have no formal standard in query strings, leading to various conventions across frameworks.
            </p>
            <p>
              When building single-page applications that read query parameters from the URL, you must decode them before use. The browser&apos;s URL API provides searchParams for this, but many developers still parse raw window.location.search strings manually and forget to decode. This causes subtle bugs where %2F in a parameter value arrives as a decoded slash and breaks route matching. Testing your encoded URLs with a dedicated encoder helps catch these issues before they reach production. The <Link href="/json-formatter" className="text-blue-600 hover:underline dark:text-blue-400">JSON Formatter</Link> can also help you inspect the structured data that often gets serialized into query string parameters.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Real-World Use Cases for URL Encoding
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              URL encoding touches nearly every web request. When you submit a search form, the search terms are encoded into the URL. When you share a link with UTM tracking parameters, the campaign values must be encoded to survive the redirect chain. When an API redirects you to an authorization endpoint with a callback URL as a parameter, that callback URL is encoded inside the outer URL. Social media platforms and URL shorteners depend on correct encoding to parse shared links without breaking on special characters like parentheses or apostrophes in article titles.
            </p>
            <p>
              In automated testing, URL encoding is critical for setting up mock server responses. If your test framework sends requests with improperly encoded query parameters, the mock assertions fail not because of the logic under test but because of encoding mismatch. Similarly, when scraping or crawling websites, URLs must be normalized: decoded for analysis and encoded for requests. The interaction between URL encoding and other encodings like Base64 also arises frequently, particularly in single-page application routing where Base64-encoded state is embedded in the URL fragment. Use Nuvora&apos;s <Link href="/case-converter" className="text-blue-600 hover:underline dark:text-blue-400">Case Converter</Link> to normalize and transform text data before or after encoding it for URLs.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About URL Encoding" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "🔐", title: "Base64 Encoder", description: "Encode and decode Base64 strings for data URIs and JWT payloads", href: "/base64-encoder" },
              { icon: "🔤", title: "HTML Entity Encoder", description: "Encode HTML special characters to prevent XSS", href: "/html-entity-encoder" },
              { icon: "📋", title: "JSON Formatter", description: "Validate, beautify, and minify JSON data", href: "/json-formatter" },
              { icon: "🔡", title: "Case Converter", description: "Convert text between uppercase, lowercase, camelCase, and more", href: "/case-converter" },
            ]}
            title="Related Developer Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="url-encoder" />
    </>
  );
}
