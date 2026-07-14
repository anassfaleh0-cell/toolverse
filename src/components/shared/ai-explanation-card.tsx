"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/shared/icon";
import { getKnowledgeForTool } from "@/lib/ai-explanation-knowledge";

interface Issue {
  severity: "error" | "warning" | "info";
  message: string;
  fix?: string;
}

interface AIExplanationCardProps {
  toolName: string;
  toolCategory?: string;
  result?: {
    status: "pass" | "warn" | "fail" | "error";
    issues?: Issue[];
    data?: Record<string, unknown>;
    raw?: string;
  } | null;
  knowledgeBase?: {
    explanation: string;
    whyBad?: string;
    howToFix?: string;
    nextStep?: string;
    beginnerExplanation?: string;
    expertCommands?: string[];
    rfcReferences?: { name: string; url: string }[];
    copySummary?: string;
  };
}

type TabKey = "explain" | "whyBad" | "fix" | "next";

export function AIExplanationCard({
  toolName,
  toolCategory,
  result,
  knowledgeBase,
}: AIExplanationCardProps) {
  const [activeTab, setActiveTab] = useState<TabKey | null>(null);
  const [expertMode, setExpertMode] = useState(false);
  const [beginnerMode, setBeginnerMode] = useState(true);
  const [copied, setCopied] = useState(false);
  const kb = knowledgeBase || getKnowledgeForTool(toolName);

  const hasIssues = result?.issues && result.issues.length > 0;

  const handleCopySummary = useCallback(() => {
    let summary = kb?.copySummary || "";
    if (!summary && kb) {
      summary = `${toolName}: ${kb.explanation}`;
      if (kb.whyBad) summary += `\n\nIssues: ${kb.whyBad}`;
      if (kb.howToFix) summary += `\n\nHow to fix: ${kb.howToFix}`;
      if (kb.nextStep) summary += `\n\nNext step: ${kb.nextStep}`;
    }
    if (!summary) summary = `Analysis for ${toolName}. Run the tool to get specific insights.`;
    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [kb, toolName]);

  const handleExportReport = useCallback(() => {
    const report = {
      tool: toolName,
      category: toolCategory || "",
      timestamp: new Date().toISOString(),
      explanation: kb?.explanation || "",
      whyBad: kb?.whyBad || "",
      howToFix: kb?.howToFix || "",
      nextStep: kb?.nextStep || "",
      issues: result?.issues || [],
      status: result?.status || null,
      data: result?.data || null,
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${toolName.replace(/\s+/g, "-")}-report.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [toolName, toolCategory, kb, result]);

  if (!kb && (!result || !result.issues?.length)) return null;

  const status = result?.status;

  const issueSummary =
    hasIssues
      ? result!.issues!
          .filter((i) => i.severity === "error" || i.severity === "warning")
          .map((i) => i.message)
          .join(". ")
      : "";

  const whyBadText =
    kb?.whyBad ||
    (hasIssues
      ? "Issues were detected. Unresolved problems can impact your security, performance, and user trust."
      : "");

  const explainText = kb?.explanation || "No explanation available for this tool.";
  const beginnerText =
    kb?.beginnerExplanation || "Enter a domain and run the tool to see results.";
  const fixText =
    kb?.howToFix || (issueSummary ? `Address these issues: ${issueSummary}` : "");
  const nextText =
    kb?.nextStep || "Explore related tools on Nuvora for deeper analysis.";

  const tabs: { key: TabKey; label: string }[] = [
    { key: "explain", label: "Explain this result" },
    ...(whyBadText && (hasIssues || status === "fail" || status === "warn")
      ? [{ key: "whyBad" as const, label: "Why is this bad?" }]
      : []),
    ...(fixText ? [{ key: "fix" as const, label: "How do I fix it?" }] : []),
    { key: "next", label: "Recommended next step" },
  ];

  const issueCount = hasIssues ? result!.issues!.length : 0;
  const errorCount = hasIssues
    ? result!.issues!.filter((i) => i.severity === "error").length
    : 0;

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
          <span>AI Analysis</span>
          {status && (
            <span
              className={cn(
                "rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase",
                status === "pass" && "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
                status === "warn" && "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
                status === "fail" && "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
                status === "error" && "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
              )}
            >
              {status}
            </span>
          )}
          {issueCount > 0 && (
            <span className="text-zinc-400">
              {issueCount} issue{issueCount !== 1 ? "s" : ""}
              {errorCount > 0 && ` (${errorCount} error${errorCount !== 1 ? "s" : ""})`}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setBeginnerMode(!beginnerMode)}
            className={cn(
              "rounded px-2 py-0.5 text-[11px] font-medium transition-colors",
              beginnerMode
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
                : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300",
            )}
          >
            Beginner
          </button>
          <button
            type="button"
            onClick={() => setExpertMode(!expertMode)}
            className={cn(
              "rounded px-2 py-0.5 text-[11px] font-medium transition-colors",
              expertMode
                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400"
                : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300",
            )}
          >
            Expert
          </button>
        </div>
      </div>

      <div className="flex border-b border-zinc-200 dark:border-zinc-800">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(activeTab === tab.key ? null : tab.key)}
            className={cn(
              "flex-1 border-r border-zinc-200 px-2 py-2.5 text-[11px] font-medium transition-colors last:border-r-0 dark:border-zinc-800",
              activeTab === tab.key
                ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                : "bg-white text-zinc-500 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800",
            )}
            aria-expanded={activeTab === tab.key}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab && (
        <div className="space-y-4 p-4 text-sm">
          {activeTab === "explain" && (
            <>
              <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">
                {beginnerMode ? beginnerText : explainText}
              </p>
              {expertMode && kb?.rfcReferences && kb.rfcReferences.length > 0 && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    RFC References
                  </p>
                  <ul className="space-y-0.5">
                    {kb.rfcReferences.map((rfc, i) => (
                      <li key={i}>
                        <a
                          href={rfc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-700 underline dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          {rfc.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {expertMode && result?.raw && (
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    Raw Data
                  </p>
                  <pre className="overflow-x-auto whitespace-pre-wrap break-all rounded bg-zinc-100 p-2 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    {result.raw.length > 500
                      ? `${result.raw.slice(0, 500)}...`
                      : result.raw}
                  </pre>
                </div>
              )}
            </>
          )}

          {activeTab === "whyBad" && (
            <div className="space-y-3">
              <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/50">
                <span className="mt-0.5 shrink-0 text-amber-500">
                  <Icon name="AlertTriangle" className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    Why this matters
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-amber-700 dark:text-amber-300">
                    {whyBadText}
                  </p>
                </div>
              </div>
              {hasIssues && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Detected issues
                  </p>
                  {result!.issues!.map((issue, i) => (
                    <div
                      key={i}
                      className={cn(
                        "rounded-lg border p-3 text-sm",
                        issue.severity === "error" &&
                          "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50",
                        issue.severity === "warning" &&
                          "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/50",
                        issue.severity === "info" &&
                          "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50",
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <Icon
                          name={issue.severity === "error"
                            ? "XCircle"
                            : issue.severity === "warning"
                              ? "AlertTriangle"
                              : "Info"}
                          className={cn(
                            "size-4 shrink-0 mt-0.5",
                            issue.severity === "error" && "text-red-500",
                            issue.severity === "warning" && "text-amber-500",
                            issue.severity === "info" && "text-blue-500",
                          )}
                        />
                        <div className="flex-1">
                          <p
                            className={cn(
                              "text-sm",
                              issue.severity === "error" &&
                                "text-red-800 dark:text-red-200",
                              issue.severity === "warning" &&
                                "text-amber-800 dark:text-amber-200",
                              issue.severity === "info" &&
                                "text-blue-800 dark:text-blue-200",
                            )}
                          >
                            {issue.message}
                          </p>
                          {issue.fix && (
                            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                              Fix: {issue.fix}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "fix" && (
            <div className="space-y-3">
              {fixText ? (
                <>
                  <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">
                    {fixText}
                  </p>
                  {beginnerMode && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      If you are unsure how to make these changes, contact your IT team
                      or hosting provider. Many DNS changes can be made through your
                      domain registrar&apos;s control panel.
                    </p>
                  )}
                  {hasIssues &&
                    result!.issues!
                      .filter((i) => i.fix)
                      .map((issue, i) => (
                        <div
                          key={i}
                          className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950/50"
                        >
                          <p className="text-xs font-medium text-green-700 dark:text-green-300">
                            {issue.message}
                          </p>
                          <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                            {issue.fix}
                          </p>
                        </div>
                      ))}
                </>
              ) : (
                <p className="text-zinc-500">
                  No fix recommendations are available. Review the results above for
                  more details.
                </p>
              )}
            </div>
          )}

          {activeTab === "next" && (
            <div className="space-y-3">
              {nextText ? (
                <>
                  <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">
                    {nextText}
                  </p>
                  {beginnerMode && (
                    <ol className="ml-4 list-decimal space-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                      <li>Review all warnings and errors first</li>
                      <li>Make the recommended changes one at a time</li>
                      <li>Re-run the tool to verify each fix</li>
                      <li>Keep a record of what you changed for future reference</li>
                    </ol>
                  )}
                </>
              ) : (
                <p className="text-zinc-500">
                  No next step recommendation available. Consider exploring related
                  tools for deeper analysis.
                </p>
              )}
            </div>
          )}

          {expertMode && kb?.expertCommands && kb.expertCommands.length > 0 && (
            <div className="rounded-lg border border-purple-200 bg-purple-50 p-3 dark:border-purple-800 dark:bg-purple-950/50">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                CLI Commands
              </p>
              <div className="space-y-1">
                {kb.expertCommands.map((cmd, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="mt-0.5 shrink-0 text-[10px] text-purple-400">$</span>
                    <code className="flex-1 break-all font-mono text-xs text-purple-700 dark:text-purple-300">
                      {cmd}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {(tabs.length > 0 || activeTab) && (
        <div className="flex items-center gap-2 border-t border-zinc-200 px-4 py-2 dark:border-zinc-800">
          <button
            type="button"
            onClick={handleCopySummary}
            className="flex items-center gap-1 rounded bg-zinc-100 px-2.5 py-1 text-[11px] font-medium text-zinc-600 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
          >
            <Icon name="Copy" className="size-3.5" />
            {copied ? "Copied!" : "Copy summary"}
          </button>
          <button
            type="button"
            onClick={handleExportReport}
            className="flex items-center gap-1 rounded bg-zinc-100 px-2.5 py-1 text-[11px] font-medium text-zinc-600 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
          >
            <Icon name="Download" className="size-3.5" />
            Export report
          </button>
        </div>
      )}
    </div>
  );
}
