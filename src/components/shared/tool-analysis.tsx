"use client";

import { useState } from "react";
import { Icon } from "@/components/shared/icon";

interface ToolAnalysisProps {
  category?: string;
}

const CATEGORY_ANALYSIS: Record<string, { expert: string; howTo: string[]; tip: string }> = {
  "network-internet": {
    expert: "DNS and network diagnostics are the backbone of internet infrastructure. Every query you run here performs the same lookups that system administrators use daily with dig, nslookup, and curl — just wrapped in a visual interface that highlights what matters.",
    howTo: [
      "Enter a fully qualified domain name (e.g., example.com) without http:// or www",
      "Choose the specific record type or run a comprehensive all-records query",
      "Review results against expected values — mismatches often reveal misconfigurations",
      "Export findings for documentation, team sharing, or compliance records",
    ],
    tip: "Pro tip: Lower your DNS TTL to 300 seconds (5 minutes) 48 hours before making changes. This minimizes propagation delays when you update records.",
  },
  "code-dev": {
    expert: "Developer tools are the quiet multipliers of engineering productivity. A formatter that catches a missing semicolon, a validator that spots invalid JSON, or a minifier that shrinks a bundle by 40% — each saves minutes that compound into hours across a team.",
    howTo: [
      "Paste or type your source data directly into the input area",
      "Toggle options to customize output format, encoding, or behavior",
      "Review real-time preview or validation feedback as you type",
      "Copy or download the processed result for use in your project",
    ],
    tip: "Pro tip: Most encoding tools support batch processing. Paste multiple items separated by newlines and process them all at once to save time.",
  },
  "image-design": {
    expert: "Image processing is the intersection of art and engineering. Every pixel manipulation — resizing, format conversion, background removal — is a mathematical transformation. Modern AI makes formerly manual tasks like subject segmentation instant and automatic.",
    howTo: [
      "Upload or drop your image file directly into the tool area",
      "Select the desired operation (resize, convert, remove background, etc.)",
      "Adjust quality, dimensions, or other parameters to fine-tune output",
      "Download the processed result — all processing stays on your device",
    ],
    tip: "Pro tip: For AI background removal, use images with good contrast between subject and background. Portraits with plain backgrounds yield the best results.",
  },
  "text-writing": {
    expert: "Text manipulation seems trivial until you need to clean 10,000 lines of data. A single regex find-and-replace can save hours of manual editing. These tools are precision instruments for anyone who works with words or data.",
    howTo: [
      "Enter or paste your source text into the input area",
      "Select the operation: count, format, transform, clean, or compare",
      "Configure options like case sensitivity, delimiter, or character filtering",
      "Review the output and copy or download the clean result",
    ],
    tip: "Pro tip: Use the Text Diff Checker before deploying website changes. Compare old vs. new content to catch unintended modifications.",
  },
  "productivity": {
    expert: "Productivity tools eliminate friction. A strong password generated in seconds, a QR code created from a URL instantly, an IP address identified without a terminal — these small wins accumulate into significant time savings across your day.",
    howTo: [
      "Configure the tool parameters to match your specific need",
      "Click generate or process to produce the result",
      "Review and customize settings if the initial output needs adjustment",
      "Copy, download, or share the result as needed",
    ],
    tip: "Pro tip: Generated passwords are never stored or transmitted. Copy them to a password manager immediately after generation.",
  },
  "data-analytics": {
    expert: "Data conversion and analysis tools bridge the gap between raw information and actionable insight. Transforming JSON to CSV for spreadsheet analysis, converting timestamps across timezones, or validating YAML structure — each is a common but critical data workflow step.",
    howTo: [
      "Paste your structured data in the supported input format",
      "Choose the target format or analysis type",
      "Configure any conversion options (delimiter, precision, encoding)",
      "Copy or download the transformed data for use in your workflow",
    ],
    tip: "Pro tip: Validate your converted data by spot-checking a few records. Format conversion can sometimes introduce edge-case errors on special characters or nested structures.",
  },
};

export function ToolAnalysis({ category }: ToolAnalysisProps) {
  const [show, setShow] = useState<"howto" | "expert" | null>(null);
  const analysis = category ? CATEGORY_ANALYSIS[category] : undefined;

  if (!analysis) return null;

  return (
    <section className="mb-8">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setShow(show === "howto" ? null : "howto")}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
            show === "howto"
              ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
              : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
          }`}
          aria-expanded={show === "howto"}
        >
          <Icon name="Info" className="size-3.5" />
          How to Use
        </button>
        <button
          type="button"
          onClick={() => setShow(show === "expert" ? null : "expert")}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
            show === "expert"
              ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950/30 dark:text-blue-300"
              : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
          }`}
          aria-expanded={show === "expert"}
        >
          <Icon name="PenSquare" className="size-3.5" />
          Expert Insight
        </button>
      </div>

      {show === "howto" && (
        <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-800 dark:bg-blue-950">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">
            How to Use This Tool
          </p>
          <ol className="space-y-2">
            {analysis.howTo.map((step, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-blue-800 dark:text-blue-200">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-200 text-[11px] font-bold text-blue-700 dark:bg-blue-800 dark:text-blue-300">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <p className="mt-3 text-xs text-blue-600/70 dark:text-blue-400/70">{analysis.tip}</p>
        </div>
      )}

      {show === "expert" && (
        <div className="mt-3 rounded-xl border border-zinc-200 bg-gradient-to-br from-amber-50 to-white p-5 dark:border-zinc-700 dark:from-amber-950/30 dark:to-zinc-900/20">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            Expert Perspective
          </p>
          <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            {analysis.expert}
          </p>
        </div>
      )}
    </section>
  );
}