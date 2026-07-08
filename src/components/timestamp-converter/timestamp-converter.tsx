"use client";

import { useState, useCallback } from "react";
import { Input, Button, Alert } from "@/components/ui";

type Mode = "unix-to-date" | "date-to-unix";

function detectPrecision(ts: number): "seconds" | "milliseconds" {
  const year = ts > 1e12 ? ts / 1000 : ts;
  const d = new Date(year < 1e11 ? ts * 1000 : ts);
  return d.getFullYear() > 1970 && d.getFullYear() < 2100 ? "seconds" : "milliseconds";
}

function isValidDate(str: string): boolean {
  const d = new Date(str);
  return !isNaN(d.getTime());
}

export function TimestampConverter() {
  const [mode, setMode] = useState<Mode>("unix-to-date");
  const [timestampInput, setTimestampInput] = useState("");
  const [dateInput, setDateInput] = useState(new Date().toISOString().slice(0, 16));
  const [result, setResult] = useState<{
    utc: string;
    local: string;
    unixSeconds: number;
    unixMillis: number;
  } | null>(null);
  const [error, setError] = useState("");

  const handleConvert = useCallback(() => {
    setError("");
    if (mode === "unix-to-date") {
      const trimmed = timestampInput.trim();
      if (!trimmed) {
        setError("Please enter a timestamp");
        return;
      }
      const ts = Number(trimmed);
      if (isNaN(ts)) {
        setError("Invalid timestamp. Enter a numeric value.");
        return;
      }
      const precision = detectPrecision(ts);
      const ms = precision === "seconds" ? ts * 1000 : ts;
      const d = new Date(ms);
      if (isNaN(d.getTime())) {
        setError("Timestamp out of range");
        return;
      }
      setResult({
        utc: d.toUTCString(),
        local: d.toLocaleString(),
        unixSeconds: Math.floor(ms / 1000),
        unixMillis: ms,
      });
    } else {
      if (!isValidDate(dateInput)) {
        setError("Invalid date/time. Use a valid format like YYYY-MM-DDTHH:mm.");
        return;
      }
      const d = new Date(dateInput);
      const ms = d.getTime();
      setResult({
        utc: d.toUTCString(),
        local: d.toLocaleString(),
        unixSeconds: Math.floor(ms / 1000),
        unixMillis: ms,
      });
    }
  }, [mode, timestampInput, dateInput]);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex gap-2">
        <Button
          variant={mode === "unix-to-date" ? "primary" : "secondary"}
          onClick={() => { setMode("unix-to-date"); setResult(null); setError(""); }}
        >
          Unix Timestamp → Date
        </Button>
        <Button
          variant={mode === "date-to-unix" ? "primary" : "secondary"}
          onClick={() => { setMode("date-to-unix"); setResult(null); setError(""); }}
        >
          Date → Unix Timestamp
        </Button>
      </div>

      <div className="space-y-4">
        {mode === "unix-to-date" ? (
          <div>
            <label htmlFor="ts-input" className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Unix Timestamp (seconds or milliseconds)
            </label>
            <Input
              id="ts-input"
              type="text"
              value={timestampInput}
              onChange={(e) => setTimestampInput(e.target.value)}
              placeholder="e.g. 1719878400 or 1719878400000"
              aria-label="Unix timestamp"
            />
          </div>
        ) : (
          <div>
            <label htmlFor="date-input" className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Date and Time
            </label>
            <Input
              id="date-input"
              type="datetime-local"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              aria-label="Date and time"
            />
          </div>
        )}

        <Button onClick={handleConvert} variant="primary">
          Convert
        </Button>
      </div>

      {error && (
        <Alert variant="error" className="mt-4">
          <p className="text-sm">{error}</p>
        </Alert>
      )}

      {result && (
        <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Converted Result
            </p>
          </div>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            <div className="flex items-center justify-between px-5 py-3">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">UTC Time</span>
              <span className="font-mono text-sm text-zinc-900 dark:text-zinc-50">{result.utc}</span>
            </div>
            <div className="flex items-center justify-between px-5 py-3 even:bg-zinc-50 dark:even:bg-zinc-900/50">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">Local Time</span>
              <span className="font-mono text-sm text-zinc-900 dark:text-zinc-50">{result.local}</span>
            </div>
            <div className="flex items-center justify-between px-5 py-3">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">Unix Timestamp (seconds)</span>
              <span className="font-mono text-sm text-zinc-900 dark:text-zinc-50">{result.unixSeconds}</span>
            </div>
            <div className="flex items-center justify-between px-5 py-3 even:bg-zinc-50 dark:even:bg-zinc-900/50">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">Unix Timestamp (milliseconds)</span>
              <span className="font-mono text-sm text-zinc-900 dark:text-zinc-50">{result.unixMillis}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
