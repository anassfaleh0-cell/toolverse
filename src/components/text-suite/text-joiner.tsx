"use client";

import { useState, useMemo } from "react";
import { Textarea, Input } from "@/components/ui";
import { CopyButton } from "@/components/shared";

type Separator = "comma" | "space" | "pipe" | "custom";

export function TextJoiner() {
  const [input, setInput] = useState("");
  const [separator, setSeparator] = useState<Separator>("comma");
  const [customSeparator, setCustomSeparator] = useState("");
  const [addQuotes, setAddQuotes] = useState(false);
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");

  const output = useMemo(() => {
    const items = input.split("\n").filter((l) => l.trim() !== "");
    let sep = ", ";
    if (separator === "space") sep = " ";
    else if (separator === "pipe") sep = " | ";
    else if (separator === "custom") sep = customSeparator || ", ";
    const processed = items.map((item) => {
      let i = item.trim();
      if (addQuotes) i = `"${i}"`;
      if (prefix) i = prefix + i;
      if (suffix) i = i + suffix;
      return i;
    });
    return processed.join(sep);
  }, [input, separator, customSeparator, addQuotes, prefix, suffix]);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Input Text</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter one item per line to join..."
          rows={6}
          aria-label="Input text"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <input type="radio" name="sep" checked={separator === "comma"} onChange={() => setSeparator("comma")} className="h-4 w-4" />
          Comma
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <input type="radio" name="sep" checked={separator === "space"} onChange={() => setSeparator("space")} className="h-4 w-4" />
          Space
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <input type="radio" name="sep" checked={separator === "pipe"} onChange={() => setSeparator("pipe")} className="h-4 w-4" />
          Pipe
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <input type="radio" name="sep" checked={separator === "custom"} onChange={() => setSeparator("custom")} className="h-4 w-4" />
          Custom
        </label>
        {separator === "custom" && (
          <Input
            value={customSeparator}
            onChange={(e) => setCustomSeparator(e.target.value)}
            placeholder="Separator..."
            className="w-40"
            aria-label="Custom separator"
          />
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <input type="checkbox" checked={addQuotes} onChange={(e) => setAddQuotes(e.target.checked)} className="h-4 w-4 rounded border-zinc-300" />
          Add Quotes
        </label>
        <div className="flex items-center gap-2">
          <Input
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            placeholder="Prefix"
            className="w-28"
            aria-label="Prefix"
          />
          <Input
            value={suffix}
            onChange={(e) => setSuffix(e.target.value)}
            placeholder="Suffix"
            className="w-28"
            aria-label="Suffix"
          />
        </div>
      </div>

      {output && (
        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Result</p>
            <CopyButton text={output} />
          </div>
          <pre className="max-h-64 overflow-y-auto p-5 font-mono text-sm text-zinc-900 dark:text-zinc-50">{output}</pre>
        </div>
      )}
    </div>
  );
}
