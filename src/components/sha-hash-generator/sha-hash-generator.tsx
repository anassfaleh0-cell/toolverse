"use client";

import { useState } from "react";
import { Textarea, Button, Alert } from "@/components/ui";
import { CopyButton } from "@/components/shared";

const ALGORITHMS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];

export function ShaHashGenerator() {
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState("SHA-256");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [computing, setComputing] = useState(false);

  async function compute(val: string, algo: string) {
    if (!val.trim()) { setOutput(""); setError(""); return; }
    if (typeof crypto === "undefined" || typeof crypto.subtle === "undefined") {
      setError("Web Crypto API is not available in this browser.");
      setOutput("");
      return;
    }
    setComputing(true);
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(val);
      const hashBuffer = await crypto.subtle.digest(algo, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      setOutput(hashHex);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate hash");
      setOutput("");
    } finally {
      setComputing(false);
    }
  }

  function handleClear() {
    setInput("");
    setOutput("");
    setError("");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-3">
        <Textarea
          value={input}
          onChange={(e) => { const val = e.target.value; setInput(val); compute(val, algorithm); }}
          placeholder="Enter text to hash..."
          rows={6}
          aria-label="Text input"
        />
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={algorithm}
            onChange={(e) => { const a = e.target.value; setAlgorithm(a); compute(input, a); }}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 font-mono text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            aria-label="Hash algorithm"
          >
            {ALGORITHMS.map((algo) => (
              <option key={algo} value={algo}>{algo}</option>
            ))}
          </select>
          <Button onClick={() => compute(input, algorithm)} variant="primary" disabled={!input.trim() || computing}>
            {computing ? "Generating..." : "Generate"}
          </Button>
          <Button onClick={handleClear} variant="secondary">
            Clear
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="error" className="mt-6">
          <p className="font-mono">{error}</p>
        </Alert>
      )}

      {output && (
        <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{algorithm} Hash</p>
            <CopyButton text={output} />
          </div>
          <pre className="overflow-x-auto break-all p-5 font-mono text-sm text-zinc-900 dark:text-zinc-50">{output}</pre>
        </div>
      )}
    </div>
  );
}
