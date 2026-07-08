import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "elevated" | "interactive";
}

const variantStyles = {
  default:
    "rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900",
  elevated:
    "rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900",
  interactive:
    "rounded-xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900",
};

export function Card({
  className,
  children,
  variant = "interactive",
  ...props
}: CardProps) {
  return (
    <div
      className={cn(variantStyles[variant], "p-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}
