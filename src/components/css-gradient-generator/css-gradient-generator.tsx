"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { CopyButton } from "@/components/shared";

type GradientType = "linear" | "radial";
type Direction = "to right" | "to bottom" | "to bottom right" | "to top right" | "circle" | "ellipse";

interface ColorStop {
  color: string;
  position: number;
}

const DEFAULT_COLORS: ColorStop[] = [
  { color: "#ff7e5f", position: 0 },
  { color: "#feb47b", position: 100 },
];

export function CssGradientGenerator() {
  const [gradientType, setGradientType] = useState<GradientType>("linear");
  const [direction, setDirection] = useState<Direction>("to right");
  const [colorStops, setColorStops] = useState<ColorStop[]>(DEFAULT_COLORS);

  function updateColorStop(index: number, field: "color" | "position", value: string) {
    const updated = [...colorStops];
    if (field === "color") {
      updated[index] = { ...updated[index], color: value };
    } else {
      const pos = Math.min(100, Math.max(0, parseInt(value) || 0));
      updated[index] = { ...updated[index], position: pos };
    }
    setColorStops(updated);
  }

  function addColorStop() {
    if (colorStops.length >= 5) return;
    const lastPos = colorStops[colorStops.length - 1]?.position ?? 100;
    setColorStops([...colorStops, { color: "#667eea", position: Math.min(100, lastPos + 25) }]);
  }

  function removeColorStop(index: number) {
    if (colorStops.length <= 2) return;
    setColorStops(colorStops.filter((_, i) => i !== index));
  }

  function generateCss(): string {
    const stops = colorStops
      .map((s) => `${s.color} ${s.position}%`)
      .join(", ");

    if (gradientType === "radial") {
      return `background: radial-gradient(${direction === "circle" ? "circle" : "ellipse"}, ${stops});`;
    }
    return `background: linear-gradient(${direction}, ${stops});`;
  }

  function generatePreviewStyle(): React.CSSProperties {
    const stops = colorStops
      .map((s) => `${s.color} ${s.position}%`)
      .join(", ");

    if (gradientType === "radial") {
      return {
        background: `radial-gradient(${direction === "circle" ? "circle" : "ellipse"}, ${stops})`,
      };
    }
    return {
      background: `linear-gradient(${direction}, ${stops})`,
    };
  }

  const cssCode = generateCss();

  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-5">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Type</label>
            <div className="flex gap-2">
              <Button variant={gradientType === "linear" ? "primary" : "secondary"} size="sm" onClick={() => setGradientType("linear")}>Linear</Button>
              <Button variant={gradientType === "radial" ? "primary" : "secondary"} size="sm" onClick={() => setGradientType("radial")}>Radial</Button>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Direction</label>
            <select
              value={direction}
              onChange={(e) => setDirection(e.target.value as Direction)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition-colors focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-blue-400"
            >
              {gradientType === "linear" ? (
                <>
                  <option value="to right">â†’ To Right</option>
                  <option value="to bottom">â†“ To Bottom</option>
                  <option value="to bottom right">â†˜ To Bottom Right</option>
                  <option value="to top right">â†— To Top Right</option>
                </>
              ) : (
                <>
                  <option value="circle">Circle</option>
                  <option value="ellipse">Ellipse</option>
                </>
              )}
            </select>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Color Stops</label>
            {colorStops.length < 5 && (
              <Button variant="ghost" size="sm" onClick={addColorStop}>+ Add Stop</Button>
            )}
          </div>
          <div className="space-y-2">
            {colorStops.map((stop, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
                <input
                  type="color"
                  value={stop.color}
                  onChange={(e) => updateColorStop(i, "color", e.target.value)}
                  className="h-10 w-14 cursor-pointer rounded border border-zinc-300 bg-transparent p-0.5 dark:border-zinc-700"
                />
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={stop.position}
                  onChange={(e) => updateColorStop(i, "position", e.target.value)}
                  className="w-20 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:ring-blue-400"
                />
                <span className="text-xs text-zinc-600">%</span>
                <span className="font-mono text-xs text-zinc-600 dark:text-zinc-400">{stop.color}</span>
                {colorStops.length > 2 && (
                  <button onClick={() => removeColorStop(i)} className="ml-auto text-zinc-600 hover:text-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Preview</p>
          </div>
          <div
            className="h-48 w-full"
            style={generatePreviewStyle()}
          />
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">CSS Code</p>
            <CopyButton text={cssCode} label="Copy CSS" />
          </div>
          <div className="bg-zinc-950 px-5 py-4">
            <code className="block whitespace-pre-wrap text-sm text-green-700">{cssCode}</code>
          </div>
        </div>
      </div>
    </div>
  );
}
