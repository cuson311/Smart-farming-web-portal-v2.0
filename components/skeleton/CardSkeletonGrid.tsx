import { ReactElement } from "react";
import { Skeleton } from "../ui/skeleton";

interface CardSkeletonGridProps {
  count?: number;
  component: ReactElement | null;
  className?: string;
}

export function CardSkeletonGrid({
  count = 6,
  component = (
    <div className="max-w-[300px] w-full flex items-center gap-3">
      <div>
        <Skeleton className="flex rounded-full w-12 h-12" />
      </div>
      <div className="w-full flex flex-col gap-2">
        <Skeleton className="h-3 w-3/5 rounded-lg" />
        <Skeleton className="h-3 w-4/5 rounded-lg" />
      </div>
    </div>
  ),
  className = "grid gap-4 w-full md:grid-cols-2 lg:grid-cols-3",
}: CardSkeletonGridProps) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{component}</div>
      ))}
    </div>
  );
}
