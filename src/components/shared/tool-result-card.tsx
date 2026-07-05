import { cn } from "@/lib/utils";

interface ToolResultCardProps {
  label: string;
  value: string;
  icon: string;
  mono?: boolean;
}

export function ToolResultCard({
  label,
  value,
  icon,
  mono,
}: ToolResultCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-lg dark:bg-zinc-800">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {label}
          </p>
          <p
            className={cn(
              "truncate font-medium text-zinc-900 dark:text-zinc-50",
              mono && "font-mono text-sm",
            )}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
