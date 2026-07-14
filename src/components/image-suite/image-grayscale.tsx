"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui";
import { Icon } from "@/components/shared/icon";

type Effect = "grayscale" | "sepia";

function applyEffect(ctx: CanvasRenderingContext2D, w: number, h: number, effect: Effect) {
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (effect === "grayscale") {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
    } else {
      data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
      data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
      data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

export function ImageGrayscale() {
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [resultDataUrl, setResultDataUrl] = useState<string | null>(null);
  const [effect, setEffect] = useState<Effect>("grayscale");
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        setResultDataUrl(null);
        process(img, effect);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  function process(img: HTMLImageElement, eff: Effect) {
    setLoading(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);
    applyEffect(ctx, canvas.width, canvas.height, eff);
    setResultDataUrl(canvas.toDataURL("image/png"));
    setLoading(false);
  }

  function handleEffectChange(eff: Effect) {
    setEffect(eff);
    if (originalImage) process(originalImage, eff);
  }

  function handleDownload() {
    if (!resultDataUrl) return;
    const link = document.createElement("a");
    link.download = `${effect}.png`;
    link.href = resultDataUrl;
    link.click();
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-5">
        {!originalImage ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors ${
              isDragOver
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                : "border-zinc-300 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500"
            }`}
          >
            <Icon name="Upload" className="mb-3 size-10 text-zinc-600" />
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Drop an image or click to upload</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <img loading="lazy" decoding="async" src={originalImage.src} alt="Original" className="h-16 w-16 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Original</p>
                <p className="text-xs text-zinc-500">{originalImage.naturalWidth} x {originalImage.naturalHeight} px</p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => { setOriginalImage(null); setResultDataUrl(null); }}>
                Remove
              </Button>
            </div>

            <div className="flex gap-2">
              {(["grayscale", "sepia"] as const).map((eff) => (
                <button
                  key={eff}
                  type="button"
                  onClick={() => handleEffectChange(eff)}
                  className={`rounded-lg border px-6 py-3 text-sm font-medium capitalize transition-colors ${
                    effect === eff
                      ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                      : "border-zinc-300 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }`}
                >
                  {eff}
                </button>
              ))}
            </div>

            {loading && <p className="text-sm text-zinc-500">Processing...</p>}

            {resultDataUrl && !loading && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onMouseDown={() => setShowOriginal(true)}
                  onMouseUp={() => setShowOriginal(false)}
                  onMouseLeave={() => setShowOriginal(false)}
                  onTouchStart={() => setShowOriginal(true)}
                  onTouchEnd={() => setShowOriginal(false)}
                >
                  Hold to see original
                </Button>

                <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400 capitalize">{effect}</p>
                    <Button variant="primary" size="sm" onClick={handleDownload}>Download</Button>
                  </div>
                  <div className="flex items-center justify-center bg-zinc-100 p-6 dark:bg-zinc-950">
                    {showOriginal ? (
                      <img loading="lazy" decoding="async" src={originalImage.src} alt="Original" className="max-h-64 max-w-full rounded-lg shadow-lg" />
                    ) : (
                      <img loading="lazy" decoding="async" src={resultDataUrl} alt={effect} className="max-h-64 max-w-full rounded-lg shadow-lg" />
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        )}

        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
