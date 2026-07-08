import { Alert, Button } from "@/components/ui";

interface ToolErrorProps {
  message: string;
  onRetry?: () => void;
}

export function ToolError({ message, onRetry }: ToolErrorProps) {
  return (
    <Alert variant="error" className="p-8 text-center">
      <p>{message}</p>
      {onRetry && (
        <Button
          type="button"
          variant="danger"
          size="sm"
          onClick={onRetry}
          className="mt-4"
        >
          Try Again
        </Button>
      )}
    </Alert>
  );
}
