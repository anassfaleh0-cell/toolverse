"use client";

import { useState, useCallback } from "react";
import { Textarea, Button } from "@/components/ui";
import { CopyButton } from "@/components/shared";

function fisherYatesShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function parseItems(input: string): string[] {
  const lines = input.split("\n").filter((line) => line.trim().length > 0);
  if (lines.length > 0) return lines;
  const commaSplit = input.split(",").filter((item) => item.trim().length > 0);
  return commaSplit.length > 0 ? commaSplit : [];
}

export function ListRandomizer() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [hasRandomized, setHasRandomized] = useState(false);

  const handleRandomize = useCallback(() => {
    const items = parseItems(input);
    if (items.length === 0) return;
    setResults(fisherYatesShuffle(items));
    setHasRandomized(true);
  }, [input]);

  const itemCount = parseItems(input).length;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-3">
        <Textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setHasRandomized(false); }}
          placeholder="Enter items, one per line or comma-separated&#10;e.g.&#10;Apple&#10;Banana&#10;Cherry"
          rows={8}
          aria-label="List items input"
        />
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={handleRandomize} variant="primary" disabled={!input.trim()}>
            Randomize
          </Button>
          {itemCount > 0 && (
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {itemCount} item{itemCount !== 1 ? "s" : ""} detected
            </span>
          )}
        </div>
      </div>

      {hasRandomized && results.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Randomized Results ({results.length} item{results.length !== 1 ? "s" : ""})
            </p>
            <CopyButton text={results.map((item, i) => `${i + 1}. ${item}`).join("\n")} label="Copy All" />
          </div>
          <ol className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {results.map((item, i) => (
              <li key={i} className="flex items-center gap-4 px-5 py-3 even:bg-zinc-50 dark:even:bg-zinc-900/50">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                  {i + 1}
                </span>
                <span className="text-sm text-zinc-900 dark:text-zinc-50">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
