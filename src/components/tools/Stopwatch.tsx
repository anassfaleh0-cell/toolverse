"use client";

import { useState, useRef, useEffect } from "react";
import { Button, Card } from "@/components/ui";

function formatTime(ms: number): string {
  const totalCs = Math.floor(ms / 10);
  const cs = totalCs % 100;
  const totalSec = Math.floor(totalCs / 100);
  const sec = totalSec % 60;
  const totalMin = Math.floor(totalSec / 60);
  const min = totalMin % 60;
  const hr = Math.floor(totalMin / 60);
  const pad = (n: number, d: number) => String(n).padStart(d, "0");
  return `${pad(hr, 2)}:${pad(min, 2)}:${pad(sec, 2)}.${pad(cs, 2)}`;
}

export function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);
  const [laps, setLaps] = useState<{ lap: number; lapTime: number; totalTime: number }[]>([]);

  useEffect(() => {
    if (running) {
      startTimeRef.current = Date.now() - elapsed;
      intervalRef.current = setInterval(() => {
        setElapsed(Date.now() - startTimeRef.current);
      }, 10);
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
  }, [running]);

  function toggle() {
    setRunning((r) => !r);
  }

  function reset() {
    setRunning(false);
    setElapsed(0);
    setLaps([]);
  }

  function lap() {
    if (!running) return;
    const total = elapsed;
    const prevTotal = laps.length > 0 ? laps[laps.length - 1].totalTime : 0;
    setLaps((prev) => [...prev, { lap: prev.length + 1, lapTime: total - prevTotal, totalTime: total }]);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card variant="default" className="p-8">
        <div className="text-center">
          <div className="font-mono text-5xl sm:text-6xl font-bold tracking-wider text-text-primary">
            {formatTime(elapsed)}
          </div>
          <div className="mt-6 flex items-center justify-center gap-4">
            <Button variant={running ? "secondary" : "primary"} onClick={toggle}>
              {running ? "Pause" : "Start"}
            </Button>
            <button
              onClick={reset}
              className="rounded-xl border border-border-subtle bg-surface px-5 py-3 text-sm font-medium text-text-primary transition-colors hover:bg-nuvora-50 dark:hover:bg-nuvora-900/50"
            >
              Reset
            </button>
            <Button variant="secondary" onClick={lap} disabled={!running}>
              Lap
            </Button>
          </div>
        </div>
      </Card>
      {laps.length > 0 && (
        <Card variant="default" className="p-8">
          <h3 className="mb-4 text-lg font-semibold text-text-primary">Laps</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border-subtle text-text-secondary">
                  <th className="pb-2 font-medium">Lap</th>
                  <th className="pb-2 font-medium">Lap Time</th>
                  <th className="pb-2 font-medium">Total Time</th>
                </tr>
              </thead>
              <tbody>
                {laps.map((l) => (
                  <tr key={l.lap} className="border-b border-border-subtle last:border-0">
                    <td className="py-2 text-text-primary">{l.lap}</td>
                    <td className="py-2 font-mono text-text-primary">{formatTime(l.lapTime)}</td>
                    <td className="py-2 font-mono text-text-primary">{formatTime(l.totalTime)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
