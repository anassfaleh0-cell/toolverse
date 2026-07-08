import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

const trendColors = {
  up: "text-emerald-600 dark:text-emerald-400",
  down: "text-red-600 dark:text-red-400",
  neutral: "text-zinc-500 dark:text-zinc-400",
};

export function MetricCard({
  label,
  value,
  icon,
  trend,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {label}
        </p>
        {icon && (
          <span className="text-zinc-400 dark:text-zinc-500">
            {icon}
          </span>
        )}
      </div>
      <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        {value}
      </p>
      {trend && (
        <p className={cn("mt-1 text-xs font-medium", trendColors[trend])}>
          {trend === "up" && "↑ "}
          {trend === "down" && "↓ "}
          {trend === "neutral" && "→ "}
          {trend === "up" && "Increasing"}
          {trend === "down" && "Decreasing"}
          {trend === "neutral" && "Stable"}
        </p>
      )}
    </div>
  );
}
