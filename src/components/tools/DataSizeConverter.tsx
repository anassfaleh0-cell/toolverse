"use client";

import { useState } from "react";
import { Alert, Card } from "@/components/ui";

const UNITS = ["Bytes", "KB", "MB", "GB", "TB"] as const;
const UNIT_MULTIPLIERS: Record<string, number> = {
  Bytes: 1,
  KB: 1024,
  MB: 1024 ** 2,
  GB: 1024 ** 3,
  TB: 1024 ** 4,
};

export function DataSizeConverter() {
  const [value, setValue] = useState("");
  const [fromUnit, setFromUnit] = useState("MB");
  const [toUnit, setToUnit] = useState("KB");
  const [result, setResult] = useState<string | null>(null);
  const [intermediate, setIntermediate] = useState<string | null>(null);
  const [error, setError] = useState("");

  function handleConvert() {
    try {
      setError("");
      const v = parseFloat(value);
      if (isNaN(v) || v < 0) { setError("Please enter a valid positive number."); return; }
      const fromMultiplier = UNIT_MULTIPLIERS[fromUnit];
      const toMultiplier = UNIT_MULTIPLIERS[toUnit];
      const bytes = v * fromMultiplier;
      const converted = bytes / toMultiplier;
      setIntermediate(`${bytes.toLocaleString()} Bytes`);
      setResult(`${converted.toLocaleString(undefined, { maximumFractionDigits: 4 })} ${toUnit}`);
    } catch {
      setError("An unexpected error occurred.");
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Value</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="1"
            aria-label="Value"
            className="w-full rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:ring-2 focus:ring-nuvora-500 dark:focus:ring-nuvora-400"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">From</label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              aria-label="From unit"
              className="w-full rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary outline-none transition-colors focus:ring-2 focus:ring-nuvora-500 dark:focus:ring-nuvora-400"
            >
              {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">To</label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              aria-label="To unit"
              className="w-full rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary outline-none transition-colors focus:ring-2 focus:ring-nuvora-500 dark:focus:ring-nuvora-400"
            >
              {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
        <button
          onClick={handleConvert}
          className="w-full rounded-xl bg-nuvora-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-nuvora-600/20 transition-all hover:bg-nuvora-700 active:scale-[0.97] dark:bg-nuvora-500 dark:hover:bg-nuvora-400 dark:shadow-nuvora-500/20"
        >
          Convert
        </button>
      </div>

      {error && <Alert variant="error" className="mt-6">{error}</Alert>}

      {result !== null && intermediate !== null && (
        <Card variant="default" className="p-8">
          <div className="space-y-4">
            <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Result</p>
              <p className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-400">{result}</p>
            </div>
            <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Steps</p>
              <p className="mt-1 text-sm text-text-secondary">{intermediate}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
