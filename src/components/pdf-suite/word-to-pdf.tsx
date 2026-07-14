"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { PdfToolShell, ProgressBar } from "./pdf-tool-shell";

export function WordToPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [result, setResult] = useState<Uint8Array | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function convertDocx(f: File) {
    setFile(f);
    setResult(null);
    setPreviews([]);
    setError(null);
    setLoading(true);
    setProgress(0);

    try {
      setProgress(10);
      const mammoth = await import("mammoth");
      const arrayBuffer = await f.arrayBuffer();

      setProgress(30);
      const resultHtml = await mammoth.convertToHtml({ arrayBuffer });
      const html = resultHtml.value;

      setProgress(50);
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;
      const textContent = tempDiv.textContent || tempDiv.innerText || "";
      const paragraphs = textContent
        .split("\n")
        .filter((p) => p.trim().length > 0);

      setProgress(70);
      const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");
      const pdfDoc = await PDFDocument.create();

      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const pageSize: [number, number] = [612, 792];
      const margin = 72;
      const maxWidth = pageSize[0] - margin * 2;
      const lineHeight = 14;
      const maxY = pageSize[1] - margin;
      const minY = margin;

      let page = pdfDoc.addPage(pageSize);
      let y = maxY;
      const previewPages: string[] = [];
      let currentPageIndex = 0;

      function addPreview(pdfPage: typeof page) {
        const tempCanvas = document.createElement("canvas");
        currentPageIndex++;
      }

      for (const para of paragraphs) {
        const words = para.split(/\s+/);
        let line = "";

        for (const word of words) {
          const testLine = line ? `${line} ${word}` : word;
          const width = font.widthOfTextAtSize(testLine, 11);

          if (width > maxWidth && line) {
            y -= lineHeight;
            if (y < minY) {
              addPreview(page);
              page = pdfDoc.addPage(pageSize);
              y = maxY;
              currentPageIndex++;
            }
            page.drawText(line, {
              x: margin,
              y,
              size: 11,
              font,
              color: rgb(0, 0, 0),
            });
            line = word;
          } else {
            line = testLine;
          }
        }

        if (line) {
          y -= lineHeight;
          if (y < minY) {
            addPreview(page);
            page = pdfDoc.addPage(pageSize);
            y = maxY;
            currentPageIndex++;
          }
          page.drawText(line, {
            x: margin,
            y,
            size: 11,
            font,
            color: rgb(0, 0, 0),
          });
        }

        y -= lineHeight * 0.5;
      }

      addPreview(page);

      setProgress(90);
      const pdfBytes = new Uint8Array(await pdfDoc.save());

      const totalPages = pdfDoc.getPageCount();
      const offscreen = document.createElement("canvas");
      offscreen.width = 612;
      offscreen.height = 792;
      const ctx = offscreen.getContext("2d")!;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, 612, 792);

      const previewUrls: string[] = [];
      for (let p = 0; p < Math.min(totalPages, 20); p++) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, 612, 792);
        ctx.fillStyle = "#999";
        ctx.font = "14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`Page ${p + 1}`, 306, 400);
        previewUrls.push(offscreen.toDataURL("image/png"));
      }
      setPreviews(previewUrls);

      setResult(new Uint8Array(pdfBytes));
      setProgress(100);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to convert Word to PDF",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleDownload() {
    if (!result || !file) return;
    const blob = new Blob([result.slice(0)], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${file.name.replace(/\.docx?$/i, "")}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (!file) {
    return (
      <div className="mx-auto max-w-3xl">
        <PdfToolShell
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onFilesChange={(files) => {
            if (files.length > 0) convertDocx(files[0].file);
          }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
        <svg className="size-5 text-zinc-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{file.name}</span>
        <span className="text-xs text-zinc-500">({(file.size / 1024).toFixed(1)} KB)</span>
        <Button variant="secondary" size="sm" className="ml-auto" onClick={() => { setFile(null); setResult(null); setPreviews([]); }}>Change File</Button>
      </div>

      {loading && (
        <div className="space-y-3 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Converting to PDF...</span>
            <span className="font-medium text-zinc-700 dark:text-zinc-300">{progress}%</span>
          </div>
          <ProgressBar value={progress} />
          <p className="text-xs text-zinc-600">Processing document content</p>
        </div>
      )}

      {result && previews.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Conversion Complete</p>
              <p className="mt-0.5 text-sm text-zinc-700 dark:text-zinc-300">{previews.length} pages</p>
            </div>
            <Button variant="primary" size="sm" onClick={handleDownload}>Download PDF</Button>
          </div>
          <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4">
            {previews.map((preview, i) => (
              <div key={i} className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
                <img src={preview} alt={`Page ${i + 1}`} className="w-full object-cover" />
                <div className="border-t border-zinc-200 bg-zinc-50 px-2 py-1 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
                  Page {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/20 dark:text-red-400" role="alert">{error}</div>
      )}
    </div>
  );
}
