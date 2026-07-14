"use client";

import { useState } from "react";
import { Input, Button } from "@/components/ui";
import { CopyButton, Icon } from "@/components/shared";

interface LangEntry {
  lang: string;
  url: string;
}

const emptyEntry = (): LangEntry => ({ lang: "", url: "" });

export function HreflangGenerator() {
  const [entries, setEntries] = useState<LangEntry[]>([
    { lang: "en", url: "https://example.com/" },
    { lang: "es", url: "https://example.com/es/" },
    { lang: "fr", url: "https://example.com/fr/" },
    { lang: "de", url: "https://example.com/de/" },
  ]);
  const [xDefault, setXDefault] = useState("https://example.com/");

  function addEntry() {
    setEntries(prev => [...prev, emptyEntry()]);
  }

  function removeEntry(index: number) {
    setEntries(prev => prev.filter((_, i) => i !== index));
  }

  function updateEntry(index: number, field: "lang" | "url", value: string) {
    setEntries(prev => prev.map((e, i) => i === index ? { ...e, [field]: value } : e));
  }

  function generateTags() {
    const valid = entries.filter(e => e.lang && e.url);
    const tags: string[] = [];
    tags.push("<!-- Hreflang Tags -->");
    valid.forEach(e => {
      tags.push(`<link rel="alternate" hreflang="${e.lang}" href="${e.url.replace(/"/g, "&quot;")}" />`);
    });
    if (xDefault) {
      tags.push(`<link rel="alternate" hreflang="x-default" href="${xDefault.replace(/"/g, "&quot;")}" />`);
    }
    return tags.join("\n");
  }

  const output = generateTags();

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="space-y-3">
        {entries.map((entry, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="flex-1">
              <label htmlFor={`hl-lang-${i}`} className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">Language Code</label>
              <Input id={`hl-lang-${i}`} value={entry.lang} onChange={(e) => updateEntry(i, "lang", e.target.value)} placeholder="en" aria-label={`Language code ${i + 1}`} />
            </div>
            <div className="flex-[2]">
              <label htmlFor={`hl-url-${i}`} className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">URL</label>
              <Input id={`hl-url-${i}`} type="url" value={entry.url} onChange={(e) => updateEntry(i, "url", e.target.value)} placeholder="https://example.com/en/" aria-label={`URL ${i + 1}`} />
            </div>
            <Button type="button" variant="ghost" size="sm" className="mt-5" onClick={() => removeEntry(i)} aria-label={`Remove entry ${i + 1}`}>
              <Icon name="X" className="size-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="secondary" size="sm" onClick={addEntry} aria-label="Add language entry">
          + Add Language
        </Button>
      </div>

      <div>
        <label htmlFor="hl-xdefault" className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">x-default URL (fallback page)</label>
        <Input id="hl-xdefault" type="url" value={xDefault} onChange={(e) => setXDefault(e.target.value)} aria-label="x-default URL" />
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between border-b bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Hreflang Tags</p>
          <CopyButton text={output} label="Copy" />
        </div>
        <pre className="overflow-x-auto p-5 font-mono text-sm text-zinc-900 dark:text-zinc-50">{output}</pre>
      </div>
    </div>
  );
}
