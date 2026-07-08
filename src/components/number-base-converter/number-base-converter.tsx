"use client";

import { useState } from "react";
import { Input, Button, Alert } from "@/components/ui";
import { CopyButton } from "@/components/shared";

const BASES = [
  { label: "Binary", value: 2, placeholder: "e.g. 1010" },
  { label: "Octal", value: 8, placeholder: "e.g. 12" },
  { label: "Decimal", value: 10, placeholder: "e.g. 10" },
  { label: "Hexadecimal", value: 16, placeholder: "e.g. A" },
];

function isValidDigit(ch: string, base: number): boolean {
  const digit = parseInt(ch, 16);
  return !isNaN(digit) && digit < base;
}

function validateInput(input: string, base: number): string | null {
  if (!input.trim()) return null;
  const normalized = base === 16 ? input.trim().toUpperCase() : input.trim();
  for (const ch of normalized) {
    if (!isValidDigit(ch, base)) return `Invalid digit "${ch}" for base ${base}.`;
  }
  return null;
}

function convertAll(input: string, fromBase: number): Record<number, string> {
  if (!input.trim()) {
    return { 2: "", 8: "", 10: "", 16: "" };
  }

  try {
    const normalized = fromBase === 16 ? input.trim().toUpperCase() : input.trim();
    const decValue = fromBase === 10 ? BigInt(normalized) : BigInt(parseInt(normalized, fromBase));

    const results: Record<number, string> = {
      2: decValue.toString(2),
      8: decValue.toString(8),
      10: decValue.toString(10),
      16: decValue.toString(16).toUpperCase(),
    };
    return results;
  } catch {
    try {
      const decValue = parseInt(input.trim(), fromBase);
      if (isNaN(decValue)) return { 2: "", 8: "", 10: "", 16: "" };
      const results: Record<number, string> = {
        2: decValue.toString(2),
        8: decValue.toString(8),
        10: decValue.toString(10),
        16: decValue.toString(16).toUpperCase(),
      };
      return results;
    } catch {
      return { 2: "", 8: "", 10: "", 16: "" };
    }
  }
}

const BASE_LABELS: Record<number, string> = {
  2: "Binary",
  8: "Octal",
  10: "Decimal",
  16: "Hexadecimal",
};

export function NumberBaseConverter() {
  const [input, setInput] = useState("");
  const [fromBase, setFromBase] = useState(10);
  const [results, setResults] = useState<Record<number, string>>({ 2: "", 8: "", 10: "", 16: "" });
  const [error, setError] = useState("");

  function handleConvert() {
    if (!input.trim()) {
      setResults({ 2: "", 8: "", 10: "", 16: "" });
      setError("");
      return;
    }
    const validationError = validateInput(input, fromBase);
    if (validationError) {
      setError(validationError);
      setResults({ 2: "", 8: "", 10: "", 16: "" });
      return;
    }
    setError("");
    setResults(convertAll(input, fromBase));
  }

  function handleClear() {
    setInput("");
    setResults({ 2: "", 8: "", 10: "", 16: "" });
    setError("");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-3">
        <Input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (e.target.value.trim()) {
              const validationError = validateInput(e.target.value, fromBase);
              if (validationError) {
                setError(validationError);
                setResults({ 2: "", 8: "", 10: "", 16: "" });
                return;
              }
              setError("");
              setResults(convertAll(e.target.value, fromBase));
            } else {
              setResults({ 2: "", 8: "", 10: "", 16: "" });
              setError("");
            }
          }}
          placeholder={BASES.find((b) => b.value === fromBase)?.placeholder || "Enter a number..."}
          aria-label="Number input"
        />
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">From:</span>
          <select
            value={fromBase}
            onChange={(e) => setFromBase(Number(e.target.value))}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 font-mono text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            aria-label="Input base"
          >
            {BASES.map((b) => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </select>
          <Button onClick={handleConvert} variant="primary" disabled={!input.trim()}>
            Convert
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

      {Object.entries(results).filter(([, v]) => v !== "").length > 0 && !error && (
        <div className="mt-6 space-y-3">
          {Object.entries(results).filter(([, v]) => v !== "").map(([base, value]) => {
            const baseNum = Number(base);
            if (baseNum === fromBase) return null;
            return (
              <div key={base} className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{BASE_LABELS[baseNum]}</p>
                  <CopyButton text={value} />
                </div>
                <pre className="overflow-x-auto break-all p-5 font-mono text-sm text-zinc-900 dark:text-zinc-50">{value}</pre>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
