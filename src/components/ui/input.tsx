import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasError, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded-xl border bg-surface px-4 py-3 text-sm text-text-primary placeholder-text-tertiary outline-none transition-all duration-200 ease-out focus:ring-2 focus:ring-nuvora-500/30 focus:border-nuvora-400 dark:focus:ring-nuvora-400/20 dark:focus:border-nuvora-600",
          hasError
            ? "border-red-300 focus:ring-red-500 dark:border-red-700 dark:focus:ring-red-400"
            : "border-border-subtle",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
