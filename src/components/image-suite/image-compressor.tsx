"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui";
import { Icon } from "@/components/shared/icon";

export function ImageCompressor() {
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [compressedDataUrl, setCompressedDataUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [quality, setQuality] = useState(0.7);
  const [format, setFormat] = useState<"image/jpeg" | "image/png" | "image/webp">("image/jpeg");
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    setOriginalSize(file.size);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        setCompressedDataUrl(null);
        compress(img);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  function compress(img: HTMLImageElement) {
    setLoading(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);
    const dataUrl = canvas.toDataURL(format, quality);
    setCompressedDataUrl(dataUrl);
    const base64Length = dataUrl.split(",")[1]?.length || 0;
    setCompressedSize(Math.round(base64Length * 0.75));
    setLoading(false);
  }

  function handleQualityChange(value: number) {
    setQuality(value);
    if (originalImage) {
      compress(originalImage);
    }
  }

  function handleFormatChange(f: typeof format) {
    setFormat(f);
    if (originalImage) {
      compress(originalImage);
    }
  }

  function handleDownload() {
    if (!compressedDataUrl) return;
    const link = document.createElement("a");
    const ext = format === "image/jpeg" ? "jpg" : format === "image/png" ? "png" : "webp";
    link.download = `compressed.${ext}`;
    link.href = compressedDataUrl;
    link.click();
  }

  function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
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

  const savings = originalSize ? Math.round((1 - compressedSize / originalSize) * 100) : 0;

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
            <p className="mt-1 text-xs text-zinc-600">Supports JPEG, PNG, WebP</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <img loading="lazy" decoding="async" src={originalImage.src} alt="Original" className="h-16 w-16 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Original</p>
                <p className="text-xs text-zinc-500">
                  {originalImage.naturalWidth} x {originalImage.naturalHeight} px &middot; {formatBytes(originalSize)}
                </p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => { setOriginalImage(null); setCompressedDataUrl(null); }}>
                Remove
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="quality-slider" className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Quality: {Math.round(quality * 100)}%
                </label>
                <input
                  id="quality-slider"
                  type="range"
                  min={0.1}
                  max={1}
                  step={0.05}
                  value={quality}
                  onChange={(e) => handleQualityChange(parseFloat(e.target.value))}
                  className="w-full accent-blue-600"
                  aria-label="Compression quality"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Format</label>
                <select
                  value={format}
                  onChange={(e) => handleFormatChange(e.target.value as typeof format)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition-colors focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-blue-400"
                >
                  <option value="image/jpeg">JPEG</option>
                  <option value="image/png">PNG</option>
                  <option value="image/webp">WebP</option>
                </select>
              </div>
            </div>

            {loading && <p className="text-sm text-zinc-500">Compressing...</p>}

            {compressedDataUrl && !loading && (
              <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Compressed</p>
                    <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-50">
                      {formatBytes(compressedSize)} ({savings}% reduction)
                    </p>
                  </div>
                  <Button variant="primary" size="sm" onClick={handleDownload}>Download</Button>
                </div>
                <div className="flex items-center justify-center bg-zinc-100 p-6 dark:bg-zinc-950">
                  <img loading="lazy" decoding="async" src={compressedDataUrl} alt="Compressed" className="max-h-64 max-w-full rounded-lg shadow-lg" />
                </div>
              </div>
            )}
          </>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
