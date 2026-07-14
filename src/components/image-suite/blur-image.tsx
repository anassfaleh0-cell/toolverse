"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui";
import { Icon } from "@/components/shared/icon";

export function BlurImage() {
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [blurredDataUrl, setBlurredDataUrl] = useState<string | null>(null);
  const [radius, setRadius] = useState(5);
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        setBlurredDataUrl(null);
        applyBlur(img);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  function applyBlur(img: HTMLImageElement) {
    setLoading(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0);
    ctx.filter = `blur(${radius}px)`;
    ctx.drawImage(img, 0, 0);
    const dataUrl = canvas.toDataURL("image/png");
    setBlurredDataUrl(dataUrl);
    setLoading(false);
  }

  function handleRadiusChange(value: number) {
    setRadius(value);
    if (originalImage) applyBlur(originalImage);
  }

  function handleDownload() {
    if (!blurredDataUrl) return;
    const link = document.createElement("a");
    link.download = "blurred.png";
    link.href = blurredDataUrl;
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
            <Icon name="Upload" className="mb-3 size-10 text-zinc-400" />
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
              <Button variant="secondary" size="sm" onClick={() => { setOriginalImage(null); setBlurredDataUrl(null); }}>
                Remove
              </Button>
            </div>

            <div>
              <label htmlFor="blur-radius" className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Blur Radius: {radius}px
              </label>
              <input
                id="blur-radius"
                type="range"
                min={1}
                max={20}
                step={1}
                value={radius}
                onChange={(e) => handleRadiusChange(parseInt(e.target.value))}
                className="w-full accent-blue-600"
                aria-label="Blur radius"
              />
            </div>

            {loading && <p className="text-sm text-zinc-500">Applying blur...</p>}

            {blurredDataUrl && !loading && (
              <>
                <div className="flex items-center gap-2">
                  <Button
                    variant={showOriginal ? "primary" : "secondary"}
                    size="sm"
                    onMouseDown={() => setShowOriginal(true)}
                    onMouseUp={() => setShowOriginal(false)}
                    onMouseLeave={() => setShowOriginal(false)}
                    onTouchStart={() => setShowOriginal(true)}
                    onTouchEnd={() => setShowOriginal(false)}
                  >
                    Hold to see original
                  </Button>
                </div>
                <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Blurred</p>
                    <Button variant="primary" size="sm" onClick={handleDownload}>Download</Button>
                  </div>
                  <div className="flex items-center justify-center bg-zinc-100 p-6 dark:bg-zinc-950">
                    <canvas
                      ref={displayCanvasRef}
                      className="max-h-64 max-w-full rounded-lg shadow-lg"
                      style={{ display: showOriginal ? "none" : "block" }}
                    />
                    {showOriginal ? (
                      <img loading="lazy" decoding="async" src={originalImage.src} alt="Original" className="max-h-64 max-w-full rounded-lg shadow-lg" />
                    ) : (
                      <img loading="lazy" decoding="async" src={blurredDataUrl} alt="Blurred" className="max-h-64 max-w-full rounded-lg shadow-lg" />
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
