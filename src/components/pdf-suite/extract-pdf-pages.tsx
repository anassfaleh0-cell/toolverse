"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui";

export function ExtractPdfPages() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
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
      setSelected([]);
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

  function togglePage(page: number) {
    setSelected((prev) =>
      prev.includes(page) ? prev.filter((p) => p !== page) : [...prev, page],
    );
    setResult(null);
  }

  async function handleExtract() {
    if (!file || selected.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const arrayBuffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();
      const indices = selected.map((p) => p - 1);
      const copiedPages = await newPdf.copyPages(sourcePdf, indices);
      copiedPages.forEach((page) => newPdf.addPage(page));
      const pdfBytes = await newPdf.save();
      setResult(pdfBytes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to extract pages");
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
    const label = selected.length === 1 ? `page-${selected[0]}` : `${selected.length}-pages`;
    link.download = `extracted-${label}.pdf`;
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
          aria-label="Upload a PDF to extract pages"
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 p-12 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500"
        >
          <svg className="mb-3 size-10 text-zinc-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Drop a PDF here or click to upload</p>
        </div>
        <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} aria-label="Select PDF to extract pages from" />
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

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Select pages to extract:</p>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => setSelected(Array.from({ length: pageCount }, (_, i) => i + 1))}>All</Button>
          <Button variant="ghost" size="sm" onClick={() => setSelected([])}>None</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: pageCount }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => togglePage(i + 1)}
            aria-label={`Select page ${i + 1}`}
            className={`flex items-center justify-between rounded-lg border-2 p-4 transition-colors ${
              selected.includes(i + 1)
                ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/20"
                : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-500"
            }`}
          >
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Page {i + 1}</span>
            <span className={`flex size-6 items-center justify-center rounded-full text-xs font-bold ${
              selected.includes(i + 1)
                ? "bg-blue-500 text-white"
                : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800"
            }`}>
              {selected.includes(i + 1) ? "âœ“" : ""}
            </span>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-500">{selected.length} of {pageCount} pages selected</span>
        {!result && (
          <Button onClick={handleExtract} disabled={loading || selected.length === 0}>
            {loading ? "Extracting..." : "Extract Selected Pages"}
          </Button>
        )}
      </div>

      {result && (
        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Extracted PDF Ready</p>
            <Button variant="primary" size="sm" onClick={handleDownload}>Download</Button>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/20 dark:text-red-400">{error}</div>
      )}
    </div>
  );
}
