export default function ToolLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="mb-4 h-8 w-1/3 rounded bg-gray-200 dark:bg-zinc-700" />
        <div className="mb-8 h-4 w-2/3 rounded bg-gray-200 dark:bg-zinc-700" />
        <div className="h-64 rounded bg-gray-200 dark:bg-zinc-700" />
      </div>
    </div>
  );
}
