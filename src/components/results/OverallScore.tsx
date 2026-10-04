import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ScoreRing } from "./ScoreRing";

export interface OverallScoreProps {
  title?: string;
  subtitle?: string;
  score: number;
  label?: string;
  className?: string;
  /** Shown under the ring, such as "Why this score?". */
  children?: ReactNode;
}

/** The overall score: ring, status and what it means. Frameless; the page places it. */
export function OverallScore({
  title = "Overall Score",
  subtitle = "Based on deterministic parsing and recruiter criteria",
  score,
  label,
  className,
  children,
}: OverallScoreProps) {
  return (
    <div className={cn("flex flex-col items-center text-center", className)}>
      <h3 className="text-[13px] font-semibold text-foreground">{title}</h3>
      <div className="mt-5">
        <ScoreRing score={score} size={164} strokeWidth={10} label={label} showStatusBadge />
      </div>
      <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-muted-foreground">{subtitle}</p>
      {children}
    </div>
  );
}
