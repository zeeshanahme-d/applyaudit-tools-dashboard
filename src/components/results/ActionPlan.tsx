import { ArrowRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { PriorityBadge } from "./PriorityBadge";
import type { ActionPlanItem } from "@/types/analysis";

export interface ActionPlanProps {
  items: ActionPlanItem[];
  currentScore: number;
  potentialScore: number;
  className?: string;
  onActionClick?: (item: ActionPlanItem) => void;
}

export function ActionPlan({
  items,
  currentScore,
  potentialScore,
  className,
  onActionClick,
}: ActionPlanProps) {
  const totalGain = potentialScore - currentScore;

  return (
    <section className={cn("overflow-hidden rounded-xl border border-border bg-card shadow-raised", className)}>
      <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <div className="flex items-center gap-2 text-[12px] font-medium text-primary">
            <TrendingUp className="size-4" aria-hidden="true" />
            Your Priority Action Plan
          </div>
          <h3 className="mt-1 font-display text-lg font-semibold tracking-tight text-foreground">What to Fix First</h3>
          <p className="mt-0.5 text-[12.5px] text-muted-foreground">Ranked by score impact and priority</p>
        </div>

        {/* Score comparison */}
        <div className="flex shrink-0 items-center gap-3 rounded-lg border border-border bg-surface/60 px-4 py-2.5 tabular-nums">
          <div>
            <span className="block text-[12px] text-muted-foreground">Current Score</span>
            <span className="block font-display text-lg font-semibold text-foreground">{currentScore}</span>
          </div>
          <ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" />
          <div>
            <span className="block text-[12px] text-muted-foreground">Scored Potential</span>
            <span className="block font-display text-lg font-semibold text-success">{potentialScore}</span>
          </div>
          {totalGain > 0 && (
            <div className="ml-1 border-l border-border pl-3">
              <span className="block text-[12px] text-muted-foreground">Recoverable</span>
              <span className="block font-display text-lg font-semibold text-success">+{totalGain}</span>
            </div>
          )}
        </div>
      </div>

      <p className="border-b border-border bg-surface/40 px-5 py-2.5 text-[12px] text-muted-foreground sm:px-6">
        Scored Potential reflects resolving the currently scored issues. Optional improvements may still remain.
      </p>

      {/* Action items, in order */}
      <ol className="divide-y divide-border">
        {items.map((item, idx) => (
          <li
            key={item.title}
            onClick={() => onActionClick?.(item)}
            className={cn(
              "flex flex-col gap-3 px-5 py-4 transition-colors sm:flex-row sm:items-center sm:justify-between sm:px-6",
              onActionClick && "cursor-pointer hover:bg-muted/40"
            )}
          >
            <div className="flex min-w-0 flex-1 items-start gap-3.5">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-[12px] font-semibold tabular-nums text-accent-foreground">
                {idx + 1}
              </span>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[13.5px] font-semibold text-foreground">{item.title}</span>
                  <PriorityBadge priority={item.priority} />
                  {item.category && (
                    <span className="inline-flex h-5 items-center rounded-full bg-muted px-2 text-[12px] text-muted-foreground">
                      {item.category}
                    </span>
                  )}
                </div>
                {item.detail && <p className="text-[12.5px] leading-relaxed text-muted-foreground">{item.detail}</p>}
              </div>
            </div>

            {/* Only the change to the overall score: section points use a
                different scale, and showing both side by side reads as a contradiction. */}
            <div className="shrink-0 self-start pl-9 sm:self-center sm:pl-0">
              {(item.overallScoreImpact ?? 0) > 0 ? (
                <span className="inline-flex h-7 items-center rounded-md border border-success-line bg-success-soft px-2.5 text-[12px] font-semibold tabular-nums text-success">
                  +{item.overallScoreImpact} to your score
                </span>
              ) : (
                // A flagged issue outside the overall score (years claimed vs. listed) is not optional.
                <span className="inline-flex h-7 items-center rounded-md border border-border bg-muted px-2.5 text-[12px] font-medium text-muted-foreground">
                  {(item.resolvesDeductionIds ?? []).length > 0 ? "Recommended" : "Optional"}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
