"use client";

import { useState, useRef, useCallback } from "react";
import { Input, Button } from "@/components/ui";

const QR_SIZE_MAP = { small: 21, medium: 33, large: 49 } as const;

function qrEncodeData(text: string): boolean[][] {
  const size = 33;
  const modules: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      modules[i][j] = false;
    }
  }

  function drawFinderPattern(row: number, col: number) {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const tr = row + r;
        const tc = col + c;
        if (tr < 0 || tr >= size || tc < 0 || tc >= size) continue;
        const isOuter = r === -1 || r === 7 || c === -1 || c === 7;
        const isCenter = (r >= 2 && r <= 4 && c >= 2 && c <= 4);
        if (isOuter || isCenter) {
          modules[tr][tc] = true;
        }
      }
    }
  }

  function drawTimingPatterns() {
    for (let i = 8; i < size - 8; i++) {
      if (i % 2 === 1) {
        modules[6][i] = true;
        modules[i][6] = true;
      }
    }
  }

  drawFinderPattern(0, 0);
  drawFinderPattern(0, size - 7);
  drawFinderPattern(size - 7, 0);
  drawTimingPatterns();

  for (let i = 0; i < size; i++) {
    modules[size - 1][i] = false;
    modules[i][size - 1] = false;
  }

  let bitIndex = 0;
  const bits: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    for (let b = 7; b >= 0; b--) {
      bits.push((code >> b) & 1);
    }
  }
  const dataBits = bits.length + 4;
  const capacity = size * size - 8 * 8 * 3 - 8 * 2 + 8;
  const needed = Math.ceil(dataBits / 8) * 8;
  for (let i = 0; i < Math.min(needed, capacity - 8); i++) {
    if (i < 4) {
      bits.unshift(0, 1, 0, 0);
    }
    if (i >= bits.length) {
      bits.push((i % 2 === 0) ? 0b11101100 : 0b00010001);
    }
  }

  let col = size - 2;
  let row = size - 2;
  let goingUp = true;

  while (col > 0) {
    if (col === 6) col--;
    for (let c = 0; c < 2; c++) {
      const cc = col - c;
      if (cc >= 0 && !modules[row][cc] && bitIndex < bits.length) {
        modules[row][cc] = bits[bitIndex++] === 1;
      }
    }
    if (goingUp) {
      row--;
      if (row < 0) { goingUp = false; col -= 2; row = 0; }
    } else {
      row++;
      if (row >= size) { goingUp = true; col -= 2; row = size - 1; }
    }
    if (col < 0) break;
  }

  return modules;
}

function renderQrCode(
  ctx: CanvasRenderingContext2D,
  modules: boolean[][],
  size: number,
  canvasSize: number,
) {
  const moduleSize = canvasSize / size;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (modules[row]?.[col]) {
        ctx.fillStyle = "#000000";
        ctx.fillRect(
          col * moduleSize,
          row * moduleSize,
          Math.ceil(moduleSize),
          Math.ceil(moduleSize),
        );
      }
    }
  }
}

export function QrCodeGenerator() {
  const [text, setText] = useState("");
  const [qrSize, setQrSize] = useState<"small" | "medium" | "large">("medium");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleGenerate = useCallback(() => {
    if (!text.trim()) return;
    const size = QR_SIZE_MAP[qrSize];
    const modules = qrEncodeData(text);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasSize = qrSize === "large" ? 600 : qrSize === "medium" ? 400 : 300;
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    renderQrCode(ctx, modules, size, canvasSize);
  }, [text, qrSize]);

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcode.png";
    a.click();
  }, []);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-3">
        <label htmlFor="qr-input" className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Text or URL to Encode
        </label>
        <Input
          id="qr-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text or URL to generate QR code..."
          aria-label="QR code data input"
        />
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Size:
          </span>
          {(["small", "medium", "large"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setQrSize(s)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                qrSize === s
                  ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-400"
                  : "border border-zinc-300 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <Button onClick={handleGenerate} variant="primary" disabled={!text.trim()}>
          Generate QR Code
        </Button>
      </div>

      <div className="mt-6">
        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              QR Code Preview
            </p>
            <Button variant="secondary" size="sm" onClick={handleDownload} disabled={!text.trim()}>
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
              height={400}
              className="max-w-full"
              aria-label="Generated QR code"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
