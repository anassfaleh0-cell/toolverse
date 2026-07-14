"use client";

import { useMemo } from "react";

interface CompareField {
  label: string;
  left: string;
  right: string;
  diff?: boolean;
}

interface CompareResultsProps {
  title: string;
  leftLabel: string;
  rightLabel: string;
  fields: CompareField[];
}

export function CompareResults({ title, leftLabel, rightLabel, fields }: CompareResultsProps) {
  const diffs = useMemo(() => fields.filter((f) => f.diff).length, [fields]);

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800">
      <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{title}</h3>
        {diffs > 0 && (
          <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-400">
            {diffs} difference{diffs !== 1 ? "s" : ""} found
          </p>
        )}
      </div>
      <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {fields.map((field) => (
          <div
            key={field.label}
            className={`grid grid-cols-[1fr_1px_1fr] gap-3 px-5 py-3 text-xs ${
              field.diff ? "bg-amber-50/50 dark:bg-amber-950/10" : ""
            }`}
          >
            <div className="space-y-1">
              <p className="text-[10px] font-medium text-zinc-500">{leftLabel}</p>
              <p className={`font-mono text-zinc-800 dark:text-zinc-200 ${field.diff ? "text-red-600 dark:text-red-400" : ""}`}>
                {field.left || "—"}
              </p>
            </div>
            <div className="h-full w-px bg-zinc-200 dark:bg-zinc-700" />
            <div className="space-y-1">
              <p className="text-[10px] font-medium text-zinc-500">{rightLabel}</p>
              <p className={`font-mono text-zinc-800 dark:text-zinc-200 ${field.diff ? "text-green-700 dark:text-green-400" : ""}`}>
                {field.right || "—"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
