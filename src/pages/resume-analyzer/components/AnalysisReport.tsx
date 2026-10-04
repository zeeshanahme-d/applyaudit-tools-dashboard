import { ActionPlan } from "@/components/results/ActionPlan";
import type { AnalysisMeta, ResumeAnalysisResult } from "../core/_models";
import { ReportHeader } from "./ReportHeader";
import { ScoreSummary } from "./ScoreSummary";
import { SectionReviews } from "./SectionReviews";
import { DeterministicModeNotice, ReadingNotes } from "./ReportNotices";

interface AnalysisReportProps {
  result: ResumeAnalysisResult;
  meta: AnalysisMeta;
  onReset: () => void;
}

/** The finished audit, in reading order: score first, what to fix next, then the detail. */
export function AnalysisReport({ result, meta, onReset }: AnalysisReportProps) {
  return (
    <div className="mt-6 space-y-8 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
      {/* The AI review was unavailable: say so before anything else */}
      {meta.analysisMode === "deterministic_only" && <DeterministicModeNotice reason={meta.ai?.reason} />}

      <ReportHeader meta={meta} onReset={onReset} />

      {/* 1-3. Score, why, the breakdown and what is recoverable */}
      <ScoreSummary result={result} />

      {/* 4. What to fix, before the detail */}
      <ActionPlan
        items={result.actionPlan}
        currentScore={result.potentialScore.current}
        potentialScore={result.potentialScore.potential}
      />

      {/* 5-6. Section-by-section analysis with line reviews */}
      <SectionReviews sections={result.sections} />

      {/* 7. Informational: doubts about how the file was read */}
      {result.confidenceIssues && result.confidenceIssues.length > 0 && <ReadingNotes issues={result.confidenceIssues} />}
    </div>
  );
}
