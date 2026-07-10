"use client";

import { useState, useRef } from "react";
import { Button, Alert, Card, Skeleton } from "@/components/ui";

const FORMATS = ["MP3", "WAV", "FLAC", "AAC", "OGG"] as const;

export function AudioConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>("MP3");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setResult(null);
      setError("");
    }
  }

  async function handleConvert() {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: `audio/${targetFormat.toLowerCase()}` });
      const url = URL.createObjectURL(blob);
      setResult(url);
    } catch {
      setError("Conversion failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const ext = targetFormat.toLowerCase();
  const outName = file ? file.name.replace(/\.[^.]+$/, `.${ext}`) : `output.${ext}`;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-xl border-2 border-dashed border-zinc-300 p-8 text-center dark:border-zinc-600">
        <input ref={inputRef} type="file" accept="audio/*" onChange={handleFile} className="hidden" />
        {file ? (
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">{file.name}</p>
            <p className="mt-1 text-sm text-zinc-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            <Button variant="ghost" size="sm" className="mt-2" onClick={() => { setFile(null); setResult(null); }}>Remove</Button>
          </div>
        ) : (
          <button onClick={() => inputRef.current?.click()} className="cursor-pointer text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="mx-auto size-10"><path d="M12 16V4m0 0L8 8m4-4l4 4" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>
            <p className="mt-2 text-sm font-medium">Click to select audio file</p>
            <p className="text-xs text-zinc-400 mt-1">MP3, WAV, FLAC, AAC, or OGG</p>
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Convert to:</label>
        <div className="flex flex-wrap gap-2">
          {FORMATS.map((fmt) => (
            <button
              key={fmt}
              onClick={() => setTargetFormat(fmt)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${targetFormat === fmt ? "bg-nuvora-600 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"}`}
            >
              .{fmt.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <Button onClick={handleConvert} disabled={!file || loading} variant="primary">
        {loading ? "Converting..." : "Convert"}
      </Button>

      {loading && <Skeleton count={1} columns={1} />}
      {error && <Alert variant="error">{error}</Alert>}

      {result && (
        <Card variant="default" className="p-5">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Conversion complete</p>
          <a href={result} download={outName} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-nuvora-600 px-4 py-2 text-sm font-medium text-white hover:bg-nuvora-700">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download {outName}
          </a>
        </Card>
      )}
    </div>
  );
}
