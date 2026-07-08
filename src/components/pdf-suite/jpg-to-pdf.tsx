"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui";

export function JpgToPdf() {
  const [images, setImages] = useState<{ file: File; dataUrl: string }[]>([]);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(e.target.files || []);
    setResult(null);
    setError(null);
    const newImages: { file: File; dataUrl: string }[] = [];
    for (const f of selectedFiles) {
      const dataUrl = await readFileAsDataUrl(f);
      newImages.push({ file: f, dataUrl });
    }
    setImages((prev) => [...prev, ...newImages]);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter((f) =>
      ["image/jpeg", "image/png", "image/webp"].includes(f.type),
    );
    if (droppedFiles.length > 0) {
      setResult(null);
      setError(null);
      Promise.all(droppedFiles.map(async (f) => ({ file: f, dataUrl: await readFileAsDataUrl(f) }))).then((items) => {
        setImages((prev) => [...prev, ...items]);
      });
    }
  }

  function moveImage(index: number, direction: "up" | "down") {
    setImages((prev) => {
      const arr = [...prev];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= arr.length) return arr;
      [arr[index], arr[target]] = [arr[target], arr[index]];
      return arr;
    });
    setResult(null);
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setResult(null);
  }

  async function handleConvert() {
    if (images.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const pdfDoc = await PDFDocument.create();
      for (const { file } of images) {
        const arrayBuffer = await file.arrayBuffer();
        const ext = file.type;
        if (ext === "image/png") {
          const pngImage = await pdfDoc.embedPng(arrayBuffer);
          const page = pdfDoc.addPage([pngImage.width, pngImage.height]);
          page.drawImage(pngImage, { x: 0, y: 0, width: pngImage.width, height: pngImage.height });
        } else {
          const jpgImage = await pdfDoc.embedJpg(arrayBuffer);
          const page = pdfDoc.addPage([jpgImage.width, jpgImage.height]);
          page.drawImage(jpgImage, { x: 0, y: 0, width: jpgImage.width, height: jpgImage.height });
        }
      }
      const pdfBytes = await pdfDoc.save();
      setResult(pdfBytes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to convert images to PDF");
    } finally {
      setLoading(false);
    }
  }

  function handleDownload() {
    if (!result) return;
    const blob = new Blob([result.slice(0)], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "converted.pdf";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-3xl">
      {images.length === 0 && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
          aria-label="Upload images to convert to PDF"
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 p-12 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500"
        >
          <svg className="mb-3 size-10 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Drop JPG or PNG images here or click to upload</p>
          <p className="mt-1 text-xs text-zinc-400">Supports JPG, PNG, and WebP</p>
        </div>
      )}
      <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} aria-label="Select images to convert" />

      {images.length > 0 && (
        <div className="space-y-3">
          {images.map((img, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
              <img loading="lazy" decoding="async" src={img.dataUrl} alt={img.file.name} className="size-12 rounded object-cover" />
              <span className="flex-1 truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">{img.file.name}</span>
              <span className="text-xs text-zinc-500">({(img.file.size / 1024).toFixed(1)} KB)</span>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => moveImage(i, "up")} disabled={i === 0} aria-label="Move up">↑</Button>
                <Button variant="ghost" size="sm" onClick={() => moveImage(i, "down")} disabled={i === images.length - 1} aria-label="Move down">↓</Button>
                <Button variant="secondary" size="sm" onClick={() => removeImage(i)} aria-label={`Remove ${img.file.name}`}>Remove</Button>
              </div>
            </div>
          ))}
          <div className="flex gap-3">
            <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>Add More</Button>
            <Button onClick={handleConvert} disabled={loading || images.length === 0}>
              {loading ? "Converting..." : `Convert ${images.length} Image${images.length > 1 ? "s" : ""} to PDF`}
            </Button>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">PDF Ready</p>
            <Button variant="primary" size="sm" onClick={handleDownload}>Download</Button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400">{error}</div>
      )}
    </div>
  );
}
