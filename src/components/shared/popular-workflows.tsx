import Link from "next/link";
import { POPULAR_WORKFLOWS } from "@/lib/seo/internal-links";

export function PopularWorkflows() {
  return (
    <section className="mt-8">
      <h2 className="mb-1 text-base font-bold text-text-primary">
        Popular Workflows
      </h2>
      <p className="mb-5 text-xs text-text-tertiary">
        Multi-tool workflows to solve common tasks end-to-end.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {POPULAR_WORKFLOWS.map((workflow) => (
          <div
            key={workflow.id}
            className="rounded-xl border border-border-subtle bg-surface p-4 transition-all hover:shadow-sm"
          >
            <h3 className="text-sm font-semibold text-text-primary">
              {workflow.title}
            </h3>
            <p className="mt-0.5 text-xs text-text-tertiary">
              {workflow.description}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {workflow.steps.map((step, idx) => (
                <span key={step.toolSlug + step.label} className="inline-flex items-center gap-1">
                  <Link
                    href={`/${step.toolSlug}`}
                    className="rounded-md bg-nuvora-50 px-2 py-1 text-[11px] font-medium text-nuvora-700 transition-colors hover:bg-nuvora-100 dark:bg-nuvora-900/40 dark:text-nuvora-300 dark:hover:bg-nuvora-900"
                  >
                    {step.label}
                  </Link>
                  {idx < workflow.steps.length - 1 && (
                    <span className="text-[11px] text-zinc-400 dark:text-zinc-600">&rarr;</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
