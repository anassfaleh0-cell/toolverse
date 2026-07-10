import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  variant?: "card" | "text" | "image" | "tool" | "table";
  rows?: number;
}

function Shimmer({ className }: { className?: string }) {
  return (
    <div className={cn("animate-shimmer rounded", className)} />
  );
}

export function LoadingSkeleton({ className, variant = "card", rows = 1 }: LoadingSkeletonProps) {
  if (variant === "text") {
    return (
      <div className={cn("space-y-2", className)} aria-busy="true" aria-label="Loading content">
        {Array.from({ length: rows }).map((_, i) => (
          <Shimmer key={i} className={cn("h-3", i === 0 ? "w-3/4" : i === rows - 1 ? "w-1/2" : "w-full")} />
        ))}
      </div>
    );
  }

  if (variant === "image") {
    return (
      <div className={cn("aspect-video overflow-hidden rounded-xl", className)} aria-busy="true" aria-label="Loading image">
        <Shimmer className="h-full w-full" />
      </div>
    );
  }

  if (variant === "tool") {
    return (
      <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)} aria-busy="true" aria-label="Loading tools">
        {Array.from({ length: rows || 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border-subtle bg-surface p-5">
            <Shimmer className="mb-3 size-10 rounded-lg" />
            <Shimmer className="mb-2 h-4 w-3/4" />
            <Shimmer className="mb-1 h-3 w-full" />
            <Shimmer className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className={cn("space-y-3", className)} aria-busy="true" aria-label="Loading table">
        <div className="flex gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Shimmer key={i} className="h-4 flex-1" />
          ))}
        </div>
        {Array.from({ length: rows || 4 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            {Array.from({ length: 4 }).map((_, j) => (
              <Shimmer key={j} className={cn("h-3 flex-1", j === 0 ? "w-1/4" : j === 3 ? "w-1/6" : "")} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border border-border-subtle bg-surface p-6", className)} aria-busy="true" aria-label="Loading content">
      <Shimmer className="mb-4 h-4 w-3/4" />
      <Shimmer className="mb-2 h-3 w-full" />
      <Shimmer className="mb-2 h-3 w-5/6" />
      <Shimmer className="h-3 w-2/3" />
    </div>
  );
}
