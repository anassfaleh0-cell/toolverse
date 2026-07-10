"use client";

import { useState } from "react";
import Link from "next/link";
import { getToolBySlug, getRelatedTools, generateToolFaq } from "@/lib/registry";
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
import { getContentForTool } from "@/lib/content/registry";
import { howToSchema, qaPageSchema } from "@/lib/seo";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import { TOOL_KEYWORDS } from "@/lib/seo/keywords";
import type { ReactNode } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

interface UseCase {
  title: string;
  description: string;
}

interface ToolLayoutProps {
  children: ReactNode;
  toolSlug?: string;
  faqItems?: FaqItem[];
  useCases?: UseCase[];
  relatedToolSlugs?: string[];
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

export function ToolLayout({ children, toolSlug, faqItems, useCases, relatedToolSlugs }: ToolLayoutProps) {
  const [whatIsOpen, setWhatIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
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

  const relatedTools = relatedToolSlugs
    ? relatedToolSlugs.map(slug => getToolBySlug(slug)).filter((t): t is NonNullable<typeof t> => t != null)
    : tool ? getRelatedTools(tool, 6) : [];

  const shareUrl = `${SITE_URL}/${toolSlug}`;
  const shareTitle = `${tool?.name ?? "Tool"} - ${SITE_NAME}`;

  const shareLinks = [
    { name: "Twitter", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}` },
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
  ];

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
      <div className="mx-auto min-h-[60vh] max-w-6xl px-4 py-12 sm:px-6 sm:py-16" role="main" aria-label={tool ? `${tool.name} tool` : "Tool page"}>
      {tool && (
        <>
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-nuvora-100 text-nuvora-600 dark:bg-nuvora-900/50 dark:text-nuvora-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-5">
                  <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">{tool.name}</p>
                <p className="text-xs text-text-tertiary">Free browser-based tool</p>
              </div>
            </div>
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

          <section className="mb-8 rounded-2xl border border-border-subtle bg-gradient-to-br from-surface to-background p-6 shadow-sm">
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
                <div className="mt-3 flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-nuvora-50 px-2.5 py-0.5 text-xs font-medium text-nuvora-600 dark:bg-nuvora-950/50 dark:text-nuvora-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                    No signup
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                    100% private
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-3"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    Browser-based
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* "What is this?" expandable section */}
          <section className="mb-8">
            <button
              onClick={() => setWhatIsOpen(!whatIsOpen)}
              className="flex w-full items-center justify-between rounded-xl border border-border-subtle bg-surface p-5 text-left transition-all hover:shadow-sm"
            >
              <span className="text-base font-semibold text-text-primary">What is {tool.name}?</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className={`size-5 text-text-tertiary transition-transform ${whatIsOpen ? "rotate-180" : ""}`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {whatIsOpen && (
              <div className="mt-2 rounded-xl border border-border-subtle bg-surface-secondary/50 p-5">
                <p className="text-sm leading-relaxed text-text-secondary">
                  {tool.description} All processing happens directly in your browser — no data is uploaded to any server. {tool.name} is designed to be fast, private, and easy to use for everyone from beginners to experts.
                </p>
              </div>
            )}
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

          {tool && (() => {
            const faqs = generateToolFaq(tool);
            const keywords = TOOL_KEYWORDS[tool.slug];
            const allFaqs = [...faqs, ...(faqItems ?? [])];
            return (
              <>
                {keywords && (
                  <section className="mb-8">
                    <h2 className="text-xl font-bold text-text-primary mb-4">How to Use {tool.name}</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-xl border border-border-subtle bg-surface p-5">
                        <div className="flex items-center gap-2 text-nuvora-600 dark:text-nuvora-400">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                          <h3 className="font-semibold text-sm text-text-primary">Step 1: Enter Your Input</h3>
                        </div>
                        <p className="mt-2 text-sm text-text-secondary leading-relaxed">Enter the {keywords.primary} data you want to process. This could be text, a URL, a domain name, or a file upload depending on the tool.</p>
                      </div>
                      <div className="rounded-xl border border-border-subtle bg-surface p-5">
                        <div className="flex items-center gap-2 text-nuvora-600 dark:text-nuvora-400">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-5"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                          <h3 className="font-semibold text-sm text-text-primary">Step 2: Configure Options</h3>
                        </div>
                        <p className="mt-2 text-sm text-text-secondary leading-relaxed">Adjust any available settings to customize the output. Most tools have sensible defaults, so you can skip this step if you want instant results.</p>
                      </div>
                      <div className="rounded-xl border border-border-subtle bg-surface p-5">
                        <div className="flex items-center gap-2 text-nuvora-600 dark:text-nuvora-400">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-5"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                          <h3 className="font-semibold text-sm text-text-primary">Step 3: Run & Review</h3>
                        </div>
                        <p className="mt-2 text-sm text-text-secondary leading-relaxed">Click the process button. Results appear instantly. Use the copy button to copy individual results or download the complete output.</p>
                      </div>
                      <div className="rounded-xl border border-border-subtle bg-surface p-5">
                        <div className="flex items-center gap-2 text-nuvora-600 dark:text-nuvora-400">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
                          <h3 className="font-semibold text-sm text-text-primary">Step 4: Get AI Analysis</h3>
                        </div>
                        <p className="mt-2 text-sm text-text-secondary leading-relaxed">Review the AI-powered explanation of your results. Switch to Beginner mode for plain-English breakdown, or Expert mode for technical details.</p>
                      </div>
                    </div>
                  </section>
                )}

                {/* Use Cases section (from props) */}
                {useCases && useCases.length > 0 && (
                  <section className="mb-8">
                    <h2 className="text-xl font-bold text-text-primary mb-4">Use Cases</h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {useCases.map((uc, i) => (
                        <div key={i} className="rounded-xl border border-border-subtle bg-surface-secondary/50 p-4">
                          <h3 className="text-sm font-semibold text-text-primary mb-1">{uc.title}</h3>
                          <p className="text-sm text-text-secondary">{uc.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {keywords && (
                  <section className="mb-8">
                    <h2 className="text-xl font-bold text-text-primary mb-4">Common Use Cases</h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {keywords.troubleshooting.slice(0, 4).map((tc) => (
                        <div key={tc} className="rounded-xl border border-border-subtle bg-surface-secondary/50 p-4">
                          <p className="text-sm text-text-secondary">{tc}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* FAQ accordion */}
                {allFaqs.length > 0 && (
                  <section className="mb-8">
                    <h2 className="text-xl font-bold text-text-primary mb-4">Frequently Asked Questions</h2>
                    <div className="space-y-3">
                      {allFaqs.map((faq, i) => (
                        <details key={i} className="group rounded-xl border border-border-subtle bg-surface transition-all hover:shadow-sm [&[open]]:shadow-sm">
                          <summary className="flex cursor-pointer items-center justify-between px-5 py-3.5 text-sm font-medium text-text-primary">
                            {faq.question}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4 shrink-0 text-text-tertiary transition-transform group-open:rotate-180">
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          </summary>
                          <div className="border-t border-border-subtle px-5 pb-3.5 pt-2.5">
                            <p className="text-sm text-text-secondary leading-relaxed">{faq.answer}</p>
                          </div>
                        </details>
                      ))}
                    </div>
                  </section>
                )}

                {/* Related tools carousel */}
                {relatedTools.length > 0 && (
                  <section className="mb-8">
                    <h2 className="text-xl font-bold text-text-primary mb-4">Related Tools</h2>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-border-subtle scrollbar-track-transparent">
                      {relatedTools.map((rt) => (
                        <Link
                          key={rt.slug}
                          href={rt.url}
                          className="flex shrink-0 flex-col gap-1 rounded-xl border border-border-subtle bg-surface p-4 transition-all hover:shadow-sm hover:border-nuvora-300 dark:hover:border-nuvora-700 min-w-[180px]"
                        >
                          <span className="text-sm font-semibold text-text-primary whitespace-nowrap">{rt.name}</span>
                          <span className="text-xs text-text-tertiary line-clamp-2">{rt.description}</span>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}

                {(getContentForTool(tool.slug).length > 0) && (
                  <section className="mb-8">
                    <h2 className="text-xl font-bold text-text-primary mb-4">Related Guides & Articles</h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {getContentForTool(tool.slug).slice(0, 4).map((content) => {
                        const typeRoutes: Record<string, string> = { guide: "guides", article: "blog", tutorial: "learn", comparison: "compare", "cheat-sheet": "cheat-sheets", "best-practices": "best-practices", commands: "commands", "use-cases": "use-cases" };
                        return (
                          <Link
                            key={content.slug}
                            href={`/${typeRoutes[content.type] ?? content.type}/${content.slug}`}
                            className="rounded-xl border border-border-subtle bg-surface p-4 transition-all hover:shadow-sm hover:border-nuvora-300 dark:hover:border-nuvora-700"
                          >
                            <span className="text-xs font-semibold uppercase tracking-wider text-nuvora-600 dark:text-nuvora-400">
                              {content.type === "article" ? "Blog" : content.type}
                            </span>
                            <h3 className="mt-1 font-medium text-text-primary text-sm">{content.title}</h3>
                          </Link>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* Share buttons */}
                <section className="mb-8">
                  <h2 className="text-xl font-bold text-text-primary mb-4">Share {tool.name}</h2>
                  <div className="flex items-center gap-3">
                    {shareLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Share on ${link.name}`}
                        className="flex size-10 items-center justify-center rounded-lg border border-border-subtle bg-surface text-text-secondary hover:bg-surface-secondary hover:text-nuvora-600 transition-all"
                      >
                        {link.name === "Twitter" && (
                          <svg viewBox="0 0 24 24" fill="currentColor" className="size-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                        )}
                        {link.name === "Facebook" && (
                          <svg viewBox="0 0 24 24" fill="currentColor" className="size-4"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                        )}
                        {link.name === "LinkedIn" && (
                          <svg viewBox="0 0 24 24" fill="currentColor" className="size-4"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" /></svg>
                        )}
                      </a>
                    ))}
                    <button
                      onClick={copyLink}
                      aria-label="Copy link"
                      className="flex size-10 items-center justify-center rounded-lg border border-border-subtle bg-surface text-text-secondary hover:bg-surface-secondary hover:text-nuvora-600 transition-colors"
                    >
                      {copied ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4 text-aurora-500"><polyline points="20 6 9 17 4 12" /></svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                      )}
                    </button>
                  </div>
                </section>

                {/* Report Issue link */}
                <section className="mb-8">
                  <a
                    href={`${SITE_URL}/contact?subject=Issue%20with%20${tool.name}&ref=${toolSlug}`}
                    className="inline-flex items-center gap-2 text-sm text-text-tertiary hover:text-nuvora-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                    Report an issue with this tool
                  </a>
                </section>
              </>
            );
          })()}
        </>
      )}
      {children}
      {tool && <RelatedReading category={tool.category} />}
    </div>
    </>
  );
}
