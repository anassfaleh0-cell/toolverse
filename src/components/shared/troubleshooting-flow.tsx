"use client";

import { useState } from "react";

interface TroubleshootingStep {
  id: string;
  instruction?: string;
  detail?: string;
  checkLabel: string;
  yesNext?: string;
  noNext?: string;
  isYesFix?: boolean;
  isNoFix?: boolean;
  yesFix?: string;
  noFix?: string;
}

interface TroubleshootingFlowProps {
  title: string;
  steps: Record<string, TroubleshootingStep>;
  startId: string;
}

export function TroubleshootingFlow({ title, steps, startId }: TroubleshootingFlowProps) {
  const [currentId, setCurrentId] = useState(startId);
  const [history, setHistory] = useState<string[]>([startId]);
  const [completed, setCompleted] = useState(false);
  const [resolution, setResolution] = useState("");

  const step = steps[currentId];

  const handleAnswer = (answer: boolean) => {
    if (!step) return;
    const nextKey = answer ? step.yesNext : step.noNext;
    const fix = answer ? step.yesFix : step.noFix;
    const isFix = answer ? step.isYesFix : step.isNoFix;

    if (isFix) {
      setCompleted(true);
      setResolution(fix ?? "Issue resolved. Check your configuration and try again.");
      return;
    }

    if (!nextKey || nextKey === "__end__") {
      setCompleted(true);
      setResolution("No specific issue found. Your configuration appears to be working correctly.");
      return;
    }

    if (nextKey === "__escalate__") {
      setCompleted(true);
      setResolution("This issue requires advanced troubleshooting. Consider consulting your system administrator or opening a support ticket.");
      return;
    }

    setHistory((prev) => [...prev, nextKey]);
    setCurrentId(nextKey);
  };

  const handleReset = () => {
    setCurrentId(startId);
    setHistory([startId]);
    setCompleted(false);
    setResolution("");
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{title}</h3>
        {history.length > 1 && !completed && (
          <button type="button" onClick={handleReset} aria-label="Restart troubleshooting flow" className="text-xs text-zinc-500 underline hover:text-zinc-700 dark:hover:text-zinc-300">Restart</button>
        )}
      </div>

      <div className="mb-4 flex gap-1.5">
        {history.map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full ${i === history.length - 1 ? "bg-blue-500" : completed ? "bg-green-400" : "bg-zinc-200 dark:bg-zinc-700"}`} />
        ))}
      </div>

      {completed ? (
        <div className="space-y-3">
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
            <p className="font-semibold text-green-800 dark:text-green-200">Resolution</p>
            <p className="mt-1 text-sm text-green-700 dark:text-green-300">{resolution}</p>
          </div>
          <button type="button" onClick={handleReset} aria-label="Run troubleshooting flow again" className="text-sm text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">Run again</button>
        </div>
      ) : step ? (
        <div className="space-y-4">
          {step.instruction && (
            <div>
              <p className="font-medium text-zinc-900 dark:text-zinc-100">{step.instruction}</p>
              {step.detail && <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{step.detail}</p>}
            </div>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleAnswer(true)}
              aria-label={`Yes, ${step.checkLabel}`}
              className="rounded-lg bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              Yes — {step.checkLabel}
            </button>
            <button
              type="button"
              onClick={() => handleAnswer(false)}
              aria-label="No, this condition is not met"
              className="rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              No
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-zinc-500">Step not found.</p>
      )}
    </div>
  );
}
