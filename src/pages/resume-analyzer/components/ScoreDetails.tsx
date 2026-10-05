import { cn } from "@/lib/utils";
import { ScoreBreakdown } from "@/components/results/ScoreBreakdown";
import { ScoreExplanation } from "@/components/results/ScoreExplanation";
import type { ResumeAnalysisResult } from "../core/_models";

/** Under the page, on the desk: each scored factor and the overall arithmetic. */
export function ScoreDetails({ result, className }: { result: ResumeAnalysisResult; className?: string }) {
  return (
    <section aria-labelledby="how-title" className={className}>
      <h2 id="how-title" className="font-serif text-[28px] font-medium tracking-[-0.01em] text-foreground">
        How the score adds up
      </h2>
      <p className="mt-1.5 max-w-2xl text-[14px] text-muted-foreground">Each factor, what was counted, and how it is scored.</p>
      <div
        className={cn(
          "mt-7 grid gap-12",
          result.scoreExplanation && "xl:grid-cols-[minmax(0,1fr)_22rem]"
        )}
      >
        <ScoreBreakdown items={result.breakdown} />
        {result.scoreExplanation && <ScoreExplanation explanation={result.scoreExplanation} />}
      </div>
    </section>
  );
}
