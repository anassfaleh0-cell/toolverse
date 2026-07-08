"use client";

import { useState } from "react";
import { Input } from "@/components/ui";
import { CopyButton } from "@/components/shared";

export function CanonicalGenerator() {
  const [originalUrl, setOriginalUrl] = useState("https://www.example.com/page");
  const [canonicalUrl, setCanonicalUrl] = useState("https://example.com/page");
  const [enableSelfRef, setEnableSelfRef] = useState(true);
  const [trailingSlash, setTrailingSlash] = useState<"keep" | "add" | "remove">("keep");
  const [wwwPref, setWwwPref] = useState<"keep" | "add" | "remove">("remove");

  function normalizeUrl(url: string) {
    let result = url;
    if (wwwPref === "remove") {
      result = result.replace(/^https?:\/\/(www\.)/, (match) => match.replace("www.", ""));
    } else if (wwwPref === "add") {
      if (!result.match(/^https?:\/\/www\./)) {
        result = result.replace(/^(https?:\/\/)/, "$1www.");
      }
    }
    if (trailingSlash === "add" && !result.endsWith("/")) {
      result += "/";
    } else if (trailingSlash === "remove" && result.endsWith("/")) {
      result = result.slice(0, -1);
    }
    return result;
  }

  function getCanonicalTag() {
    const href = enableSelfRef ? normalizeUrl(originalUrl) : normalizeUrl(canonicalUrl);
    return `<link rel="canonical" href="${href.replace(/"/g, "&quot;")}" />`;
  }

  const output = getCanonicalTag();

  function analyzeRedirects() {
    const lines: string[] = [];
    const base = normalizeUrl(originalUrl);
    const canon = normalizeUrl(canonicalUrl);

    if (base !== canon) {
      lines.push(`Original (normalized): ${base}`);
      lines.push(`Canonical (normalized): ${canon}`);
      lines.push("");
      if (base.replace(/^https?:\/\//, "") !== canon.replace(/^https?:\/\//, "")) {
        lines.push("These are different URLs. Consider a 301 redirect if possible.");
      } else {
        lines.push("These URLs differ only in protocol/slash. The canonical tag handles this.");
      }
    } else {
      lines.push("The original URL and canonical URL are the same after normalization.");
      lines.push("This is a self-referencing canonical — recommended for most pages.");
    }
    return lines;
  }

  const redirectAnalysis = analyzeRedirects();

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <label htmlFor="c-orig" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Original URL</label>
        <Input id="c-orig" type="url" value={originalUrl} onChange={(e) => setOriginalUrl(e.target.value)} aria-label="Original URL" />
      </div>
      <div>
        <label htmlFor="c-canon" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Canonical URL</label>
        <Input id="c-canon" type="url" value={canonicalUrl} onChange={(e) => setCanonicalUrl(e.target.value)} aria-label="Canonical URL" />
      </div>

      <div className="space-y-3 rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">URL Normalization Options</p>
        <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
          <input type="checkbox" checked={enableSelfRef} onChange={(e) => setEnableSelfRef(e.target.checked)} className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600" />
          Self-referencing canonical (use original URL)
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="c-slash" className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">Trailing Slash</label>
            <select id="c-slash" value={trailingSlash} onChange={(e) => setTrailingSlash(e.target.value as "keep" | "add" | "remove")} className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50" aria-label="Trailing slash">
              <option value="keep">Keep as-is</option>
              <option value="add">Add trailing slash</option>
              <option value="remove">Remove trailing slash</option>
            </select>
          </div>
          <div>
            <label htmlFor="c-www" className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">www. Prefix</label>
            <select id="c-www" value={wwwPref} onChange={(e) => setWwwPref(e.target.value as "keep" | "add" | "remove")} className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50" aria-label="WWW prefix">
              <option value="keep">Keep as-is</option>
              <option value="add">Add www.</option>
              <option value="remove">Remove www.</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between border-b bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Canonical Tag</p>
          <CopyButton text={output} label="Copy" />
        </div>
        <pre className="overflow-x-auto p-5 font-mono text-sm text-zinc-900 dark:text-zinc-50">{output}</pre>
      </div>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Redirect Chain Analysis</p>
        </div>
        <div className="space-y-2 p-5 font-mono text-sm text-zinc-600 dark:text-zinc-400">
          {redirectAnalysis.map((line, i) => <p key={i}>{line}</p>)}
        </div>
      </div>
    </div>
  );
}
