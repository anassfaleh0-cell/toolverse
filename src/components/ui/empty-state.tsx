import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center sm:py-20">
      {icon ? (
        <div className="mb-4 text-3xl opacity-50 dark:opacity-40">
          {icon}
        </div>
      ) : (
        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border-2 border-dashed border-border-subtle text-2xl text-text-tertiary">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="size-6">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        </div>
      )}
      <h3 className="text-lg font-semibold text-text-primary">
        {title}
      </h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-text-secondary leading-relaxed">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-6">{action}</div>
      )}
    </div>
  );
}
