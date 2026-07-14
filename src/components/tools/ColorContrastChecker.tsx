"use client";

import { useState } from "react";
import { Alert, Card } from "@/components/ui";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const h = hex.replace("#", "").trim();
  if (h.length !== 3 && h.length !== 6) return null;
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const num = parseInt(full, 16);
  if (isNaN(num)) return null;
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function srgbToLinear(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function relativeLuminance(r: number, g: number, b: number): number {
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function ColorContrastChecker() {
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");
  const [ratio, setRatio] = useState<number | null>(null);
  const [criteria, setCriteria] = useState<{
    aaNormal: boolean;
    aaLarge: boolean;
    aaaNormal: boolean;
    aaaLarge: boolean;
  } | null>(null);
  const [error, setError] = useState("");

  function handleCheck() {
    try {
      setError("");
      const fgRgb = hexToRgb(fg);
      const bgRgb = hexToRgb(bg);
      if (!fgRgb) { setError("Invalid foreground color."); return; }
      if (!bgRgb) { setError("Invalid background color."); return; }
      const l1 = relativeLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
      const l2 = relativeLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
      const r = contrastRatio(l1, l2);
      setRatio(r);
      setCriteria({
        aaNormal: r >= 4.5,
        aaLarge: r >= 3,
        aaaNormal: r >= 7,
        aaaLarge: r >= 4.5,
      });
    } catch {
      setError("An unexpected error occurred.");
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Foreground Color</label>
          <input
            type="text"
            value={fg}
            onChange={(e) => setFg(e.target.value)}
            placeholder="#000000"
            aria-label="Foreground color hex"
            className="w-full rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:ring-2 focus:ring-nuvora-500 dark:focus:ring-nuvora-400"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Background Color</label>
          <input
            type="text"
            value={bg}
            onChange={(e) => setBg(e.target.value)}
            placeholder="#ffffff"
            aria-label="Background color hex"
            className="w-full rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm text-text-primary placeholder-text-tertiary outline-none transition-colors focus:ring-2 focus:ring-nuvora-500 dark:focus:ring-nuvora-400"
          />
        </div>
        <button
          onClick={handleCheck}
          className="w-full rounded-xl bg-nuvora-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-nuvora-600/20 transition-all hover:bg-nuvora-700 active:scale-[0.97] dark:bg-nuvora-500 dark:hover:bg-nuvora-400 dark:shadow-nuvora-500/20"
        >
          Check Contrast
        </button>
      </div>

      {error && <Alert variant="error" className="mt-6">{error}</Alert>}

      {ratio !== null && criteria && (
        <>
          <Card variant="default" className="p-8">
            <div className="mb-4 text-center">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Contrast Ratio</p>
              <p className="text-3xl font-bold text-text-primary">{ratio.toFixed(2)}:1</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className={`rounded-lg p-4 ${criteria.aaNormal ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-red-50 dark:bg-red-950"}`}>
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">AA Normal</p>
                <p className={`mt-1 text-lg font-bold ${criteria.aaNormal ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
                  {criteria.aaNormal ? "PASS" : "FAIL"} (4.5:1)
                </p>
              </div>
              <div className={`rounded-lg p-4 ${criteria.aaLarge ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-red-50 dark:bg-red-950"}`}>
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">AA Large</p>
                <p className={`mt-1 text-lg font-bold ${criteria.aaLarge ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
                  {criteria.aaLarge ? "PASS" : "FAIL"} (3:1)
                </p>
              </div>
              <div className={`rounded-lg p-4 ${criteria.aaaNormal ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-red-50 dark:bg-red-950"}`}>
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">AAA Normal</p>
                <p className={`mt-1 text-lg font-bold ${criteria.aaaNormal ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
                  {criteria.aaaNormal ? "PASS" : "FAIL"} (7:1)
                </p>
              </div>
              <div className={`rounded-lg p-4 ${criteria.aaaLarge ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-red-50 dark:bg-red-950"}`}>
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">AAA Large</p>
                <p className={`mt-1 text-lg font-bold ${criteria.aaaLarge ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
                  {criteria.aaaLarge ? "PASS" : "FAIL"} (4.5:1)
                </p>
              </div>
            </div>
          </Card>

          <Card variant="default" className="p-8">
            <p className="mb-3 text-sm font-medium text-text-secondary">Preview</p>
            <div
              className="rounded-lg p-6 text-center"
              style={{ backgroundColor: bg, color: fg }}
            >
              <p className="text-2xl font-bold">Sample Text</p>
              <p className="mt-2 text-base">The quick brown fox jumps over the lazy dog.</p>
              <p className="mt-1 text-sm">1234567890 ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
