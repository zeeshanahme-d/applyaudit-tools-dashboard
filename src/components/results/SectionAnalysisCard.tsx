import { useState } from "react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";
import { StrengthList } from "./StrengthList";
import { IssueList } from "./IssueList";
import { OriginalContent } from "./OriginalContent";
import { ImprovedContent } from "./ImprovedContent";
import { LineReview } from "./LineReview";
import type { SectionReview } from "@/types/analysis";
import { getSemanticState } from "./semantic-tokens";

type LineFilter = "action" | "strong" | "all";

export interface SectionAnalysisCardProps {
  section: SectionReview;
  defaultExpanded?: boolean;
  className?: string;
}

export function SectionAnalysisCard({
  section,
  defaultExpanded,
  className,
}: SectionAnalysisCardProps) {
  const isAutoExpanded =
    defaultExpanded ??
    section.isDefaultExpanded ??
    (section.score < 75 ||
      section.status === "Needs Improvement" ||
      section.status === "Weak");

  const [isExpanded, setIsExpanded] = useState(isAutoExpanded);
  const [lineFilter, setLineFilter] = useState<LineFilter>("action");

  // Lines that need something first; strong lines on request.
  const lineReviews = section.lineReviews || [];
  const needsAction = lineReviews.filter((r) => getSemanticState(r.status) !== "strong");
  const strongBullets = lineReviews.filter((r) => getSemanticState(r.status) === "strong");
  const shownLines = lineFilter === "action" ? needsAction : lineFilter === "strong" ? strongBullets : [...needsAction, ...strongBullets];
  const filters: Array<{ id: LineFilter; label: string; count: number }> = [
    { id: "action", label: "Needs Action", count: needsAction.length },
    { id: "strong", label: "Strong", count: strongBullets.length },
    { id: "all", label: "All", count: lineReviews.length },
  ];
  const bodyId = `section-${section.id}`;

  return (
    <div className={cn("overflow-hidden rounded-xl border border-border bg-card shadow-raised", className)}>
      <SectionHeader
        name={section.name}
        score={section.score}
        potentialScore={section.potentialScore}
        status={section.status}
        company={section.company}
        role={section.role}
        dates={section.dates}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
        controlsId={bodyId}
      />

      {isExpanded && (
        <div id={bodyId} className="space-y-6 border-t border-border px-5 py-5 animate-in fade-in-0 duration-200 sm:px-6">
          {/* Section Summary */}
          {section.summary && (
            <p className="max-w-3xl text-[13.5px] leading-relaxed text-muted-foreground">{section.summary}</p>
          )}

          {/* Strengths & Issues / Opportunities */}
          {(section.strengths?.length > 0 || section.issues?.length > 0 || (section.opportunities && section.opportunities.length > 0)) && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <StrengthList strengths={section.strengths} />
              <IssueList
                issues={section.issues}
                opportunities={section.opportunities}
                isPerfectScore={section.score === 100}
              />
            </div>
          )}

          {/* Explainable deduction breakdown */}
          {section.deductions && section.deductions.length > 0 && section.score < 100 && (
            <div className="overflow-hidden rounded-lg border border-border">
              <div className="flex items-center justify-between gap-3 bg-surface/70 px-4 py-2 text-[12px] font-medium text-muted-foreground">
                <span>Score Point Deductions (Reconciled)</span>
                <span className="tabular-nums">Base 100 - {100 - section.score} = {section.score}</span>
              </div>
              <ul className="divide-y divide-border text-[13px]">
                {section.deductions.map((d) => (
                  <li key={d.id} className="flex items-start justify-between gap-4 px-4 py-2.5">
                    <span className="leading-snug text-foreground/90">{d.reason}</span>
                    <span className="shrink-0 font-semibold tabular-nums text-danger">{d.points} pts</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Current content beside its rewrite */}
          {section.currentContent && section.improvedContent && (
            <div className="space-y-3">
              <h5 className="text-[12.5px] font-semibold text-foreground">Content Comparison & Rewrites</h5>
              <OriginalContent
                variant={section.score === 100 || (section.deductions && section.deductions.length === 0) ? "opportunity" : "issue"}
                label={section.score === 100 || (section.deductions && section.deductions.length === 0) ? "Current Content (Optimization)" : "Current Content"}
                content={section.currentContent}
                whyWeak={section.whyWeak}
                problems={section.problems}
              />
              <ImprovedContent
                label={section.score === 100 ? "Optional Rewrite" : "Recommended Rewrite"}
                improved={section.improvedContent}
                whyBetter={section.whyBetter}
                copyLabel="Copy Improved Version"
              />
            </div>
          )}

          {/* Line-by-line review: lines that need action first, strong lines on request */}
          {lineReviews.length > 0 && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h5 className="text-[12.5px] font-semibold text-foreground">Line-by-Line Bullet Review</h5>
                <div className="inline-flex rounded-lg border border-border bg-surface p-0.5" role="group" aria-label="Filter bullet reviews">
                  {filters.map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      aria-pressed={lineFilter === filter.id}
                      onClick={() => setLineFilter(filter.id)}
                      className={cn(
                        "h-7 pointer-coarse:h-11 rounded-md px-2.5 text-[12px] font-medium tabular-nums transition-colors duration-150 cursor-pointer",
                        lineFilter === filter.id ? "bg-card text-foreground shadow-raised" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {filter.label} ({filter.count})
                    </button>
                  ))}
                </div>
              </div>

              {shownLines.length > 0 ? (
                <div className="space-y-3">
                  {shownLines.map((item) => (
                    <LineReview key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <p className="rounded-lg border border-dashed border-border px-4 py-3 text-[13px] text-muted-foreground">
                  {lineFilter === "action" ? "Nothing in this section needs action." : "No bullets here yet."}
                </p>
              )}
            </div>
          )}

          {/* Potential section score */}
          {section.potentialScore > section.score && (
            <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4 text-[13px] tabular-nums">
              <span className="text-muted-foreground">Potential Section Score:</span>
              <span className="font-semibold text-foreground">{section.score}</span>
              <span className="text-muted-foreground" aria-hidden="true">→</span>
              <span className="font-semibold text-success">{section.potentialScore}/100</span>
              <span className="font-medium text-success">(+{section.potentialScore - section.score} pts in this section)</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
