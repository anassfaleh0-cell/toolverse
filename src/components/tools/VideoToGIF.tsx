"use client";

import { useState, useRef } from "react";
import { Button, Alert, Card, Input } from "@/components/ui";
import { Icon } from "@/components/shared/icon";
import { getFFmpeg, formatBytes } from "@/lib/ffmpeg";

export function VideoToGIF() {
  const [file, setFile] = useState<File | null>(null);
  const [startTime, setStartTime] = useState("0");
  const [duration, setDuration] = useState("3");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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

  async function handleConvert() {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult(null);
    setProgress(0);

    try {
      const ffmpeg = await getFFmpeg((p) => {
        if (p.total > 0) setProgress(Math.round((p.received / p.total) * 50));
      });
      ffmpeg.writeFile("input", new Uint8Array(await file.arrayBuffer()));
      setProgress(50);

      const start = parseFloat(startTime) || 0;
      const dur = parseFloat(duration) || 3;
      const scale = "320:-1";

      await ffmpeg.exec([
        "-ss", String(start),
        "-t", String(dur),
        "-i", "input",
        "-vf", `fps=10,scale=${scale}:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=256[p];[s1][p]paletteuse=dither=bayer`,
        "-loop", "0",
        "output.gif",
      ]);

      const data = await ffmpeg.readFile("output.gif");
      ffmpeg.deleteFile("input");
      ffmpeg.deleteFile("output.gif");

      const blob = new Blob([data as BlobPart], { type: "image/gif" });
      setResult(URL.createObjectURL(blob));
      setProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-xl border-2 border-dashed border-zinc-300 p-8 text-center dark:border-zinc-600">
        <input ref={inputRef} type="file" accept="video/*" onChange={handleFile} className="hidden" />
        {file ? (
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">{file.name}</p>
            <Button variant="ghost" size="sm" className="mt-2" onClick={() => { setFile(null); setResult(null); }}>Remove</Button>
          </div>
        ) : (
          <button onClick={() => inputRef.current?.click()} className="cursor-pointer text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-600">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="mx-auto size-10"><path d="M12 16V4m0 0L8 8m4-4l4 4" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>
            <p className="mt-2 text-sm font-medium">Select video file</p>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Start Time (seconds)</label>
          <Input type="number" min={0} step={1} value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Duration (seconds)</label>
          <Input type="number" min={1} max={30} step={1} value={duration} onChange={(e) => setDuration(e.target.value)} />
        </div>
      </div>

      <Button onClick={handleConvert} disabled={!file || loading} variant="primary">
        {loading ? `Converting (${progress}%)...` : "Convert to GIF"}
      </Button>

      {loading && (
        <div className="space-y-2">
          <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
            <div className="h-full rounded-full bg-nuvora-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
      {error && <Alert variant="error">{error}</Alert>}

      {result && (
        <Card variant="default" className="p-5">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Conversion complete</p>
          <img src={result} alt="Animated GIF" className="mt-3 max-h-64 rounded-lg" />
          <a href={result} download={`${file?.name?.replace(/\.[^.]+$/, "") ?? "clip"}.gif`} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-nuvora-600 px-4 py-2 text-sm font-medium text-white hover:bg-nuvora-700">
            <Icon name="Download" className="size-4" />
            Download GIF
          </a>
        </Card>
      )}
    </div>
  );
}
