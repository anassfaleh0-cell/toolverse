import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  count?: number;
  columns?: 1 | 2 | 3;
}

export function Skeleton({
  className,
  count = 3,
  columns = 1,
}: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Loading content"
      className={cn(
        "grid gap-4",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "animate-pulse rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900",
            className,
          )}
        >
          <div className="mb-4 h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="mb-2 h-3 w-full rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="mb-2 h-3 w-5/6 rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-3 w-2/3 rounded bg-zinc-200 dark:bg-zinc-700" />
        </div>
      ))}
    </div>
  );
}
