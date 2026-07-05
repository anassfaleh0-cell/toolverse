import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Tool } from "@/lib/registry";
import Link from "next/link";

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const isExternal = tool.url.startsWith("http");

  return (
    <Card className="flex flex-col">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
          {tool.name}
        </h3>
        {tool.isFree && <Badge variant="success">Free</Badge>}
      </div>
      <p className="mt-2 flex-1 text-sm text-zinc-600 dark:text-zinc-400">
        {tool.description}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <Badge>{tool.category.replace("-", " & ")}</Badge>
        <Link
          href={tool.url}
          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="text-sm font-medium text-zinc-900 underline-offset-2 hover:underline dark:text-zinc-50"
        >
          {isExternal ? "Visit" : "Open"} &rarr;
        </Link>
      </div>
    </Card>
  );
}
