import type { Metadata } from "next";
import { MarkdownPreview } from "@/components/markdown-preview/markdown-preview";
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

const slug = "markdown-preview";
const pageTitle = "Markdown Preview - Live Markdown Editor & HTML Preview Online";
const pageDescription =
  "Write and preview Markdown in real time with ToolVerse&apos;s live Markdown preview tool. Render GitHub-flavored Markdown to HTML instantly with a split-pane editor.";

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
  { label: "Markdown Preview" },
];

const faqItems: FaqItem[] = [
  {
    question: "What is Markdown and why is it so widely used?",
    answer:
      "Markdown is a lightweight markup language that uses plain text formatting to create structured documents. It was created by John Gruber in 2004 with the goal of making documents readable as-is while also being convertible to HTML. Markdown has become the standard for README files on GitHub, documentation sites, forum posts, note-taking apps, and static site generators because it is easy to learn, fast to write, and works everywhere. Its simplicity has led to widespread adoption across the developer ecosystem.",
  },
  {
    question: "What is the difference between standard Markdown and GitHub-Flavored Markdown?",
    answer:
      "GitHub-Flavored Markdown (GFM) extends standard Markdown with additional features including tables, task lists, strikethrough, autolinking URLs, fenced code blocks with syntax highlighting, and emoji support. Standard Markdown only supports basic formatting like headings, lists, bold, italic, and links. ToolVerse uses GFM rendering via the marked library, so you get the full feature set including tables, code blocks, and strikethrough formatting.",
  },
  {
    question: "Can I use Markdown preview for writing documentation or blog posts?",
    answer:
      "Absolutely. The split-pane live preview is ideal for writing documentation, README files, blog posts, and technical articles. The left pane shows your raw Markdown source and the right pane renders the HTML output in real time with a 300ms debounce. This instant feedback loop helps catch formatting errors early and lets you focus on content without toggling between editor and preview modes.",
  },
  {
    question: "Does this Markdown preview support syntax highlighting in code blocks?",
    answer:
      "Yes. The marked library renders fenced code blocks with language identifiers, and the preview pane applies syntax highlighting through CSS styling. Code blocks are displayed in a monospace font with a distinct background color to set them apart from body text. For specialized code highlighting with language-specific colors, you can combine the output with dedicated code highlighting libraries like Prism.js or highlight.js.",
  },
  {
    question: "What are the most common Markdown formatting mistakes?",
    answer:
      "Common mistakes include forgetting a space after the hash symbol in headings, inconsistent indentation in nested lists, missing blank lines between paragraphs and code blocks, and incorrect link syntax. Another frequent issue is using tabs instead of spaces for indentation inside code blocks or list continuations. The live preview makes these errors immediately visible so you can correct them as you type.",
  },
  {
    question: "How is Markdown different from rich text editors like Google Docs?",
    answer:
      "Markdown is plain text with formatting syntax, while rich text editors use WYSIWYG (What You See Is What You Get) interfaces with hidden formatting codes. Markdown files are smaller, portable, version-control friendly, and can be edited in any text editor. Rich text editors are more intuitive for non-technical users but produce proprietary formats that are harder to diff, merge, and process programmatically. Markdown bridges the gap between plain text and formatted documents.",
  },
  {
    question: "Can I use HTML inside Markdown?",
    answer:
      "Yes. Markdown allows inline HTML for elements that are not covered by its syntax. You can embed <div>, <span>, <table>, and other HTML tags directly in your Markdown document. Most Markdown parsers will pass through HTML unchanged while still processing Markdown syntax in the rest of the document. This makes Markdown extensible for advanced layouts while keeping the majority of your content simple and readable.",
  },
  {
    question: "What is the best way to learn Markdown syntax?",
    answer:
      "The best way to learn Markdown is to practice with a live preview tool like this one. Start with the basics: headings (using # symbols), bold and italic text, links, images, and lists. Then move on to tables, code blocks, and blockquotes. The John Gruber original specification covers the fundamentals, while GitHub&apos;s documentation explains the GFM extensions. Most note-taking apps like Obsidian, Notion, and Bear have built-in Markdown guides as well.",
  },
  {
    question: "How does Markdown compare to other markup languages like reStructuredText or AsciiDoc?",
    answer:
      "Markdown is simpler and more intuitive than reStructuredText (rST) and AsciiDoc, which offer more features but with steeper learning curves. rST is the default for Python documentation and offers powerful directive-based extensions. AsciiDoc is popular in the Java ecosystem and supports complex document structures, cross-references, and includes. Markdown wins for general-purpose writing because of its minimal syntax and universal support across platforms and tools.",
  },
  {
    question: "Can I use Markdown in static site generators?",
    answer:
      "Yes. Most static site generators including Next.js (with MDX), Hugo, Jekyll, Eleventy, and Astro use Markdown as their primary content format. You write pages in Markdown with frontmatter metadata, and the generator converts them to HTML during the build process. MDX extends Markdown to allow embedding React components directly in Markdown files, enabling interactive content within static pages.",
  },
];

export default function MarkdownPreviewPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}`, breadcrumbs })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd data={softwareAppSchema({ name: pageTitle, description: pageDescription, url: `${SITE_URL}/${slug}` })} />

      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <ToolLayout toolSlug={slug}>
          <ToolHero
            title="Markdown Preview"
            description="Write Markdown on the left and see the rendered HTML on the right in real time. Perfect for documentation, README files, and technical writing."
            breadcrumbs={breadcrumbs}
          >
            <MarkdownPreview />
          </ToolHero>
        </ToolLayout>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Why Markdown Is the Language of Modern Documentation
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              Markdown has become the de facto standard for documentation across the software industry because it solves a fundamental problem: how to write formatted text without learning HTML or fighting with a rich text editor. Every README on GitHub, every documentation page on GitBook, and every post on Reddit and Discord uses Markdown. Its syntax is intuitive enough that anyone can learn it in five minutes, yet powerful enough to produce complex documents with tables, code blocks, images, and nested lists.
            </p>
            <p>
              The power of Markdown lies in its dual nature. A Markdown file is both human-readable plain text and machine-convertible structured content. You can edit it in any text editor, diff it with standard tools, store it in version control, and convert it to HTML, PDF, or EPUB. This makes it ideal for collaborative writing where multiple people need to review and contribute to documents without a specialized editor. For encoding text content that includes special characters, pair this tool with the <Link href="/html-entity-encoder" className="text-blue-600 hover:underline dark:text-blue-400">HTML Entity Encoder</Link> to ensure your output is properly escaped.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Live Preview: Writing with Instant Feedback
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              The split-pane live preview is the most effective way to write Markdown. Instead of writing blindly and then switching to a preview tab, you see the rendered output update as you type. This immediate feedback loop helps you catch formatting errors, visualize table layouts, and adjust heading hierarchy in real time. The 300-millisecond debounce ensures smooth performance even with large documents by batching render operations and avoiding unnecessary re-renders on every keystroke.
            </p>
            <p>
              This approach is particularly valuable when working with complex Markdown features like tables, nested lists, and fenced code blocks. Table alignment, list indentation, and code block fences are visually subtle in raw Markdown but become immediately clear in the rendered preview. For technical writers producing documentation that includes code examples, the combination of live preview and syntax-highlighted code blocks significantly reduces the time spent on formatting corrections. When working with text that needs to be transformed for different output formats, the <Link href="/case-converter" className="text-blue-600 hover:underline dark:text-blue-400">Case Converter</Link> helps normalize headings and labels across your documentation.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            GitHub-Flavored Markdown and Extended Syntax
          </h2>
          <div className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
            <p>
              GitHub-Flavored Markdown extends the original specification with features that modern documentation requires. Tables with alignment support let you present structured data without HTML. Task lists with checkboxes enable progress tracking directly in Markdown files. Fenced code blocks with optional language identifiers enable syntax highlighting in rendered output. Strikethrough, autolinks, and emoji shortcodes round out the feature set. ToolVerse uses the marked library with GFM mode enabled, giving you access to all these extensions in the preview pane.
            </p>
            <p>
              Beyond the standard GFM extensions, many Markdown processors support footnotes, definition lists, abbr eviations, and math expressions through additional plugins. The marked library is plugin-based, so additional extensions can be added as needed. For documentation that includes data tables generated from other formats, the <Link href="/base64-encoder" className="text-blue-600 hover:underline dark:text-blue-400">Base64 Encoder</Link> helps embed binary data and images inline within your Markdown documents using data URIs.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <FaqSection items={faqItems} title="Frequently Asked Questions About Markdown" />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <RelatedTools
            tools={[
              { icon: "🔤", title: "HTML Entity Encoder", description: "Encode HTML special characters to prevent rendering issues", href: "/html-entity-encoder" },
              { icon: "🔡", title: "Case Converter", description: "Convert text between uppercase, lowercase, camelCase, and more", href: "/case-converter" },
              { icon: "🔗", title: "URL Encoder", description: "Percent-encode and decode URLs and query string parameters", href: "/url-encoder" },
              { icon: "📋", title: "JSON Formatter", description: "Validate, beautify, and minify JSON data", href: "/json-formatter" },
            ]}
            title="Related Developer Tools"
          />
        </div>
      </section>
      <RelatedContent toolSlug="markdown-preview" />
    </>
  );
}
