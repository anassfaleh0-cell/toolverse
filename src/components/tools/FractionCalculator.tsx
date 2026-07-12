"use client";

import { useState } from "react";
import { Button, Alert, Card } from "@/components/ui";

function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

function simplify(n: number, d: number): [number, number] {
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d);
  return [n / g, d / g];
}

export function FractionCalculator() {
  const [n1, setN1] = useState("");
  const [d1, setD1] = useState("");
  const [n2, setN2] = useState("");
  const [d2, setD2] = useState("");
  const [op, setOp] = useState("+");
  const [result, setResult] = useState<{
    num: number;
    den: number;
    decimal: string;
    steps: string;
  } | null>(null);
  const [error, setError] = useState("");

  function handleCalculate() {
    try {
      setError("");
      const a = parseFloat(n1);
      const b = parseFloat(d1);
      const c = parseFloat(n2);
      const de = parseFloat(d2);

      if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(de)) {
        setError("All fields must be valid numbers.");
        return;
      }
      if (b === 0 || de === 0) {
        setError("Denominators cannot be zero.");
        return;
      }

      let num: number, den: number, steps = "";

      switch (op) {
        case "+":
          num = a * de + c * b;
          den = b * de;
          steps = `${a}/${b} + ${c}/${de} = (${a} × ${de} + ${c} × ${b}) / (${b} × ${de}) = ${a * de + c * b}/${b * de}`;
          break;
        case "-":
          num = a * de - c * b;
          den = b * de;
          steps = `${a}/${b} - ${c}/${de} = (${a} × ${de} - ${c} × ${b}) / (${b} × ${de}) = ${a * de - c * b}/${b * de}`;
          break;
        case "×":
          num = a * c;
          den = b * de;
          steps = `${a}/${b} × ${c}/${de} = (${a} × ${c}) / (${b} × ${de}) = ${a * c}/${b * de}`;
          break;
        case "÷":
          num = a * de;
          den = b * c;
          steps = `${a}/${b} ÷ ${c}/${de} = (${a} × ${de}) / (${b} × ${c}) = ${a * de}/${b * c}`;
          break;
        default:
          setError("Invalid operation.");
          return;
      }

      const [sn, sd] = simplify(num, den);
      const decimal = (sn / sd).toFixed(4);
      const simplified = sn !== num || sd !== den
        ? ` = ${sn}/${sd}`
        : "";
      steps += simplified;
      setResult({ num: sn, den: sd, decimal, steps });
    } catch {
      setError("An unexpected error occurred.");
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Numerator 1</label>
            <input
              type="number"
              value={n1}
              onChange={(e) => setN1(e.target.value)}
              placeholder="1"
              aria-label="Numerator 1"
              className="w-full rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:ring-2 focus:ring-nuvora-500 dark:focus:ring-nuvora-400"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Denominator 1</label>
            <input
              type="number"
              value={d1}
              onChange={(e) => setD1(e.target.value)}
              placeholder="2"
              aria-label="Denominator 1"
              className="w-full rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:ring-2 focus:ring-nuvora-500 dark:focus:ring-nuvora-400"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Numerator 2</label>
            <input
              type="number"
              value={n2}
              onChange={(e) => setN2(e.target.value)}
              placeholder="1"
              aria-label="Numerator 2"
              className="w-full rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:ring-2 focus:ring-nuvora-500 dark:focus:ring-nuvora-400"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Denominator 2</label>
            <input
              type="number"
              value={d2}
              onChange={(e) => setD2(e.target.value)}
              placeholder="3"
              aria-label="Denominator 2"
              className="w-full rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:ring-2 focus:ring-nuvora-500 dark:focus:ring-nuvora-400"
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Operation</label>
          <select
            value={op}
            onChange={(e) => setOp(e.target.value)}
            aria-label="Operation"
            className="w-full rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary outline-none transition-colors focus:ring-2 focus:ring-nuvora-500 dark:focus:ring-nuvora-400"
          >
            <option value="+">+ (Add)</option>
            <option value="-">- (Subtract)</option>
            <option value="×">× (Multiply)</option>
            <option value="÷">÷ (Divide)</option>
          </select>
        </div>
        <Button onClick={handleCalculate} variant="primary" className="w-full">Calculate</Button>
      </div>

      {error && <Alert variant="error" className="mt-6">{error}</Alert>}

      {result && (
        <div className="mt-8 space-y-3">
          <Card variant="default" className="p-8">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Result</p>
            <p className="mt-1 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {result.num}/{result.den}
            </p>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Decimal: {result.decimal}
            </p>
            <div className="mt-4 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Steps</p>
              <p className="mt-1 font-mono text-sm text-zinc-700 dark:text-zinc-300">{result.steps}</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
