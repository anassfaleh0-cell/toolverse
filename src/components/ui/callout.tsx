import { cn } from "@/lib/utils";
import { Icon } from "@/components/shared/icon";
import type { ReactNode } from "react";

type CalloutVariant = "tip" | "warning" | "info" | "note";

interface CalloutProps {
  children: ReactNode;
  variant?: CalloutVariant;
  title?: string;
  className?: string;
}

const variantStyles: Record<CalloutVariant, string> = {
  tip: "border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30",
  warning: "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30",
  info: "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30",
  note: "border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50",
};

const iconColors: Record<CalloutVariant, string> = {
  tip: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  info: "text-blue-600 dark:text-blue-400",
  note: "text-zinc-500 dark:text-zinc-400",
};

const icons: Record<CalloutVariant, ReactNode> = {
  tip: (
    <Icon name="Lightbulb" className="size-5" aria-hidden="true" />
  ),
  warning: (
    <Icon name="AlertTriangle" className="size-5" aria-hidden="true" />
  ),
  info: (
    <Icon name="Info" className="size-5" aria-hidden="true" />
  ),
  note: (
    <Icon name="Plus" className="size-5" aria-hidden="true" />
  ),
};

export function Callout({
  children,
  variant = "info",
  title,
  className,
}: CalloutProps) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        variantStyles[variant],
        className,
      )}
    >
      <div className="flex gap-3">
        <span className={cn("mt-0.5 shrink-0", iconColors[variant])}>
          {icons[variant]}
        </span>
        <div className="min-w-0 text-sm text-zinc-700 dark:text-zinc-300">
          {title && (
            <p className="mb-1 font-semibold">{title}</p>
          )}
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
