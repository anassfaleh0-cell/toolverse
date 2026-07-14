"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui";
import { Icon } from "@/components/shared/icon";

const ASPECT_RATIOS = [
  { label: "Free", value: 0 },
  { label: "1:1 Square", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "16:9", value: 16 / 9 },
  { label: "3:2", value: 3 / 2 },
] as const;

interface CropRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function CropImage() {
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [croppedDataUrl, setCroppedDataUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(0);
  const [crop, setCrop] = useState<CropRect>({ x: 0, y: 0, w: 100, h: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [displaySize, setDisplaySize] = useState({ w: 400, h: 300 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        setCroppedDataUrl(null);
        const maxW = 600;
        const scale = Math.min(maxW / img.naturalWidth, 1);
        const dw = Math.round(img.naturalWidth * scale);
        const dh = Math.round(img.naturalHeight * scale);
        setDisplaySize({ w: dw, h: dh });
        setCrop({ x: 0, y: 0, w: dw, h: dh });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  function getMousePos(e: React.MouseEvent) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: Math.max(0, Math.min(e.clientX - rect.left, displaySize.w)),
      y: Math.max(0, Math.min(e.clientY - rect.top, displaySize.h)),
    };
  }

  function handleMouseDown(e: React.MouseEvent) {
    if (!originalImage) return;
    const pos = getMousePos(e);
    setIsDragging(true);
    setDragStart(pos);
    setCrop({ x: pos.x, y: pos.y, w: 0, h: 0 });
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!isDragging) return;
    const pos = getMousePos(e);
    const x = Math.min(dragStart.x, pos.x);
    const y = Math.min(dragStart.y, pos.y);
    let w = Math.abs(pos.x - dragStart.x);
    let h = Math.abs(pos.y - dragStart.y);
    if (aspectRatio > 0) {
      h = w / aspectRatio;
      if (y + h > displaySize.h) {
        h = displaySize.h - y;
        w = h * aspectRatio;
      }
    }
    setCrop({ x, y, w, h });
  }

  function handleMouseUp() {
    setIsDragging(false);
  }

  function handleCropAction() {
    if (!originalImage) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const scaleX = originalImage.naturalWidth / displaySize.w;
    const scaleY = originalImage.naturalHeight / displaySize.h;
    const sx = Math.round(crop.x * scaleX);
    const sy = Math.round(crop.y * scaleY);
    const sw = Math.round(crop.w * scaleX);
    const sh = Math.round(crop.h * scaleY);
    if (sw < 1 || sh < 1) return;
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(originalImage, sx, sy, sw, sh, 0, 0, sw, sh);
    setCroppedDataUrl(canvas.toDataURL("image/png"));
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

  useEffect(() => {
    if (!isDragging) return;
    const handleUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleUp);
    return () => window.removeEventListener("mouseup", handleUp);
  }, [isDragging]);

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
              <Button variant="secondary" size="sm" onClick={() => { setOriginalImage(null); setCroppedDataUrl(null); }}>
                Remove
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {ASPECT_RATIOS.map((ar) => (
                <button
                  key={ar.value}
                  type="button"
                  onClick={() => setAspectRatio(ar.value)}
                  className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                    aspectRatio === ar.value
                      ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                      : "border-zinc-300 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }`}
                >
                  {ar.label}
                </button>
              ))}
            </div>

            <div
              ref={containerRef}
              className="relative mx-auto cursor-crosshair overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800"
              style={{ width: displaySize.w, height: displaySize.h }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              <img loading="lazy" decoding="async" ref={imageRef} src={originalImage.src} alt="To crop" className="absolute left-0 top-0" style={{ width: displaySize.w, height: displaySize.h }} draggable={false} />
              {crop.w > 0 && crop.h > 0 && (
                <div
                  className="absolute border-2 border-blue-500 bg-blue-500/10"
                  style={{ left: crop.x, top: crop.y, width: crop.w, height: crop.h }}
                />
              )}
            </div>

            <div className="flex gap-4">
              <Button onClick={handleCropAction} disabled={crop.w < 2 || crop.h < 2}>Crop Image</Button>
            </div>

            {croppedDataUrl && (
              <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Cropped</p>
                  <Button variant="primary" size="sm" onClick={() => { const a = document.createElement("a"); a.download = "cropped.png"; a.href = croppedDataUrl; a.click(); }}>
                    Download
                  </Button>
                </div>
                <div className="flex items-center justify-center bg-zinc-100 p-6 dark:bg-zinc-950">
                  <img loading="lazy" decoding="async" src={croppedDataUrl} alt="Cropped" className="max-h-64 max-w-full rounded-lg shadow-lg" />
                </div>
              </div>
            )}
          </>
        )}

        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
