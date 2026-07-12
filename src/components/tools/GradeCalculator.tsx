"use client";

import { useState } from "react";
import { Button, Alert, Card } from "@/components/ui";

function getLetterGrade(avg: number): string {
  if (avg >= 90) return "A";
  if (avg >= 80) return "B";
  if (avg >= 70) return "C";
  if (avg >= 60) return "D";
  return "F";
}

function getGPA(letter: string): number {
  switch (letter) {
    case "A": return 4.0;
    case "B": return 3.0;
    case "C": return 2.0;
    case "D": return 1.0;
    default: return 0.0;
  }
}

export function GradeCalculator() {
  const [scores, setScores] = useState(["", "", "", "", ""]);
  const [result, setResult] = useState<{
    average: number;
    letter: string;
    gpa: number;
  } | null>(null);
  const [error, setError] = useState("");

  function handleScoreChange(index: number, value: string) {
    const updated = [...scores];
    updated[index] = value;
    setScores(updated);
  }

  function handleCalculate() {
    try {
      setError("");
      const nums = scores.map((s) => parseFloat(s));
      if (nums.some((n) => isNaN(n) || n < 0 || n > 100)) {
        setError("All scores must be between 0 and 100.");
        return;
      }
      const average = nums.reduce((a, b) => a + b, 0) / nums.length;
      const letter = getLetterGrade(average);
      const gpa = getGPA(letter);
      setResult({ average, letter, gpa });
    } catch {
      setError("An unexpected error occurred.");
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-4">
        {scores.map((score, i) => (
          <div key={i}>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Score {i + 1} (0-100)</label>
            <input
              type="number"
              value={score}
              onChange={(e) => handleScoreChange(i, e.target.value)}
              placeholder="85"
              min="0"
              max="100"
              aria-label={`Score ${i + 1}`}
              className="w-full rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:ring-2 focus:ring-nuvora-500 dark:focus:ring-nuvora-400"
            />
          </div>
        ))}
        <Button onClick={handleCalculate} variant="primary" className="w-full">Calculate</Button>
      </div>

      {error && <Alert variant="error" className="mt-6">{error}</Alert>}

      {result && (
        <div className="mt-8 space-y-3">
          <Card variant="default" className="p-8">
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-zinc-50 p-4 text-center dark:bg-zinc-900">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Average Score</p>
                <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{result.average.toFixed(1)}</p>
              </div>
              <div className="rounded-lg bg-zinc-50 p-4 text-center dark:bg-zinc-900">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Letter Grade</p>
                <p className="mt-1 text-2xl font-bold text-nuvora-600 dark:text-nuvora-400">{result.letter}</p>
              </div>
              <div className="rounded-lg bg-zinc-50 p-4 text-center dark:bg-zinc-900">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">GPA</p>
                <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{result.gpa.toFixed(1)}</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
