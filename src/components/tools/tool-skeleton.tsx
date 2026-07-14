export function ToolSkeleton() {
  return (
    <div role="status" aria-label="Loading tool" className="animate-pulse space-y-6 rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="h-5 w-2/5 rounded bg-zinc-200 dark:bg-zinc-700" />
      <div className="space-y-3">
        <div className="h-10 w-full rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-10 w-3/4 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
      </div>
      <div className="h-32 w-full rounded-lg bg-zinc-200 dark:bg-zinc-700" />
      <div className="flex gap-3">
        <div className="h-10 w-28 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-10 w-28 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
      </div>
    </div>
  );
}
