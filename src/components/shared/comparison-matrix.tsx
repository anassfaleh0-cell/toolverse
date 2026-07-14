interface MatrixRow {
  feature: string;
  values: (string | boolean | number)[];
  highlight?: boolean;
}

interface ComparisonMatrixProps {
  headers: string[];
  rows: MatrixRow[];
  title?: string;
}

export function ComparisonMatrix({ headers, rows, title }: ComparisonMatrixProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-700">
      {title && (
        <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{title}</h3>
        </div>
      )}
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
            <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Feature</th>
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {rows.map((row, i) => (
            <tr key={i} className={row.highlight ? "bg-blue-50 dark:bg-blue-950" : ""}>
              <td className="px-4 py-2.5 font-medium text-zinc-900 dark:text-zinc-100">{row.feature}</td>
              {row.values.map((v, j) => (
                <td key={j} className="px-4 py-2.5 text-zinc-600 dark:text-zinc-400">
                  {typeof v === "boolean" ? (
                    <span className={v ? "text-green-700 dark:text-green-400" : "text-red-600"}>{v ? "✓" : "✗"}</span>
                  ) : (
                    v
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
