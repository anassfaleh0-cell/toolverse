"use client";

import { useState } from "react";
import { Button, Alert, Card } from "@/components/ui";

export function PercentageChangeCalculator() {
  const [original, setOriginal] = useState("");
  const [newVal, setNewVal] = useState("");
  const [result, setResult] = useState<{
    change: number;
    percentage: number;
    direction: string;
  } | null>(null);
  const [error, setError] = useState("");

  function handleCalculate() {
    setError("");
    setResult(null);

    try {
      const orig = parseFloat(original);
      const n = parseFloat(newVal);

      if (isNaN(orig) || isNaN(n)) {
        setError("Both values must be valid numbers.");
        return;
      }

      if (orig === 0) {
        setError("Original value cannot be zero.");
        return;
      }

      const change = n - orig;
      const percentage = (change / orig) * 100;
      const direction = change > 0 ? "Increase" : change < 0 ? "Decrease" : "No change";

      setResult({ change, percentage, direction });
    } catch {
      setError("An unexpected error occurred.");
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Card variant="default" className="p-8">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-text-primary">
              Original Value
            </label>
            <input
              type="text"
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
              placeholder="e.g. 100"
              className="w-full rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:ring-2 focus:ring-nuvora-500 dark:focus:ring-nuvora-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text-primary">
              New Value
            </label>
            <input
              type="text"
              value={newVal}
              onChange={(e) => setNewVal(e.target.value)}
              placeholder="e.g. 150"
              className="w-full rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:ring-2 focus:ring-nuvora-500 dark:focus:ring-nuvora-400"
            />
          </div>
          <Button onClick={handleCalculate} variant="primary" size="lg" className="w-full">
            Calculate
          </Button>
        </div>

        {error && <Alert variant="error" className="mt-6">{error}</Alert>}

        {result && (
          <div className="mt-6 divide-y divide-border-subtle rounded-xl border border-border-subtle">
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-sm text-text-secondary">Change (absolute)</span>
              <span className="font-mono font-medium text-text-primary">
                {result.change > 0 ? "+" : ""}{result.change.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-sm text-text-secondary">Percentage Change</span>
              <span className="font-mono font-medium text-text-primary">
                {result.percentage > 0 ? "+" : ""}{result.percentage.toFixed(2)}%
              </span>
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-sm text-text-secondary">Direction</span>
              <span
                className={`font-medium ${
                  result.direction === "Increase"
                    ? "text-green-600 dark:text-green-400"
                    : result.direction === "Decrease"
                      ? "text-red-600 dark:text-red-400"
                      : "text-text-secondary"
                }`}
              >
                {result.direction}
              </span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
