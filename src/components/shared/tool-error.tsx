interface ToolErrorProps {
  message: string;
  onRetry?: () => void;
}

export function ToolError({ message, onRetry }: ToolErrorProps) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950">
      <p className="text-red-600 dark:text-red-400">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-red-600 px-5 text-sm font-medium text-white transition-colors hover:bg-red-500"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
