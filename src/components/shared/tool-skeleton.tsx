interface ToolSkeletonProps {
  count?: number;
  columns?: 1 | 2 | 3;
}

export function ToolSkeleton({ count = 12, columns = 3 }: ToolSkeletonProps) {
  const gridCols =
    columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" :
    columns === 2 ? "sm:grid-cols-2" :
    "grid-cols-1";

  return (
    <div className="animate-pulse space-y-6" aria-label="Loading content">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="space-y-2">
          <div className="h-3 w-16 rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-5 w-48 rounded bg-zinc-200 dark:bg-zinc-700" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-20 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-9 w-24 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        </div>
      </div>

      <div className={`grid gap-4 ${gridCols}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
              <div className="space-y-2">
                <div className="h-3 w-20 rounded bg-zinc-200 dark:bg-zinc-700" />
                <div className="h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-700" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
