"use client";

import { useState, useCallback } from "react";
import { Button, Alert, Card } from "@/components/ui";

type HueFilter = "all" | "red" | "blue" | "green" | "purple" | "orange" | "pink";

const hueRanges: Record<Exclude<HueFilter, "all">, [number, number][]> = {
  red: [[0, 30], [330, 360]],
  blue: [[190, 260]],
  green: [[80, 170]],
  purple: [[260, 310]],
  orange: [[30, 70]],
  pink: [[310, 350]],
};

function randomHSL(hue: HueFilter): { h: number; s: number; l: number } {
  let h: number;
  if (hue === "all") {
    h = Math.random() * 360;
  } else {
    const ranges = hueRanges[hue];
    const range = ranges[Math.floor(Math.random() * ranges.length)];
    h = range[0] + Math.random() * (range[1] - range[0]);
  }
  return { h, s: 50 + Math.random() * 40, l: 40 + Math.random() * 30 };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hslString(h: number, s: number, l: number): string {
  return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
}

function generateColors(hue: HueFilter, count: number) {
  return Array.from({ length: count }, () => {
    const { h, s, l } = randomHSL(hue);
    return { hex: hslToHex(h, s, l), rgb: "", hsl: hslString(h, s, l), h, s, l };
  });
}

export function RandomColorGenerator() {
  const [hue, setHue] = useState<HueFilter>("all");
  const [colors, setColors] = useState(() => generateColors("all", 5));
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = useCallback(() => {
    setColors(generateColors(hue, 5));
  }, [hue]);

  async function handleCopy(hex: string, index: number) {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  }

  const mainColor = colors[0];

  return (
    <div className="mx-auto max-w-3xl">
      <Card variant="default" className="p-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {(["all", "red", "blue", "green", "purple", "orange", "pink"] as const).map((h) => (
            <Button
              key={h}
              variant={hue === h ? "primary" : "secondary"}
              size="sm"
              onClick={() => setHue(h)}
            >
              {h.charAt(0).toUpperCase() + h.slice(1)}
            </Button>
          ))}
        </div>
        <Button onClick={handleGenerate} variant="primary" size="lg" className="w-full">
          Generate Colors
        </Button>
        <div
          className="mt-6 h-32 rounded-xl border border-border-subtle transition-colors"
          style={{ backgroundColor: mainColor.hex }}
        />
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="rounded-lg bg-surface-secondary p-3">
            <span className="text-text-secondary">Hex</span>
            <p className="font-mono font-medium text-text-primary">{mainColor.hex}</p>
          </div>
          <div className="rounded-lg bg-surface-secondary p-3">
            <span className="text-text-secondary">RGB</span>
            <p className="font-mono font-medium text-text-primary">
              rgb({parseInt(mainColor.hex.slice(1, 3), 16)}, {parseInt(mainColor.hex.slice(3, 5), 16)}, {parseInt(mainColor.hex.slice(5, 7), 16)})
            </p>
          </div>
          <div className="rounded-lg bg-surface-secondary p-3 col-span-2">
            <span className="text-text-secondary">HSL</span>
            <p className="font-mono font-medium text-text-primary">{mainColor.hsl}</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-5 gap-3">
          {colors.map((c, i) => (
            <button
              key={i}
              onClick={() => handleCopy(c.hex, i)}
              className="relative flex flex-col items-center rounded-xl border border-border-subtle p-3 transition-transform hover:scale-105"
              title="Click to copy hex"
            >
              <div
                className="h-10 w-full rounded-lg"
                style={{ backgroundColor: c.hex }}
              />
              <span className="mt-1 font-mono text-xs text-text-secondary">{c.hex}</span>
              {copiedIndex === i && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-zinc-900 px-2 py-0.5 text-xs text-white dark:bg-zinc-100 dark:text-zinc-900">
                  Copied!
                </span>
              )}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
