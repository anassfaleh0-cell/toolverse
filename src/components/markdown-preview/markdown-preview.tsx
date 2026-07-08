"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Textarea } from "@/components/ui";
import { marked } from "marked";

export function MarkdownPreview() {
  const [input, setInput] = useState("# Hello Markdown\n\nType **Markdown** here...");
  const [html, setHtml] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const renderPreview = useCallback(async (value: string) => {
    try {
      const result = await marked.parse(value, { breaks: true, gfm: true });
      setHtml(result);
    } catch {
      setHtml('<p class="text-red-500">Failed to render Markdown</p>');
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      renderPreview(input);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input, renderPreview]);

  function handleInputChange(value: string) {
    setInput(value);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Markdown Input
          </label>
          <Textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Type Markdown here..."
            rows={16}
            aria-label="Markdown input"
            className="min-h-[400px] resize-y font-mono text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Rendered Preview
          </label>
          <div
            className="min-h-[400px] overflow-auto rounded-lg border border-zinc-300 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900 [&_a]:text-blue-600 [&_a]:underline [&_a:hover]:text-blue-500 [&_blockquote]:border-l-4 [&_blockquote]:border-zinc-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-zinc-600 [&_code]:rounded [&_code]:bg-zinc-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_h1]:mb-3 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mb-1 [&_h3]:text-lg [&_h3]:font-semibold [&_hr]:my-4 [&_hr]:border-zinc-300 [&_img]:max-w-full [&_li]:mb-1 [&_ol]:ml-6 [&_ol]:list-decimal [&_p]:mb-3 [&_p]:leading-relaxed [&_pre]:mb-3 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-zinc-100 [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-sm [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-zinc-300 [&_td]:p-2 [&_th]:border [&_th]:border-zinc-300 [&_th]:bg-zinc-50 [&_th]:p-2 [&_th]:font-semibold [&_ul]:ml-6 [&_ul]:list-disc"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </div>
  );
}
