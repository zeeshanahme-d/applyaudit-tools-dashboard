// ─── Domain-Level Production Analysis & Scoring Interfaces ───
//
// The building blocks of the analysis API's response, mirrored from the Next.js
// app (the API): marketing/src/modules/analysis/types.ts. Shared by the result
// components; the resume analyzer's full response is in
// pages/resume-analyzer/core/_models.ts. Types only: the API computes
// everything. When the API's shape changes, change it here too.

export type ScoreStatus = "Excellent" | "Good" | "Needs Improvement" | "Weak";
export type PriorityLevel = "critical" | "high" | "medium" | "low";

/**
 * The 4 canonical semantic analysis states:
 * 1. issue: color red, scoreImpact < 0, represents an actual problem that reduced the score
 * 2. warning: color amber, scoreImpact < 0 or low-severity risk, meaningful weakness
 * 3. opportunity: color blue, scoreImpact = 0, optional non-penalizing enhancement
 * 4. strong: color green, scoreImpact = 0, high-performing content
 */
export type AnalysisState = "issue" | "warning" | "opportunity" | "strong";

// Retained for backward compatibility with existing components and tests
export type LineStatus = AnalysisState | "problem" | "good";

export interface ScoreState {
  score: number;
  status: ScoreStatus;
  colorToken: "emerald" | "indigo" | "amber" | "rose";
}

export function getScoreState(score: number): ScoreState {
  if (score >= 90) {
    return { score, status: "Excellent", colorToken: "emerald" };
  }
  if (score >= 75) {
    return { score, status: "Good", colorToken: "indigo" };
  }
  if (score >= 60) {
    return { score, status: "Needs Improvement", colorToken: "amber" };
  }
  return { score, status: "Weak", colorToken: "rose" };
}

/**
 * Explainable score deduction unit.
 * Every deduction must explain why points were lost, which rule triggered it,
 * and which source items it applies to.
 */
export interface ScoreDeduction {
  id: string; // unique deduction identifier, e.g. "ded-exp-metrics-0"
  ruleId: string; // e.g. "experience.missing-impact-metrics"
  reason: string;
  points: number; // strictly negative integer, e.g. -5
  sourceIds: string[];
  category: string; // e.g. "measurable_impact", "bullet_quality", "contact", "section_completeness", "ats_structure"
}

export interface LineReviewItem {
  id: string;
  label: string; // e.g. "CloudScale Inc. Bullet", "Headline"
  original: string;
  status: LineStatus;
  priority?: PriorityLevel;
  scoreImpact?: number; // negative for issue/warning, 0 for opportunity/strong
  ruleId?: string;
  issueText?: string;
  problemDetails?: string[];
  whyWeak?: string;
  improved?: string;
  improvementReasons?: string[];
  notes?: string;
  evidence?: {
    detectedIn?: string;
    missingFrom?: string;
    whyItMatters?: string;
    sourceA?: { label: string; text: string };
    sourceB?: { label: string; text: string };
  };
  /** What makes a strong line strong ("Scope", "Ownership"), derived by rule. */
  evidenceBadges?: string[];
}

/** "Why this score?": deterministic, and its deductions add up to 100 minus the score. */
export interface ScoreExplanation {
  headline: string;
  strengths: string[];
  deductions: Array<{ label: string; points: number }>;
}

export interface SectionReview {
  id: string;
  name: string;
  score: number;
  potentialScore: number;
  status: ScoreStatus;
  summary: string;
  strengths: string[];
  issues: string[]; // Actual problematic findings (must be empty if score === 100)
  opportunities?: string[]; // Optional optimizations (scoreImpact === 0)
  deductions?: ScoreDeduction[]; // Reconciled deductions that justify score loss
  currentContent?: string;
  improvedContent?: string;
  whyWeak?: string;
  whyBetter?: string[];
  problems?: string[];
  company?: string;
  role?: string;
  dates?: string;
  lineReviews?: LineReviewItem[];
  isDefaultExpanded?: boolean;
}

export interface ActionPlanItem {
  id?: string;
  priority: PriorityLevel;
  title: string;
  sectionScoreImpact?: number; // e.g. +6 in Experience section
  overallScoreImpact?: number; // e.g. +1 overall score gain
  potentialPoints: number; // Legacy or primary displayed gain
  category: string;
  detail?: string;
  resolvesDeductionIds?: string[]; // Unique deduction IDs resolved to prevent inflated sum
}
