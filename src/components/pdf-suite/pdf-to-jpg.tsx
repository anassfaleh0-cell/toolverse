"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui";

export function PdfToJpg() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleLoad(f: File) {
    setFile(f);
    setPreviews([]);
    setSelectedPages([]);
    setError(null);
    setLoading(true);
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
      const arrayBuffer = await f.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setPageCount(pdf.numPages);
      const urls: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.3 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvas: canvas, viewport }).promise;
        urls.push(canvas.toDataURL("image/jpeg", 0.7));
      }
      setPreviews(urls);
      setSelectedPages(Array.from({ length: pdf.numPages }, (_, i) => i + 1));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load PDF");
    } finally {
      setLoading(false);
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
    setSelectedPages((prev) =>
      prev.includes(page) ? prev.filter((p) => p !== page) : [...prev, page],
    );
  }

  async function handleConvert() {
    if (!file || selectedPages.length === 0) return;
    setConverting(true);
    setError(null);
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      if (selectedPages.length === 1) {
        const page = await pdf.getPage(selectedPages[0]);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvas: canvas, viewport }).promise;
        const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.92));
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `page-${selectedPages[0]}.jpg`;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        const JSZip = (await import("jszip")).default;
        const zip = new JSZip();
        for (const pageNum of selectedPages) {
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
        await page.render({ canvas: canvas, viewport }).promise;
          const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.92));
          const buffer = await blob.arrayBuffer();
          zip.file(`page-${pageNum}.jpg`, new Uint8Array(buffer));
        }
        const zipBlob = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(zipBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${file.name.replace(/\.pdf$/i, "")}-images.zip`;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to convert PDF to JPG");
    } finally {
      setConverting(false);
    }
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
          aria-label="Upload a PDF to convert to JPG"
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 p-12 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500"
        >
          <svg className="mb-3 size-10 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Drop a PDF here or click to upload</p>
        </div>
        <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} aria-label="Select PDF to convert" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{file.name}</span>
        <span className="text-xs text-zinc-500">{pageCount} pages</span>
        <Button variant="secondary" size="sm" className="ml-auto" onClick={() => { setFile(null); setPreviews([]); }}>Change File</Button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8 text-sm text-zinc-500">Loading previews...</div>
      )}

      {previews.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Select pages to convert:</p>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setSelectedPages(Array.from({ length: pageCount }, (_, i) => i + 1))}>All</Button>
              <Button variant="ghost" size="sm" onClick={() => setSelectedPages([])}>None</Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {previews.map((dataUrl, i) => (
              <div key={i} className="space-y-2">
                <button
                  type="button"
                  onClick={() => togglePage(i + 1)}
                  aria-label={`Select page ${i + 1}`}
                  className={`w-full overflow-hidden rounded-lg border-2 transition-colors ${
                    selectedPages.includes(i + 1)
                      ? "border-blue-500 ring-2 ring-blue-500/30"
                      : "border-zinc-200 dark:border-zinc-700"
                  }`}
                >
                  <img loading="lazy" decoding="async" src={dataUrl} alt={`Page ${i + 1} preview`} className="w-full" />
                </button>
                <p className="text-center text-xs text-zinc-500">Page {i + 1}</p>
              </div>
            ))}
          </div>

          <Button onClick={handleConvert} disabled={converting || selectedPages.length === 0}>
            {converting ? "Converting..." : `Convert ${selectedPages.length} Page${selectedPages.length > 1 ? "s" : ""} to JPG`}
          </Button>
        </>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400">{error}</div>
      )}
    </div>
  );
}
