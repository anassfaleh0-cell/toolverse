interface ComparisonTableProps {
  title: string;
  headers: string[];
  rows: string[][];
  caption?: string;
}

export function ComparisonTable({ title, headers, rows, caption }: ComparisonTableProps) {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6">
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{title}</h2>
      {caption && (
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{caption}</p>
      )}
      <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              {headers.map((h, i) => (
                <th key={i} className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={`px-4 py-2.5 ${j === 0 ? "font-medium text-zinc-900 dark:text-zinc-100" : "text-zinc-600 dark:text-zinc-400"}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
