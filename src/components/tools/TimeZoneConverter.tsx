"use client";

import { useState } from "react";
import { Button, Alert, Card } from "@/components/ui";

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Australia/Sydney",
  "Pacific/Auckland",
];

function getOffset(tz: string): number {
  const now = new Date();
  const utc = now.getTime();
  const local = new Date(now.toLocaleString("en-US", { timeZone: tz })).getTime();
  return (local - utc) / (1000 * 60 * 60);
}

export function TimeZoneConverter() {
  const [dateTime, setDateTime] = useState("");
  const [fromTz, setFromTz] = useState("UTC");
  const [toTz, setToTz] = useState("America/New_York");
  const [result, setResult] = useState<{
    original: string;
    converted: string;
    diff: string;
  } | null>(null);
  const [error, setError] = useState("");

  function handleConvert() {
    try {
      setError("");
      if (!dateTime) { setError("Please select a date and time."); return; }
      const date = new Date(dateTime);
      if (isNaN(date.getTime())) { setError("Invalid date/time."); return; }

      const original = new Intl.DateTimeFormat("en-US", {
        timeZone: fromTz,
        dateStyle: "full",
        timeStyle: "long",
      }).format(date);

      const converted = new Intl.DateTimeFormat("en-US", {
        timeZone: toTz,
        dateStyle: "full",
        timeStyle: "long",
      }).format(date);

      const fromOff = getOffset(fromTz);
      const toOff = getOffset(toTz);
      const diff = toOff - fromOff;
      const sign = diff >= 0 ? "+" : "";
      const diffStr = `${sign}${diff.toFixed(1)}h`;

      setResult({ original, converted, diff: diffStr });
    } catch {
      setError("An unexpected error occurred.");
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Date & Time</label>
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            aria-label="Date and time"
            className="w-full rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:ring-2 focus:ring-nuvora-500 dark:focus:ring-nuvora-400"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">From Timezone</label>
            <select
              value={fromTz}
              onChange={(e) => setFromTz(e.target.value)}
              aria-label="From timezone"
              className="w-full rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary outline-none transition-colors focus:ring-2 focus:ring-nuvora-500 dark:focus:ring-nuvora-400"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">To Timezone</label>
            <select
              value={toTz}
              onChange={(e) => setToTz(e.target.value)}
              aria-label="To timezone"
              className="w-full rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary outline-none transition-colors focus:ring-2 focus:ring-nuvora-500 dark:focus:ring-nuvora-400"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
        </div>
        <Button onClick={handleConvert} variant="primary" className="w-full">Convert</Button>
      </div>

      {error && <Alert variant="error" className="mt-6">{error}</Alert>}

      {result && (
        <div className="mt-8 space-y-3">
          <Card variant="default" className="p-8">
            <div className="space-y-4">
              <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Original Time ({fromTz})</p>
                <p className="mt-1 font-medium text-zinc-900 dark:text-zinc-50">{result.original}</p>
              </div>
              <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Converted Time ({toTz})</p>
                <p className="mt-1 font-medium text-emerald-700 dark:text-emerald-400">{result.converted}</p>
              </div>
              <div className="rounded-lg bg-nuvora-50 p-4 text-center dark:bg-nuvora-900/30">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Time Difference</p>
                <p className="mt-1 text-xl font-bold text-nuvora-600 dark:text-nuvora-400">{result.diff}</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
