"use client";

import { useState, useCallback } from "react";
import { Icon } from "@/components/shared/icon";

interface ExportActionsProps {
  rawData: unknown;
  fileName: string;
  displayName: string;
  formatAsText: () => string;
  formatAsCsv?: () => string;
}

export function ResultExport({ rawData, fileName, displayName, formatAsText, formatAsCsv }: ExportActionsProps) {
  const [copied, setCopied] = useState(false);

  const downloadJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(rawData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [rawData, fileName]);

  const downloadTxt = useCallback(() => {
    const blob = new Blob([formatAsText()], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [fileName, formatAsText]);

  const downloadCsv = useCallback(() => {
    if (!formatAsCsv) return;
    const blob = new Blob([formatAsCsv()], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [fileName, formatAsCsv]);

  const downloadPdf = useCallback(() => {
    window.print();
  }, []);

  const copyText = useCallback(async () => {
    await navigator.clipboard.writeText(formatAsText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [formatAsText]);

  const shareResults = useCallback(async () => {
    const text = formatAsText();
    if (navigator.share) {
      try {
        await navigator.share({ title: `${displayName} - Nuvora`, text, url: window.location.href });
      } catch { /* noop */ }
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [formatAsText, displayName]);

  return (
    <div className="relative flex flex-wrap items-center gap-1.5">
      <button
        type="button"
        onClick={copyText}
        className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
      >
        {copied ? (
          <>
            <Icon name="Check" className="size-3.5 text-emerald-600" />
            Copied
          </>
        ) : (
          <>
            <Icon name="Copy" className="size-3.5" />
            Copy
          </>
        )}
      </button>

      <button
        type="button"
        onClick={downloadJson}
        className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-3.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
        JSON
      </button>

      <button
        type="button"
        onClick={downloadTxt}
        className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
      >
        <Icon name="FileText" className="size-3.5" />
        TXT
      </button>

      {formatAsCsv && (
        <button
          type="button"
          onClick={downloadCsv}
          className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
        >
          <Icon name="FileText" className="size-3.5" />
          CSV
        </button>
      )}

      <button
        type="button"
        onClick={downloadPdf}
        className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
      >
        <Icon name="FileText" className="size-3.5" />
        PDF
      </button>

      <button
        type="button"
        onClick={shareResults}
        className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
      >
        <Icon name="Share2" className="size-3.5" />
        Share
      </button>
    </div>
  );
}
