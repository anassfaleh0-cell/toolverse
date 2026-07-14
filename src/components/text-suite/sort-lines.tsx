"use client";

import { useState } from "react";
import { Textarea, Button } from "@/components/ui";
import { CopyButton } from "@/components/shared";

export function SortLines() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [ignoreCase, setIgnoreCase] = useState(true);
  const [numericSort, setNumericSort] = useState(false);
  const [removeDuplicates, setRemoveDuplicates] = useState(false);
  const [reverseOrder, setReverseOrder] = useState(false);

  function process() {
    const lines = input.split("\n");
    let sorted = [...lines];
    if (numericSort) {
      sorted.sort((a, b) => {
        const na = parseFloat(a.trim()) || 0;
        const nb = parseFloat(b.trim()) || 0;
        return order === "asc" ? na - nb : nb - na;
      });
    } else {
      sorted.sort((a, b) => {
        const compare = ignoreCase
          ? a.toLowerCase().localeCompare(b.toLowerCase())
          : a.localeCompare(b);
        return order === "asc" ? compare : -compare;
      });
    }
    if (removeDuplicates) {
      const seen = new Set<string>();
      sorted = sorted.filter((l) => {
        const key = ignoreCase ? l.toLowerCase() : l;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }
    if (reverseOrder) sorted.reverse();
    setOutput(sorted.join("\n"));
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Input Text</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste lines of text to sort..."
          rows={6}
          aria-label="Input text"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <input type="radio" name="order" checked={order === "asc"} onChange={() => setOrder("asc")} className="h-4 w-4" /> A-Z
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <input type="radio" name="order" checked={order === "desc"} onChange={() => setOrder("desc")} className="h-4 w-4" /> Z-A
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <input type="checkbox" checked={ignoreCase} onChange={(e) => setIgnoreCase(e.target.checked)} className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-600" />
          Ignore Case
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <input type="checkbox" checked={numericSort} onChange={(e) => setNumericSort(e.target.checked)} className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-600" />
          Numeric Sort
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <input type="checkbox" checked={removeDuplicates} onChange={(e) => setRemoveDuplicates(e.target.checked)} className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-600" />
          Remove Duplicates
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <input type="checkbox" checked={reverseOrder} onChange={(e) => setReverseOrder(e.target.checked)} className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-600" />
          Reverse Order
        </label>
      </div>

      <div className="flex gap-3">
        <Button onClick={process} disabled={!input.trim()}>Sort Lines</Button>
        {output && <Button variant="secondary" onClick={() => { setInput(""); setOutput(""); }}>Clear</Button>}
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
