import { JsonLd } from "./json-ld";

interface AnswerBlockProps {
  question: string;
  answer: string;
  bulletPoints?: string[];
  codeExample?: { language: string; code: string };
  toolName?: string;
}

function qaPageSchema(question: string, answer: string) {
  return {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    },
  };
}

export function AnswerBlock({ question, answer, bulletPoints, codeExample, toolName }: AnswerBlockProps) {
  return (
    <>
      <JsonLd data={qaPageSchema(question, answer)} />
      <section className="rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {toolName ? `${toolName} — ` : ""}Quick Answer
          </p>
        </div>
        <div className="px-5 py-4">
          <dl>
            <dt className="font-semibold text-zinc-900 dark:text-zinc-50">
              {question}
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {answer}
            </dd>
          </dl>
          {bulletPoints && bulletPoints.length > 0 && (
            <ul className="mt-3 space-y-1">
              {bulletPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <svg viewBox="0 0 16 16" fill="currentColor" className="mt-0.5 size-4 shrink-0 text-blue-500" aria-hidden="true">
                    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zm3.36 5.66a.75.75 0 0 0-1.06-1.06L7 7.73 5.7 6.44a.75.75 0 1 0-1.06 1.06l1.81 1.81a.75.75 0 0 0 1.06 0z" />
                  </svg>
                  {point}
                </li>
              ))}
            </ul>
          )}
          {codeExample && (
            <pre className="mt-3 overflow-x-auto rounded-lg bg-zinc-900 p-4 text-xs text-zinc-100 dark:bg-black">
              <code>{codeExample.code}</code>
            </pre>
          )}
        </div>
      </section>
    </>
  );
}
