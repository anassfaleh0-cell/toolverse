import { JsonLd } from "./json-ld";
import { faqSchema, type FaqItem } from "@/lib/seo";

interface ToolFaqSectionProps {
  items: FaqItem[];
  toolName: string;
}

export function ToolFaqSection({ items, toolName }: ToolFaqSectionProps) {
  if (items.length === 0) return null;
  return (
    <>
      <JsonLd data={faqSchema(items)} />
      <section className="rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Frequently Asked Questions About {toolName}
          </h2>
        </div>
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {items.map((item, i) => (
            <details key={i} className="group">
              <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:text-zinc-50 dark:hover:bg-zinc-900/50">
                {item.question}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-4 shrink-0 text-zinc-400 transition-transform group-open:rotate-180" aria-hidden="true">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>
              <p className="px-5 pb-4 text-sm text-zinc-600 dark:text-zinc-400">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
