import { cn } from "@/lib/utils";

type Status = "healthy" | "warning" | "critical" | "inactive" | "info";

interface StatusDotProps {
  status: Status;
  label?: string;
  className?: string;
  pulse?: boolean;
}

const dotStyles: Record<Status, string> = {
  healthy: "bg-emerald-500",
  warning: "bg-amber-500",
  critical: "bg-red-500",
  inactive: "bg-zinc-300 dark:bg-zinc-600",
  info: "bg-blue-500",
};

const labelStyles: Record<Status, string> = {
  healthy: "text-emerald-700 dark:text-emerald-400",
  warning: "text-amber-700 dark:text-amber-400",
  critical: "text-red-700 dark:text-red-400",
  inactive: "text-zinc-500 dark:text-zinc-400",
  info: "text-blue-700 dark:text-blue-400",
};

export function StatusDot({
  status,
  label,
  className,
  pulse,
}: StatusDotProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span
        className={cn(
          "inline-block size-2 rounded-full",
          dotStyles[status],
          pulse && "animate-pulse",
        )}
        aria-hidden="true"
      />
      {label && (
        <span className={cn("text-xs font-medium", labelStyles[status])}>
          {label}
        </span>
      )}
    </span>
  );
}
