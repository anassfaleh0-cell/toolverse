"use client";

import { useState } from "react";
import { Input } from "@/components/ui";
import { CopyButton } from "@/components/shared";

function truncate(str: string, len: number) {
  if (str.length <= len) return str;
  return str.slice(0, len - 3) + "...";
}

export function OpenGraphGenerator() {
  const [title, setTitle] = useState("My Amazing Website");
  const [description, setDescription] = useState("Discover the best free SEO tools to optimize your website. Boost rankings, improve visibility, and drive more traffic.");
  const [image, setImage] = useState("https://example.com/og-image.png");
  const [url, setUrl] = useState("https://example.com");
  const [ogType, setOgType] = useState("website");
  const [siteName, setSiteName] = useState("Nuvora");
  const [locale, setLocale] = useState("en_US");
  const [twitterCard, setTwitterCard] = useState("summary_large_image");
  const [twitterSite, setTwitterSite] = useState("@Nuvora");

  function generateTags() {
    const tags: string[] = [];
    tags.push("<!-- Open Graph Tags -->");
    tags.push(`<meta property="og:title" content="${title.replace(/"/g, "&quot;")}" />`);
    tags.push(`<meta property="og:description" content="${description.replace(/"/g, "&quot;")}" />`);
    if (image) tags.push(`<meta property="og:image" content="${image}" />`);
    if (url) tags.push(`<meta property="og:url" content="${url}" />`);
    tags.push(`<meta property="og:type" content="${ogType}" />`);
    if (siteName) tags.push(`<meta property="og:site_name" content="${siteName}" />`);
    if (locale) tags.push(`<meta property="og:locale" content="${locale}" />`);
    tags.push("");
    tags.push("<!-- Twitter Card Tags -->");
    tags.push(`<meta name="twitter:card" content="${twitterCard}" />`);
    if (twitterSite) tags.push(`<meta name="twitter:site" content="${twitterSite}" />`);
    tags.push(`<meta name="twitter:title" content="${title.replace(/"/g, "&quot;")}" />`);
    tags.push(`<meta name="twitter:description" content="${truncate(description.replace(/"/g, "&quot;"), 160)}" />`);
    if (image) tags.push(`<meta name="twitter:image" content="${image}" />`);
    return tags.join("\n");
  }

  const output = generateTags();

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="og-title" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">og:title</label>
          <Input id="og-title" value={title} onChange={(e) => setTitle(e.target.value)} aria-label="OG title" />
        </div>
        <div>
          <label htmlFor="og-type" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">og:type</label>
          <select id="og-type" value={ogType} onChange={(e) => setOgType(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-blue-400" aria-label="OG type">
            <option value="website">Website</option>
            <option value="article">Article</option>
            <option value="product">Product</option>
            <option value="music.song">Music Song</option>
            <option value="video.movie">Video Movie</option>
            <option value="profile">Profile</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="og-desc" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">og:description</label>
        <textarea id="og-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:ring-blue-400" aria-label="OG description" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="og-image" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">og:image URL</label>
          <Input id="og-image" type="url" value={image} onChange={(e) => setImage(e.target.value)} aria-label="OG image URL" />
        </div>
        <div>
          <label htmlFor="og-url" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">og:url</label>
          <Input id="og-url" type="url" value={url} onChange={(e) => setUrl(e.target.value)} aria-label="OG URL" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="og-site" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">og:site_name</label>
          <Input id="og-site" value={siteName} onChange={(e) => setSiteName(e.target.value)} aria-label="Site name" />
        </div>
        <div>
          <label htmlFor="og-locale" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">og:locale</label>
          <Input id="og-locale" value={locale} onChange={(e) => setLocale(e.target.value)} aria-label="Locale" />
        </div>
        <div>
          <label htmlFor="og-twitter-card" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">twitter:card</label>
          <select id="og-twitter-card" value={twitterCard} onChange={(e) => setTwitterCard(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-blue-400" aria-label="Twitter card">
            <option value="summary">Summary</option>
            <option value="summary_large_image">Summary Large Image</option>
            <option value="app">App</option>
            <option value="player">Player</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="og-twitter-site" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">twitter:site</label>
        <Input id="og-twitter-site" value={twitterSite} onChange={(e) => setTwitterSite(e.target.value)} placeholder="@username" aria-label="Twitter site" />
      </div>

      <div className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800">
        <p className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">Social Media Card Preview</p>
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          {image && (
            <div className="aspect-[1.91/1] w-full bg-zinc-100 dark:bg-zinc-800">
              <img loading="lazy" decoding="async" src={image} alt="OG preview" className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>
          )}
          <div className="p-4">
            <p className="text-xs text-zinc-500">{url.replace(/^https?:\/\//, "")} / {siteName}</p>
            <p className="mt-1 font-semibold text-zinc-900 dark:text-zinc-50">{title}</p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{truncate(description, 160)}</p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between border-b bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">OG & Twitter Tags</p>
          <CopyButton text={output} label="Copy" />
        </div>
        <pre className="overflow-x-auto p-5 font-mono text-sm text-zinc-900 dark:text-zinc-50">{output}</pre>
      </div>
    </div>
  );
}
