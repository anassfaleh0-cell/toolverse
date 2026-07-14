"use client";

import { useState } from "react";
import { Button, Alert, Card } from "@/components/ui";

export function DiscountCalculator() {
  const [price, setPrice] = useState("");
  const [rate, setRate] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [result, setResult] = useState<{
    discount: number;
    finalPrice: number;
    total: number;
    savings: number;
    qty: number;
  } | null>(null);
  const [error, setError] = useState("");

  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  function handleCalculate() {
    try {
      setError("");
      const p = parseFloat(price);
      const r = parseFloat(rate);
      const q = parseInt(quantity, 10) || 1;
      if (isNaN(p) || p < 0) { setError("Please enter a valid price."); return; }
      if (isNaN(r) || r < 0) { setError("Please enter a valid discount rate."); return; }
      if (q < 1) { setError("Quantity must be at least 1."); return; }
      const discount = p * r / 100;
      const finalPrice = p - discount;
      const total = finalPrice * q;
      const savings = discount * q;
      setResult({ discount, finalPrice, total, savings, qty: q });
    } catch {
      setError("An unexpected error occurred.");
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Original Price ($)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="49.99"
            aria-label="Original price"
            className="w-full rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:ring-2 focus:ring-nuvora-500 dark:focus:ring-nuvora-400"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Discount Rate (%)</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="20"
            aria-label="Discount rate"
            className="w-full rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:ring-2 focus:ring-nuvora-500 dark:focus:ring-nuvora-400"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="1"
            min="1"
            aria-label="Quantity"
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
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Discount Amount</p>
                <p className="mt-1 text-xl font-bold text-red-600 dark:text-red-400">{currency.format(result.discount)}</p>
              </div>
              <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Final Price</p>
                <p className="mt-1 text-xl font-bold text-emerald-700 dark:text-emerald-400">{currency.format(result.finalPrice)}</p>
              </div>
              <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Total for {result.qty} items</p>
                <p className="mt-1 text-xl font-bold text-zinc-900 dark:text-zinc-50">{currency.format(result.total)}</p>
              </div>
              <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">You save</p>
                <p className="mt-1 text-xl font-bold text-green-700 dark:text-green-400">{currency.format(result.savings)}</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
