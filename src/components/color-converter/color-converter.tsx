"use client";

import { useState } from "react";
import { Input, Alert } from "@/components/ui";
import { CopyButton } from "@/components/shared";

const namedColors: Record<string, string> = {
  aliceblue: "#F0F8FF", antiquewhite: "#FAEBD7", aqua: "#00FFFF", aquamarine: "#7FFFD4",
  azure: "#F0FFFF", beige: "#F5F5DC", bisque: "#FFE4C4", black: "#000000",
  blanchedalmond: "#FFEBCD", blue: "#0000FF", blueviolet: "#8A2BE2", brown: "#A52A2A",
  burlywood: "#DEB887", cadetblue: "#5F9EA0", chartreuse: "#7FFF00", chocolate: "#D2691E",
  coral: "#FF7F50", cornflowerblue: "#6495ED", cornsilk: "#FFF8DC", crimson: "#DC143C",
  cyan: "#00FFFF", darkblue: "#00008B", darkcyan: "#008B8B", darkgoldenrod: "#B8860B",
  darkgray: "#A9A9A9", darkgreen: "#006400", darkgrey: "#A9A9A9", darkkhaki: "#BDB76B",
  darkmagenta: "#8B008B", darkolivegreen: "#556B2F", darkorange: "#FF8C00", darkorchid: "#9932CC",
  darkred: "#8B0000", darksalmon: "#E9967A", darkseagreen: "#8FBC8F", darkslateblue: "#483D8B",
  darkslategray: "#2F4F4F", darkslategrey: "#2F4F4F", darkturquoise: "#00CED1", darkviolet: "#9400D3",
  deeppink: "#FF1493", deepskyblue: "#00BFFF", dimgray: "#696969", dimgrey: "#696969",
  dodgerblue: "#1E90FF", firebrick: "#B22222", floralwhite: "#FFFAF0", forestgreen: "#228B22",
  fuchsia: "#FF00FF", gainsboro: "#DCDCDC", ghostwhite: "#F8F8FF", gold: "#FFD700",
  goldenrod: "#DAA520", gray: "#808080", green: "#008000", greenyellow: "#ADFF2F",
  grey: "#808080", honeydew: "#F0FFF0", hotpink: "#FF69B4", indianred: "#CD5C5C",
  indigo: "#4B0082", ivory: "#FFFFF0", khaki: "#F0E68C", lavender: "#E6E6FA",
  lavenderblush: "#FFF0F5", lawngreen: "#7CFC00", lemonchiffon: "#FFFACD", lightblue: "#ADD8E6",
  lightcoral: "#F08080", lightcyan: "#E0FFFF", lightgoldenrodyellow: "#FAFAD2", lightgray: "#D3D3D3",
  lightgreen: "#90EE90", lightgrey: "#D3D3D3", lightpink: "#FFB6C1", lightsalmon: "#FFA07A",
  lightseagreen: "#20B2AA", lightskyblue: "#87CEFA", lightslategray: "#778899", lightslategrey: "#778899",
  lightsteelblue: "#B0C4DE", lightyellow: "#FFFFE0", lime: "#00FF00", limegreen: "#32CD32",
  linen: "#FAF0E6", magenta: "#FF00FF", maroon: "#800000", mediumaquamarine: "#66CDAA",
  mediumblue: "#0000CD", mediumorchid: "#BA55D3", mediumpurple: "#9370DB", mediumseagreen: "#3CB371",
  mediumslateblue: "#7B68EE", mediumspringgreen: "#00FA9A", mediumturquoise: "#48D1CC", mediumvioletred: "#C71585",
  midnightblue: "#191970", mintcream: "#F5FFFA", mistyrose: "#FFE4E1", moccasin: "#FFE4B5",
  navajowhite: "#FFDEAD", navy: "#000080", oldlace: "#FDF5E6", olive: "#808000",
  olivedrab: "#6B8E23", orange: "#FFA500", orangered: "#FF4500", orchid: "#DA70D6",
  palegoldenrod: "#EEE8AA", palegreen: "#98FB98", paleturquoise: "#AFEEEE", palevioletred: "#DB7093",
  papayawhip: "#FFEFD5", peachpuff: "#FFDAB9", peru: "#CD853F", pink: "#FFC0CB",
  plum: "#DDA0DD", powderblue: "#B0E0E6", purple: "#800080", rebeccapurple: "#663399",
  red: "#FF0000", rosybrown: "#BC8F8F", royalblue: "#4169E1", saddlebrown: "#8B4513",
  salmon: "#FA8072", sandybrown: "#F4A460", seagreen: "#2E8B57", seashell: "#FFF5EE",
  sienna: "#A0522D", silver: "#C0C0C0", skyblue: "#87CEEB", slateblue: "#6A5ACD",
  slategray: "#708090", slategrey: "#708090", snow: "#FFFAFA", springgreen: "#00FF7F",
  steelblue: "#4682B4", tan: "#D2B48C", teal: "#008080", thistle: "#D8BFD8",
  tomato: "#FF6347", turquoise: "#40E0D0", violet: "#EE82EE", wheat: "#F5DEB3",
  white: "#FFFFFF", whitesmoke: "#F5F5F5", yellow: "#FFFF00", yellowgreen: "#9ACD32",
};

function hexToRgb(hex: string): { r: number; g: number; b: number; a?: number } | null {
  const clean = hex.replace(/^#/, "");
  if (!/^[0-9a-fA-F]{3}$/.test(clean) && !/^[0-9a-fA-F]{6}$/.test(clean) && !/^[0-9a-fA-F]{8}$/.test(clean)) return null;
  if (clean.length === 8) {
    const num = parseInt(clean, 16);
    return {
      r: (num >> 24) & 255,
      g: (num >> 16) & 255,
      b: (num >> 8) & 255,
      a: Math.round(((num & 255) / 255) * 100) / 100,
    };
  }
  let full = clean;
  if (full.length === 3) {
    full = full[0] + full[0] + full[1] + full[1] + full[2] + full[2];
  }
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const r1 = r / 255;
  const g1 = g / 255;
  const b1 = b / 255;
  const max = Math.max(r1, g1, b1);
  const min = Math.min(r1, g1, b1);
  const diff = max - min;
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);
    if (max === r1) {
      h = ((g1 - b1) / diff + (g1 < b1 ? 6 : 0)) * 60;
    } else if (max === g1) {
      h = ((b1 - r1) / diff + 2) * 60;
    } else {
      h = ((r1 - g1) / diff + 4) * 60;
    }
  }

  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const s1 = s / 100;
  const l1 = l / 100;
  const c = (1 - Math.abs(2 * l1 - 1)) * s1;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l1 - c / 2;
  let r1 = 0, g1 = 0, b1 = 0;

  if (h < 60) { r1 = c; g1 = x; b1 = 0; }
  else if (h < 120) { r1 = x; g1 = c; b1 = 0; }
  else if (h < 180) { r1 = 0; g1 = c; b1 = x; }
  else if (h < 240) { r1 = 0; g1 = x; b1 = c; }
  else if (h < 300) { r1 = x; g1 = 0; b1 = c; }
  else { r1 = c; g1 = 0; b1 = x; }

  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

function linearize(channel: number): number {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relativeLuminance(r: number, g: number, b: number): number {
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

type ColorFormat = "hex" | "rgb" | "rgba" | "hsl" | "hsla";

function detectFormat(input: string): ColorFormat | null {
  const trimmed = input.trim();
  if (/^#?[0-9a-fA-F]{3,8}$/.test(trimmed)) return "hex";
  if (/^rgba?\s*\(/.test(trimmed)) {
    return /^rgba\s*\(/.test(trimmed) ? "rgba" : "rgb";
  }
  if (/^hsla?\s*\(/.test(trimmed)) {
    return /^hsla\s*\(/.test(trimmed) ? "hsla" : "hsl";
  }
  return null;
}

function parseRgb(input: string): { r: number; g: number; b: number; a?: number } | null {
  const match = input.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/);
  if (!match) return null;
  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);
  if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) return null;
  const result: { r: number; g: number; b: number; a?: number } = { r, g, b };
  if (match[4] !== undefined) {
    const alpha = parseFloat(match[4]);
    if (alpha < 0 || alpha > 1) return null;
    result.a = Math.round(alpha * 100) / 100;
  }
  return result;
}

function parseHsl(input: string): { h: number; s: number; l: number; a?: number } | null {
  const match = input.match(/^hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*([\d.]+)\s*)?\)$/);
  if (!match) return null;
  const h = parseInt(match[1]);
  const s = parseInt(match[2]);
  const l = parseInt(match[3]);
  if (h < 0 || h > 360 || s < 0 || s > 100 || l < 0 || l > 100) return null;
  const result: { h: number; s: number; l: number; a?: number } = { h, s, l };
  if (match[4] !== undefined) {
    const alpha = parseFloat(match[4]);
    if (alpha < 0 || alpha > 1) return null;
    result.a = Math.round(alpha * 100) / 100;
  }
  return result;
}

function findColorName(hex: string): string | undefined {
  const upper = hex.toUpperCase();
  for (const [name, value] of Object.entries(namedColors)) {
    if (value === upper) return name;
  }
  return undefined;
}

interface WcagResult {
  ratio: number;
  aa: boolean;
  aaa: boolean;
  aaLarge: boolean;
}

interface ColorResults {
  hex: string;
  rgb: string;
  hsl: string;
  rgba: string;
  hsla: string;
  validRgb: { r: number; g: number; b: number };
  alpha: number;
  name?: string;
  wcagWhite: WcagResult;
  wcagBlack: WcagResult;
}

function computeColor(input: string): ColorResults | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const format = detectFormat(trimmed);
  if (!format) return null;

  let rgb: { r: number; g: number; b: number; a?: number } | null = null;
  let alpha = 1;

  if (format === "hex") {
    rgb = hexToRgb(trimmed);
    if (rgb && rgb.a !== undefined) alpha = rgb.a;
  } else if (format === "rgb" || format === "rgba") {
    rgb = parseRgb(trimmed);
    if (rgb && rgb.a !== undefined) alpha = rgb.a;
  } else if (format === "hsl" || format === "hsla") {
    const hsl = parseHsl(trimmed);
    if (!hsl) return null;
    if (hsl.a !== undefined) alpha = hsl.a;
    rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  }

  if (!rgb) return null;
  if (rgb.r < 0 || rgb.r > 255 || rgb.g < 0 || rgb.g > 255 || rgb.b < 0 || rgb.b > 255) return null;

  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
  const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  const rgbaStr = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
  const hslaStr = `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${alpha})`;

  const name = findColorName(hex);

  const lum = relativeLuminance(rgb.r, rgb.g, rgb.b);
  const lumWhite = relativeLuminance(255, 255, 255);
  const lumBlack = relativeLuminance(0, 0, 0);
  const ratioWhite = Math.round(contrastRatio(lum, lumWhite) * 100) / 100;
  const ratioBlack = Math.round(contrastRatio(lum, lumBlack) * 100) / 100;

  return {
    hex,
    rgb: rgbStr,
    hsl: hslStr,
    rgba: rgbaStr,
    hsla: hslaStr,
    validRgb: { r: rgb.r, g: rgb.g, b: rgb.b },
    alpha,
    name,
    wcagWhite: {
      ratio: ratioWhite,
      aa: ratioWhite >= 4.5,
      aaa: ratioWhite >= 7,
      aaLarge: ratioWhite >= 3,
    },
    wcagBlack: {
      ratio: ratioBlack,
      aa: ratioBlack >= 4.5,
      aaa: ratioBlack >= 7,
      aaLarge: ratioBlack >= 3,
    },
  };
}

export function ColorConverter() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<ColorResults | null>(null);
  const [error, setError] = useState("");

  function handleConvert(value: string) {
    setInput(value);
    if (!value.trim()) {
      setResults(null);
      setError("");
      return;
    }
    const format = detectFormat(value);
    if (!format) {
      setError("Invalid color format. Use HEX (#RRGGBB/#RRGGBBAA), rgb()/rgba(), or hsl()/hsla().");
      setResults(null);
      return;
    }
    const computed = computeColor(value);
    if (!computed) {
      setError("Invalid color value.");
      setResults(null);
      return;
    }
    setError("");
    setResults(computed);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-3">
        <Input
          value={input}
          onChange={(e) => handleConvert(e.target.value)}
          placeholder="Enter color: #FF0000, #FF000080, rgb(255,0,0), rgba(255,0,0,0.5), hsl(0,100%,50%), hsla(0,100%,50%,0.5)..."
          aria-label="Color input"
        />
        {results && (
          <div className="flex items-center gap-6">
            <div
              className="h-24 w-24 shrink-0 rounded-lg border border-zinc-300 dark:border-zinc-700"
              style={{ backgroundColor: results.alpha < 1 ? results.rgba : results.hex }}
              aria-label="Color preview"
            />
            <div className="space-y-1 text-sm text-zinc-500 dark:text-zinc-400">
              <p className="font-mono text-lg font-semibold text-zinc-900 dark:text-zinc-50">{results.hex}</p>
              {results.name && (
                <p className="capitalize text-zinc-600 dark:text-zinc-400">{results.name}</p>
              )}
              {results.alpha < 1 && (
                <p className="text-zinc-500 dark:text-zinc-500">Alpha: {Math.round(results.alpha * 100)}%</p>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="error" className="mt-6">
          <p className="font-mono">{error}</p>
        </Alert>
      )}

      {results && !error && (
        <div className="mt-6 space-y-6">
          <div className="space-y-3">
            {[
              { label: "HEX", value: results.alpha < 1 ? results.hex + (results.alpha * 255).toString(16).padStart(2, "0").toUpperCase() : results.hex },
              { label: "RGB", value: results.rgb },
              { label: "RGBA", value: results.rgba },
              { label: "HSL", value: results.hsl },
              { label: "HSLA", value: results.hsla },
            ].map((item) => (
              <div key={item.label} className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{item.label}</p>
                  <CopyButton text={item.value} />
                </div>
                <pre className="overflow-x-auto break-all p-5 font-mono text-sm text-zinc-900 dark:text-zinc-50">{item.value}</pre>
              </div>
            ))}
          </div>

          <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">WCAG Contrast</p>
            </div>
            <div className="grid grid-cols-2 gap-4 p-5">
              {[
                { label: "On White (#FFFFFF)", wcag: results.wcagWhite, bg: "bg-white", text: "text-zinc-900" },
                { label: "On Black (#000000)", wcag: results.wcagBlack, bg: "bg-zinc-900", text: "text-zinc-50" },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{item.label}</p>
                  <div className={`rounded-lg border border-zinc-200 p-3 ${item.bg} dark:border-zinc-700`}>
                    <p className={`text-lg font-bold ${item.text}`} style={{ color: results.alpha < 1 ? results.rgba : results.hex }}>
                      Sample Text
                    </p>
                  </div>
                  <p className="font-mono text-sm text-zinc-900 dark:text-zinc-50">Ratio: {item.wcag.ratio}:1</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { pass: item.wcag.aa, name: "AA" },
                      { pass: item.wcag.aaLarge, name: "AA Large" },
                      { pass: item.wcag.aaa, name: "AAA" },
                    ].map((level) => (
                      <span
                        key={level.name}
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                          level.pass
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {level.pass ? `Pass ${level.name}` : `Fail ${level.name}`}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
