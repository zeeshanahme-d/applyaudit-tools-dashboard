import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { getScoreState, type ScoreStatus } from "@/types/analysis";
import { StatusBadge } from "./StatusBadge";
import { SCORE_TONES } from "./semantic-tokens";

export interface SectionHeaderProps {
  name: string;
  score: number;
  potentialScore?: number;
  status: ScoreStatus;
  company?: string;
  role?: string;
  dates?: string;
  isExpanded: boolean;
  onToggle: () => void;
  /** The id of the panel this header opens. */
  controlsId?: string;
  className?: string;
}

/** The section's toggle: a heading holding a real button, so it opens with the keyboard too. */
export function SectionHeader({
  name,
  score,
  potentialScore,
  status,
  company,
  role,
  dates,
  isExpanded,
  onToggle,
  controlsId,
  className,
}: SectionHeaderProps) {
  const tone = SCORE_TONES[getScoreState(score).colorToken];

  return (
    <h4 className={className}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={controlsId}
        className="group flex w-full cursor-pointer flex-col items-start gap-3 px-5 py-4 text-left transition-colors duration-150 hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between sm:px-6"
      >
        <span className="block min-w-0 flex-1 space-y-1">
          <span className="flex flex-wrap items-center gap-2.5">
            <span className="text-[15px] font-semibold tracking-tight text-foreground">{name}</span>
            <StatusBadge status={status} size="sm" />
          </span>

          {(company || role || dates) && (
            <span className="block text-[12.5px] font-normal text-muted-foreground">
              {role && <span className="font-medium text-foreground">{role} • </span>}
              {company && <span>{company} </span>}
              {dates && <span className="text-muted-foreground">({dates})</span>}
            </span>
          )}
        </span>

        <span className="flex shrink-0 items-center gap-4 self-stretch sm:self-center">
          <span className="flex flex-1 flex-col items-start gap-1.5 sm:items-end">
            <span className="flex items-baseline gap-1 tabular-nums">
              <span className="font-display text-lg font-semibold text-foreground">{score}</span>
              <span className="text-[12px] font-normal text-muted-foreground">/100</span>
              {potentialScore && potentialScore > score && (
                <span className="ml-2 text-[12px] font-medium text-success">Potential: {potentialScore}</span>
              )}
            </span>
            <span className="block h-1 w-24 overflow-hidden rounded-full bg-muted" aria-hidden="true">
              <span className={cn("block h-full origin-left rounded-full", tone.bar)} style={{ transform: `scaleX(${score / 100})` }} />
            </span>
          </span>

          <span
            className={cn(
              "flex size-7 items-center justify-center rounded-md text-muted-foreground transition-[rotate,color] duration-200 group-hover:text-foreground",
              isExpanded && "rotate-180"
            )}
          >
            <ChevronDown className="size-4" aria-hidden="true" />
          </span>
        </span>
      </button>
    </h4>
  );
}
