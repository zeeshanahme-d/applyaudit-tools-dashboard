import { cn } from "@/lib/utils";

export type PriorityLevel = "critical" | "high" | "medium" | "low";

const styles: Record<PriorityLevel, string> = {
  critical: "border-danger-line bg-danger-soft text-danger",
  high: "border-warning-line bg-warning-soft text-warning",
  medium: "border-info-line bg-info-soft text-info",
  low: "border-border bg-muted text-muted-foreground",
};

export function PriorityBadge({
  priority,
  className,
}: {
  priority: PriorityLevel;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-5 shrink-0 items-center rounded-full border px-2 text-[12px] font-medium capitalize",
        styles[priority] ?? styles.medium,
        className
      )}
    >
      {priority}
    </span>
  );
}
