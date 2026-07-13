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
    "nuvora-button-primary rounded-xl",
  secondary:
    "border border-border-subtle bg-surface text-text-primary hover:bg-surface-secondary active:scale-[0.97] shadow-sm transition-all duration-150 ease-out",
  ghost:
    "text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-all duration-150 ease-out",
  danger:
    "bg-red-600 text-white hover:bg-red-500 active:scale-[0.97] shadow-sm transition-all duration-150 ease-out dark:bg-red-700 dark:hover:bg-red-600",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-8 text-base",
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
        "inline-flex items-center justify-center font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nuvora-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950",
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
