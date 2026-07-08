"use client";

import { useState } from "react";
import { Input, Textarea } from "@/components/ui";
import { CopyButton } from "@/components/shared";

export function MetaTagGenerator() {
  const [title, setTitle] = useState("My Amazing Website | Best SEO Tools");
  const [description, setDescription] = useState("Discover the best free SEO tools to optimize your website. Boost rankings, improve visibility, and drive more traffic with our comprehensive toolkit.");
  const [keywords, setKeywords] = useState("SEO, meta tags, website optimization, free tools");
  const [author, setAuthor] = useState("ToolVerse");
  const [viewport, setViewport] = useState("width=device-width, initial-scale=1.0");
  const [robots, setRobots] = useState("index, follow");
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [ogUrl, setOgUrl] = useState("");
  const [twitterCard, setTwitterCard] = useState("summary_large_image");

  function generateTags() {
    const tags: string[] = [];
    tags.push(`<title>${title.replace(/</g, "&lt;")}</title>`);
    tags.push(`<meta name="description" content="${description.replace(/"/g, "&quot;")}" />`);
    if (keywords) tags.push(`<meta name="keywords" content="${keywords.replace(/"/g, "&quot;")}" />`);
    if (author) tags.push(`<meta name="author" content="${author}" />`);
    if (viewport) tags.push(`<meta name="viewport" content="${viewport}" />`);
    if (robots) tags.push(`<meta name="robots" content="${robots}" />`);
    tags.push("");
    tags.push("<!-- Open Graph Tags -->");
    tags.push(`<meta property="og:title" content="${(ogTitle || title).replace(/"/g, "&quot;")}" />`);
    tags.push(`<meta property="og:description" content="${(ogDescription || description).replace(/"/g, "&quot;")}" />`);
    if (ogImage) tags.push(`<meta property="og:image" content="${ogImage}" />`);
    if (ogUrl) tags.push(`<meta property="og:url" content="${ogUrl}" />`);
    tags.push(`<meta property="og:type" content="website" />`);
    tags.push("");
    tags.push("<!-- Twitter Card Tags -->");
    tags.push(`<meta name="twitter:card" content="${twitterCard}" />`);
    tags.push(`<meta name="twitter:title" content="${(ogTitle || title).replace(/"/g, "&quot;")}" />`);
    tags.push(`<meta name="twitter:description" content="${(ogDescription || description).replace(/"/g, "&quot;")}" />`);
    if (ogImage) tags.push(`<meta name="twitter:image" content="${ogImage}" />`);
    return tags.join("\n");
  }

  const output = generateTags();

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="mt-title" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Title</label>
          <Input id="mt-title" value={title} onChange={(e) => setTitle(e.target.value)} aria-label="Title" />
        </div>
        <div>
          <label htmlFor="mt-author" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Author</label>
          <Input id="mt-author" value={author} onChange={(e) => setAuthor(e.target.value)} aria-label="Author" />
        </div>
      </div>
      <div>
        <label htmlFor="mt-description" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Meta Description</label>
        <Textarea id="mt-description" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} aria-label="Meta description" />
      </div>
      <div>
        <label htmlFor="mt-keywords" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Keywords (comma separated)</label>
        <Input id="mt-keywords" value={keywords} onChange={(e) => setKeywords(e.target.value)} aria-label="Keywords" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="mt-viewport" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Viewport</label>
          <Input id="mt-viewport" value={viewport} onChange={(e) => setViewport(e.target.value)} aria-label="Viewport" />
        </div>
        <div>
          <label htmlFor="mt-robots" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Robots</label>
          <Input id="mt-robots" value={robots} onChange={(e) => setRobots(e.target.value)} aria-label="Robots" />
        </div>
        <div>
          <label htmlFor="mt-twitter" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Twitter Card</label>
          <select id="mt-twitter" value={twitterCard} onChange={(e) => setTwitterCard(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-blue-400" aria-label="Twitter card type">
            <option value="summary">Summary</option>
            <option value="summary_large_image">Summary Large Image</option>
            <option value="app">App</option>
            <option value="player">Player</option>
          </select>
        </div>
      </div>
      <div className="border-t border-zinc-200 pt-4 dark:border-zinc-800">
        <p className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">Open Graph Tags (leave blank to fallback to meta values)</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="mt-og-title" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">OG Title</label>
            <Input id="mt-og-title" value={ogTitle} onChange={(e) => setOgTitle(e.target.value)} aria-label="OG title" />
          </div>
          <div>
            <label htmlFor="mt-og-desc" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">OG Description</label>
            <Input id="mt-og-desc" value={ogDescription} onChange={(e) => setOgDescription(e.target.value)} aria-label="OG description" />
          </div>
          <div>
            <label htmlFor="mt-og-image" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">OG Image URL</label>
            <Input id="mt-og-image" type="url" value={ogImage} onChange={(e) => setOgImage(e.target.value)} aria-label="OG image URL" />
          </div>
          <div>
            <label htmlFor="mt-og-url" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">OG URL</label>
            <Input id="mt-og-url" type="url" value={ogUrl} onChange={(e) => setOgUrl(e.target.value)} aria-label="OG URL" />
          </div>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between border-b bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">HTML Meta Tags</p>
          <CopyButton text={output} label="Copy" />
        </div>
        <pre className="overflow-x-auto p-5 font-mono text-sm text-zinc-900 dark:text-zinc-50">{output}</pre>
      </div>
    </div>
  );
}
