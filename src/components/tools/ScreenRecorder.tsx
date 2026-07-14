"use client";

import { useState, useRef, useCallback } from "react";
import { Button, Alert, Card } from "@/components/ui";
import { Icon } from "@/components/shared/icon";

type RecordingState = "idle" | "requesting" | "recording" | "stopped";

export function ScreenRecorder() {
  const [state, setState] = useState<RecordingState>("idle");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null; }
    if (previewRef.current) { previewRef.current.srcObject = null; }
    setDuration(0);
  }, []);

  async function handleStart() {
    setError("");
    setResult(null);
    setDuration(0);
    chunksRef.current = [];
    setState("requesting");

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: "monitor" },
        audio: { echoCancellation: true, noiseSuppression: true },
      });

      streamRef.current = stream;

      if (previewRef.current) {
        previewRef.current.srcObject = stream;
      }

      const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9,opus" });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        setResult(URL.createObjectURL(blob));
        cleanup();
        setState("stopped");
      };

      recorder.start(1000);
      setState("recording");

      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      stream.getVideoTracks()[0].addEventListener("ended", () => {
        if (recorder.state === "recording") recorder.stop();
      });
    } catch (err) {
      if ((err as DOMException).name === "NotAllowedError") {
        setError("Screen recording permission was denied. Please allow screen capture to record.");
      } else if ((err as DOMException).name === "AbortError") {
        setError("Recording setup was cancelled.");
      } else {
        setError("Failed to start recording. Make sure your browser supports screen recording.");
      }
      setState("idle");
    }
  }

  function handleStop() {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }

  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Record your screen with audio. Perfect for tutorials, demos, and bug reports.
        </p>

        {state === "idle" && (
          <Button onClick={handleStart} variant="primary" size="lg">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="mr-2 size-5"><circle cx="12" cy="12" r="6"/><path d="M12 2v2m0 16v2m10-10h2M2 12h2"/></svg>
            Start Recording
          </Button>
        )}

        {state === "requesting" && (
          <Button disabled variant="secondary" size="lg">Requesting screen access...</Button>
        )}

        {state === "recording" && (
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="flex size-3 items-center justify-center">
                <span className="absolute inline-flex size-3 animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="inline-flex size-3 rounded-full bg-red-600" />
              </span>
              <span className="font-mono text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {formatTime(duration)}
              </span>
            </div>
            <Button onClick={handleStop} variant="primary" className="bg-red-600 hover:bg-red-700">
              <svg viewBox="0 0 24 24" fill="currentColor" className="mr-2 size-5"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
              Stop Recording
            </Button>
          </div>
        )}

        <video ref={previewRef} muted autoPlay playsInline className="max-h-64 w-full rounded-lg bg-black" />
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {result && state === "stopped" && (
        <Card variant="default" className="p-5">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Recording complete</p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Duration: {formatTime(duration)}</p>
          <video src={result} controls className="mt-3 max-h-64 w-full rounded-lg" />
          <div className="mt-4 flex flex-wrap gap-3">
            <a href={result} download={`recording-${Date.now()}.webm`} className="inline-flex items-center gap-2 rounded-lg bg-nuvora-600 px-4 py-2 text-sm font-medium text-white hover:bg-nuvora-700">
              <Icon name="Download" className="size-4" />
              Download Recording
            </a>
            <Button variant="ghost" onClick={() => { setState("idle"); setResult(null); cleanup(); }}>
              Record Again
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
