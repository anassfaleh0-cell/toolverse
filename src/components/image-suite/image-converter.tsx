"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui";
import { Icon } from "@/components/shared/icon";

const FORMATS = [
  { mime: "image/png", ext: "png", label: "PNG" },
  { mime: "image/jpeg", ext: "jpg", label: "JPEG" },
  { mime: "image/webp", ext: "webp", label: "WebP" },
  { mime: "image/gif", ext: "gif", label: "GIF" },
  { mime: "image/bmp", ext: "bmp", label: "BMP" },
] as const;

export function ImageConverter() {
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [convertedDataUrl, setConvertedDataUrl] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<string>("image/png");
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        setConvertedDataUrl(null);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  function handleConvert() {
    if (!originalImage) return;
    setLoading(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = originalImage.naturalWidth;
    canvas.height = originalImage.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(originalImage, 0, 0);
    const dataUrl = canvas.toDataURL(outputFormat, 0.92);
    setConvertedDataUrl(dataUrl);
    setLoading(false);
  }

  function handleDownload() {
    if (!convertedDataUrl) return;
    const link = document.createElement("a");
    const fmt = FORMATS.find((f) => f.mime === outputFormat);
    link.download = `converted.${fmt?.ext || "png"}`;
    link.href = convertedDataUrl;
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
            <p className="mt-1 text-xs text-zinc-600">Supports PNG, JPEG, WebP, GIF, BMP</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <img loading="lazy" decoding="async" src={originalImage.src} alt="Original" className="h-16 w-16 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Original</p>
                <p className="text-xs text-zinc-500">{originalImage.naturalWidth} x {originalImage.naturalHeight} px</p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => { setOriginalImage(null); setConvertedDataUrl(null); }}>
                Remove
              </Button>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Convert to</label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition-colors focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-blue-400"
              >
                {FORMATS.map((f) => (
                  <option key={f.mime} value={f.mime}>{f.label} (.{f.ext})</option>
                ))}
              </select>
            </div>

            <Button onClick={handleConvert} disabled={!originalImage || loading}>
              {loading ? "Converting..." : "Convert Image"}
            </Button>

            {convertedDataUrl && !loading && (
              <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Converted</p>
                  <Button variant="primary" size="sm" onClick={handleDownload}>Download</Button>
                </div>
                <div className="flex items-center justify-center bg-zinc-100 p-6 dark:bg-zinc-950">
                  <img loading="lazy" decoding="async" src={convertedDataUrl} alt="Converted" className="max-h-64 max-w-full rounded-lg shadow-lg" />
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
