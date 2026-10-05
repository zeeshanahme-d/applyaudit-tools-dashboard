import { useState } from "react";
import { getSemanticState } from "@/components/results/semantic-tokens";
import type { AnalysisMeta, ResumeAnalysisResult } from "../core/_models";
import type { PageMode } from "./MarkedLine";
import { ReportHeader } from "./ReportHeader";
import { GradeSlip } from "./GradeSlip";
import { MarkedUpResume, type PageFocus } from "./MarkedUpResume";
import { ScoreDetails } from "./ScoreDetails";
import { MarkLegend } from "./MarkLegend";
import { DeterministicModeNotice, ReadingNotes } from "./ReportNotices";

interface AnalysisReportProps {
  result: ResumeAnalysisResult;
  meta: AnalysisMeta;
  onReset: () => void;
}

/**
 * The finished audit: the resume marked up, beside its grade and the fixes in
 * order (picking one points at its lines), then how the score adds up.
 */
export function AnalysisReport({ result, meta, onReset }: AnalysisReportProps) {
  const [mode, setMode] = useState<PageMode>("marked");
  const [focus, setFocus] = useState<PageFocus | null>(null);
  const hasRewrites = result.sections.some(
    (section) =>
      Boolean(section.improvedContent) ||
      (section.lineReviews ?? []).some((line) => line.improved && getSemanticState(line.status) !== "strong")
  );

  return (
    <div className="mt-8">
      {/* The AI review was unavailable: say so before anything else */}
      {meta.analysisMode === "deterministic_only" && <DeterministicModeNotice reason={meta.ai?.reason} />}

      <ReportHeader meta={meta} mode={mode} onModeChange={setMode} hasRewrites={hasRewrites} onReset={onReset} />

      {/* How to read the marks: beside the grade on wide screens, above the page otherwise. */}
      <div data-print="hide" className="mt-5 xl:hidden">
        <MarkLegend />
      </div>

      <div className="mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_18rem] xl:gap-8">
        <div className="xl:sticky xl:top-6 xl:order-2">
          <GradeSlip result={result} onShowFix={(ids) => setFocus((prev) => ({ ids, key: (prev?.key ?? 0) + 1 }))} />
          <div data-print="hide" className="mt-6 hidden xl:block">
            <MarkLegend />
          </div>
        </div>
        <MarkedUpResume result={result} mode={mode} focus={focus} className="xl:order-1" />
      </div>

      {/* Informational: doubts about how the file was read */}
      {result.confidenceIssues && result.confidenceIssues.length > 0 && (
        <ReadingNotes issues={result.confidenceIssues} className="mt-8" />
      )}

      <ScoreDetails result={result} className="mt-16" />
    </div>
  );
}
