import type { Metadata } from "next";
import { HtmlPreview } from "@/components/html-preview/html-preview";
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

const slug = "html-preview";
const pageTitle = "HTML Preview - Live HTML Viewer & Editor Online";
const pageDescription =
  "Write and preview HTML code in real time with live rendering. Test HTML snippets with CSS and JavaScript before deploying to your website.";

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
  { label: "HTML Preview" },
];

const faqItems: FaqItem[] = [
  {
    question: "How does the HTML preview tool work?",
    answer:
      "The HTML Preview tool runs entirely in your browser. As you type HTML code into the left textarea, the right iframe updates in real time using the srcdoc attribute to render your markup. No data is ever sent to a server, making it safe for testing sensitive or proprietary HTML templates.",
  },
  {
    question: "Can I preview HTML with CSS and JavaScript?",
    answer:
      "Yes. The iframe renders your code exactly as a browser would, including embedded CSS within style tags and JavaScript within script tags. You can build and test complete web page snippets with styles and interactivity, all within the preview pane.",
  },
  {
    question: "Is the html-preview tool safe for testing untrusted code?",
    answer:
      "The iframe uses the sandbox attribute with allow-scripts and allow-same-origin, which restricts potentially dangerous operations. However, you should still exercise caution when running untrusted JavaScript. The tool processes everything locally in your browser with no server-side execution.",
  },
  {
    question: "What is the srcdoc attribute on an iframe?",
    answer:
      "The srcdoc attribute allows you to specify inline HTML content directly within an iframe element, as opposed to loading content from an external URL via the src attribute. This enables instant rendering without additional network requests and keeps your code private to your browser session.",
  },
  {
    question: "Does the HTML preview support responsive design testing?",
    answer:
      "The preview iframe resizes with the viewport, but you can test responsive designs by resizing your browser window. For more advanced device-specific testing, consider using browser developer tools alongside the live preview.",
  },
  {
    question: "Can I preview external libraries like Bootstrap or Tailwind?",
    answer:
      "Yes. Include CDN links to external CSS and JavaScript libraries within the head of your HTML snippet. The iframe will load these resources when rendering, allowing you to test components built with popular frameworks before integrating them.",
  },
  {
    question: "What is the difference between HTML preview and HTML minifier?",
    answer:
      "The HTML Preview tool lets you write and test HTML with live rendering, while the <Link href=\"/html-minifier\" className=\"text-blue-600 hover:underline dark:text-blue-400\">HTML Minifier</Link> compresses existing HTML by removing whitespace and comments. Use the previewer during development and the minifier before deployment.",
  },
  {
    question: "Is my HTML code saved or stored anywhere?",
    answer:
      "No. All processing happens locally in your browser. Your HTML code is not sent to any server, stored, or logged. The tool is completely private and ephemeral — refreshing the page clears your input.",
  },
];

export default function HtmlPreviewPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="HTML Preview"
            description="Write HTML, CSS, and JavaScript on the left and see the rendered result instantly on the right. Perfect for testing snippets, prototyping layouts, and debugging markup before deployment."
            breadcrumbs={breadcrumbs}
          >
            <HtmlPreview />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Why Live HTML Preview Matters for Development
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Every web developer knows the edit-save-refresh cycle. Even with hot reloading tools, there are times when you need to test a small HTML snippet in isolation without the overhead of a full development environment. An HTML preview tool fills this gap perfectly: type your code in one pane, see the rendered output immediately in the other. No file system, no build steps, no waiting for servers to restart.
            </p>
            <p>
              This workflow is especially valuable when debugging a specific rendering issue. Instead of hunting through a complex component tree, you can extract the minimal HTML, CSS, and JavaScript that reproduces the problem and test it in isolation. Once the fix works in the preview, you can confidently apply it to your production code. For formatting and compressing that finalized HTML before deployment, use the <Link href="/html-minifier" className="text-blue-600 hover:underline dark:text-blue-400">HTML Minifier</Link> to strip unnecessary whitespace and reduce file size.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Common Use Cases for an HTML Viewer
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Email template testing is one of the most practical applications. HTML emails require inline styles, table-based layouts, and specific coding patterns to render correctly across Outlook, Gmail, and Apple Mail. Paste your email HTML into the previewer, and you will immediately see how it looks before sending a test campaign. The same applies to prototyping landing page sections, testing third-party embed codes, and verifying that your Open Graph meta tags render correctly.
            </p>
            <p>
              Developers also use HTML previews for educational purposes. When teaching HTML and CSS to beginners, showing the immediate visual feedback of code changes is the most effective way to explain how the box model, Flexbox, or CSS Grid works. For more complex encoding needs like embedding Base64-encoded images or SVGs into HTML, pair this tool with the <Link href="/base64-encoder" className="text-blue-600 hover:underline dark:text-blue-400">Base64 Encoder</Link> to generate the encoded strings and preview them simultaneously.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About HTML Preview" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "Link", title: "URL Encoder", description: "Percent-encode and decode URLs and query string parameters", href: "/url-encoder" },
              { icon: "TextIcon", title: "HTML Entity Encoder", description: "Encode HTML special characters to prevent XSS", href: "/html-entity-encoder" },
              { icon: "Package", title: "HTML Minifier", description: "Minify and beautify HTML code", href: "/html-minifier" },
              { icon: "FileText", title: "JSON Formatter", description: "Validate, beautify, and minify JSON data", href: "/json-formatter" },
            ]}
            title="Related Developer Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="html-preview" />
    </>
  );
}
