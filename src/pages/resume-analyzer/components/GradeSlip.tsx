import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { GradeMark } from "@/components/results/GradeMark";
import { PriorityBadge } from "@/components/results/PriorityBadge";
import { SCORE_TONES } from "@/components/results/semantic-tokens";
import { getScoreState, type ActionPlanItem } from "@/types/analysis";
import type { ResumeAnalysisResult } from "../core/_models";

interface GradeSlipProps {
  result: ResumeAnalysisResult;
  /** Point at a fix's places on the page. */
  onShowFix: (ids: string[]) => void;
  className?: string;
}

/**
 * The grade, clipped to the page: the score as a pen circle, what it means,
 * how far fixing the scored issues takes it, and the fixes in order. Picking
 * a fix opens its detail and points at the lines it is about.
 */
export function GradeSlip({ result, onShowFix, className }: GradeSlipProps) {
  const { score, label } = result.overall;
  const state = getScoreState(score);
  const { current, potential } = result.potentialScore;
  const gain = potential - current;

  return (
    <aside aria-labelledby="grade-title" className={cn("paper px-6 py-7", className)}>
      <h2 id="grade-title" className="sr-only">
        Score and fixes
      </h2>
      {/* The grade first, its words under it: a status like "Needs Improvement" never fits beside the circle. */}
      <GradeMark score={score} size={132} delayMs={300} className="-ml-1.5" />
      <p className="mt-2 text-[13px] text-paper-muted">{label}</p>
      <p className={cn("font-serif text-[22px] font-semibold leading-tight", SCORE_TONES[state.colorToken].text)}>
        {state.status}
      </p>
      <p className="mt-3 text-[14px] leading-relaxed">{result.scoreExplanation?.headline ?? result.summaryText}</p>

      <div className="mt-5 border-t border-paper-line pt-4">
        {gain > 0 ? (
          <>
            <p className="flex items-baseline gap-2">
              <span className="text-[13px] text-paper-muted">Up to</span>
              <span className="font-serif text-[34px] font-medium italic leading-none tabular-nums">{potential}</span>
              <span className="text-[13.5px] font-semibold tabular-nums text-pen-green">+{gain}</span>
            </p>
            <p className="mt-1.5 text-[12.5px] leading-snug text-paper-muted">
              If you resolve the scored issues below. Optional suggestions may remain.
            </p>
          </>
        ) : (
          <p className="text-[13px] text-paper-muted">No scored issues left to resolve. The suggestions on the page are optional.</p>
        )}
      </div>

      {result.actionPlan.length > 0 && (
        <>
          <h3 className="mt-6 font-serif text-[19px] font-semibold">Fix these first</h3>
          <ol className="mt-1.5 divide-y divide-paper-line">
            {result.actionPlan.map((item, index) => (
              <FixItem
                key={item.id ?? item.title}
                item={item}
                rank={index + 1}
                onShow={() => onShowFix(fixPlaces(result, item))}
              />
            ))}
          </ol>
        </>
      )}
    </aside>
  );
}

function FixItem({ item, rank, onShow }: { item: ActionPlanItem; rank: number; onShow: () => void }) {
  const [open, setOpen] = useState(false);
  const detailId = useId();
  const impact = item.overallScoreImpact ?? 0;

  return (
    <li>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={detailId}
        onClick={() => {
          setOpen(!open);
          if (!open) onShow();
        }}
        className="-mx-2 flex w-[calc(100%+1rem)] cursor-pointer items-start gap-3 rounded-sm px-2 py-3 text-left transition-colors hover:bg-paper-ink/4"
      >
        <span className="w-4 shrink-0 font-serif text-[17px] italic leading-tight text-paper-muted">{rank}</span>
        <span className="min-w-0 flex-1">
          <span className="block text-[14px] font-semibold leading-snug">{item.title}</span>
          <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <PriorityBadge priority={item.priority} />
            {item.category && <span className="text-[12px] text-paper-muted">{item.category}</span>}
          </span>
        </span>
        {/* Only the change to the overall score: section points use another scale. */}
        <span className="shrink-0 pt-0.5 text-[13px] font-semibold tabular-nums">
          {impact > 0 ? (
            <span className="text-pen-green">+{impact}</span>
          ) : (
            // A flagged issue outside the overall score (years claimed vs. listed) is not optional.
            <span className="font-medium text-paper-muted">
              {(item.resolvesDeductionIds ?? []).length > 0 ? "Recommended" : "Optional"}
            </span>
          )}
        </span>
      </button>
      <div id={detailId} hidden={!open} className="pb-3 pl-7 text-[13px] leading-relaxed text-paper-muted">
        {item.detail && <p>{item.detail}</p>}
        <p className="mt-1.5 text-[12.5px] italic">Marked on the page.</p>
      </div>
    </li>
  );
}

/**
 * Where a fix applies, on the page: the lines its deductions name, or their
 * section when no line is named; a missing section by its name.
 */
function fixPlaces(result: ResumeAnalysisResult, item: ActionPlanItem): string[] {
  const resolves = new Set(item.resolvesDeductionIds ?? []);
  const places = new Set<string>();
  for (const section of result.sections) {
    const lineIds = new Set((section.lineReviews ?? []).map((line) => line.id));
    for (const deduction of section.deductions ?? []) {
      if (!resolves.has(deduction.id)) continue;
      const lines = deduction.sourceIds.filter((id) => lineIds.has(id));
      for (const id of lines.length > 0 ? lines : [section.id]) places.add(id);
    }
  }
  if (places.size === 0 && result.stats?.missingSections?.includes(item.category)) places.add(`missing:${item.category}`);
  return [...places];
}
