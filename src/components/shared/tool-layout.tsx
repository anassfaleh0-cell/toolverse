"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getToolBySlug, getRelatedTools } from "@/lib/registry";
import { BookmarkButton } from "@/components/shared/bookmark-button";
import { ShareButton } from "@/components/shared/share-button";
import { JsonLd } from "@/components/shared/json-ld";
import { Icon } from "@/components/shared/icon";
import { howToSchema } from "@/lib/seo";
import { SITE_URL, SITE_NAME } from "@/lib/constants";
import { TOOL_KEYWORDS } from "@/lib/seo/keywords";
import { getToolConfig } from "@/lib/tools-config";
import type { ReactNode } from "react";

interface UseCase {
  title: string;
  description: string;
}

interface ToolLayoutProps {
  children: ReactNode;
  toolSlug?: string;
  useCases?: UseCase[];
  relatedToolSlugs?: string[];
}

function LazySection({ children, minHeight = "100px", rootMargin = "200px" }: { children: ReactNode; minHeight?: string; rootMargin?: string }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return <div ref={ref} style={{ minHeight: visible ? "auto" : minHeight }}>{visible ? children : null}</div>;
}

export function ToolLayout({ children, toolSlug, useCases, relatedToolSlugs }: ToolLayoutProps) {
  const [copied, setCopied] = useState(false);
  const tool = toolSlug ? getToolBySlug(toolSlug) : undefined;
  const cat = tool?.category;

  const howTo = tool ? (() => {
    const config = getToolConfig(tool.slug);
    if (config.howTo && config.howTo.length > 0) {
      return {
        name: `How to Use ${tool.name}`,
        description: `Step-by-step guide for using the ${tool.name} tool on ${SITE_NAME}.`,
        steps: config.howTo.map(s => ({ name: s.action, text: s.desc })),
      };
    }
    if (config.fields.length > 0) {
      return {
        name: `How to Use ${tool.name}`,
        description: `Step-by-step guide for using the ${tool.name} tool on ${SITE_NAME}.`,
        steps: [
          { name: "Enter Input", text: `Provide ${config.fields.map(f => f.label.toLowerCase()).join(" and ")}.` },
          { name: "Configure", text: "Adjust any available settings to customize the output." },
          { name: "Run", text: `Click "${config.buttonText}" to process.` },
          { name: "Review", text: "Review the results and copy or download them." },
        ],
      };
    }
    return {
      name: `How to Use ${tool.name}`,
      description: `Step-by-step guide for using the ${tool.name} tool on ${SITE_NAME}.`,
      steps: [
        { name: "Run", text: `Click "${config.buttonText}".` },
        { name: "Review", text: "View results instantly." },
      ],
    };
  })() : null;

  const relatedTools = relatedToolSlugs
    ? relatedToolSlugs.map(slug => getToolBySlug(slug)).filter((t): t is NonNullable<typeof t> => t != null)
    : tool ? getRelatedTools(tool, 6) : [];

  const shareUrl = `${SITE_URL}/${toolSlug}`;
  const shareTitle = `${tool?.name ?? "Tool"} - ${SITE_NAME}`;

  const shareLinks = [
    { name: "Twitter", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}&via=NuvoraHQ` },
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
    { name: "Reddit", href: `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}` },
  ];

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {tool && <JsonLd data={howToSchema(howTo!)} />}

      <div className="mx-auto min-h-[60vh] max-w-5xl px-4 py-6 sm:px-6 sm:py-8" role="main" aria-label={tool ? `${tool.name} tool` : "Tool page"}>

        {/* THE TOOL — rendered FIRST, IMMEDIATELY visible */}
        {children}

        {/* SECTIONS BELOW THE TOOL */}
        {tool && (
          <>
            {/* What is this? */}
            <section className="mt-10 mb-8 rounded-xl border border-border-subtle bg-surface-secondary/50 p-5">
              <h2 className="text-base font-bold text-text-primary mb-2">What is {tool.name}?</h2>
              <p className="text-sm leading-relaxed text-text-secondary">
                {tool.description} All processing happens directly in your browser — no data is uploaded to any server. {tool.name} is designed to be fast, private, and easy to use.
              </p>
            </section>

            {/* How to Use — compact steps */}
            {(() => {
              const config = getToolConfig(tool.slug);
              let steps: { action: string; desc: string }[] | null = null;

              // Use config-driven howTo if available
              if (config.howTo && config.howTo.length > 0) {
                steps = config.howTo;
              } else if (config.fields.length > 0) {
                // Derive from config fields
                const inputLabels = config.fields.map(f => f.label.toLowerCase()).join(" and ");
                const btn = config.buttonText.toLowerCase();
                steps = [
                  { action: "Enter", desc: `Provide the ${inputLabels} in the input fields.` },
                  { action: "Configure", desc: "Adjust any available options for your needs." },
                  { action: "Run", desc: `Click "${config.buttonText}" to ${btn}.` },
                  { action: "Review", desc: "View the results and copy or download them." },
                ];
              } else {
                // No fields — one-click tool
                steps = [
                  { action: "Run", desc: `Click "${config.buttonText}" to start.` },
                  { action: "Review", desc: "View the results instantly on screen." },
                ];
              }

              return (
                <section className="mb-8">
                  <h2 className="text-base font-bold text-text-primary mb-3">How to Use {tool.name}</h2>
                  <div className="space-y-2">
                    {steps.map((s, i) => (
                      <div key={i} className="flex items-start gap-3 rounded-lg border border-border-subtle bg-surface px-4 py-3">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-nuvora-100 text-xs font-bold text-nuvora-600 dark:bg-nuvora-900/50 dark:text-nuvora-400">{i + 1}</span>
                        <p className="text-sm text-text-secondary"><strong className="text-text-primary">{s.action}.</strong> {s.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })()}

            {/* Use Cases from props */}
            {useCases && useCases.length > 0 && (
              <section className="mb-8">
                <h2 className="text-base font-bold text-text-primary mb-3">Use Cases</h2>
                <div className="space-y-2">
                  {useCases.map((uc, i) => (
                    <div key={i} className="rounded-lg border border-border-subtle bg-surface px-4 py-3">
                      <p className="text-sm text-text-secondary"><strong className="text-text-primary">{uc.title}</strong> — {uc.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Common Use Cases */}
            {(() => {
              const keywords = TOOL_KEYWORDS[tool.slug];
              return keywords && keywords.troubleshooting.length > 0 ? (
                <section className="mb-8">
                  <h2 className="text-base font-bold text-text-primary mb-3">Common Use Cases</h2>
                  <ul className="space-y-1.5">
                    {keywords.troubleshooting.slice(0, 4).map((tc, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-nuvora-500" />
                        {tc}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null;
            })()}

            {/* Share + bookmark — lazy loaded */}
            <LazySection rootMargin="200px" minHeight="60px">
              <section className="mb-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-text-primary">Share {tool.name}</h2>
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
                <div className="mt-3 flex items-center gap-2">
                  {shareLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Share on ${link.name}`}
                      className="flex size-9 items-center justify-center rounded-lg border border-border-subtle bg-surface text-text-secondary hover:bg-surface-secondary hover:text-nuvora-600 transition-all"
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
                      {link.name === "Reddit" && (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="size-4"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.059l-2.295-.383v5.4h5.651a3.35 3.35 0 0 1 1.498 6.325 3.35 3.35 0 0 1-3.446-.722 3.35 3.35 0 0 1-1.08-2.347h-2.065v3.162c0 1.176-.969 2.132-2.152 2.132a2.14 2.14 0 0 1-2.152-2.132c0-1.176.969-2.132 2.152-2.132.284 0 .552.055.8.154v-2.68H9.19v.762c-.434.357-.912.64-1.446.813a2.16 2.16 0 0 1-.177-1.064 2.16 2.16 0 0 1 2.16-2.16c.484 0 .844.173 1.124.46l.196-.18a2.16 2.16 0 0 1-.42-1.224 2.16 2.16 0 0 1 2.16-2.16c.484 0 .844.173 1.124.46l.196-.18a2.16 2.16 0 0 1-.42-1.224 2.16 2.16 0 0 1 2.16-2.16z" /></svg>
                      )}
                    </a>
                  ))}
                  <button
                    onClick={copyLink}
                    aria-label="Copy link"
                    className="flex size-9 items-center justify-center rounded-lg border border-border-subtle bg-surface text-text-secondary hover:bg-surface-secondary hover:text-nuvora-600 transition-colors"
                  >
                    {copied ? (
                      <Icon name="Check" className="size-4 text-aurora-700" />
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                    )}
                  </button>
                </div>
              </section>
            </LazySection>

            {/* Report Issue link */}
            <section className="mb-4">
              <a
                href={`${SITE_URL}/contact?subject=Issue%20with%20${encodeURIComponent(tool.name)}&ref=${toolSlug}`}
                className="inline-flex items-center gap-1.5 text-xs text-text-tertiary hover:text-nuvora-600 transition-colors"
              >
                <Icon name="Shield" className="size-3.5" />
                Report an issue
              </a>
            </section>
          </>
        )}
      </div>
    </>
  );
}
