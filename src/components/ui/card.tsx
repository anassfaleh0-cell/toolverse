import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "elevated" | "interactive" | "premium";
}

const variantStyles = {
  default:
    "nuvora-card",
  elevated:
    "nuvora-card shadow-sm",
  interactive:
    "nuvora-card cursor-pointer",
  premium:
    "nuvora-card bg-gradient-to-br from-surface to-surface-secondary/50",
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
