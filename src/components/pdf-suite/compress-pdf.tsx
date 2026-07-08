"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui";

export function CompressPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [compressedSize, setCompressedSize] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleLoad(f: File) {
    setFile(f);
    setOriginalSize(f.size);
    setResult(null);
    setError(null);
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

  async function handleCompress() {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);

      const pdfBytes = await pdf.save({ useObjectStreams: true });
      setResult(pdfBytes);
      setCompressedSize(pdfBytes.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to compress PDF");
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
    link.download = `compressed-${file?.name || "output.pdf"}`;
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
          aria-label="Upload a PDF to compress"
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 p-12 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500"
        >
          <svg className="mb-3 size-10 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M12 1.5v12m0 0l-3-3m3 3l3-3" /></svg>
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Drop a PDF here or click to upload</p>
        </div>
        <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} aria-label="Select PDF to compress" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
        <svg className="size-5 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{file.name}</span>
        <span className="text-xs text-zinc-500">({(file.size / 1024).toFixed(1)} KB)</span>
        <Button variant="secondary" size="sm" className="ml-auto" onClick={() => { setFile(null); setResult(null); }}>Change File</Button>
      </div>

      {!result && (
        <Button onClick={handleCompress} disabled={loading}>
          {loading ? "Compressing..." : "Compress PDF"}
        </Button>
      )}

      {result && (
        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Compressed PDF Ready</p>
            <Button variant="primary" size="sm" onClick={handleDownload}>Download</Button>
          </div>
          <div className="space-y-2 p-4 text-sm">
            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
              <span>Original size:</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-50">{(originalSize / 1024).toFixed(1)} KB</span>
            </div>
            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
              <span>Compressed size:</span>
              <span className="font-medium text-green-600 dark:text-green-400">{(compressedSize / 1024).toFixed(1)} KB</span>
            </div>
            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
              <span>Reduction:</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                {originalSize > 0 ? `${((1 - compressedSize / originalSize) * 100).toFixed(1)}%` : "—"}
              </span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400">{error}</div>
      )}
    </div>
  );
}
