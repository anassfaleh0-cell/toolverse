"use client";

import { useState } from "react";
import { Textarea, Button } from "@/components/ui";
import { CopyButton } from "@/components/shared";

export function RemoveDuplicateLines() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [trimWhitespace, setTrimWhitespace] = useState(true);
  const [sortResults, setSortResults] = useState(false);

  function process() {
    let lines = input.split("\n");
    if (trimWhitespace) lines = lines.map((l) => l.trim()).filter((l) => l !== "");
    else lines = lines.filter((l) => l !== "");
    const seen = new Set<string>();
    const unique = lines.filter((l) => {
      const key = caseSensitive ? l : l.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    if (sortResults) unique.sort((a, b) => (caseSensitive ? a.localeCompare(b) : a.toLowerCase().localeCompare(b.toLowerCase())));
    setOutput(unique.join("\n"));
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Input Text</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your text here with duplicate lines..."
          rows={6}
          aria-label="Input text"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-600" />
          Case Sensitive
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <input type="checkbox" checked={trimWhitespace} onChange={(e) => setTrimWhitespace(e.target.checked)} className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-600" />
          Trim Whitespace
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <input type="checkbox" checked={sortResults} onChange={(e) => setSortResults(e.target.checked)} className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-600" />
          Sort Results
        </label>
      </div>

      <div className="flex gap-3">
        <Button onClick={process} disabled={!input.trim()}>Remove Duplicates</Button>
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
