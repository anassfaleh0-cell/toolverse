"use client";

import { useState, useMemo } from "react";
import { Textarea, Button, Input } from "@/components/ui";
import { CopyButton } from "@/components/shared";

function downloadFile(content: string, filename: string) {
  const blob = new Blob([content], { type: "application/xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function isValidUrl(str: string) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

export function SitemapGenerator() {
  const [urls, setUrls] = useState("https://example.com/\nhttps://example.com/about\nhttps://example.com/contact");
  const [priority, setPriority] = useState("0.8");
  const [changefreq, setChangefreq] = useState("monthly");
  const [lastmod, setLastmod] = useState(new Date().toISOString().split("T")[0]);

  const urlList = useMemo(() => urls.split("\n").filter(Boolean).map(u => u.trim()), [urls]);

  const computedErrors = useMemo(() => {
    const errs: string[] = [];
    urlList.forEach((u, i) => {
      if (!isValidUrl(u)) errs.push(`Line ${i + 1}: Invalid URL "${u}"`);
    });
    return errs;
  }, [urlList]);

  const output = useMemo(() => {
    if (computedErrors.length > 0) return "";

    const lines: string[] = [];
    lines.push('<?xml version="1.0" encoding="UTF-8"?>');
    lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    urlList.forEach(u => {
      lines.push("  <url>");
      lines.push(`    <loc>${u.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</loc>`);
      if (lastmod) lines.push(`    <lastmod>${lastmod}</lastmod>`);
      if (changefreq) lines.push(`    <changefreq>${changefreq}</changefreq>`);
      if (priority) lines.push(`    <priority>${priority}</priority>`);
      lines.push("  </url>");
    });
    lines.push("</urlset>");
    return lines.join("\n");
  }, [urlList, lastmod, changefreq, priority, computedErrors]);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <label htmlFor="sitemap-urls" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">URLs (one per line)</label>
        <Textarea id="sitemap-urls" value={urls} onChange={(e) => setUrls(e.target.value)} rows={5} aria-label="URLs" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="sitemap-priority" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Priority (0.0 - 1.0)</label>
          <Input id="sitemap-priority" type="number" min="0" max="1" step="0.1" value={priority} onChange={(e) => setPriority(e.target.value)} aria-label="Priority" />
        </div>
        <div>
          <label htmlFor="sitemap-changefreq" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Change Frequency</label>
          <select id="sitemap-changefreq" value={changefreq} onChange={(e) => setChangefreq(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-blue-400" aria-label="Change frequency">
            <option value="always">Always</option>
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="never">Never</option>
          </select>
        </div>
        <div>
          <label htmlFor="sitemap-lastmod" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Last Modified</label>
          <Input id="sitemap-lastmod" type="date" value={lastmod} onChange={(e) => setLastmod(e.target.value)} aria-label="Last modified" />
        </div>
      </div>
      {computedErrors.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400" role="alert">
          {computedErrors.map((e, i) => <p key={i}>{e}</p>)}
        </div>
      )}
      <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between border-b bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">sitemap.xml</p>
          <div className="flex gap-2">
            {output && (
              <Button type="button" variant="secondary" size="sm" onClick={() => downloadFile(output, "sitemap.xml")} aria-label="Download sitemap">
                Download
              </Button>
            )}
            <CopyButton text={output} label="Copy" />
          </div>
        </div>
        <pre className="overflow-x-auto p-5 font-mono text-sm text-zinc-900 dark:text-zinc-50">{output || "Fix errors above to generate sitemap"}</pre>
      </div>
    </div>
  );
}
