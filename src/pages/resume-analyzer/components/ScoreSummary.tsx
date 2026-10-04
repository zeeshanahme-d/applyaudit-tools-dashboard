import { OverallScore } from "@/components/results/OverallScore";
import { ScoreBreakdown } from "@/components/results/ScoreBreakdown";
import { ImprovementPotential } from "@/components/results/ImprovementPotential";
import { ScoreExplanation } from "@/components/results/ScoreExplanation";
import type { ResumeAnalysisResult } from "../core/_models";

/** The score, why it is that score, the breakdown and what is recoverable: one summary. */
export function ScoreSummary({ result }: { result: ResumeAnalysisResult }) {
  return (
    <section aria-label="Score summary" className="overflow-hidden rounded-xl border border-border bg-card shadow-raised">
      <div className="grid lg:grid-cols-[19rem_minmax(0,1fr)]">
        <div className="border-b border-border p-6 lg:border-b-0 lg:border-r">
          <OverallScore
            title="Resume Score"
            subtitle={result.scoreExplanation?.headline ?? result.summaryText}
            score={result.overall.score}
            label={result.overall.label}
          >
            {result.scoreExplanation && <ScoreExplanation explanation={result.scoreExplanation} />}
          </OverallScore>
        </div>
        <div className="p-6">
          <ScoreBreakdown items={result.breakdown} />
        </div>
      </div>
      <div className="border-t border-border bg-surface/50 px-6 py-5">
        <ImprovementPotential currentScore={result.potentialScore.current} potentialScore={result.potentialScore.potential} />
      </div>
    </section>
  );
}
