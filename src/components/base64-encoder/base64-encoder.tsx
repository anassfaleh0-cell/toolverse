"use client";

import { useState } from "react";
import { Textarea, Button, Alert } from "@/components/ui";
import { CopyButton } from "@/components/shared";

type Mode = "encode" | "decode";

export function Base64Encoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<Mode>("encode");

  function compute(val: string, m: Mode) {
    if (!val.trim()) { setOutput(""); setError(""); return; }
    try {
      if (m === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(val))));
      } else {
        setOutput(decodeURIComponent(escape(atob(val))));
      }
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : m === "encode" ? "Failed to encode" : "Invalid Base64 input");
      setOutput("");
    }
  }

  function handleEncode() { setMode("encode"); compute(input, "encode"); }
  function handleDecode() { setMode("decode"); compute(input, "decode"); }
  function handleClear() { setInput(""); setOutput(""); setError(""); }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-3">
        <Textarea
          value={input}
          onChange={(e) => { const val = e.target.value; setInput(val); compute(val, mode); }}
          placeholder="Enter text to encode or Base64 string to decode..."
          rows={8}
          aria-label="Base64 input"
        />
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleEncode} variant={mode === "encode" ? "primary" : "secondary"} disabled={!input.trim()}>
            Encode
          </Button>
          <Button onClick={handleDecode} variant={mode === "decode" ? "primary" : "secondary"} disabled={!input.trim()}>
            Decode
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
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Output</p>
            <CopyButton text={output} />
          </div>
          <pre className="overflow-x-auto break-all p-5 font-mono text-sm text-zinc-900 dark:text-zinc-50">{output}</pre>
        </div>
      )}
    </div>
  );
}
