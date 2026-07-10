import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-nuvora-600 text-white hover:bg-nuvora-700 active:scale-[0.97] shadow-sm shadow-nuvora-600/20 dark:bg-nuvora-500 dark:hover:bg-nuvora-400 dark:shadow-nuvora-500/20",
  secondary:
    "border border-border-subtle bg-surface text-text-primary hover:bg-surface-secondary active:scale-[0.97]",
  ghost:
    "text-text-secondary hover:bg-surface-secondary hover:text-text-primary",
  danger:
    "bg-red-600 text-white hover:bg-red-500 active:scale-[0.97] dark:bg-red-700 dark:hover:bg-red-600",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-9 px-4 text-xs rounded-lg",
  md: "h-11 px-6 text-sm rounded-xl",
  lg: "h-12 px-8 text-base rounded-xl",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nuvora-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950",
        variantStyles[variant],
        sizeStyles[size],
        disabled && "pointer-events-none opacity-50",
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
