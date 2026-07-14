"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui";
import { CopyButton } from "@/components/shared";

function generateSlug(text: string, lowercase: boolean, separator: string): string {
  let slug = text.trim();
  if (!slug) return "";
  if (lowercase) {
    slug = slug.toLowerCase();
  }
  slug = slug.replace(/[^\w\s-]/g, "");
  slug = slug.replace(/\s+/g, " ");
  if (separator === "none") {
    slug = slug.replace(/\s+/g, "");
  } else if (separator === "underscore") {
    slug = slug.replace(/\s+/g, "_");
  } else {
    slug = slug.replace(/\s+/g, "-");
  }
  slug = slug.replace(/[-_]+/g, separator === "none" ? "" : separator === "underscore" ? "_" : "-");
  slug = slug.replace(/^[-_]+|[-_]+$/g, "");
  return slug;
}

export function TextToSlug() {
  const [text, setText] = useState("");
  const [lowercase, setLowercase] = useState(true);
  const [separator, setSeparator] = useState<"hyphen" | "underscore" | "none">("hyphen");

  const slug = useMemo(
    () => generateSlug(text, lowercase, separator),
    [text, lowercase, separator],
  );

  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-3">
        <label htmlFor="text-to-slug-input" className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Enter Text
        </label>
        <Input
          id="text-to-slug-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type text to convert to a URL-friendly slug..."
          aria-label="Text to convert to slug"
        />
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <input
              type="checkbox"
              checked={lowercase}
              onChange={(e) => setLowercase(e.target.checked)}
              className="rounded border-zinc-300 text-zinc-900 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            />
            Lowercase
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Separator:
            </span>
            {(["hyphen", "underscore", "none"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSeparator(s)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  separator === s
                    ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-400"
                    : "border border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900"
                }`}
              >
                {s === "hyphen" ? "Hyphen (-)" : s === "underscore" ? "Underscore (_)" : "None"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {slug && (
        <div className="mt-6">
          <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Generated Slug
              </p>
              <CopyButton text={slug} label="Copy Slug" />
            </div>
            <div className="px-5 py-4">
              <code className="rounded-md bg-blue-50 px-3 py-2 font-mono text-sm text-blue-700 dark:bg-blue-950/30 dark:text-blue-400">
                {slug}
              </code>
            </div>
          </div>
          <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
            Preview URL: /{slug}
          </p>
        </div>
      )}
      {!slug && text.trim() && (
        <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
          Only alphanumeric characters, spaces, hyphens, and underscores are kept.
        </p>
      )}
    </div>
  );
}
