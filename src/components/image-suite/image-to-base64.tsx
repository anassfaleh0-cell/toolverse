"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui";
import { CopyButton } from "@/components/shared";

export function ImageToBase64() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [base64String, setBase64String] = useState("");
  const [dataUrl, setDataUrl] = useState("");
  const [includePrefix, setIncludePrefix] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setDataUrl(result);
      const raw = result.split(",")[1] || "";
      setBase64String(raw);
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setLoading(false);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  }

  function handleDownload() {
    const content = includePrefix ? dataUrl : base64String;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "base64.txt";
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
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

  const displayString = includePrefix ? dataUrl : base64String;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-5">
        {!image ? (
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
            <p className="mt-1 text-xs text-zinc-400">Convert any image to Base64</p>
          </div>
        ) : (
          <>
            {loading && <p className="text-sm text-zinc-500">Converting...</p>}

            {!loading && (
              <>
                <div className="flex items-center gap-4 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                  <img loading="lazy" decoding="async" src={dataUrl} alt="Uploaded" className="h-16 w-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Uploaded Image</p>
                    <p className="text-xs text-zinc-500">{image.naturalWidth} x {image.naturalHeight} px</p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => { setImage(null); setBase64String(""); setDataUrl(""); }}>
                    Remove
                  </Button>
                </div>

                <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={includePrefix}
                    onChange={(e) => setIncludePrefix(e.target.checked)}
                    className="size-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600"
                  />
                  Include data URI prefix (data:image/...;base64,...)
                </label>

                <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      Base64 String ({displayString.length} chars)
                    </p>
                    <div className="flex gap-2">
                      <CopyButton text={displayString} />
                      <Button variant="secondary" size="sm" onClick={handleDownload}>Download as .txt</Button>
                    </div>
                  </div>
                  <div className="max-h-48 overflow-auto p-5">
                    <pre className="break-all font-mono text-xs text-zinc-900 dark:text-zinc-50">{displayString}</pre>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      </div>
    </div>
  );
}
