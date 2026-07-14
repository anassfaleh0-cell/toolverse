import { cn } from "@/lib/utils";
import { forwardRef, type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, hasError, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-lg border bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-500 outline-none transition-colors focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:ring-blue-400",
          hasError
            ? "border-red-300 focus:ring-red-500 dark:border-red-700 dark:focus:ring-red-400"
            : "border-zinc-300 dark:border-zinc-700",
          className,
        )}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
