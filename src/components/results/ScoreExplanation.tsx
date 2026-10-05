import type { ScoreExplanation as Explanation } from "@/types/analysis";

/** "Why this score": what earned the score and what each scored gap costs overall. Frameless; the page places it. */
export function ScoreExplanation({ explanation, className }: { explanation: Explanation; className?: string }) {
  const { strengths, deductions } = explanation;
  if (strengths.length === 0 && deductions.length === 0) return null;

  return (
    <div className={className}>
      <h3 className="text-[14px] font-semibold text-foreground">Why this score</h3>
      {deductions.length > 0 && (
        <ul className="mt-3 divide-y divide-border border-y border-border text-[13.5px]">
          {deductions.map((deduction) => (
            <li key={deduction.label} className="flex items-start justify-between gap-4 py-2.5 text-foreground/90">
              <span>{deduction.label}</span>
              <span className="shrink-0 font-semibold tabular-nums text-danger">{deduction.points} overall</span>
            </li>
          ))}
        </ul>
      )}
      {strengths.length > 0 && (
        <ul className="mt-4 space-y-1.5 text-[13.5px]">
          {strengths.map((strength) => (
            <li key={strength} className="flex items-start gap-2 text-foreground/90">
              <span className="font-semibold text-success" aria-hidden="true">
                +
              </span>
              <span>{strength}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
