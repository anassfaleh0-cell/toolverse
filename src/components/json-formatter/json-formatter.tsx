"use client";

import { useState, useMemo, useCallback } from "react";
import { Textarea, Button, Alert, Input } from "@/components/ui";
import { CopyButton } from "@/components/shared";

function tokenizeLine(line: string) {
  const tokens: { text: string; className?: string }[] = [];
  const re = /("(?:[^"\\]|\\.)*")(\s*:)|("(?:[^"\\]|\\.)*")|(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|\b(true|false|null)\b|([{}[\],])/g;
  let lastIndex = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(line)) !== null) {
    if (m.index > lastIndex) {
      tokens.push({ text: line.slice(lastIndex, m.index) });
    }
    if (m[1]) {
      tokens.push({ text: m[1], className: "text-blue-600 dark:text-blue-400" });
      tokens.push({ text: m[2] });
    } else if (m[3]) {
      tokens.push({ text: m[3], className: "text-green-700 dark:text-green-400" });
    } else if (m[4]) {
      tokens.push({ text: m[4], className: "text-orange-700 dark:text-orange-400" });
    } else if (m[5]) {
      tokens.push({ text: m[5], className: "text-purple-600 dark:text-purple-400" });
    } else if (m[6]) {
      tokens.push({ text: m[6] });
    }
    lastIndex = m.index + m[0].length;
  }

  if (lastIndex < line.length) {
    tokens.push({ text: line.slice(lastIndex) });
  }

  return tokens;
}

function tokenizePath(path: string): string[] {
  const tokens: string[] = [];
  let buf = "";
  for (let i = 0; i < path.length; i++) {
    const ch = path[i];
    if (ch === ".") {
      if (buf) tokens.push(buf);
      buf = "";
    } else if (ch === "[") {
      if (buf) tokens.push(buf);
      buf = "[";
      let depth = 1;
      i++;
      while (i < path.length && depth > 0) {
        buf += path[i];
        if (path[i] === "[") depth++;
        if (path[i] === "]") depth--;
        i++;
      }
      i--;
      tokens.push(buf);
      buf = "";
    } else {
      buf += ch;
    }
  }
  if (buf) tokens.push(buf);
  return tokens;
}

function evaluatePath(data: unknown, tokens: string[]): unknown {
  let current = data;
  for (const token of tokens) {
    if (current === null || current === undefined) return undefined;
    if (token === "*") {
      if (typeof current !== "object") return undefined;
      return Array.isArray(current) ? [...current] : Object.values(current as Record<string, unknown>);
    }
    if (token.startsWith("[")) {
      const inner = token.slice(1, -1);
      if (/^\d+$/.test(inner)) {
        if (!Array.isArray(current)) return undefined;
        current = current[parseInt(inner, 10)];
      } else {
        const key = inner.replace(/['"]/g, "");
        if (typeof current !== "object" || current === null) return undefined;
        current = (current as Record<string, unknown>)[key];
      }
    } else {
      if (typeof current !== "object" || current === null) return undefined;
      current = (current as Record<string, unknown>)[token];
    }
  }
  return current;
}

function formatPathValue(val: unknown): string {
  if (val === undefined) return "no match";
  if (val === null) return "null";
  if (typeof val === "string") return `"${val}"`;
  if (typeof val === "object") return JSON.stringify(val, null, 2);
  return String(val);
}

export function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [jsonPath, setJsonPath] = useState("");

  const parsedData = useMemo(() => {
    try {
      return output ? JSON.parse(output) : null;
    } catch {
      return null;
    }
  }, [output]);

  const highlightedLines = useMemo(() => {
    if (!output) return [];
    return output.split("\n").map((line) => tokenizeLine(line));
  }, [output]);

  const pathResult = useMemo(() => {
    if (!jsonPath.trim() || !parsedData) return null;
    const tokens = tokenizePath(jsonPath.trim());
    if (tokens.length === 0) return null;
    return evaluatePath(parsedData, tokens);
  }, [jsonPath, parsedData]);

  const errorPos = useMemo(() => {
    if (!error || !input) return null;
    const m = error.match(/position\s+(\d+)/);
    return m ? parseInt(m[1], 10) : null;
  }, [error, input]);

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const errorLocation = useMemo(() => {
    if (errorPos === null) return null;
    const lines = input!.split("\n");
    let count = 0;
    for (let i = 0; i < lines.length; i++) {
      if (count + lines[i].length >= errorPos) {
        return {
          line: lines[i],
          lineNum: i + 1,
          col: errorPos - count,
        };
      }
      count += lines[i].length + 1;
    }
    return null;
  }, [errorPos, input]);

  const stats = useMemo(() => {
    if (!output) return null;
    const chars = output.length;
    const lineCount = output.split("\n").length;
    const bytes = new TextEncoder().encode(output).length;
    const size = bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(2)} KB`;
    return { chars, lines: lineCount, size };
  }, [output]);

  const handleFormat = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setOutput("");
    }
  }, [input]);

  const handleMinify = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setOutput("");
    }
  }, [input]);

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    setError("");
    setJsonPath("");
  }, []);

  const handleExport = useCallback(() => {
    if (!output) return;
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [output]);

  const lineCount = output ? output.split("\n").length : 0;
  const lineNumberDigits = String(lineCount).length;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-3">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Paste JSON here, e.g. {"key": "value"}'
          rows={8}
          aria-label="JSON input"
        />
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleFormat} variant="primary" disabled={!input.trim()}>
            Format / Beautify
          </Button>
          <Button onClick={handleMinify} variant="primary" disabled={!input.trim()}>
            Minify
          </Button>
          <Button onClick={handleClear} variant="secondary">
            Clear
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="error" className="mt-6">
          <p className="font-mono text-sm">{error}</p>
          {errorLocation && (
            <pre className="mt-2 overflow-x-auto rounded bg-red-50 p-3 font-mono text-sm dark:bg-red-950/30">
              <code>{errorLocation.line}</code>
              {"\n"}
              <span className="text-red-700">{errorLocation.col > 0 ? " ".repeat(errorLocation.col) : ""}^</span>
              {" "}
              <span className="text-xs text-red-700">Line {errorLocation.lineNum}, Col {errorLocation.col + 1}</span>
            </pre>
          )}
        </Alert>
      )}

      {output && (
        <div className="mt-6 space-y-4">
          <div>
            <Input
              value={jsonPath}
              onChange={(e) => setJsonPath(e.target.value)}
              placeholder="JSONPath query, e.g. data.users[0].name"
              aria-label="JSONPath query"
            />
            {jsonPath.trim() && (
              <div className="mt-2 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2 font-mono text-sm dark:border-zinc-800 dark:bg-zinc-900">
                <span className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Result:{" "}
                </span>
                {pathResult !== null && typeof pathResult === "object" && !(pathResult instanceof String) ? (
                  <pre className="mt-1 overflow-x-auto text-zinc-900 dark:text-zinc-50">
                    {formatPathValue(pathResult)}
                  </pre>
                ) : (
                  <span className="text-zinc-900 dark:text-zinc-50">
                    {pathResult !== null ? formatPathValue(pathResult) : "no match"}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex flex-wrap items-center gap-4">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Formatted Output
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  {stats?.chars} chars | {stats?.lines} lines | {stats?.size}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CopyButton text={output} />
                <Button variant="secondary" size="sm" onClick={handleExport}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="size-4"
                    aria-hidden="true"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Export
                </Button>
              </div>
            </div>
            <div className="flex">
              <div
                className="select-none border-r border-zinc-200 bg-zinc-50 py-5 text-right font-mono text-sm leading-5 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
                style={{ minWidth: `${lineNumberDigits + 2}ch` }}
              >
                {highlightedLines.map((_, i) => (
                  <div key={i} className="pr-2 pl-3">
                    {i + 1}
                  </div>
                ))}
              </div>
              <pre className="flex-1 overflow-x-auto p-5 font-mono text-sm leading-5 text-zinc-900 dark:text-zinc-50">
                {highlightedLines.length === 0 ? (
                  <span>&nbsp;</span>
                ) : (
                  highlightedLines.map((tokens, i) => (
                    <div key={i}>
                      {tokens.length > 0
                        ? tokens.map((t, j) =>
                            t.className ? (
                              <span key={j} className={t.className}>
                                {t.text}
                              </span>
                            ) : (
                              <span key={j}>{t.text}</span>
                            ),
                          )
                        : "Â "}
                    </div>
                  ))
                )}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
