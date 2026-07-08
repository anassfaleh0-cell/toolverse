"use client";

import { useState } from "react";
import { Textarea, Button, Alert } from "@/components/ui";
import { CopyButton } from "@/components/shared";

function compressHex(color: string): string {
  const match = color.match(/^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F]?)([0-9a-fA-F]?)([0-9a-fA-F]?)$/);
  if (!match) return color;
  if (match[4] && match[4] !== match[1]) return color;
  if (match[5] && match[5] !== match[2]) return color;
  if (match[6] && match[6] !== match[3]) return color;
  return `#${match[1]}${match[2]}${match[3]}${match[4] ? match[4] : ""}`;
}

function minifyCss(css: string): string {
  let result = css;

  result = result.replace(/\/\*[\s\S]*?\*\//g, "");

  result = result.replace(/;\s*}/g, "}");

  result = result.replace(/\s*([{}:;,])\s*/g, "$1");

  result = result.replace(/\s+/g, " ");

  result = result.replace(/#([0-9a-fA-F]{3,8})\b/g, (_m, hex) => compressHex(`#${hex}`));

  result = result.replace(/0(px|em|rem|vh|vw|%|pt|pc|mm|cm|in)/g, "0");

  result = result.replace(/:\s+/g, ":");

  result = result.replace(/;\s+/g, ";");

  result = result.replace(/,\s+/g, ",");

  return result.trim();
}

function beautifyCss(css: string): string {
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, "").trim();

  const lines: string[] = [];
  let indent = 0;
  let buffer = "";

  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    if (ch === "{") {
      lines.push("  ".repeat(indent) + buffer.trim() + " {");
      indent++;
      buffer = "";
    } else if (ch === "}") {
      if (buffer.trim()) {
        lines.push("  ".repeat(indent) + buffer.trim());
      }
      indent = Math.max(0, indent - 1);
      lines.push("  ".repeat(indent) + "}");
      buffer = "";
    } else if (ch === ";") {
      const line = buffer.trim();
      if (line) {
        lines.push("  ".repeat(indent) + line + ";");
      }
      buffer = "";
    } else {
      buffer += ch;
    }
  }

  if (buffer.trim()) {
    lines.push(buffer.trim());
  }

  return lines.join("\n");
}

export function CssMinifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function handleMinify() {
    if (!input.trim()) return;
    try {
      setOutput(minifyCss(input));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to minify CSS");
      setOutput("");
    }
  }

  function handleBeautify() {
    if (!input.trim()) return;
    try {
      setOutput(beautifyCss(input));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to beautify CSS");
      setOutput("");
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
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter CSS to minify or beautify..."
          rows={8}
          aria-label="CSS input"
        />
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleMinify} variant="primary" disabled={!input.trim()}>
            Minify
          </Button>
          <Button onClick={handleBeautify} variant="primary" disabled={!input.trim()}>
            Beautify
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
