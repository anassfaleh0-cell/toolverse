"use client";

import { useState } from "react";
import { Textarea, Button } from "@/components/ui";
import { CopyButton } from "@/components/shared";

type ReverseMode = "characters" | "words" | "lines";

export function ReverseText() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<ReverseMode>("characters");

  function process() {
    let result = "";
    if (mode === "characters") {
      result = input.split("").reverse().join("");
    } else if (mode === "words") {
      result = input.split(/\s+/).reverse().join(" ");
    } else {
      result = input.split("\n").reverse().join("\n");
    }
    setOutput(result);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Input Text</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to reverse..."
          rows={6}
          aria-label="Input text"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <input type="radio" name="mode" checked={mode === "characters"} onChange={() => setMode("characters")} className="h-4 w-4" />
          Reverse Characters
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <input type="radio" name="mode" checked={mode === "words"} onChange={() => setMode("words")} className="h-4 w-4" />
          Reverse Words
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <input type="radio" name="mode" checked={mode === "lines"} onChange={() => setMode("lines")} className="h-4 w-4" />
          Reverse Lines
        </label>
      </div>

      <div className="flex gap-3">
        <Button onClick={process} disabled={!input.trim()}>Reverse</Button>
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
