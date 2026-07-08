"use client";

import { useState, useRef } from "react";
import { Textarea, Button } from "@/components/ui";

interface DecodedResult {
  dataUrl: string;
  mimeType: string;
  size: number;
}

export function Base64ToImage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<DecodedResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  function detectMimeType(str: string): string {
    const trimmed = str.trim();
    if (trimmed.startsWith("data:")) {
      const match = trimmed.match(/^data:([^;]+);/);
      if (match) return match[1];
    }
    if (trimmed.startsWith("iVBOR")) return "image/png";
    if (trimmed.startsWith("/9j/")) return "image/jpeg";
    if (trimmed.startsWith("R0lG")) return "image/gif";
    if (trimmed.startsWith("Qk")) return "image/bmp";
    if (trimmed.startsWith("UklGR")) return "image/webp";
    return "image/png";
  }

  function decode() {
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const raw = input.trim();
      if (!raw) {
        setError("Please paste a Base64 string");
        setLoading(false);
        return;
      }
      let dataUrl: string;
      if (raw.startsWith("data:")) {
        dataUrl = raw;
      } else {
        const mime = detectMimeType(raw);
        dataUrl = `data:${mime};base64,${raw}`;
      }

      const img = new Image();
      img.onload = () => {
        const base64 = dataUrl.split(",")[1];
        const size = Math.round((base64?.length || 0) * 0.75);
        setResult({ dataUrl, mimeType: detectMimeType(raw), size });
        setLoading(false);
      };
      img.onerror = () => {
        setError("Invalid Base64 image data. The string could not be decoded as an image.");
        setLoading(false);
      };
      img.src = dataUrl;
    } catch {
      setError("Failed to decode Base64 string. Please check your input.");
      setLoading(false);
    }
  }

  function handleDownload() {
    if (!result) return;
    const ext = result.mimeType.split("/").pop() || "png";
    const link = document.createElement("a");
    link.download = `decoded.${ext}`;
    link.href = result.dataUrl;
    link.click();
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setInput(reader.result as string);
    };
    reader.readAsText(file);
  }

  function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-5">
        <div className="space-y-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste a Base64 data URI or raw Base64 string here..."
            rows={6}
            aria-label="Base64 input"
          />
          <div className="flex flex-wrap gap-2">
            <Button onClick={decode} disabled={!input || loading}>
              {loading ? "Decoding..." : "Decode to Image"}
            </Button>
            <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
              Upload .txt file
            </Button>
            <input ref={fileInputRef} type="file" accept=".txt,.b64" className="hidden" onChange={handleFileUpload} />
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
            {error}
          </div>
        )}

        {result && !loading && (
          <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Decoded Image</p>
                <p className="mt-1 text-xs text-zinc-500">
                  {result.mimeType} &middot; {formatBytes(result.size)}
                </p>
              </div>
              <Button variant="primary" size="sm" onClick={handleDownload}>Download</Button>
            </div>
            <div className="flex items-center justify-center bg-zinc-100 p-6 dark:bg-zinc-950">
              <img loading="lazy" decoding="async" ref={imgRef} src={result.dataUrl} alt="Decoded" className="max-h-64 max-w-full rounded-lg shadow-lg" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
