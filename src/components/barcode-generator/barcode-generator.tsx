"use client";

import { useState, useRef, useCallback } from "react";
import { Input, Button } from "@/components/ui";

const CODE128_PATTERNS: Record<string, string> = {
  " ": "11011001100", "!": "11001101100", "\"": "11001100110",
  "#": "10010011000", "$": "10010001100", "%": "10001001100",
  "&": "10011001000", "'": "10011000100", "(": "10001100100",
  ")": "10001100010", "*": "11001001000", "+": "11001000100",
  ",": "11000100100", "-": "10110011100", ".": "10011011100",
  "/": "10011001110", "0": "10111001100", "1": "10011101100",
  "2": "10011100110", "3": "11001110010", "4": "11001011100",
  "5": "11001001110", "6": "11011100100", "7": "11001110100",
  "8": "11101101110", "9": "11101001100", ":": "11100101100",
  ";": "11100100110", "<": "11101100100", "=": "11100110100",
  ">": "11100110010", "?": "11011011000", "@": "11011000110",
  "A": "11000110110", "B": "10100011000", "C": "10001011000",
  "D": "10001000110", "E": "10110001000", "F": "10001101000",
  "G": "10001100010", "H": "11010001000", "I": "11000101000",
  "J": "11000100010", "K": "10110111000", "L": "10110001110",
  "M": "10001101110", "N": "10111011000", "O": "10111000110",
  "P": "10001110110", "Q": "11101110110", "R": "11010001110",
  "S": "11000101110", "T": "11011101000", "U": "11011100010",
  "V": "11011101110", "W": "11101011000", "X": "11101000110",
  "Y": "11100010110", "Z": "11101101000", "[": "11101100010",
  "\\": "11100011010", "]": "11101111010", "^": "11001000010",
  "_": "11110001010", "`": "10100110000", "a": "10100001100",
  "b": "10010110000", "c": "10010000110", "d": "10000101100",
  "e": "10000100110", "f": "10110010000", "g": "10110000100",
  "h": "10011010000", "i": "10011000010", "j": "10000110100",
  "k": "10000110010", "l": "11000010010", "m": "11001010000",
  "n": "11110111010", "o": "11000010100", "p": "10001111010",
  "q": "10100111100", "r": "10010111100", "s": "10010011110",
  "t": "10111100100", "u": "10011110100", "v": "10011110010",
  "w": "11110100100", "x": "11110010100", "y": "11110010010",
  "z": "11011011110", "{": "11011110110", "|": "11110110110",
  "}": "10101111000", "~": "10100011110",
};

const START_PATTERN = "11010000100";
const STOP_PATTERN = "1100011101011";

function encodeCode128(data: string): string {
  let pattern = START_PATTERN;
  let checksum = 104;
  for (let i = 0; i < data.length; i++) {
    const ch = data[i];
    const p = CODE128_PATTERNS[ch];
    if (!p) throw new Error(`Character "${ch}" is not supported in Code 128`);
    pattern += p;
    const idx = Object.keys(CODE128_PATTERNS).indexOf(ch);
    checksum += (idx + 1) * (i + 1);
  }
  checksum = checksum % 103;
  const checkChar = Object.keys(CODE128_PATTERNS)[checksum - 1] || " ";
  if (checkChar && CODE128_PATTERNS[checkChar]) {
    pattern += CODE128_PATTERNS[checkChar];
  } else {
    pattern += CODE128_PATTERNS[" "];
  }
  pattern += STOP_PATTERN;
  return pattern;
}

function encodeEan13(data: string): string {
  const digits = data.replace(/\D/g, "").slice(0, 12).padEnd(12, "0");
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(digits[i], 10) * (i % 2 === 0 ? 1 : 3);
  }
  const check = (10 - (sum % 10)) % 10;
  const full = digits + check;
  const patterns: string[] = [];
  for (const ch of full) {
    const n = parseInt(ch, 10);
    let binary = "";
    for (let b = 0; b < 7; b++) {
      binary = ((n >> b) & 1) + binary;
    }
    patterns.push(binary);
  }
  return "101" + patterns.join("0") + "101";
}

function encodeUpcA(data: string): string {
  return encodeEan13("0" + data);
}

function renderBarcode(
  ctx: CanvasRenderingContext2D,
  pattern: string,
  width: number,
  height: number,
) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  const quietWidth = width * 0.05;
  const barWidth = (width - quietWidth * 2) / pattern.length;
  ctx.fillStyle = "#000000";
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === "1") {
      ctx.fillRect(quietWidth + i * barWidth, 0, Math.ceil(barWidth), height);
    }
  }
}

export function BarcodeGenerator() {
  const [data, setData] = useState("");
  const [format, setFormat] = useState<"code128" | "ean13" | "upca">("code128");
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleGenerate = useCallback(() => {
    setError("");
    if (!data.trim()) {
      setError("Please enter data to encode.");
      return;
    }
    try {
      let pattern: string;
      if (format === "code128") {
        pattern = encodeCode128(data);
      } else if (format === "ean13") {
        pattern = encodeEan13(data);
      } else {
        pattern = encodeUpcA(data);
      }
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = 400;
      canvas.height = 150;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      renderBarcode(ctx, pattern, canvas.width, canvas.height);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
    }
  }, [data, format]);

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `barcode-${format}.png`;
    a.click();
  }, [format]);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-3">
        <label htmlFor="barcode-input" className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Data to Encode
        </label>
        <Input
          id="barcode-input"
          value={data}
          onChange={(e) => setData(e.target.value)}
          placeholder={
            format === "code128"
              ? "Enter text for Code 128..."
              : format === "ean13"
                ? "Enter 12 digits for EAN-13..."
                : "Enter 11 digits for UPC-A..."
          }
          aria-label="Barcode data input"
        />
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Format:
          </span>
          {(["code128", "ean13", "upca"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => { setFormat(f); setError(""); }}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                format === f
                  ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                  : "border border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900"
              }`}
            >
              {f === "code128" ? "Code 128" : f === "ean13" ? "EAN-13" : "UPC-A"}
            </button>
          ))}
        </div>
        <Button onClick={handleGenerate} variant="primary" disabled={!data.trim()}>
          Generate Barcode
        </Button>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          <p className="font-mono text-sm">{error}</p>
        </div>
      )}

      <div className="mt-6">
        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Barcode Preview
            </p>
            <Button variant="secondary" size="sm" onClick={handleDownload} disabled={!data.trim()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="size-4"
                aria-hidden="true"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download PNG
            </Button>
          </div>
          <div className="flex items-center justify-center bg-white p-6 dark:bg-zinc-800">
            <canvas
              ref={canvasRef}
              width={400}
              height={150}
              className="max-w-full"
              aria-label="Generated barcode"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
