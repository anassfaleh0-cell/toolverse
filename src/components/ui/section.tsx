import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  action?: ReactNode;
  id?: string;
  background?: "default" | "muted" | "brand" | "gradient";
}

const bgStyles: Record<string, string> = {
  default: "bg-background",
  muted: "bg-surface-secondary/50",
  brand: "bg-nuvora-50 dark:bg-nuvora-950/30",
  gradient: "bg-gradient-to-b from-surface to-background",
};

export function Section({
  children,
  className,
  title,
  description,
  action,
  id,
  background = "default",
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("border-b border-border-subtle py-20 sm:py-24", bgStyles[background], className)}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {(title || description || action) && (
          <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              {title && (
                <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-3 text-lg text-text-secondary">
                  {description}
                </p>
              )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
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
        "text-2xl font-bold tracking-tight text-text-primary",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
