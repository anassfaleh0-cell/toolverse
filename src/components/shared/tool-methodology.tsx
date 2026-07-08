interface MethodologySection {
  title: string;
  body: string;
}

interface ToolMethodologyProps {
  sections: MethodologySection[];
}

export function ToolMethodology({ sections }: ToolMethodologyProps) {
  return (
    <div className="rounded-xl border border-zinc-200 p-5 text-sm dark:border-zinc-800">
      <h3 className="mb-3 font-semibold text-zinc-900 dark:text-zinc-50">
        How This Works
      </h3>
      <div className="space-y-3">
        {sections.map((s) => (
          <div key={s.title}>
            <h4 className="font-medium text-zinc-800 dark:text-zinc-200">{s.title}</h4>
            <p className="mt-0.5 text-zinc-600 dark:text-zinc-400">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
