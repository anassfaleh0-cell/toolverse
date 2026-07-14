import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import type { BreadcrumbItem } from "@/lib/seo";
import { Icon } from "@/components/shared/icon";

interface ToolHeroProps {
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
  children?: ReactNode;
  introText?: string;
}

export function ToolHero({ title, description, breadcrumbs, children, introText }: ToolHeroProps) {
  return (
    <div>
      <div className="mb-3">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <div className="flex items-start gap-3 mb-6">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-nuvora-100 text-nuvora-600 dark:bg-nuvora-900/50 dark:text-nuvora-400">
          <Icon name="PenSquare" className="size-5" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-text-primary sm:text-2xl">{title}</h1>
          <p className="mt-1 text-sm text-text-tertiary leading-relaxed">{description}</p>
        </div>
      </div>
      {introText && (
        <div className="mb-6 rounded-lg border border-border-subtle bg-surface p-4">
          <p className="text-sm text-text-secondary leading-relaxed">{introText}</p>
        </div>
      )}
      <div className="nuvora-card p-4 sm:p-6" role="region" aria-label="Tool interface">
        {children}
      </div>
    </div>
  );
}
