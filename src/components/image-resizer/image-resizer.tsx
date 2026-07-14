"use client";

import { useState, useRef, useCallback } from "react";
import { Input, Button } from "@/components/ui";
import { Icon } from "@/components/shared/icon";

interface Dimensions {
  width: number;
  height: number;
}

export function ImageResizer() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<Dimensions | null>(null);
  const [targetWidth, setTargetWidth] = useState(400);
  const [targetHeight, setTargetHeight] = useState(300);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [resizedDataUrl, setResizedDataUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [outputFormat, setOutputFormat] = useState<"image/png" | "image/jpeg" | "image/webp">("image/png");

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        setOriginalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
        setTargetWidth(img.naturalWidth);
        setTargetHeight(img.naturalHeight);
        setResizedDataUrl(null);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  function handleWidthChange(value: string) {
    const w = parseInt(value) || 1;
    setTargetWidth(w);
    if (maintainAspect && originalDimensions) {
      setTargetHeight(Math.round(w * (originalDimensions.height / originalDimensions.width)));
    }
  }

  function handleHeightChange(value: string) {
    const h = parseInt(value) || 1;
    setTargetHeight(h);
    if (maintainAspect && originalDimensions) {
      setTargetWidth(Math.round(h * (originalDimensions.width / originalDimensions.height)));
    }
  }

  function handleResize() {
    if (!originalImage) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(originalImage, 0, 0, targetWidth, targetHeight);
    setResizedDataUrl(canvas.toDataURL(outputFormat, 0.92));
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

  function handleDownload() {
    if (!resizedDataUrl) return;
    const link = document.createElement("a");
    const ext = outputFormat === "image/png" ? "png" : outputFormat === "image/jpeg" ? "jpg" : "webp";
    link.download = `resized-image.${ext}`;
    link.href = resizedDataUrl;
    link.click();
  }

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
            <Icon name="Upload" className="mb-3 size-10 text-zinc-400" />
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              {isDragOver ? "Drop your image here" : "Drop an image or click to upload"}
            </p>
            <p className="mt-1 text-xs text-zinc-400">Supports PNG, JPEG, WebP, GIF</p>
          </div>
        ) : (
          <div className="flex items-center gap-4 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
            <img
              src={originalImage?.src}
              alt="Original"
              loading="lazy"
              decoding="async"
              className="h-20 w-20 rounded-lg object-cover"
            />
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Original</p>
              <p className="text-xs text-zinc-500">
                {originalDimensions?.width} × {originalDimensions?.height} px
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="ml-auto"
              onClick={() => {
                setOriginalImage(null);
                setOriginalDimensions(null);
                setResizedDataUrl(null);
              }}
            >
              Remove
            </Button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <label htmlFor="resize-width" className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Width (px)
            </label>
            <Input
              id="resize-width"
              type="number"
              min={1}
              value={targetWidth}
              onChange={(e) => handleWidthChange(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="resize-height" className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Height (px)
            </label>
            <Input
              id="resize-height"
              type="number"
              min={1}
              value={targetHeight}
              onChange={(e) => handleHeightChange(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Format</label>
            <select
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value as typeof outputFormat)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition-colors focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-blue-400"
            >
              <option value="image/png">PNG</option>
              <option value="image/jpeg">JPEG</option>
              <option value="image/webp">WebP</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800">
              <input
                type="checkbox"
                checked={maintainAspect}
                onChange={(e) => setMaintainAspect(e.target.checked)}
                className="size-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600"
              />
              Lock Ratio
            </label>
          </div>
        </div>

        <Button onClick={handleResize} disabled={!originalImage}>
          Resize Image
        </Button>

        {resizedDataUrl && (
          <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Resized {targetWidth} × {targetHeight} px
              </p>
              <Button variant="primary" size="sm" onClick={handleDownload}>
                Download
              </Button>
            </div>
            <div className="flex items-center justify-center bg-zinc-100 p-6 dark:bg-zinc-950">
              <img
                src={resizedDataUrl}
                alt="Resized"
                loading="lazy"
                decoding="async"
                className="max-h-96 max-w-full rounded-lg shadow-lg"
              />
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
