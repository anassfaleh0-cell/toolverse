"use client";

import { useState } from "react";

interface DecisionNode {
  id: string;
  question?: string;
  options?: { label: string; next: string }[];
  answer?: string;
  isFinal?: boolean;
}

interface DecisionTreeProps {
  title: string;
  nodes: Record<string, DecisionNode>;
  startId: string;
}

export function DecisionTree({ title, nodes, startId }: DecisionTreeProps) {
  const [history, setHistory] = useState<string[]>([startId]);
  const currentNode = nodes[history[history.length - 1]];

  const handleChoice = (nextId: string) => {
    setHistory((prev) => [...prev, nextId]);
  };

  const handleBack = () => {
    setHistory((prev) => prev.slice(0, -1));
  };

  const handleReset = () => {
    setHistory([startId]);
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{title}</h3>
        <div className="flex gap-2">
          {history.length > 1 && (
            <button type="button" onClick={handleBack} aria-label="Go back to previous question" className="text-xs text-zinc-500 underline hover:text-zinc-700 dark:hover:text-zinc-300">Back</button>
          )}
          <button type="button" onClick={handleReset} aria-label="Restart decision tree from beginning" className="text-xs text-zinc-500 underline hover:text-zinc-700 dark:hover:text-zinc-300">Restart</button>
        </div>
      </div>

      <div className="mb-4 flex gap-1.5">
        {history.map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full ${i === history.length - 1 ? "bg-blue-500" : "bg-zinc-200 dark:bg-zinc-700"}`} />
        ))}
      </div>

      <div className="min-h-[200px]">
        {!currentNode ? (
          <p className="text-sm text-zinc-500">Node not found.</p>
        ) : currentNode.isFinal ? (
          <div className="space-y-3">
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
              <p className="font-semibold text-green-800 dark:text-green-200">Recommendation</p>
              <p className="mt-1 text-sm text-green-700 dark:text-green-300">{currentNode.answer}</p>
            </div>
            <button type="button" onClick={handleReset} aria-label="Reset and start over" className="text-sm text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">Start over</button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="font-medium text-zinc-900 dark:text-zinc-100">{currentNode.question}</p>
            <div className="space-y-2">
              {currentNode.options?.map((opt, idx) => (
                <button
                  key={opt.next}
                  type="button"
                  onClick={() => handleChoice(opt.next)}
                  aria-label={`Option ${idx + 1}: ${opt.label}`}
                  className="block w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-left text-sm text-zinc-700 transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-blue-600 dark:hover:bg-blue-950"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
