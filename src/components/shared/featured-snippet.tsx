import { JsonLd } from "./json-ld";

interface FeaturedSnippetProps {
  answer: string;
  keyTakeaways: string[];
  toolName: string;
}

function snippetSchema(answer: string, toolName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${toolName} â€” Quick Answer`,
    description: answer,
  };
}

export function FeaturedSnippet({ answer, keyTakeaways, toolName }: FeaturedSnippetProps) {
  return (
    <>
      <JsonLd data={snippetSchema(answer, toolName)} />
      <section className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="rounded-xl border border-nuvora-200 bg-nuvora-50 p-6 dark:border-nuvora-800 dark:bg-nuvora-950/40">
          <p className="text-xs font-semibold uppercase tracking-wider text-nuvora-600 dark:text-nuvora-400">
            {toolName} â€” Quick Answer
          </p>
          <p className="mt-3 text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
            {answer}
          </p>
          <h3 className="mt-5 text-sm font-semibold text-nuvora-700 dark:text-nuvora-300">
            Key Takeaways
          </h3>
          <ul className="mt-2 space-y-1.5">
            {keyTakeaways.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <svg viewBox="0 0 16 16" fill="currentColor" className="mt-0.5 size-4 shrink-0 text-nuvora-600" aria-hidden="true">
                  <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zm3.36 5.66a.75.75 0 0 0-1.06-1.06L7 7.73 5.7 6.44a.75.75 0 1 0-1.06 1.06l1.81 1.81a.75.75 0 0 0 1.06 0z" />
                </svg>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
