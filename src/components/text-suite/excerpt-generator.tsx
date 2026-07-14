"use client";

import { useState, useMemo } from "react";
import { Textarea, Button, Input } from "@/components/ui";
import { CopyButton } from "@/components/shared";

type LimitMode = "words" | "characters";

export function ExcerptGenerator() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [limitMode, setLimitMode] = useState<LimitMode>("words");
  const [limit, setLimit] = useState(50);
  const [addEllipsis, setAddEllipsis] = useState(true);
  const [breakAtSentence, setBreakAtSentence] = useState(true);

  const canGenerate = input.trim().length > 0 && limit > 0;

  const originalStats = useMemo(() => {
    const words = input.trim() ? input.trim().split(/\s+/).length : 0;
    const chars = input.length;
    return { words, chars };
  }, [input]);

  function generate() {
    let excerpt = input.trim();
    if (limitMode === "words") {
      const words = excerpt.split(/\s+/);
      let count = 0;
      const selected: string[] = [];
      for (const w of words) {
        if (count >= limit) break;
        selected.push(w);
        count++;
      }
      excerpt = selected.join(" ");
      if (breakAtSentence) {
        const lastPeriod = excerpt.lastIndexOf(".");
        const lastExcl = excerpt.lastIndexOf("!");
        const lastQues = excerpt.lastIndexOf("?");
        const lastBreak = Math.max(lastPeriod, lastExcl, lastQues);
        if (lastBreak > excerpt.length * 0.5) excerpt = excerpt.slice(0, lastBreak + 1);
      }
    } else {
      excerpt = excerpt.slice(0, limit);
      if (breakAtSentence) {
        const lastPeriod = excerpt.lastIndexOf(".");
        const lastExcl = excerpt.lastIndexOf("!");
        const lastQues = excerpt.lastIndexOf("?");
        const lastBreak = Math.max(lastPeriod, lastExcl, lastQues);
        if (lastBreak > excerpt.length * 0.5) excerpt = excerpt.slice(0, lastBreak + 1);
      }
    }
    if (addEllipsis && excerpt.length < input.trim().length) excerpt += "...";
    setOutput(excerpt);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Input Text</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your text to generate an excerpt..."
          rows={6}
          aria-label="Input text"
        />
      </div>

      {input && (
        <p className="text-sm text-zinc-500">
          {originalStats.words} words · {originalStats.chars} characters
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <input type="radio" name="mode" checked={limitMode === "words"} onChange={() => setLimitMode("words")} className="h-4 w-4" />
            Words
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <input type="radio" name="mode" checked={limitMode === "characters"} onChange={() => setLimitMode("characters")} className="h-4 w-4" />
            Characters
          </label>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-zinc-600 dark:text-zinc-400">Limit:</label>
          <Input
            type="number"
            value={limit}
            onChange={(e) => setLimit(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-24"
            min={1}
            aria-label="Limit"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <input type="checkbox" checked={addEllipsis} onChange={(e) => setAddEllipsis(e.target.checked)} className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-600" />
          Add Ellipsis
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <input type="checkbox" checked={breakAtSentence} onChange={(e) => setBreakAtSentence(e.target.checked)} className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-600" />
          Break at Sentence
        </label>
      </div>

      <div className="flex gap-3">
        <Button onClick={generate} disabled={!canGenerate}>Generate Excerpt</Button>
        {output && <Button variant="secondary" onClick={() => { setInput(""); setOutput(""); }}>Clear</Button>}
      </div>

      {output && (
        <>
          <div className="flex gap-4 text-sm text-zinc-600 dark:text-zinc-400">
            <span>Original: <strong>{limitMode === "words" ? `${originalStats.words} words` : `${originalStats.chars} chars`}</strong></span>
            <span>Excerpt: <strong>{limitMode === "words" ? `${output.split(/\s+/).length} words` : `${output.length} chars`}</strong></span>
          </div>
          <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Excerpt</p>
              <CopyButton text={output} />
            </div>
            <pre className="max-h-64 overflow-y-auto p-5 font-mono text-sm text-zinc-900 dark:text-zinc-50">{output}</pre>
          </div>
        </>
      )}
    </div>
  );
}
