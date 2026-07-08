import { Skeleton } from "@/components/ui";

interface ToolSkeletonProps {
  count?: number;
  columns?: 1 | 2 | 3;
}

export function ToolSkeleton({ count = 12, columns = 3 }: ToolSkeletonProps) {
  return <Skeleton count={count} columns={columns} />;
}
