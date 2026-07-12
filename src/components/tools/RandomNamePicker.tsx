"use client";

import { useState, useRef, useCallback } from "react";
import { Button, Alert, Card } from "@/components/ui";

export function RandomNamePicker() {
  const [text, setText] = useState("");
  const [names, setNames] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [error, setError] = useState("");

  const pickRandom = useCallback(() => {
    try {
      setError("");
      const list = text.split("\n").map((s) => s.trim()).filter(Boolean);
      if (list.length === 0) { setError("Please enter at least one name."); return; }
      setNames(list);
      setSpinning(true);
      setSelected(null);
      let idx = 0;
      intervalRef.current = setInterval(() => {
        setDisplayName(list[idx % list.length]);
        idx++;
      }, 100);
      timeoutRef.current = setTimeout(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        const final = list[Math.floor(Math.random() * list.length)];
        setDisplayName(final);
        setSelected(final);
        setSpinning(false);
      }, 2000);
    } catch {
      setError("An unexpected error occurred.");
    }
  }, [text]);

  function handleReset() {
    try {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setSpinning(false);
      setSelected(null);
      setDisplayName("");
    } catch {
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Names (one per line)</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="John&#10;Jane&#10;Alice&#10;Bob"
          rows={6}
          aria-label="List of names"
          className="w-full rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:ring-2 focus:ring-nuvora-500 dark:focus:ring-nuvora-400"
        />
      </div>

      <div className="flex gap-3">
        <Button onClick={pickRandom} variant="primary" disabled={spinning}>Pick Random</Button>
        <Button onClick={handleReset} variant="secondary">Reset</Button>
      </div>

      {error && <Alert variant="error" className="mt-6">{error}</Alert>}

      <Card variant="default" className="p-8">
        <div className="text-center">
          <p className="text-4xl font-bold text-text-primary">
            {displayName || "Click 'Pick Random' to start"}
          </p>
        </div>
      </Card>

      {names.length > 0 && (
        <Card variant="default" className="p-8">
          <p className="mb-3 text-sm font-medium text-text-secondary">Full List</p>
          <ul className="space-y-1">
            {names.map((name, i) => (
              <li
                key={i}
                className={`rounded-lg px-3 py-2 text-sm ${
                  name === selected
                    ? "bg-nuvora-100 font-semibold text-nuvora-700 dark:bg-nuvora-900/50 dark:text-nuvora-400"
                    : "text-text-primary"
                }`}
              >
                {name}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
