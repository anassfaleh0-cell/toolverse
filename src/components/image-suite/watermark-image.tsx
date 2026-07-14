"use client";

import { useState, useRef, useCallback } from "react";
import { Input, Button } from "@/components/ui";
import { Icon } from "@/components/shared/icon";

const POSITIONS = ["top-left", "top-right", "bottom-left", "bottom-right", "center"] as const;

export function WatermarkImage() {
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [watermarkedDataUrl, setWatermarkedDataUrl] = useState<string | null>(null);
  const [text, setText] = useState("© Nuvora");
  const [opacity, setOpacity] = useState(0.5);
  const [fontSize, setFontSize] = useState(32);
  const [position, setPosition] = useState<typeof POSITIONS[number]>("bottom-right");
  const [color, setColor] = useState("#ffffff");
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
        setWatermarkedDataUrl(null);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  function applyWatermark() {
    if (!originalImage || !text.trim()) return;
    setLoading(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = originalImage.naturalWidth;
    canvas.height = originalImage.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(originalImage, 0, 0);
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textBaseline = "middle";
    const metrics = ctx.measureText(text);
    const tw = metrics.width;
    const th = fontSize;
    const pad = 20;
    const w = canvas.width;
    const h = canvas.height;
    let x = pad;
    let y = pad + th;
    switch (position) {
      case "top-right": x = w - tw - pad; y = pad + th; break;
      case "bottom-left": x = pad; y = h - pad; break;
      case "bottom-right": x = w - tw - pad; y = h - pad; break;
      case "center": x = (w - tw) / 2; y = (h + th) / 2; break;
    }
    ctx.fillText(text, x, y);
    ctx.globalAlpha = 1;
    setWatermarkedDataUrl(canvas.toDataURL("image/png"));
    setLoading(false);
  }

  function handleDownload() {
    if (!watermarkedDataUrl) return;
    const link = document.createElement("a");
    link.download = "watermarked.png";
    link.href = watermarkedDataUrl;
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
              <Button variant="secondary" size="sm" onClick={() => { setOriginalImage(null); setWatermarkedDataUrl(null); }}>
                Remove
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Text</label>
                <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Watermark text" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Opacity</label>
                <input type="range" min={0.1} max={1} step={0.1} value={opacity} onChange={(e) => setOpacity(parseFloat(e.target.value))} className="w-full accent-blue-600" aria-label="Opacity" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Size</label>
                <input type="range" min={12} max={120} step={4} value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full accent-blue-600" aria-label="Font size" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Position</label>
                <select value={position} onChange={(e) => setPosition(e.target.value as typeof position)} className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-blue-400">
                  {POSITIONS.map((p) => <option key={p} value={p}>{p.replace("-", " ")}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Color</label>
                <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-12" />
              </div>
            </div>

            <Button onClick={applyWatermark} disabled={!originalImage || !text.trim() || loading}>
              {loading ? "Applying..." : "Apply Watermark"}
            </Button>

            {watermarkedDataUrl && !loading && (
              <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Watermarked</p>
                  <Button variant="primary" size="sm" onClick={handleDownload}>Download</Button>
                </div>
                <div className="flex items-center justify-center bg-zinc-100 p-6 dark:bg-zinc-950">
                  <img loading="lazy" decoding="async" src={watermarkedDataUrl} alt="Watermarked" className="max-h-64 max-w-full rounded-lg shadow-lg" />
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
