"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui";

export function RotatePdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [rotations, setRotations] = useState<number[]>([]);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleLoad(f: File) {
    setFile(f);
    setResult(null);
    setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const arrayBuffer = await f.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const count = pdf.getPageCount();
      setPageCount(count);
      setRotations(new Array(count).fill(0));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load PDF");
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) handleLoad(f);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f?.type === "application/pdf") handleLoad(f);
  }

  function rotatePage(index: number) {
    setRotations((prev) => {
      const next = [...prev];
      next[index] = (next[index] + 90) % 360;
      return next;
    });
    setResult(null);
  }

  function rotateAll(angle: number) {
    setRotations(new Array(pageCount).fill(angle));
    setResult(null);
  }

  async function handleApply() {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const { PDFDocument, degrees } = await import("pdf-lib");
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pages = pdf.getPages();
      for (let i = 0; i < pages.length; i++) {
        const angle = rotations[i] || 0;
        if (angle !== 0) {
          pages[i].setRotation(degrees(angle));
        }
      }
      const pdfBytes = await pdf.save();
      setResult(pdfBytes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to rotate PDF");
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
    link.download = `rotated-${file?.name || "output.pdf"}`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (!file) {
    return (
      <div className="mx-auto max-w-3xl">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
          aria-label="Upload a PDF to rotate"
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 p-12 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500"
        >
          <svg className="mb-3 size-10 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" /></svg>
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Drop a PDF here or click to upload</p>
        </div>
        <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} aria-label="Select PDF to rotate" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{file.name}</span>
        <span className="text-xs text-zinc-500">{pageCount} pages</span>
        <Button variant="secondary" size="sm" className="ml-auto" onClick={() => { setFile(null); setResult(null); }}>Change File</Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">Rotate all:</span>
        <Button variant="secondary" size="sm" onClick={() => rotateAll(90)}>90°</Button>
        <Button variant="secondary" size="sm" onClick={() => rotateAll(180)}>180°</Button>
        <Button variant="secondary" size="sm" onClick={() => rotateAll(270)}>270°</Button>
        <Button variant="ghost" size="sm" onClick={() => rotateAll(0)}>Reset</Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {Array.from({ length: pageCount }, (_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900">
              <svg className={`size-16 text-zinc-400 transition-transform`} style={{ transform: `rotate(${rotations[i] || 0}deg)` }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">Page {i + 1}</span>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => rotatePage(i)} aria-label={`Rotate page ${i + 1}`}>
                  <svg className="size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" /></svg>
                </Button>
                <span className="text-xs text-zinc-400">{rotations[i]}°</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!result && (
        <Button onClick={handleApply} disabled={loading}>
          {loading ? "Applying Rotation..." : "Apply Rotation & Download"}
        </Button>
      )}

      {result && (
        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Rotated PDF Ready</p>
            <Button variant="primary" size="sm" onClick={handleDownload}>Download</Button>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400">{error}</div>
      )}
    </div>
  );
}
