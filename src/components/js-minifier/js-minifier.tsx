"use client";

import { useState } from "react";
import { Textarea, Button, Alert } from "@/components/ui";
import { CopyButton } from "@/components/shared";

function minifyJs(code: string): string {
  let result = code;

  result = result.replace(/\/\/.*$/gm, "");
  result = result.replace(/\/\*[\s\S]*?\*\//g, "");

  result = result.replace(/\s+/g, " ");

  result = result.replace(/\s*([{}();,:=+\-*/%<>!&|^~?])\s*/g, "$1");

  result = result.replace(/;\s*}/g, "}");

  result = result.replace(/;(\s*;)+/g, ";");

  result = result.replace(/}\s*(else|catch|finally)\s*{/g, "}$1{");

  return result.trim();
}

function beautifyJs(code: string): string {
  const clean = code.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");

  const lines: string[] = [];
  let indent = 0;
  let buffer = "";
  let inString = false;
  let stringChar = "";
  let inTemplate = false;

  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];

    if (inString) {
      buffer += ch;
      if (ch === "\\") {
        i++;
        if (i < clean.length) buffer += clean[i];
      } else if (ch === stringChar) {
        inString = false;
      }
      continue;
    }

    if (inTemplate) {
      buffer += ch;
      if (ch === "\\") {
        i++;
        if (i < clean.length) buffer += clean[i];
      } else if (ch === "`") {
        inTemplate = false;
      } else if (ch === "$" && clean[i + 1] === "{") {
        buffer += clean[++i];
        indent++;
        lines.push("  ".repeat(indent - 1) + buffer.trim());
        buffer = "";
      } else if (ch === "}" && clean[i - 1] === "{") {
      }
      continue;
    }

    if (ch === '"' || ch === "'" || ch === "`") {
      inString = true;
      stringChar = ch;
      if (ch === "`") inTemplate = true;
      buffer += ch;
      continue;
    }

    if (ch === "{" || ch === "(" || ch === "[") {
      const line = buffer.trim();
      if (line) lines.push("  ".repeat(indent) + line + " " + ch);
      else lines.push("  ".repeat(indent) + ch);
      indent++;
      buffer = "";
      continue;
    }

    if (ch === "}" || ch === ")" || ch === "]") {
      if (buffer.trim()) {
        lines.push("  ".repeat(indent) + buffer.trim());
      }
      indent = Math.max(0, indent - 1);
      buffer = "";
      const closeCh = ch === "}" ? "}" : ch === ")" ? ")" : "]";
      const nextChar = clean[i + 1];
      if (nextChar && (nextChar === ";" || nextChar === ",")) {
        lines.push("  ".repeat(indent) + closeCh + nextChar);
        i++;
      } else {
        lines.push("  ".repeat(indent) + closeCh);
      }
      continue;
    }

    if (ch === ";") {
      const line = buffer.trim();
      if (line) lines.push("  ".repeat(indent) + line + ";");
      buffer = "";
      continue;
    }

    if (ch === ",") {
      buffer += ",";
      const line = buffer.trim();
      if (line) {
        lines.push("  ".repeat(indent) + line);
        buffer = "";
      }
      continue;
    }

    buffer += ch;
  }

  if (buffer.trim()) {
    lines.push(buffer.trim());
  }

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

export function JsMinifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function handleMinify() {
    if (!input.trim()) return;
    try {
      setOutput(minifyJs(input));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to minify JavaScript");
      setOutput("");
    }
  }

  function handleBeautify() {
    if (!input.trim()) return;
    try {
      setOutput(beautifyJs(input));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to beautify JavaScript");
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
          placeholder="Enter JavaScript to minify or beautify..."
          rows={8}
          aria-label="JavaScript input"
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
