"use client";

import { useState, useRef } from "react";
import { Button, Alert, Card, Skeleton } from "@/components/ui";
import { Icon } from "@/components/shared/icon";
import { getFFmpeg, formatBytes, onFFmpegLog } from "@/lib/ffmpeg";

const FORMATS = ["MP4", "AVI", "MOV", "MKV", "WebM", "GIF"] as const;
const MAX_SIZE = 200 * 1024 * 1024;

export function VideoConverter() {
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
      if (f.size > MAX_SIZE) {
        setError("File exceeds the 200 MB size limit. Please choose a smaller file.");
        return;
      }
      setFile(f);
      setResult(null);
      setError("");
    }
  }

  const ext = targetFormat.toLowerCase();

  function getOutputName() {
    const base = file ? file.name.replace(/\.[^.]+$/, "") : "video";
    return `${base}.${ext === "webm" ? "webm" : ext === "gif" ? "gif" : ext}`;
  }

  function getFfmpegArgs(): string[] {
    const out = `output.${ext === "webm" ? "webm" : ext}`;
    switch (targetFormat) {
      case "MP4":
        return ["-i", "input", "-c:v", "libx264", "-preset", "fast", "-c:a", "aac", out];
      case "AVI":
        return ["-i", "input", "-c:v", "mpeg4", "-c:a", "mp2", out];
      case "MOV":
        return ["-i", "input", "-c:v", "libx264", "-preset", "fast", "-c:a", "aac", out];
      case "MKV":
        return ["-i", "input", "-c:v", "libx264", "-preset", "fast", "-c:a", "aac", out];
      case "WebM":
        return ["-i", "input", "-c:v", "libvpx", "-c:a", "libvorbis", out];
      case "GIF":
        return ["-i", "input", "-vf", "fps=10,scale=320:-1:flags=lanczos", "-c:v", "gif", out];
      default:
        return ["-i", "input", "-c:v", "libx264", "-preset", "fast", "-c:a", "aac", out];
    }
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
      ffmpeg.writeFile("input", new Uint8Array(inputData));

      const outName = `output.${ext === "webm" ? "webm" : ext}`;
      const args = getFfmpegArgs();

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

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-xl border-2 border-dashed border-zinc-300 p-8 text-center dark:border-zinc-600">
        <input ref={inputRef} type="file" accept="video/*" onChange={handleFile} className="hidden" />
        {file ? (
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">{file.name}</p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            <Button variant="ghost" size="sm" className="mt-2" onClick={() => { setFile(null); setResult(null); }}>Remove</Button>
          </div>
        ) : (
          <button onClick={() => inputRef.current?.click()} className="cursor-pointer text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-600">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="mx-auto size-10"><path d="M12 16V4m0 0L8 8m4-4l4 4" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>
            <p className="mt-2 text-sm font-medium">Click to select video file</p>
            <p className="text-xs text-zinc-600 mt-1">Max 200 MB</p>
          </button>
        )}
      </div>

      {file && file.size > MAX_SIZE * 0.8 && (
        <Alert variant="warning">File size ({formatBytes(file.size)}) is close to the 200 MB limit.</Alert>
      )}

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
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{formatBytes(resultSize)}</p>
          {targetFormat !== "GIF" ? (
            <video src={result} controls className="mt-3 max-h-64 rounded-lg" />
          ) : (
            <img src={result} alt="Converted GIF" className="mt-3 max-h-64 rounded-lg" />
          )}
          <a href={result} download={getOutputName()} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-nuvora-600 px-4 py-2 text-sm font-medium text-white hover:bg-nuvora-700">
            <Icon name="Download" className="size-4" />
            Download {getOutputName()}
          </a>
        </Card>
      )}
    </div>
  );
}
