"use client";

import { useState } from "react";
import { Button, Alert, Card } from "@/components/ui";

export function SalesTaxCalculator() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [result, setResult] = useState<{
    tax: number;
    total: number;
    amountNum: number;
    rateNum: number;
  } | null>(null);
  const [error, setError] = useState("");

  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  function handleCalculate() {
    try {
      setError("");
      const a = parseFloat(amount);
      const r = parseFloat(rate);
      if (isNaN(a) || a < 0) { setError("Please enter a valid amount."); return; }
      if (isNaN(r) || r < 0) { setError("Please enter a valid tax rate."); return; }
      const tax = a * r / 100;
      const total = a + tax;
      setResult({ tax, total, amountNum: a, rateNum: r });
    } catch {
      setError("An unexpected error occurred.");
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Amount ($)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="100.00"
            aria-label="Amount"
            className="w-full rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:ring-2 focus:ring-nuvora-500 dark:focus:ring-nuvora-400"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Tax Rate (%)</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="8.5"
            aria-label="Tax rate"
            className="w-full rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:ring-2 focus:ring-nuvora-500 dark:focus:ring-nuvora-400"
          />
        </div>
        <Button onClick={handleCalculate} variant="primary" className="w-full">Calculate</Button>
      </div>

      {error && <Alert variant="error" className="mt-6">{error}</Alert>}

      {result && (
        <div className="mt-8 space-y-3">
          <Card variant="default" className="p-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Amount</p>
                <p className="mt-1 text-xl font-bold text-zinc-900 dark:text-zinc-50">{currency.format(result.amountNum)}</p>
              </div>
              <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Rate</p>
                <p className="mt-1 text-xl font-bold text-zinc-900 dark:text-zinc-50">{result.rateNum}%</p>
              </div>
              <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Tax Amount</p>
                <p className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">{currency.format(result.tax)}</p>
              </div>
              <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Total (with tax)</p>
                <p className="mt-1 text-xl font-bold text-zinc-900 dark:text-zinc-50">{currency.format(result.total)}</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
