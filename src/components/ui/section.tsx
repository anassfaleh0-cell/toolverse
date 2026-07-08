import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  action?: ReactNode;
  id?: string;
}

export function Section({
  children,
  className,
  title,
  description,
  action,
  id,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "border-b border-zinc-200 py-16 dark:border-zinc-800 sm:py-20",
        className,
      )}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {(title || description || action) && (
          <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              {title && (
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-2 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
                  {description}
                </p>
              )}
            </div>
            {action && <div>{action}</div>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export function SectionHeading({
  children,
  className,
  as: Tag = "h2",
}: {
  children: ReactNode;
  className?: string;
  as?: "h2" | "h3" | "h4";
}) {
  return (
    <Tag
      className={cn(
        "text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
