"use client";

import { useState, useRef } from "react";
import { Button, Alert, Card, Skeleton } from "@/components/ui";
import { getFFmpeg, formatBytes, onFFmpegLog } from "@/lib/ffmpeg";

const FORMATS = ["MP4", "WebM"] as const;

export function GIFToMP4() {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>("MP4");
  const [result, setResult] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [ffmpegLoading, setFfmpegLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setResult(null);
      setError("");
    }
  }

  const ext = targetFormat.toLowerCase();

  function getOutputName() {
    const base = file ? file.name.replace(/\.[^.]+$/, "") : "output";
    return `${base}.${ext}`;
  }

  async function handleConvert() {
    if (!file) return;
    setLoading(true);
    setFfmpegLoading(true);
    setError("");
    setResult(null);
    setProgress(0);

    try {
      const ffmpeg = await getFFmpeg((p) => {
        setProgress(p.done ? 100 : Math.round((p.received / p.total) * 50));
      });
      setFfmpegLoading(false);
      setProgress(50);

      onFFmpegLog(ffmpeg, (_type, _message) => {});

      const inputData = await file.arrayBuffer();
      ffmpeg.writeFile("input.gif", new Uint8Array(inputData));

      const outName = `output.${ext}`;
      let args: string[];

      if (targetFormat === "MP4") {
        args = ["-i", "input.gif", "-movflags", "faststart", "-pix_fmt", "yuv420p", "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2", outName];
      } else {
        args = ["-i", "input.gif", "-c:v", "libvpx", "-b:v", "0", "-crf", "25", outName];
      }

      ffmpeg.on("progress", ({ progress: p }) => {
        setProgress(50 + Math.round(p * 50));
      });

      await ffmpeg.exec(args);

      const data = (await ffmpeg.readFile(outName)) as Uint8Array;
      const blob = new Blob([data.buffer as ArrayBuffer]);
      setResult(URL.createObjectURL(blob));
      setResultSize(blob.size);
      setProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed");
    } finally {
      setLoading(false);
      setFfmpegLoading(false);
    }
  }

  const ratio = file && resultSize ? ((1 - resultSize / file.size) * 100).toFixed(1) : "0";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-xl border-2 border-dashed border-zinc-300 p-8 text-center dark:border-zinc-600">
        <input ref={inputRef} type="file" accept="image/gif" onChange={handleFile} className="hidden" />
        {file ? (
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">{file.name}</p>
            <p className="mt-1 text-sm text-zinc-500">{formatBytes(file.size)}</p>
            <Button variant="ghost" size="sm" className="mt-2" onClick={() => { setFile(null); setResult(null); }}>Remove</Button>
          </div>
        ) : (
          <button onClick={() => inputRef.current?.click()} className="cursor-pointer text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="mx-auto size-10"><path d="M12 16V4m0 0L8 8m4-4l4 4" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>
            <p className="mt-2 text-sm font-medium">Click to select GIF file</p>
            <p className="text-xs text-zinc-400 mt-1">Animated GIF</p>
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
        {loading ? (ffmpegLoading ? "Loading FFmpeg..." : `Converting (${progress}%)...`) : "Convert"}
      </Button>

      {loading && (
        <div className="space-y-2">
          <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
            <div className="h-full rounded-full bg-nuvora-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <Skeleton count={1} columns={1} />
        </div>
      )}
      {error && <Alert variant="error">{error}</Alert>}

      {result && (
        <Card variant="default" className="p-5">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Conversion complete</p>
          {targetFormat === "MP4" ? (
            <video src={result} controls className="mt-3 max-h-64 rounded-lg" />
          ) : (
            <video src={result} controls autoPlay loop muted className="mt-3 max-h-64 rounded-lg" />
          )}
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            {formatBytes(file!.size)} &rarr; {formatBytes(resultSize)} ({ratio}% reduction)
          </p>
          <a href={result} download={getOutputName()} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-nuvora-600 px-4 py-2 text-sm font-medium text-white hover:bg-nuvora-700">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download {getOutputName()}
          </a>
        </Card>
      )}
    </div>
  );
}
