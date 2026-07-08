import type { ReactNode } from "react";
import { BookmarkButton } from "@/components/shared/bookmark-button";
import { ShareButton } from "@/components/shared/share-button";
import { JsonLd } from "@/components/shared/json-ld";
import { RelatedReading } from "@/components/shared/related-reading";
import { getToolBySlug } from "@/lib/registry";
import { howToSchema, qaPageSchema } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";

interface ToolLayoutProps {
  children: ReactNode;
  toolSlug?: string;
}

function featuredSnippetAnswer(name: string, cat?: string): string {
  const answers: Record<string, string> = {
    "network-internet": `${name} is a free online network diagnostic tool. It helps you analyze connectivity, verify configurations, and troubleshoot network issues from your browser with instant results.`,
    "code-dev": `${name} is a free online developer utility. It processes code, data, or configuration input directly in your browser and returns formatted, validated, or transformed output instantly.`,
    "image-design": `${name} is a free online image processing tool. It lets you edit, convert, or enhance images entirely in your browser with no uploads to any server.`,
    "text-writing": `${name} is a free online text utility. It helps you format, transform, or analyze text content quickly and accurately in your browser.`,
    "productivity": `${name} is a free online productivity tool. It simplifies everyday tasks with fast, browser-based processing for common workflows.`,
    "data-analytics": `${name} is a free online data analysis tool. It processes structured data in your browser and returns meaningful insights instantly.`,
  };
  return answers[cat ?? ""] || `${name} is a free online utility that processes your input directly in your browser and returns instant results. No data is sent to any server.`;
}

function whenToUse(name: string, cat?: string): string[] {
  const items: Record<string, string[]> = {
    "network-internet": ["Diagnose connectivity or DNS resolution issues", "Verify server or website availability from your location", "Audit security configurations like SSL certificates and HTTP headers"],
    "code-dev": ["Validate and format code or structured data before deployment", "Debug encoding issues in URLs, Base64, or file formats", "Quickly transform data between JSON, XML, YAML, or CSV"],
    "image-design": ["Resize or optimize images for web performance", "Remove backgrounds or apply visual effects without desktop software", "Convert between image formats while preserving quality"],
    "text-writing": ["Count words, characters, or paragraphs in your content", "Format text for specific platforms or markup languages", "Validate and clean up text data before publishing"],
    "productivity": ["Automate repetitive formatting or conversion tasks", "Generate codes, hashes, or identifiers for your projects", "Quickly calculate, convert, or transform common data types"],
  };
  return items[cat ?? ""] || [`Use ${name} when you need fast, reliable browser-based processing for common tasks`];
}

function whenNotToUse(): string[] {
  return [
    `For large-scale or batch processing that exceeds browser memory limits`,
    `When you need persistent storage or server-side data processing`,
    `If the tool does not support your specific file format or input type`,
  ];
}

function commonMistakes(name: string, cat?: string): string[] {
  const items: Record<string, string[]> = {
    "network-internet": ["Entering incomplete or malformed domain names — always use the full domain like example.com", "Misreading TTL values as resolution failures — propagation takes time", "Forgetting to check firewall or local network settings when diagnosing connectivity"],
    "code-dev": ["Pasting data with trailing whitespace or invisible characters that cause validation errors", "Assuming the tool accepts all encodings — check for UTF-8, Base64, or hex requirements", "Not clearing previous results before running a new conversion or transformation"],
  };
  return items[cat ?? ""] || ["Entering invalid or incomplete input that does not match the expected format", "Skipping the configuration options — defaults may not suit your use case", "Not reviewing the output carefully before using or exporting results"];
}

function keyTakeaways(name: string, cat?: string): string[] {
  const items: Record<string, string[]> = {
    "network-internet": [`${name} runs entirely in your browser — no data is sent to external servers`, `Results are generated in real time using live data from authoritative sources`, `Ideal for quick diagnostics without installing command-line tools`, `Free to use with no limits, registration, or API keys required`],
    "code-dev": [`${name} processes all data locally in your browser for maximum privacy`, `Handles common developer formats with syntax validation and error detection`, `Results update instantly as you type or paste new input`, `No file size limits beyond what your browser can handle`],
  };
  return items[cat ?? ""] || [`${name} is completely free and works offline after the first load`, `Processing happens locally — your data never leaves your device`, `Results are accurate and tested against industry-standard tools`, `No account, login, or API key needed to use this tool`];
}

export function ToolLayout({ children, toolSlug }: ToolLayoutProps) {
  const tool = toolSlug ? getToolBySlug(toolSlug) : undefined;
  const cat = tool?.category;

  const howTo = tool ? {
    name: `How to Use ${tool.name}`,
    description: `Step-by-step guide for using the ${tool.name} tool on ToolVerse.`,
    steps: [
      { name: "Enter Your Input", text: `Enter the required data into the input field. This could be a domain name, IP address, text, code, or file depending on the tool.` },
      { name: "Configure Options", text: `Adjust any available settings or parameters to customize the output to your needs.` },
      { name: "Run the Tool", text: `Click the process or lookup button to start. The tool will process your input and display results.` },
      { name: "Review and Export", text: `Review the results displayed on screen. Use the copy button to copy individual values, or download the complete result.` },
    ],
  } : null;

  return (
    <>
      {tool && <JsonLd data={howToSchema(howTo!)} />}
      {tool && <JsonLd data={qaPageSchema({ question: `How does ${tool.name} work?`, answer: `${tool.name} is a free online tool that processes your input entirely in your browser. Enter your data, configure options, and get instant results. No data is sent to any server.` })} />}
      <div className="mx-auto min-h-[60vh] max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      {tool && (
        <>
          <div className="mb-8 flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {tool.name}
            </p>
            <div className="flex items-center gap-2">
              <BookmarkButton
                tool={{ slug: tool.slug, name: tool.name, url: tool.url, viewedAt: new Date().toISOString() }}
              />
              <ShareButton
                title={`${tool.name} - ToolVerse`}
                text={`Check out ${tool.name} on ToolVerse`}
                url={`${SITE_URL}/${toolSlug}`}
              />
            </div>
          </div>

          <section className="mb-8 rounded-lg border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-700 dark:bg-zinc-900/50">
            <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {featuredSnippetAnswer(tool.name, cat)}
            </p>
          </section>

          <section className="mb-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Key Takeaways</h3>
              <ul className="mt-2 space-y-1">
                {keyTakeaways(tool.name, cat).map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                    <span className="mt-0.5 shrink-0 text-blue-500">&#8226;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">When to Use</h3>
              <ul className="mt-2 space-y-1">
                {whenToUse(tool.name, cat).map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                    <span className="mt-0.5 shrink-0 text-green-500">&#43;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">When Not to Use</h3>
              <ul className="mt-2 space-y-1">
                {whenNotToUse().map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                    <span className="mt-0.5 shrink-0 text-amber-500">&#8722;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Common Mistakes</h3>
              <ul className="mt-2 space-y-1">
                {commonMistakes(tool.name, cat).map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                    <span className="mt-0.5 shrink-0 text-red-500">&#33;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </>
      )}
      {children}
      {tool && <RelatedReading category={tool.category} />}
    </div>
    </>
  );
}
