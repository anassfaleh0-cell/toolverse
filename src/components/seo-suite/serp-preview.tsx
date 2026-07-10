"use client";

import { useState } from "react";
import { Input, Button } from "@/components/ui";

function truncateToWord(str: string, maxLen: number) {
  if (str.length <= maxLen) return str;
  const truncated = str.slice(0, maxLen);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + "...";
}

function formatUrlBreadcrumb(url: string) {
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    return u.hostname + (u.pathname.length > 1 ? u.pathname : "");
  } catch {
    return url;
  }
}

export function SerpPreview() {
  const [title, setTitle] = useState("10 Best SEO Tools to Boost Your Rankings in 2026 | Nuvora");
  const [description, setDescription] = useState("Discover the top free SEO tools to improve your website's search rankings. Compare features, pricing, and performance of the best SEO software available.");
  const [url, setUrl] = useState("https://Nuvora.dev/seo-tools");
  const [mode, setMode] = useState<"desktop" | "mobile">("desktop");

  const titleMax = 60;
  const descMax = 160;

  const displayTitle = title.length > titleMax ? truncateToWord(title, titleMax) : title;
  const displayDesc = description.length > descMax ? truncateToWord(description, descMax) : description;
  const displayUrl = formatUrlBreadcrumb(url);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex gap-2">
        <Button type="button" variant={mode === "desktop" ? "primary" : "secondary"} size="sm" onClick={() => setMode("desktop")} aria-label="Desktop preview">
          Desktop
        </Button>
        <Button type="button" variant={mode === "mobile" ? "primary" : "secondary"} size="sm" onClick={() => setMode("mobile")} aria-label="Mobile preview">
          Mobile
        </Button>
      </div>

      <div>
        <label htmlFor="sp-title" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Page Title
          <span className={`ml-2 text-xs ${title.length > titleMax ? "text-red-500" : "text-zinc-400"}`}>
            {title.length}/{titleMax}
          </span>
        </label>
        <Input
          id="sp-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          hasError={title.length > titleMax}
          aria-label="Page title"
        />
      </div>

      <div>
        <label htmlFor="sp-desc" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Meta Description
          <span className={`ml-2 text-xs ${description.length > descMax ? "text-red-500" : "text-zinc-400"}`}>
            {description.length}/{descMax}
          </span>
        </label>
        <textarea
          id="sp-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition-colors focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-blue-400 ${
            description.length > descMax
              ? "border-red-300 focus:ring-red-500 dark:border-red-700 dark:focus:ring-red-400"
              : "border-zinc-300 dark:border-zinc-700"
          }`}
          aria-label="Meta description"
        />
      </div>

      <div>
        <label htmlFor="sp-url" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Page URL</label>
        <Input id="sp-url" type="url" value={url} onChange={(e) => setUrl(e.target.value)} aria-label="Page URL" />
      </div>

      <div className={`rounded-xl border border-zinc-200 dark:border-zinc-800 ${mode === "mobile" ? "max-w-sm" : ""}`}>
        <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Google {mode === "mobile" ? "Mobile" : "Desktop"} Preview
          </p>
        </div>
        <div className="p-5">
          {mode === "desktop" ? (
            <div>
              <p className="text-sm text-green-700 dark:text-green-400">{displayUrl}</p>
              <p className="mt-1 cursor-pointer text-xl text-blue-700 hover:underline dark:text-blue-400">{displayTitle}</p>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{displayDesc}</p>
            </div>
          ) : (
            <div className="text-sm">
              <p className="text-green-700 dark:text-green-400">{displayUrl}</p>
              <p className="mt-1 cursor-pointer text-base text-blue-700 hover:underline dark:text-blue-400">{displayTitle}</p>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{displayDesc}</p>
            </div>
          )}
        </div>
      </div>

      {title.length > titleMax && (
        <p className="text-xs text-red-500" role="alert">
          Title exceeds {titleMax} characters. It may be truncated in search results.
        </p>
      )}
      {description.length > descMax && (
        <p className="text-xs text-red-500" role="alert">
          Meta description exceeds {descMax} characters. It may be truncated in search results.
        </p>
      )}
    </div>
  );
}
