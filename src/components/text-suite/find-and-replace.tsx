"use client";

import { useState, useMemo } from "react";
import { Textarea, Input } from "@/components/ui";
import { CopyButton } from "@/components/shared";

export function FindAndReplace() {
  const [input, setInput] = useState("");
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [regexMode, setRegexMode] = useState(false);

  const result = useMemo(() => {
    if (!find || !input) return { text: input, count: 0 };
    try {
      let pattern: string | RegExp = find;
      if (!regexMode) pattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (wholeWord) pattern = `\\b${pattern}\\b`;
      const flags = caseSensitive ? "g" : "gi";
      const regex = new RegExp(pattern, flags);
      const matches = input.match(regex);
      return { text: input.replace(regex, replace), count: matches ? matches.length : 0 };
    } catch {
      return { text: input, count: 0 };
    }
  }, [input, find, replace, caseSensitive, wholeWord, regexMode]);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Input Text</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your text here..."
          rows={6}
          aria-label="Input text"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Find</label>
          <Input
            value={find}
            onChange={(e) => setFind(e.target.value)}
            placeholder="Text to find..."
            aria-label="Text to find"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Replace with</label>
          <Input
            value={replace}
            onChange={(e) => setReplace(e.target.value)}
            placeholder="Replacement text..."
            aria-label="Replacement text"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} className="h-4 w-4 rounded border-zinc-300" />
          Case Sensitive
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <input type="checkbox" checked={wholeWord} onChange={(e) => setWholeWord(e.target.checked)} className="h-4 w-4 rounded border-zinc-300" />
          Whole Word
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <input type="checkbox" checked={regexMode} onChange={(e) => setRegexMode(e.target.checked)} className="h-4 w-4 rounded border-zinc-300" />
          Regex Mode
        </label>
      </div>

      {result.count > 0 && (
        <p className="text-sm text-emerald-600 dark:text-emerald-400">
          {result.count} replacement{result.count !== 1 ? "s" : ""} made
        </p>
      )}

      {result.text !== input && (
        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Result</p>
            <CopyButton text={result.text} />
          </div>
          <pre className="max-h-64 overflow-y-auto p-5 font-mono text-sm text-zinc-900 dark:text-zinc-50">{result.text}</pre>
        </div>
      )}
    </div>
  );
}
