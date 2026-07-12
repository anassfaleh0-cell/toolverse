"use client";

import { useState } from "react";
import { Button, Alert, Card } from "@/components/ui";

export function BodyFatCalculator() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [neck, setNeck] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [result, setResult] = useState<{
    bodyFat: number;
    category: string;
    fatMass: number;
    leanMass: number;
  } | null>(null);
  const [error, setError] = useState("");

  function getCategory(bf: number): string {
    if (gender === "male") {
      if (bf >= 2 && bf <= 5) return "Essential";
      if (bf >= 6 && bf <= 13) return "Athlete";
      if (bf >= 14 && bf <= 17) return "Fitness";
      if (bf >= 18 && bf <= 24) return "Average";
      return "Obese";
    }
    if (bf >= 10 && bf <= 13) return "Essential";
    if (bf >= 14 && bf <= 20) return "Athlete";
    if (bf >= 21 && bf <= 24) return "Fitness";
    if (bf >= 25 && bf <= 31) return "Average";
    return "Obese";
  }

  function handleCalculate() {
    try {
      setError("");
      const a = parseFloat(age);
      const h = parseFloat(height);
      const w = parseFloat(weight);
      const n = parseFloat(neck);
      const wa = parseFloat(waist);
      const hi = parseFloat(hip);
      if (isNaN(a) || a <= 0 || a > 150) { setError("Please enter a valid age (1-150)."); return; }
      if (isNaN(h) || h <= 0 || h > 300) { setError("Please enter a valid height (cm)."); return; }
      if (isNaN(w) || w <= 0 || w > 700) { setError("Please enter a valid weight (kg)."); return; }
      if (isNaN(n) || n <= 0 || n > 100) { setError("Please enter a valid neck measurement (cm)."); return; }
      if (isNaN(wa) || wa <= 0 || wa > 300) { setError("Please enter a valid waist measurement (cm)."); return; }
      if (gender === "female" && (isNaN(hi) || hi <= 0 || hi > 300)) { setError("Please enter a valid hip measurement (cm)."); return; }
      const log10 = Math.log10;
      let bodyFat: number;
      if (gender === "male") {
        bodyFat = 86.01 * log10(wa - n) - 70.041 * log10(h) + 36.76;
      } else {
        bodyFat = 163.205 * log10(wa + hi - n) - 97.684 * log10(h) - 78.387;
      }
      if (isNaN(bodyFat) || !isFinite(bodyFat)) { setError("Calculation error. Please check your inputs."); return; }
      bodyFat = Math.max(2, Math.min(60, bodyFat));
      const fatMass = w * bodyFat / 100;
      const leanMass = w - fatMass;
      setResult({ bodyFat, category: getCategory(bodyFat), fatMass, leanMass });
    } catch {
      setError("An unexpected error occurred.");
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as "male" | "female")}
            aria-label="Gender"
            className="w-full rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary outline-none transition-colors focus:ring-2 focus:ring-nuvora-500 dark:focus:ring-nuvora-400"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="30"
            aria-label="Age"
            className="w-full rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:ring-2 focus:ring-nuvora-500 dark:focus:ring-nuvora-400"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Height (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="175"
            aria-label="Height"
            className="w-full rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:ring-2 focus:ring-nuvora-500 dark:focus:ring-nuvora-400"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Weight (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="70"
            aria-label="Weight"
            className="w-full rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:ring-2 focus:ring-nuvora-500 dark:focus:ring-nuvora-400"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Neck (cm)</label>
          <input
            type="number"
            value={neck}
            onChange={(e) => setNeck(e.target.value)}
            placeholder="38"
            aria-label="Neck"
            className="w-full rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:ring-2 focus:ring-nuvora-500 dark:focus:ring-nuvora-400"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Waist (cm)</label>
          <input
            type="number"
            value={waist}
            onChange={(e) => setWaist(e.target.value)}
            placeholder="82"
            aria-label="Waist"
            className="w-full rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:ring-2 focus:ring-nuvora-500 dark:focus:ring-nuvora-400"
          />
        </div>
        {gender === "female" && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Hip (cm)</label>
            <input
              type="number"
              value={hip}
              onChange={(e) => setHip(e.target.value)}
              placeholder="93"
              aria-label="Hip"
              className="w-full rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:ring-2 focus:ring-nuvora-500 dark:focus:ring-nuvora-400"
            />
          </div>
        )}
        <Button onClick={handleCalculate} variant="primary" className="w-full">Calculate Body Fat</Button>
      </div>

      {error && <Alert variant="error" className="mt-6">{error}</Alert>}

      {result && (
        <div className="mt-8 space-y-3">
          <Card variant="default" className="p-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Body Fat %</p>
                <p className="mt-1 text-xl font-bold text-zinc-900 dark:text-zinc-50">{result.bodyFat.toFixed(1)}%</p>
              </div>
              <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Category</p>
                <p className="mt-1 text-xl font-bold text-nuvora-600 dark:text-nuvora-400">{result.category}</p>
              </div>
              <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Fat Mass</p>
                <p className="mt-1 text-xl font-bold text-orange-600 dark:text-orange-400">{result.fatMass.toFixed(1)} kg</p>
              </div>
              <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Lean Mass</p>
                <p className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">{result.leanMass.toFixed(1)} kg</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
