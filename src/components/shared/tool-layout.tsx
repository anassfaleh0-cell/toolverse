import type { ReactNode } from "react";
import { BookmarkButton } from "@/components/shared/bookmark-button";
import { ShareButton } from "@/components/shared/share-button";
import { JsonLd } from "@/components/shared/json-ld";
import { RelatedReading } from "@/components/shared/related-reading";
import { ToolAnalysis } from "@/components/shared/tool-analysis";
import { AIExplanationCard } from "@/components/shared/ai-explain";
import { CrossLinks } from "@/components/shared/cross-links";
import { PopularWorkflows } from "@/components/shared/popular-workflows";
import { SuggestedNextTool } from "@/components/shared/suggested-next-tool";
import { getKnowledgeForTool } from "@/lib/ai-explanation-knowledge";
import { getToolBySlug } from "@/lib/registry";
import { howToSchema, qaPageSchema } from "@/lib/seo";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

interface ToolLayoutProps {
  children: ReactNode;
  toolSlug?: string;
}

function featuredSnippetAnswer(name: string, cat?: string): string {
  const answers: Record<string, string> = {
    "network-internet": `${name} is a free online network diagnostic tool from ${SITE_NAME}. It helps you analyze connectivity, verify configurations, and troubleshoot network issues from your browser with instant results.`,
    "code-dev": `${name} is a free online developer utility from ${SITE_NAME}. It processes code, data, or configuration input directly in your browser and returns formatted, validated, or transformed output instantly.`,
    "image-design": `${name} is a free online image processing tool from ${SITE_NAME}. It lets you edit, convert, or enhance images entirely in your browser with no uploads to any server.`,
    "text-writing": `${name} is a free online text utility from ${SITE_NAME}. It helps you format, transform, or analyze text content quickly and accurately in your browser.`,
    "productivity": `${name} is a free online productivity tool from ${SITE_NAME}. It simplifies everyday tasks with fast, browser-based processing for common workflows.`,
    "data-analytics": `${name} is a free online data analysis tool from ${SITE_NAME}. It processes structured data in your browser and returns meaningful insights instantly.`,
  };
  return answers[cat ?? ""] || `${name} is a free online utility from ${SITE_NAME} that processes your input directly in your browser and returns instant results. No data is sent to any server.`;
}

export function ToolLayout({ children, toolSlug }: ToolLayoutProps) {
  const tool = toolSlug ? getToolBySlug(toolSlug) : undefined;
  const cat = tool?.category;

  const howTo = tool ? {
    name: `How to Use ${tool.name}`,
    description: `Step-by-step guide for using the ${tool.name} tool on ${SITE_NAME}.`,
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
      {tool && <JsonLd data={qaPageSchema({ question: `How does ${tool.name} work?`, answer: `${tool.name} is a free online tool from ${SITE_NAME} that processes your input entirely in your browser. Enter your data, configure options, and get instant results. No data is sent to any server.` })} />}
      {tool && <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "TechArticle",
        name: tool.name,
        description: tool.description,
        proficiencyLevel: "Beginner",
        timeRequired: "PT1M",
      } as const} />}
      <div className="mx-auto min-h-[60vh] max-w-5xl px-4 py-12 sm:px-6 sm:py-16" role="main" aria-label={tool ? `${tool.name} tool` : "Tool page"}>
      {tool && (
        <>
          <div className="mb-8 flex items-center justify-between border-b border-border-subtle pb-4">
            <p className="text-xs font-medium uppercase tracking-wider text-text-tertiary">
              {tool.name}
            </p>
            <div className="flex items-center gap-2">
              <BookmarkButton
                tool={{ slug: tool.slug, name: tool.name, url: tool.url, viewedAt: new Date().toISOString() }}
              />
              <ShareButton
                title={`${tool.name} - ${SITE_NAME}`}
                text={`Check out ${tool.name} on ${SITE_NAME}`}
                url={`${SITE_URL}/${toolSlug}`}
              />
            </div>
          </div>

          <section className="mb-8 rounded-xl border border-border-subtle bg-gradient-to-br from-surface to-background p-6">
            <div className="flex items-start gap-4">
              <div className="hidden shrink-0 sm:block">
                <div className="flex size-12 items-center justify-center rounded-xl bg-nuvora-100 text-nuvora-600 dark:bg-nuvora-900/50 dark:text-nuvora-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-6">
                    <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-sm leading-relaxed text-text-secondary">
                  {featuredSnippetAnswer(tool.name, cat)}
                </p>
                <p className="mt-3 text-xs text-text-tertiary">
                  Powered by {SITE_NAME} &bull; Free &bull; No signup required &bull; Processes in your browser
                </p>
              </div>
            </div>
          </section>

          {tool && <ToolAnalysis category={cat} />}

          {tool && (
            <div className="mb-8">
              <AIExplanationCard
                toolName={tool.slug}
                toolCategory={cat}
                knowledgeBase={getKnowledgeForTool(tool.slug)}
              />
            </div>
          )}

          {tool && <CrossLinks toolSlug={tool.slug} />}
          {tool && <SuggestedNextTool currentSlug={tool.slug} />}
          {tool && <PopularWorkflows />}
        </>
      )}
      {children}
      {tool && <RelatedReading category={tool.category} />}
    </div>
    </>
  );
}
