"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui";

type ChromaKey = "green" | "blue";

const CHROMA_COLORS = {
  green: { r: 0, g: 255, b: 0 },
  blue: { r: 0, g: 0, b: 255 },
};

export function BackgroundRemover() {
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [resultDataUrl, setResultDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [chromaKey, setChromaKey] = useState<ChromaKey>("green");
  const [tolerance, setTolerance] = useState(100);
  const [showApiArchitecture, setShowApiArchitecture] = useState(false);
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
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  function removeBackground() {
    if (!originalImage) return;
    setLoading(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = originalImage.naturalWidth;
    canvas.height = originalImage.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(originalImage, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const key = CHROMA_COLORS[chromaKey];

    for (let i = 0; i < data.length; i += 4) {
      const dr = data[i] - key.r;
      const dg = data[i + 1] - key.g;
      const db = data[i + 2] - key.b;
      const dist = Math.sqrt(dr * dr + dg * dg + db * db);
      if (dist < tolerance) {
        data[i + 3] = 0;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    setResultDataUrl(canvas.toDataURL("image/png"));
    setLoading(false);
  }

  function handleDownload() {
    if (!resultDataUrl) return;
    const link = document.createElement("a");
    link.download = "no-background.png";
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="mb-3 size-10 text-zinc-400">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Drop an image or click to upload</p>
            <p className="mt-1 text-xs text-zinc-400">Best results with green or blue screen background</p>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Chroma Key</label>
                <select value={chromaKey} onChange={(e) => setChromaKey(e.target.value as ChromaKey)} className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:ring-blue-400">
                  <option value="green">Green Screen</option>
                  <option value="blue">Blue Screen</option>
                </select>
              </div>
              <div>
                <label htmlFor="tolerance" className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Tolerance: {tolerance}</label>
                <input id="tolerance" type="range" min={10} max={200} step={5} value={tolerance} onChange={(e) => setTolerance(parseInt(e.target.value))} className="w-full accent-blue-600" aria-label="Color tolerance" />
              </div>
            </div>

            <Button onClick={removeBackground} disabled={!originalImage || loading}>
              {loading ? "Processing..." : "Remove Background"}
            </Button>

            {resultDataUrl && !loading && (
              <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Result (transparent background)</p>
                  <Button variant="primary" size="sm" onClick={handleDownload}>Download</Button>
                </div>
                <div className="flex items-center justify-center bg-zinc-100 p-6 dark:bg-zinc-950">
                  <div className="rounded-lg shadow-lg" style={{ backgroundImage: "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)", backgroundSize: "20px 20px", backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px" }}>
                    <img loading="lazy" decoding="async" src={resultDataUrl} alt="Background removed" className="max-h-64 max-w-full" />
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
              <button type="button" onClick={() => setShowApiArchitecture(!showApiArchitecture)} className="flex w-full items-center justify-between text-sm font-medium text-amber-800 dark:text-amber-200">
                <span>Architecture Note: Integrating AI Background Removal APIs</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={`size-4 transition-transform ${showApiArchitecture ? "rotate-180" : ""}`}>
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {showApiArchitecture && (
                <div className="mt-3 space-y-2 text-sm text-amber-700 dark:text-amber-300">
                  <p>This demo uses chroma key (green/blue screen) removal via Canvas pixel manipulation. For real-world background removal without a chroma key screen, integrate an AI service:</p>
                  <pre className="overflow-x-auto rounded-lg bg-amber-100 p-3 text-xs dark:bg-amber-900">
{`// Example: Remove.bg API integration
async function removeBgWithAPI(file: File, apiKey: string) {
  const form = new FormData();
  form.append("image_file", file);
  form.append("size", "auto");
  const res = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: { "X-Api-Key": apiKey },
    body: form,
  });
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

// Alternative: rembg (self-hosted)
// $ pip install rembg
// $ rembg i input.jpg output.png

// Alternative: @imgly/background-removal (client-side WASM)
// import { removeBackground } from "@imgly/background-removal";
// const blob = await removeBackground(imageSrc);`}
                  </pre>
                </div>
              )}
            </div>
          </>
        )}

        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
