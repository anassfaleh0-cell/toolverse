"use client";

import { useState } from "react";
import { Button, Alert, Card } from "@/components/ui";

type Mode = "number-to-roman" | "roman-to-number";

const romanMap: [number, string][] = [
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

const romanRegex = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;

export function RomanNumeralConverter() {
  const [mode, setMode] = useState<Mode>("number-to-roman");
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [steps, setSteps] = useState<string[]>([]);

  function handleConvert() {
    setError("");
    setResult("");
    setSteps([]);

    try {
      const trimmed = input.trim();
      if (!trimmed) {
        setError("Input cannot be empty.");
        return;
      }

      if (mode === "number-to-roman") {
        const num = parseInt(trimmed, 10);
        if (isNaN(num) || num < 1 || num > 3999 || !/^\d+$/.test(trimmed)) {
          setError("Enter a number between 1 and 3999.");
          return;
        }
        let remaining = num;
        let roman = "";
        const s: string[] = [];
        for (const [value, symbol] of romanMap) {
          if (remaining >= value) {
            const count = Math.floor(remaining / value);
            roman += symbol.repeat(count);
            s.push(`${value} → "${symbol.repeat(count)}" (${count}x ${symbol})`);
            remaining %= value;
          }
        }
        setResult(roman);
        setSteps(s);
      } else {
        const upper = trimmed.toUpperCase();
        if (!romanRegex.test(upper)) {
          setError("Invalid Roman numeral. Use I, V, X, L, C, D, M with valid subtractive notation.");
          return;
        }
        let total = 0;
        let i = 0;
        const s: string[] = [];
        while (i < upper.length) {
          for (const [value, symbol] of romanMap) {
            if (upper.startsWith(symbol, i)) {
              total += value;
              s.push(`${symbol} → ${value}`);
              i += symbol.length;
              break;
            }
          }
        }
        setResult(total.toString());
        setSteps(s);
      }
    } catch {
      setError("An unexpected error occurred.");
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Card variant="default" className="p-8">
        <div className="flex gap-2 mb-6">
          <Button
            variant={mode === "number-to-roman" ? "primary" : "secondary"}
            size="sm"
            onClick={() => { setMode("number-to-roman"); setResult(""); setError(""); setSteps([]); }}
          >
            Number → Roman
          </Button>
          <Button
            variant={mode === "roman-to-number" ? "primary" : "secondary"}
            size="sm"
            onClick={() => { setMode("roman-to-number"); setResult(""); setError(""); setSteps([]); }}
          >
            Roman → Number
          </Button>
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "number-to-roman" ? "e.g. 2024" : "e.g. MMXXIV"}
          className="w-full rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:ring-2 focus:ring-nuvora-500 dark:focus:ring-nuvora-400"
        />
        <Button onClick={handleConvert} variant="primary" size="lg" className="mt-4 w-full">
          Convert
        </Button>

        {error && <Alert variant="error" className="mt-6">{error}</Alert>}

        {result && (
          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-border-subtle bg-surface-secondary p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-text-secondary mb-2">
                Result
              </p>
              <p className="break-all font-mono text-lg font-bold text-text-primary">{result}</p>
            </div>
            {steps.length > 0 && (
              <div className="rounded-xl border border-border-subtle">
                <div className="border-b border-border-subtle px-5 py-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">
                    Conversion Steps
                  </p>
                </div>
                <div className="divide-y divide-border-subtle">
                  {steps.map((step, i) => (
                    <div key={i} className="px-5 py-2.5 text-sm text-text-secondary">
                      <span className="font-mono text-text-primary">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
