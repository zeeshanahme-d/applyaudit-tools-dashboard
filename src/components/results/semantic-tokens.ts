import { CircleCheck, CircleX, Lightbulb, TriangleAlert, type LucideIcon } from "lucide-react";
import type { AnalysisState, LineStatus, ScoreState } from "@/types/analysis";

/** One result state's look, from the theme's semantic tokens (globals.css). */
export interface SemanticVariant {
  label: string;
  Icon: LucideIcon;
  /** Text and icon color. */
  text: string;
  /** A tinted callout: hairline border and soft fill. */
  panel: string;
  /** A small status pill. */
  badge: string;
  /** A solid dot for list bullets. */
  dot: string;
}

export const SEMANTIC_TOKENS: Record<AnalysisState, SemanticVariant> = {
  issue: {
    label: "Issue",
    Icon: CircleX,
    text: "text-danger",
    panel: "border-danger-line bg-danger-soft",
    badge: "border-danger-line bg-danger-soft text-danger",
    dot: "bg-danger",
  },
  warning: {
    label: "Warning",
    Icon: TriangleAlert,
    text: "text-warning",
    panel: "border-warning-line bg-warning-soft",
    badge: "border-warning-line bg-warning-soft text-warning",
    dot: "bg-warning",
  },
  opportunity: {
    label: "Opportunity",
    Icon: Lightbulb,
    text: "text-info",
    panel: "border-info-line bg-info-soft",
    badge: "border-info-line bg-info-soft text-info",
    dot: "bg-info",
  },
  strong: {
    label: "Strong",
    Icon: CircleCheck,
    text: "text-success",
    panel: "border-success-line bg-success-soft",
    badge: "border-success-line bg-success-soft text-success",
    dot: "bg-success",
  },
};

/** A score band's look (getScoreState's colorToken): ring stroke, bar fill, text, pill. */
export const SCORE_TONES: Record<ScoreState["colorToken"], { text: string; stroke: string; bar: string; badge: string }> = {
  emerald: { text: "text-success", stroke: "stroke-success", bar: "bg-success", badge: "border-success-line bg-success-soft text-success" },
  indigo: { text: "text-primary", stroke: "stroke-primary", bar: "bg-primary", badge: "border-primary/25 bg-accent text-accent-foreground" },
  amber: { text: "text-warning", stroke: "stroke-warning", bar: "bg-warning", badge: "border-warning-line bg-warning-soft text-warning" },
  rose: { text: "text-danger", stroke: "stroke-danger", bar: "bg-danger", badge: "border-danger-line bg-danger-soft text-danger" },
};

/**
 * Normalizes any line status or legacy key to one of the 4 canonical analysis states.
 */
export function getSemanticState(status?: LineStatus | string | null): AnalysisState {
  if (!status) return "strong";
  const s = status.toLowerCase().trim();
  if (s === "issue" || s === "problem") return "issue";
  if (s === "warning") return "warning";
  if (s === "opportunity" || s === "optional") return "opportunity";
  return "strong";
}
