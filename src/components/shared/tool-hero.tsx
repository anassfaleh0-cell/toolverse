import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import type { BreadcrumbItem } from "@/lib/seo";

interface ToolHeroProps {
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
  children?: ReactNode;
}

export function ToolHero({ title, description, breadcrumbs, children }: ToolHeroProps) {
  return (
    <div className="text-center">
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="mt-6 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
        {title}
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary leading-relaxed">
        {description}
      </p>
      {children && <div className="mt-10" role="region" aria-label="Tool interface">{children}</div>}
    </div>
  );
}
