"use client";

import { useState } from "react";
import { Textarea, Button, Input } from "@/components/ui";
import { CopyButton } from "@/components/shared";

function downloadFile(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function RobotsTxtGenerator() {
  const [userAgent, setUserAgent] = useState("*");
  const [disallowPaths, setDisallowPaths] = useState("/admin/\n/private/");
  const [allowPaths, setAllowPaths] = useState("");
  const [sitemapUrl, setSitemapUrl] = useState("https://example.com/sitemap.xml");
  const [crawlDelay, setCrawlDelay] = useState("");

  function generateRobotsTxt() {
    const lines: string[] = [];
    lines.push(`User-agent: ${userAgent}`);
    disallowPaths.split("\n").filter(Boolean).forEach(p => {
      lines.push(`Disallow: ${p.trim()}`);
    });
    allowPaths.split("\n").filter(Boolean).forEach(p => {
      lines.push(`Allow: ${p.trim()}`);
    });
    if (crawlDelay) {
      lines.push(`Crawl-delay: ${crawlDelay}`);
    }
    if (sitemapUrl) {
      lines.push(`Sitemap: ${sitemapUrl}`);
    }
    return lines.join("\n");
  }

  const output = generateRobotsTxt();

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <label htmlFor="user-agent" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">User-agent</label>
        <Input id="user-agent" value={userAgent} onChange={(e) => setUserAgent(e.target.value)} aria-label="User-agent" />
      </div>
      <div>
        <label htmlFor="disallow-paths" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Disallow Paths (one per line)</label>
        <Textarea id="disallow-paths" value={disallowPaths} onChange={(e) => setDisallowPaths(e.target.value)} rows={3} aria-label="Disallow paths" />
      </div>
      <div>
        <label htmlFor="allow-paths" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Allow Paths (one per line)</label>
        <Textarea id="allow-paths" value={allowPaths} onChange={(e) => setAllowPaths(e.target.value)} rows={3} aria-label="Allow paths" />
      </div>
      <div>
        <label htmlFor="crawl-delay" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Crawl-delay (seconds)</label>
        <Input id="crawl-delay" type="number" min="0" value={crawlDelay} onChange={(e) => setCrawlDelay(e.target.value)} placeholder="10" aria-label="Crawl delay" />
      </div>
      <div>
        <label htmlFor="sitemap-url" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Sitemap URL</label>
        <Input id="sitemap-url" type="url" value={sitemapUrl} onChange={(e) => setSitemapUrl(e.target.value)} aria-label="Sitemap URL" />
      </div>
      <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between border-b bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">robots.txt</p>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => downloadFile(output, "robots.txt")} aria-label="Download robots.txt">
              Download
            </Button>
            <CopyButton text={output} label="Copy" />
          </div>
        </div>
        <pre className="overflow-x-auto p-5 font-mono text-sm text-zinc-900 dark:text-zinc-50">{output}</pre>
      </div>
    </div>
  );
}
