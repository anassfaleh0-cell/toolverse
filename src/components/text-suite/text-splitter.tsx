"use client";

import { useState, useMemo } from "react";
import { Textarea, Input } from "@/components/ui";
import { CopyButton } from "@/components/shared";

type Delimiter = "newline" | "comma" | "space" | "custom";
type OutputFormat = "newline" | "comma" | "json";

export function TextSplitter() {
  const [input, setInput] = useState("");
  const [delimiter, setDelimiter] = useState<Delimiter>("newline");
  const [customDelimiter, setCustomDelimiter] = useState("");
  const [trimItems, setTrimItems] = useState(true);
  const [removeEmpty, setRemoveEmpty] = useState(true);
  const [deduplicate, setDeduplicate] = useState(false);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("newline");

  const splitItems = useMemo(() => {
    let sep: string | RegExp = "\n";
    if (delimiter === "comma") sep = ",";
    else if (delimiter === "space") sep = /\s+/;
    else if (delimiter === "custom") sep = customDelimiter || "\n";
    let items = input.split(sep);
    if (trimItems) items = items.map((i) => i.trim());
    if (removeEmpty) items = items.filter((i) => i !== "");
    if (deduplicate) items = [...new Set(items)];
    return items;
  }, [input, delimiter, customDelimiter, trimItems, removeEmpty, deduplicate]);

  const output = useMemo(() => {
    if (outputFormat === "newline") return splitItems.join("\n");
    if (outputFormat === "comma") return splitItems.join(", ");
    return JSON.stringify(splitItems);
  }, [splitItems, outputFormat]);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Input Text</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to split..."
          rows={6}
          aria-label="Input text"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <input type="radio" name="delim" checked={delimiter === "newline"} onChange={() => setDelimiter("newline")} className="h-4 w-4" />
          Newline
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <input type="radio" name="delim" checked={delimiter === "comma"} onChange={() => setDelimiter("comma")} className="h-4 w-4" />
          Comma
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <input type="radio" name="delim" checked={delimiter === "space"} onChange={() => setDelimiter("space")} className="h-4 w-4" />
          Space
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <input type="radio" name="delim" checked={delimiter === "custom"} onChange={() => setDelimiter("custom")} className="h-4 w-4" />
          Custom
        </label>
        {delimiter === "custom" && (
          <Input
            value={customDelimiter}
            onChange={(e) => setCustomDelimiter(e.target.value)}
            placeholder="Enter delimiter..."
            className="w-40"
            aria-label="Custom delimiter"
          />
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <input type="checkbox" checked={trimItems} onChange={(e) => setTrimItems(e.target.checked)} className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-600" />
          Trim Items
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <input type="checkbox" checked={removeEmpty} onChange={(e) => setRemoveEmpty(e.target.checked)} className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-600" />
          Remove Empty
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <input type="checkbox" checked={deduplicate} onChange={(e) => setDeduplicate(e.target.checked)} className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-600" />
          Deduplicate
        </label>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <input type="radio" name="fmt" checked={outputFormat === "newline"} onChange={() => setOutputFormat("newline")} className="h-4 w-4" />
          Newline
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <input type="radio" name="fmt" checked={outputFormat === "comma"} onChange={() => setOutputFormat("comma")} className="h-4 w-4" />
          Comma-Separated
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <input type="radio" name="fmt" checked={outputFormat === "json"} onChange={() => setOutputFormat("json")} className="h-4 w-4" />
          JSON Array
        </label>
      </div>

      <p className="text-sm text-zinc-500">{splitItems.length} item{splitItems.length !== 1 ? "s" : ""}</p>

      {splitItems.length > 0 && (
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
