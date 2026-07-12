"use client";

import { useState, useRef } from "react";
import { Button, Alert, Card } from "@/components/ui";
import { getFFmpeg, formatBytes } from "@/lib/ffmpeg";

interface FormatConfig {
  ext: string;
  args: string[];
  mime: string;
}

const FORMAT_CONFIG: Record<string, FormatConfig> = {
  MP3: { ext: "mp3", args: ["-c:a", "libmp3lame", "-q:a", "2"], mime: "audio/mpeg" },
  WAV: { ext: "wav", args: ["-c:a", "pcm_s16le"], mime: "audio/wav" },
  FLAC: { ext: "flac", args: ["-c:a", "flac"], mime: "audio/flac" },
  AAC: { ext: "aac", args: ["-c:a", "aac", "-b:a", "192k"], mime: "audio/aac" },
  OGG: { ext: "ogg", args: ["-c:a", "libvorbis", "-q:a", "3"], mime: "audio/ogg" },
};

const FORMATS = Object.keys(FORMAT_CONFIG);
const MAX_SIZE = 100 * 1024 * 1024;

export function AudioConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>("MP3");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [convertProgress, setConvertProgress] = useState(0);
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

    if (file.size > MAX_SIZE) {
      setError(`File exceeds 100 MB limit (${formatBytes(file.size)}). FFmpeg.wasm runs in browser memory and cannot process files this large.`);
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setLoadProgress(0);
    setConvertProgress(0);

    try {
      const ffmpeg = await getFFmpeg((p) => {
        setLoadProgress(p.done ? 100 : Math.round((p.received / p.total) * 100));
      });
      setLoadProgress(100);

      const config = FORMAT_CONFIG[targetFormat];
      const ext = file.name.substring(file.name.lastIndexOf("."));
      const inputName = `input${ext}`;
      const outputName = `output.${config.ext}`;

      const inputData = new Uint8Array(await file.arrayBuffer());
      await ffmpeg.writeFile(inputName, inputData);

      ffmpeg.on("progress", ({ progress }: { progress: number }) => {
        setConvertProgress(Math.round(progress * 100));
      });

      await ffmpeg.exec(["-i", inputName, ...config.args, outputName]);

      const outputData = (await ffmpeg.readFile(outputName)) as Uint8Array;
      const blob = new Blob([outputData.buffer as ArrayBuffer], { type: config.mime });
      const url = URL.createObjectURL(blob);
      setResult(url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Conversion failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const config = FORMAT_CONFIG[targetFormat];
  const outName = file ? file.name.replace(/\.[^.]+$/, `.${config.ext}`) : `output.${config.ext}`;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-xl border-2 border-dashed border-zinc-300 p-8 text-center dark:border-zinc-600">
        <input ref={inputRef} type="file" accept="audio/*" onChange={handleFile} className="hidden" />
        {file ? (
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">{file.name}</p>
            <p className="mt-1 text-sm text-zinc-500">{formatBytes(file.size)}</p>
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
              .{FORMAT_CONFIG[fmt].ext}
            </button>
          ))}
        </div>
      </div>

      <Button onClick={handleConvert} disabled={!file || loading} variant="primary">
        {loading && loadProgress < 100 ? "Loading FFmpeg..." : loading ? "Converting..." : "Convert"}
      </Button>

      {loading && loadProgress < 100 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-zinc-500">
            <span>Loading FFmpeg...</span>
            <span>{loadProgress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
            <div className="h-full rounded-full bg-nuvora-600 transition-all duration-300" style={{ width: `${loadProgress}%` }} />
          </div>
        </div>
      )}

      {loading && loadProgress >= 100 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-zinc-500">
            <span>Converting...</span>
            <span>{convertProgress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
            <div className="h-full rounded-full bg-nuvora-600 transition-all duration-300" style={{ width: `${convertProgress}%` }} />
          </div>
        </div>
      )}

      {error && <Alert variant="error">{error}</Alert>}

      {result && (
        <Card variant="default" className="space-y-3 p-5">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Conversion complete</p>
          <audio controls src={result} className="w-full" />
          <a href={result} download={outName} className="inline-flex items-center gap-2 rounded-lg bg-nuvora-600 px-4 py-2 text-sm font-medium text-white hover:bg-nuvora-700">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download {outName}
          </a>
        </Card>
      )}
    </div>
  );
}
