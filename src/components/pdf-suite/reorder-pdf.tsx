"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui";

export function ReorderPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [order, setOrder] = useState<number[]>([]);
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
      setOrder(Array.from({ length: count }, (_, i) => i));
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

  function movePage(index: number, direction: "up" | "down") {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= order.length) return;
    setOrder((prev) => {
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setResult(null);
  }

  async function handleReorder() {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const arrayBuffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(sourcePdf, order);
      copiedPages.forEach((page) => newPdf.addPage(page));
      const pdfBytes = await newPdf.save();
      setResult(pdfBytes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reorder PDF");
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
    link.download = `reordered-${file?.name || "output.pdf"}`;
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
          aria-label="Upload a PDF to reorder pages"
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 p-12 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500"
        >
          <svg className="mb-3 size-10 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" /></svg>
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Drop a PDF here or click to upload</p>
        </div>
        <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} aria-label="Select PDF to reorder" />
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

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {order.map((pageIndex, pos) => (
          <div key={pos} className="space-y-2 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Page {pageIndex + 1}</span>
              <span className="text-xs text-zinc-400">#{pos + 1}</span>
            </div>
            <div className="flex items-center justify-center rounded bg-zinc-50 py-4 dark:bg-zinc-900">
              <svg className="size-10 text-zinc-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
            </div>
            <div className="flex justify-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => movePage(pos, "up")} disabled={pos === 0} aria-label="Move page up">↑</Button>
              <Button variant="ghost" size="sm" onClick={() => movePage(pos, "down")} disabled={pos === order.length - 1} aria-label="Move page down">↓</Button>
            </div>
          </div>
        ))}
      </div>

      {!result && (
        <Button onClick={handleReorder} disabled={loading}>
          {loading ? "Reordering..." : "Apply New Order & Download"}
        </Button>
      )}

      {result && (
        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Reordered PDF Ready</p>
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
