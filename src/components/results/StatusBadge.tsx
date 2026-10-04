import { CircleAlert, CircleCheck, CircleX, TriangleAlert, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ScoreStatus, LineStatus, AnalysisState } from "@/types/analysis";
import { SEMANTIC_TOKENS, getSemanticState } from "./semantic-tokens";

/** Score statuses and the remaining labels: tone, icon and the words shown. */
const OTHER_STATUSES: Record<string, { label: string; Icon: LucideIcon; tone: string }> = {
  Excellent: { label: "Excellent", Icon: CircleCheck, tone: "border-success-line bg-success-soft text-success" },
  Pass: { label: "Pass", Icon: CircleCheck, tone: "border-success-line bg-success-soft text-success" },
  Good: { label: "Good", Icon: CircleCheck, tone: "border-primary/25 bg-accent text-accent-foreground" },
  "Needs Improvement": { label: "Needs Improvement", Icon: TriangleAlert, tone: "border-warning-line bg-warning-soft text-warning" },
  Weak: { label: "Weak", Icon: CircleX, tone: "border-danger-line bg-danger-soft text-danger" },
  MISSING: { label: "Missing", Icon: CircleX, tone: "border-danger-line bg-danger-soft text-danger" },
  Missing: { label: "Missing", Icon: CircleX, tone: "border-danger-line bg-danger-soft text-danger" },
  PARSER_WARNING: { label: "Extraction Warning", Icon: TriangleAlert, tone: "border-warning-line bg-warning-soft text-warning" },
  Optional: { label: "Optional", Icon: CircleAlert, tone: "border-border bg-muted text-muted-foreground" },
};

const SEMANTIC_STATUSES = new Set(["issue", "problem", "warning", "opportunity", "strong", "good"]);

export function StatusBadge({
  status,
  className,
  size = "default",
}: {
  status: ScoreStatus | LineStatus | AnalysisState | "Pass" | "Optional" | "MISSING" | "Missing" | "PARSER_WARNING" | "Warning";
  className?: string;
  size?: "sm" | "default";
}) {
  // The 4 canonical analysis states first, then score statuses; anything else shows nothing.
  const semantic = SEMANTIC_STATUSES.has(status) ? SEMANTIC_TOKENS[getSemanticState(status)] : null;
  const look = semantic ? { label: semantic.label, Icon: semantic.Icon, tone: semantic.badge } : OTHER_STATUSES[status];
  if (!look) return null;

  const isSmall = size === "sm";
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border font-medium",
        isSmall ? "h-5 px-2 text-[12px]" : "h-6 px-2.5 text-xs",
        look.tone,
        className
      )}
    >
      <look.Icon className={isSmall ? "size-3" : "size-3.5"} aria-hidden="true" />
      {look.label}
    </span>
  );
}
