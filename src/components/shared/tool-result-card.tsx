import { cn } from "@/lib/utils";
import { Card } from "@/components/ui";
import { Icon } from "./icon";

interface ToolResultCardProps {
  label: string;
  value: string;
  icon: string;
  mono?: boolean;
  index?: number;
}

export function ToolResultCard({
  label,
  value,
  icon,
  mono,
  index = 0,
}: ToolResultCardProps) {
  return (
    <Card variant="default" className="p-4 nuvora-result-reveal" style={{ animationDelay: `${index * 25}ms` } as React.CSSProperties}>
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
          <Icon name={icon} className="size-5 text-nuvora-600 dark:text-nuvora-400" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {label}
          </p>
          <p
            className={cn(
              "truncate font-medium text-zinc-900 dark:text-zinc-50",
              mono && "font-mono text-sm",
            )}
          >
            {value}
          </p>
        </div>
      </div>
    </Card>
  );
}
