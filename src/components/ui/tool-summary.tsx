import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ToolSummaryProps {
  title: string;
  status?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function ToolSummary({
  title,
  status,
  actions,
  className,
}: ToolSummaryProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-zinc-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/50",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="size-4 text-zinc-600 dark:text-zinc-400"
            aria-hidden="true"
          >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
            {title}
          </p>
          {status && (
            <div className="mt-0.5">{status}</div>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-2">{actions}</div>
      )}
    </div>
  );
}
