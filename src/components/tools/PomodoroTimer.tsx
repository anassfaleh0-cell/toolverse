"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button, Card } from "@/components/ui";

function playBeep() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
    setTimeout(() => ctx.close(), 600);
  } catch {
  }
}

type Mode = "focus" | "break" | "longBreak";

const MODE_DURATIONS: Record<Mode, number> = {
  focus: 25,
  break: 5,
  longBreak: 15,
};

export function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<Mode>("focus");
  const [completed, setCompleted] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalSecondsRef = useRef(25 * 60);
  const modeRef = useRef(mode);

  modeRef.current = mode;

  const tick = useCallback(() => {
    try {
      const total = minutes * 60 + seconds - 1;
      if (total <= 0) {
        setIsRunning(false);
        playBeep();
        const nextMode: Mode = modeRef.current === "focus" ? "break" : "focus";
        const dur = MODE_DURATIONS[nextMode];
        setMode(nextMode);
        setMinutes(dur);
        setSeconds(0);
        totalSecondsRef.current = dur * 60;
        if (modeRef.current === "focus") {
          setCompleted((c) => c + 1);
        }
      } else {
        const m = Math.floor(total / 60);
        const s = total % 60;
        setMinutes(m);
        setSeconds(s);
      }
    } catch {
    }
  }, [minutes, seconds]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, tick]);

  function setPreset(m: Mode) {
    try {
      setIsRunning(false);
      setMode(m);
      const dur = MODE_DURATIONS[m];
      setMinutes(dur);
      setSeconds(0);
      totalSecondsRef.current = dur * 60;
    } catch {
    }
  }

  function toggle() {
    setIsRunning((r) => !r);
  }

  function handleReset() {
    try {
      setIsRunning(false);
      const dur = MODE_DURATIONS[mode];
      setMinutes(dur);
      setSeconds(0);
      totalSecondsRef.current = dur * 60;
    } catch {
    }
  }

  const display = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card variant="default" className="p-8">
        <div className="text-center">
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
            <Button variant={mode === "focus" ? "primary" : "secondary"} size="sm" onClick={() => setPreset("focus")}>
              Focus (25m)
            </Button>
            <Button variant={mode === "break" ? "primary" : "secondary"} size="sm" onClick={() => setPreset("break")}>
              Short Break (5m)
            </Button>
            <Button variant={mode === "longBreak" ? "primary" : "secondary"} size="sm" onClick={() => setPreset("longBreak")}>
              Long Break (15m)
            </Button>
          </div>
          <div className="font-mono text-5xl sm:text-7xl font-bold tracking-wider text-text-primary">
            {display}
          </div>
          <p className="mt-2 text-sm text-text-secondary">
            {mode === "focus" ? "Focus Time" : mode === "break" ? "Short Break" : "Long Break"}
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <Button variant={isRunning ? "secondary" : "primary"} onClick={toggle}>
              {isRunning ? "Pause" : "Start"}
            </Button>
            <button
              onClick={handleReset}
              className="rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm font-medium text-text-primary transition-colors hover:bg-nuvora-50 dark:hover:bg-nuvora-900/50"
            >
              Reset
            </button>
          </div>
          <p className="mt-4 text-sm text-text-secondary">Completed: {completed}</p>
        </div>
      </Card>
    </div>
  );
}
