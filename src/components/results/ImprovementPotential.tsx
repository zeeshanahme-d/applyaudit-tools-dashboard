import { TrendingUp, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ImprovementPotentialProps {
  currentScore: number;
  potentialScore: number;
  className?: string;
  notes?: string;
}

/** Not a promise of a perfect resume: only what resolving the scored issues adds. */
const SCORED_POTENTIAL_HELP =
  "Scored Potential reflects resolving the currently scored issues. Optional improvements may still remain.";

export function ImprovementPotential({
  currentScore,
  potentialScore,
  className,
  notes = SCORED_POTENTIAL_HELP,
}: ImprovementPotentialProps) {
  const diff = potentialScore - currentScore;
  const message = diff > 0 ? notes : "No scored issues left to resolve. The suggestions below are optional.";

  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div className="flex items-start gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
          <TrendingUp className="size-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-[13px] font-semibold text-foreground">Scored Potential</p>
          <p className="mt-0.5 max-w-md text-[12.5px] leading-snug text-muted-foreground">{message}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3 tabular-nums">
        <div>
          <span className="block text-[12px] text-muted-foreground">Current Score</span>
          <span className="block font-display text-xl font-semibold text-foreground">{currentScore}</span>
        </div>
        <ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" />
        <div>
          <span className="block text-[12px] text-muted-foreground">Scored Potential</span>
          <span className="block font-display text-xl font-semibold text-success">{potentialScore}</span>
        </div>
        {diff > 0 && (
          <span className="ml-1 inline-flex h-6 items-center rounded-full border border-success-line bg-success-soft px-2.5 text-xs font-semibold text-success">
            +{diff} Recoverable
          </span>
        )}
      </div>
    </div>
  );
}
