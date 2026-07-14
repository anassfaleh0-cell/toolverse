"use client";

import { useState } from "react";
import { Textarea, Button } from "@/components/ui";
import { CopyButton } from "@/components/shared";

export function RemoveEmptyLines() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [removeWhitespaceLines, setRemoveWhitespaceLines] = useState(true);

  function process() {
    const lines = input.split("\n");
    const filtered = removeWhitespaceLines
      ? lines.filter((l) => l.trim() !== "")
      : lines.filter((l) => l !== "");
    setOutput(filtered.join("\n"));
  }

  const inputLineCount = input ? input.split("\n").length : 0;
  const outputLineCount = output ? output.split("\n").length : 0;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Input Text</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste text with empty lines..."
          rows={6}
          aria-label="Input text"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <input type="checkbox" checked={removeWhitespaceLines} onChange={(e) => setRemoveWhitespaceLines(e.target.checked)} className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-600" />
          Remove whitespace-only lines too
        </label>
      </div>

      <div className="flex gap-3">
        <Button onClick={process} disabled={!input.trim()}>Remove Empty Lines</Button>
        {output && <Button variant="secondary" onClick={() => { setInput(""); setOutput(""); }}>Clear</Button>}
      </div>

      {output && (
        <>
          <div className="flex gap-4 text-sm text-zinc-600 dark:text-zinc-400">
            <span>Before: <strong>{inputLineCount}</strong> lines</span>
            <span>After: <strong>{outputLineCount}</strong> lines</span>
            <span>Removed: <strong>{inputLineCount - outputLineCount}</strong> lines</span>
          </div>
          <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Result</p>
              <CopyButton text={output} />
            </div>
            <pre className="max-h-64 overflow-y-auto p-5 font-mono text-sm text-zinc-900 dark:text-zinc-50">{output}</pre>
          </div>
        </>
      )}
    </div>
  );
}
