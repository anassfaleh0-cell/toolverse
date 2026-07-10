import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "elevated" | "interactive" | "premium";
}

const variantStyles = {
  default:
    "rounded-xl border border-border-subtle bg-surface",
  elevated:
    "rounded-xl border border-border-subtle bg-surface shadow-sm",
  interactive:
    "rounded-xl border border-border-subtle bg-surface shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]",
  premium:
    "rounded-2xl border border-border-subtle bg-gradient-to-br from-surface to-surface-secondary/50 shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5",
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
