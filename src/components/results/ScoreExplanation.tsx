import { ChevronDown } from "lucide-react";
import type { ScoreExplanation as Explanation } from "@/types/analysis";

/** "Why this score?": what earned the score and what each scored gap costs overall. */
export function ScoreExplanation({ explanation }: { explanation: Explanation }) {
  const { strengths, deductions } = explanation;
  if (strengths.length === 0 && deductions.length === 0) return null;

  return (
    <details className="group mt-5 w-full text-left">
      <summary className="mx-auto flex min-h-6 w-fit cursor-pointer list-none items-center gap-1.5 pointer-coarse:min-h-11 rounded-sm text-[13px] font-medium text-primary transition-colors hover:text-primary-hover [&::-webkit-details-marker]:hidden">
        Why this score?
        <ChevronDown className="size-3.5 transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="mt-4 space-y-4 rounded-lg border border-border bg-surface/60 p-4 text-[12.5px]">
        {strengths.length > 0 && (
          <div className="space-y-1.5">
            <p className="font-semibold text-foreground">Strengths</p>
            <ul className="space-y-1.5">
              {strengths.map((strength) => (
                <li key={strength} className="flex items-start gap-2 text-foreground/90">
                  <span className="font-semibold text-success" aria-hidden="true">+</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {deductions.length > 0 && (
          <div className="space-y-1.5">
            <p className="font-semibold text-foreground">Deductions</p>
            <ul className="space-y-1.5">
              {deductions.map((deduction) => (
                <li key={deduction.label} className="flex items-start justify-between gap-3 text-foreground/90">
                  <span>{deduction.label}</span>
                  <span className="shrink-0 font-semibold tabular-nums text-danger">{deduction.points} overall</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </details>
  );
}
