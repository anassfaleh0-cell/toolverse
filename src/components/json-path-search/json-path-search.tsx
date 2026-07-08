"use client";

import { useState, useMemo, useCallback } from "react";
import { Textarea, Button, Input, Alert } from "@/components/ui";
import { CopyButton } from "@/components/shared";

interface PathSegment {
  key: string;
  type: "object" | "array" | "value";
  value: unknown;
  path: string;
}

function tokenizeJsonPath(expr: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  while (i < expr.length) {
    if (expr[i] === "$") {
      tokens.push("$");
      i++;
    } else if (expr[i] === ".") {
      let name = "";
      i++;
      while (i < expr.length && expr[i] !== "." && expr[i] !== "[" && expr[i] !== " ") {
        name += expr[i];
        i++;
      }
      if (name) tokens.push(name);
    } else if (expr[i] === "[") {
      let bracket = "[";
      let depth = 1;
      i++;
      while (i < expr.length && depth > 0) {
        bracket += expr[i];
        if (expr[i] === "[") depth++;
        if (expr[i] === "]") depth--;
        i++;
      }
      tokens.push(bracket);
    } else if (expr[i] === " ") {
      i++;
    } else {
      let name = "";
      while (i < expr.length && expr[i] !== "." && expr[i] !== "[" && expr[i] !== " " && expr[i] !== "$") {
        name += expr[i];
        i++;
      }
      if (name) tokens.push(name);
    }
  }
  return tokens;
}

function evaluateTokens(data: unknown, tokens: string[]): unknown[] {
  const results: unknown[] = [data];
  let idx = tokens[0] === "$" ? 1 : 0;

  while (idx < tokens.length) {
    const token = tokens[idx];
    const currentResults = [...results];
    results.length = 0;

    for (const item of currentResults) {
      if (item === null || item === undefined) continue;

      if (token === "*" || token === "[*]") {
        if (Array.isArray(item)) {
          results.push(...item);
        } else if (typeof item === "object") {
          results.push(...Object.values(item as Record<string, unknown>));
        }
      } else if (token.startsWith("[") && token.endsWith("]")) {
        const inner = token.slice(1, -1);
        if (inner === "*") {
          if (Array.isArray(item)) {
            results.push(...item);
          } else if (typeof item === "object") {
            results.push(...Object.values(item as Record<string, unknown>));
          }
        } else if (/^\d+$/.test(inner)) {
          if (Array.isArray(item) && parseInt(inner, 10) < item.length) {
            results.push(item[parseInt(inner, 10)]);
          }
        } else if (inner.startsWith("?") || inner.startsWith("@")) {
          if (Array.isArray(item)) {
            for (const elem of item) {
              if (typeof elem === "object" && elem !== null) {
                const filterMatch = inner.match(/\?\(@\.(\w+)\s*(==|!=|<|>|<=|>=)\s*['"]?([^'"]+)['"]?\)/);
                if (filterMatch) {
                  const [, key, op, val] = filterMatch;
                  const propVal = (elem as Record<string, unknown>)[key];
                  const cmp = isNaN(Number(val)) ? val : Number(val);
                  const propCmp = typeof propVal === "string" && !isNaN(Number(propVal)) ? Number(propVal) : propVal;
                  let match = false;
                  switch (op) {
                    case "==": match = propCmp == cmp; break;
                    case "!=": match = propCmp != cmp; break;
                    case "<": match = (propCmp as number) < (cmp as number); break;
                    case ">": match = (propCmp as number) > (cmp as number); break;
                    case "<=": match = (propCmp as number) <= (cmp as number); break;
                    case ">=": match = (propCmp as number) >= (cmp as number); break;
                  }
                  if (match) results.push(elem);
                } else {
                  results.push(elem);
                }
              }
            }
          }
        } else {
          const key = inner.replace(/['"]/g, "");
          if (typeof item === "object" && item !== null) {
            const val = (item as Record<string, unknown>)[key];
            if (val !== undefined) results.push(val);
          }
        }
      } else {
        if (typeof item === "object" && item !== null) {
          const val = (item as Record<string, unknown>)[token];
          if (val !== undefined) results.push(val);
        }
      }
    }
    idx++;
  }
  return results;
}

function formatValue(val: unknown): string {
  if (val === undefined) return "undefined";
  if (val === null) return "null";
  if (typeof val === "string") return `"${val}"`;
  if (typeof val === "object") return JSON.stringify(val, null, 2);
  return String(val);
}

function extractPaths(data: unknown, prefix: string = "$"): PathSegment[] {
  const segments: PathSegment[] = [];
  if (data === null || data === undefined) {
    segments.push({ key: prefix, type: "value", value: data, path: prefix });
    return segments;
  }
  if (typeof data === "object") {
    if (Array.isArray(data)) {
      segments.push({ key: prefix, type: "array", value: data, path: prefix });
      data.forEach((item, i) => {
        segments.push(...extractPaths(item, `${prefix}[${i}]`));
      });
    } else {
      segments.push({ key: prefix, type: "object", value: data, path: prefix });
      for (const [key, val] of Object.entries(data as Record<string, unknown>)) {
        segments.push(...extractPaths(val, `${prefix}.${key}`));
      }
    }
  } else {
    segments.push({ key: prefix, type: "value", value: data, path: prefix });
  }
  return segments;
}

export function JsonPathSearch() {
  const [jsonInput, setJsonInput] = useState("");
  const [pathExpr, setPathExpr] = useState("");
  const [error, setError] = useState("");

  const parsedData = useMemo(() => {
    try {
      return jsonInput.trim() ? JSON.parse(jsonInput) : null;
    } catch {
      return null;
    }
  }, [jsonInput]);

  const pathResults = useMemo(() => {
    if (!pathExpr.trim() || !parsedData) return null;
    try {
      const tokens = tokenizeJsonPath(pathExpr.trim());
      if (tokens.length === 0) return null;
      return evaluateTokens(parsedData, tokens);
    } catch {
      return null;
    }
  }, [pathExpr, parsedData]);

  const paths = useMemo(() => {
    if (!parsedData) return [];
    return extractPaths(parsedData);
  }, [parsedData]);

  const handleSearch = useCallback(() => {
    if (!jsonInput.trim()) {
      setError("Please enter JSON data.");
      return;
    }
    try {
      JSON.parse(jsonInput);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
    }
  }, [jsonInput]);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-3">
        <Textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='Paste JSON here, e.g. {"store": {"book": [{"author": "John"}]}}'
          rows={6}
          aria-label="JSON input"
        />
        <label htmlFor="json-path-input" className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          JSONPath Expression
        </label>
        <Input
          id="json-path-input"
          value={pathExpr}
          onChange={(e) => setPathExpr(e.target.value)}
          placeholder="e.g. $.store.book[*].author or $..author"
          aria-label="JSONPath expression"
        />
        <Button onClick={handleSearch} variant="primary" disabled={!jsonInput.trim()}>
          Search
        </Button>
      </div>

      {error && (
        <Alert variant="error" className="mt-6">
          <p className="font-mono text-sm">{error}</p>
        </Alert>
      )}

      {parsedData && paths.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Path Navigation
            </p>
          </div>
          <div className="max-h-48 overflow-y-auto divide-y divide-zinc-200 dark:divide-zinc-800">
            {paths.map((seg, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPathExpr(seg.path)}
                className={`flex w-full items-center gap-2 px-5 py-2 text-left text-sm transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900 ${
                  seg.type === "object"
                    ? "text-blue-600 dark:text-blue-400"
                    : seg.type === "array"
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-zinc-700 dark:text-zinc-300"
                }`}
              >
                <span className="font-mono text-xs">{seg.path}</span>
                <span className="text-xs text-zinc-400">
                  ({seg.type === "object" ? "{}" : seg.type === "array" ? "[]" : typeof seg.value})
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {pathResults !== null && (
        <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Results ({pathResults.length})
            </p>
            <CopyButton text={pathResults.map(formatValue).join("\n")} label="Copy Results" />
          </div>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {pathResults.length === 0 ? (
              <div className="px-5 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                No matches found
              </div>
            ) : (
              pathResults.map((result, i) => (
                <div key={i} className="px-5 py-3 even:bg-zinc-50 dark:even:bg-zinc-900/50">
                  {typeof result === "object" && result !== null ? (
                    <pre className="overflow-x-auto font-mono text-sm text-zinc-900 dark:text-zinc-50">
                      {formatValue(result)}
                    </pre>
                  ) : (
                    <span className="font-mono text-sm text-zinc-900 dark:text-zinc-50">
                      {formatValue(result)}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
