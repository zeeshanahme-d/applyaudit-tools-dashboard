import type { ActionPlanItem, ScoreExplanation, ScoreStatus, SectionReview } from "@/types/analysis";

/** What one analysis sends: the chosen file, or the built-in sample. */
export interface AnalyzeResumePayload {
  file?: File | null;
  useSample: boolean;
}

/** One row of the category breakdown (modules/scoring/scoring-types.ts). */
export interface ScoreBreakdownItem {
  label: string;
  score: number;
  status: ScoreStatus;
  detail?: string;
  help?: string;
}

/** The `data` of a resume analysis (modules/resume/orchestrator.ts). */
export interface ResumeAnalysisResult {
  overall: { score: number; status: string; label: string };
  potentialScore: { current: number; potential: number };
  summaryText: string;
  breakdown: ScoreBreakdownItem[];
  sections: SectionReview[];
  actionPlan: ActionPlanItem[];
  /** DeterministicResumeAnalysis["stats"] (modules/resume/analyzer.ts). */
  stats: {
    wordCount: number;
    bulletCount: number;
    measurableBulletsCount: number;
    actionVerbBulletsCount: number;
    impactMetricsCount: number;
    scopeMetricsCount: number;
    projectsCount: number;
    certificationsCount: number;
    /** Unique skills in ParsedResume, case- and spacing-insensitive. */
    skillsCount: number;
    sectionsDetected: string[];
    missingSections: string[];
  };
  analysisMode?: "hybrid" | "deterministic_only";
  parserConfidence?: "high" | "medium" | "low";
  layoutType?: "single-column" | "multi-column" | "uncertain";
  confidenceIssues?: string[];
  scoreExplanation?: ScoreExplanation;
}

/** How the analysis ran. */
export interface AnalysisMeta {
  analysisType: string;
  analysisMode: "hybrid" | "deterministic_only";
  ai: { used: boolean; reason?: string };
  /** Development only: the server omits these in production. */
  flow?: string;
  processingTimeMs?: number;
}

export interface AnalysisResponse {
  success: boolean;
  data: ResumeAnalysisResult;
  meta: AnalysisMeta;
  error?: { code: string; message: string };
}
