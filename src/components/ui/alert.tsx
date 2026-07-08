import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type AlertVariant = "error" | "warning" | "success" | "info";

interface AlertProps {
  children: ReactNode;
  variant?: AlertVariant;
  className?: string;
  title?: string;
}

const variantStyles: Record<AlertVariant, string> = {
  error:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400",
  warning:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-400",
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400",
  info:
    "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-400",
};

export function Alert({
  children,
  variant = "error",
  className,
  title,
}: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-xl border p-4 text-sm",
        variantStyles[variant],
        className,
      )}
    >
      {title && (
        <p className="mb-1 font-medium">{title}</p>
      )}
      <div>{children}</div>
    </div>
  );
}
