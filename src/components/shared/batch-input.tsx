"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui";

interface BatchInputProps {
  label: string;
  placeholder: string;
  onBatchResults: (results: { input: string; output: any }[]) => void;
  fetchFn: (input: string) => Promise<any>;
  batchLabel?: string;
}

export function BatchInput({ label, placeholder, onBatchResults, fetchFn, batchLabel }: BatchInputProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);

  const handleBatch = useCallback(async () => {
    const items = text.trim().split("\n").map((s) => s.trim()).filter(Boolean);
    if (items.length === 0) return;
    setLoading(true);
    setTotal(items.length);
    setProgress(0);
    const results: { input: string; output: any }[] = [];
    for (let i = 0; i < items.length; i++) {
      try {
        const output = await fetchFn(items[i]);
        results.push({ input: items[i], output });
      } catch {
        results.push({ input: items[i], output: { error: "Failed" } });
      }
      setProgress(i + 1);
    }
    onBatchResults(results);
    setLoading(false);
  }, [text, fetchFn, onBatchResults]);

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800">
      <div className="border-b border-zinc-200 px-5 py-3 dark:border-zinc-800">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{batchLabel || "Batch Mode"}</p>
      </div>
      <div className="space-y-3 px-5 py-4">
        <label className="sr-only" htmlFor="batch-input">{label}</label>
        <textarea
          id="batch-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          placeholder={placeholder}
          className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          aria-label={label}
        />
        <div className="flex items-center justify-between">
          <Button onClick={handleBatch} disabled={loading || !text.trim()}>
            {loading ? `Processing ${progress}/${total}...` : `Run Batch (${text.trim().split("\n").filter(Boolean).length} items)`}
          </Button>
          {loading && (
            <div className="flex items-center gap-2" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={total}>
              <div className="h-2 w-24 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${(progress / total) * 100}%` }} />
              </div>
              <span className="text-xs text-zinc-500">{Math.round((progress / total) * 100)}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
