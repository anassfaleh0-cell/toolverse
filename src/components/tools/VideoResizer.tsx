"use client";

import { useState, useRef } from "react";
import { Button, Alert, Card, Skeleton, Input } from "@/components/ui";
import { Icon } from "@/components/shared/icon";

const PRESETS = [
  { label: "4K UHD", w: 3840, h: 2160 },
  { label: "1080p", w: 1920, h: 1080 },
  { label: "720p", w: 1280, h: 720 },
  { label: "480p", w: 854, h: 480 },
  { label: "360p", w: 640, h: 360 },
];

export function VideoResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState(1280);
  const [height, setHeight] = useState(720);
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

  function applyPreset(preset: { w: number; h: number }) {
    setWidth(preset.w);
    setHeight(preset.h);
  }

  async function handleResize() {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const videoUrl = URL.createObjectURL(file);
      const video = document.createElement("video");
      video.src = videoUrl;
      video.muted = true;

      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => resolve();
        video.onerror = () => reject(new Error("Failed to load video"));
        setTimeout(() => reject(new Error("Timeout")), 10000);
      });

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;

      const stream = canvas.captureStream(30);
      const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };

      await new Promise<void>((resolve, reject) => {
        recorder.onstop = () => resolve();
        recorder.onerror = () => reject(new Error("Encoding failed"));
        recorder.start();

        video.currentTime = 0;
        video.ontimeupdate = () => {
          if (video.currentTime >= video.duration || video.ended) {
            recorder.stop();
          } else {
            ctx.drawImage(video, 0, 0, width, height);
          }
        };
        video.play().catch(reject);
      });

      const blob = new Blob(chunks, { type: "video/webm" });
      setResult(URL.createObjectURL(blob));
      URL.revokeObjectURL(videoUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Resize failed");
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

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button key={p.label} onClick={() => applyPreset(p)} className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${width === p.w && height === p.h ? "bg-nuvora-600 text-white" : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"}`}>
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Width (px)</label>
          <Input type="number" min={1} max={7680} value={width} onChange={(e) => setWidth(parseInt(e.target.value) || 1)} />
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Height (px)</label>
          <Input type="number" min={1} max={4320} value={height} onChange={(e) => setHeight(parseInt(e.target.value) || 1)} />
        </div>
      </div>

      <Button onClick={handleResize} disabled={!file || loading} variant="primary">
        {loading ? "Resizing..." : "Resize Video"}
      </Button>

      {loading && <Skeleton count={1} columns={1} />}
      {error && <Alert variant="error">{error}</Alert>}

      {result && (
        <Card variant="default" className="p-5">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Resized to {width}x{height}</p>
          <video src={result} controls className="mt-3 max-h-64 rounded-lg" />
          <a href={result} download={`resized-${file?.name?.replace(/\.[^.]+$/, ".webm") ?? "video.webm"}`} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-nuvora-600 px-4 py-2 text-sm font-medium text-white hover:bg-nuvora-700">
            <Icon name="Download" className="size-4" />
            Download Resized Video
          </a>
        </Card>
      )}
    </div>
  );
}
