"use client";

import { useState, useRef } from "react";
import { Button, Alert, Card, Skeleton } from "@/components/ui";
import { getFFmpeg, formatBytes } from "@/lib/ffmpeg";

function qualityToCRF(quality: number): number {
  if (quality >= 0.5) return Math.round(38 - 20 * quality);
  if (quality >= 0.25) return Math.round(42 - 28 * quality);
  return Math.round(45 - 40 * quality);
}

export function VideoCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(0.5);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setResultUrl(null);
      setError("");
    }
  }

  const isOverLimit = file !== null && file.size > 200 * 1024 * 1024;

  async function handleCompress() {
    if (!file) return;
    setLoading(true);
    setError("");
    setResultUrl(null);
    setProgress(0);
    setStatusText("Loading FFmpeg...");

    try {
      const ffmpeg = await getFFmpeg((p) => {
        const pct = p.total > 0 ? Math.round((p.received / p.total) * 20) : 0;
        setProgress(pct);
      });

      setStatusText("Writing input file...");
      setProgress(25);

      const inputData = new Uint8Array(await file.arrayBuffer());
      const ext = file.name.split(".").pop() || "mp4";
      const inputName = `input.${ext}`;
      await ffmpeg.writeFile(inputName, inputData);

      setProgress(30);
      setStatusText("Compressing video...");

      const crf = qualityToCRF(quality);

      ffmpeg.on("progress", ({ progress: p }) => {
        setProgress(Math.min(95, 30 + Math.round(p * 65)));
      });

      await ffmpeg.exec([
        "-i",
        inputName,
        "-c:v",
        "libx264",
        "-crf",
        String(crf),
        "-preset",
        "medium",
        "-c:a",
        "aac",
        "-b:a",
        "128k",
        "output.mp4",
      ]);

      setProgress(96);
      setStatusText("Reading output...");

      const outputData = (await ffmpeg.readFile("output.mp4")) as Uint8Array;
      const blob = new Blob([outputData as unknown as BlobPart], { type: "video/mp4" });

      setResultUrl(URL.createObjectURL(blob));
      setResultSize(blob.size);
      setProgress(100);
      setStatusText("Complete");

      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile("output.mp4");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Compression failed");
    } finally {
      setLoading(false);
    }
  }

  const ratio =
    file && resultSize > 0
      ? ((1 - resultSize / file.size) * 100).toFixed(1)
      : "0";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-xl border-2 border-dashed border-zinc-300 p-8 text-center dark:border-zinc-600">
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          onChange={handleFile}
          className="hidden"
        />
        {file ? (
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">
              {file.name}
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            {isOverLimit && (
              <Alert variant="warning" className="mt-3">
                File exceeds 200 MB limit — compression may fail or be very
                slow.
              </Alert>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => {
                setFile(null);
                setResultUrl(null);
              }}
            >
              Remove
            </Button>
          </div>
        ) : (
          <button
            onClick={() => inputRef.current?.click()}
            className="cursor-pointer text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="mx-auto size-10"
            >
              <path
                d="M12 16V4m0 0L8 8m4-4l4 4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
            </svg>
            <p className="mt-2 text-sm font-medium">
              Click to select video file
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              MP4, AVI, MOV, WebM
            </p>
          </button>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Compression Quality: {Math.round(quality * 100)}%
        </label>
        <input
          type="range"
          min={0.01}
          max={1}
          step={0.01}
          value={quality}
          onChange={(e) => setQuality(parseFloat(e.target.value))}
          className="w-full accent-nuvora-600"
        />
        <div className="flex justify-between text-xs text-zinc-500">
          <span>Smaller size</span>
          <span>Higher quality</span>
        </div>
      </div>

      <Button
        onClick={handleCompress}
        disabled={!file || loading}
        variant="primary"
      >
        {loading ? `${statusText} (${progress}%)` : "Compress Video"}
      </Button>

      {loading && (
        <div className="space-y-2">
          <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
            <div
              className="h-full rounded-full bg-nuvora-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <Skeleton count={1} columns={1} />
        </div>
      )}

      {error && <Alert variant="error">{error}</Alert>}

      {resultUrl && (
        <Card variant="default" className="p-5">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Compression complete
          </p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {formatBytes(file?.size || 0)} → {formatBytes(resultSize)} (Reduced
            by {ratio}%)
          </p>
          <a
            href={resultUrl}
            download={`compressed-${file?.name ?? "video.mp4"}`}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-nuvora-600 px-4 py-2 text-sm font-medium text-white hover:bg-nuvora-700"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="size-4"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Compressed
          </a>
        </Card>
      )}
    </div>
  );
}
