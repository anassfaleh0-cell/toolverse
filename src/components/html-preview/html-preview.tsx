"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Textarea } from "@/components/ui";

export function HtmlPreview() {
  const [html, setHtml] = useState("<h1>Hello, World!</h1>\n<p>Start typing HTML on the left to see the preview here.</p>");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updatePreview = useCallback((code: string) => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = code;
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updatePreview(html), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [html, updatePreview]);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col">
          <label htmlFor="html-input" className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            HTML Source
          </label>
          <Textarea
            id="html-input"
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            placeholder="Enter HTML code here..."
            className="min-h-[400px] font-mono text-sm"
            spellCheck={false}
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Live Preview
          </label>
          <iframe
            ref={iframeRef}
            title="HTML Preview"
            sandbox="allow-scripts allow-same-origin"
            className="w-full flex-1 rounded-lg border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-white"
          />
        </div>
      </div>
    </div>
  );
}
