import { JsonLd } from "./json-ld";

interface StepByStepProps {
  title: string;
  steps: { title: string; body: string }[];
  toolSlug: string;
}

function howToSchema(title: string, steps: { title: string; body: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: title,
    step: steps.map((s) => ({
      "@type": "HowToStep",
      name: s.title,
      text: s.body,
    })),
  };
}

export function StepByStep({ title, steps, toolSlug }: StepByStepProps) {
  return (
    <>
      <JsonLd data={howToSchema(title, steps)} />
      <section className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{title}</h2>
        <ol className="mt-6 space-y-6">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-nuvora-100 text-sm font-bold text-nuvora-700 dark:bg-nuvora-900 dark:text-nuvora-300">
                {i + 1}
              </span>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{step.title}</h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
