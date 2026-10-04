import { CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";
import { OriginalContent } from "./OriginalContent";
import { ImprovedContent } from "./ImprovedContent";
import type { LineReviewItem } from "@/types/analysis";
import { getSemanticState } from "./semantic-tokens";

export function LineReview({
  item,
  className,
}: {
  item: LineReviewItem;
  className?: string;
}) {
  const semantic = getSemanticState(item.status);
  const hasImproved = Boolean(item.improved);
  // The wording is already fine and only a place for the candidate's number
  // was added: say so, rather than presenting it as a rewrite.
  const onlyAddsResult =
    item.improvementReasons?.length === 1 && item.improvementReasons[0] === "Shows where your real result goes";
  // A strong line is never shown as a problem, even if a rewrite slipped through.
  const isRewriteCandidate = semantic !== "strong" && (semantic === "issue" || semantic === "warning" || semantic === "opportunity" || hasImproved);

  return (
    <div className={cn("space-y-3 rounded-lg border border-border bg-panel p-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[12.5px] font-semibold text-foreground">{item.label}</span>
          {item.scoreImpact && item.scoreImpact < 0 ? (
            <span className="inline-flex h-5 items-center rounded-full border border-danger-line bg-danger-soft px-2 text-[12px] font-semibold tabular-nums text-danger">
              {item.scoreImpact} pts
            </span>
          ) : semantic !== "strong" ? (
            <span className="inline-flex h-5 items-center rounded-full bg-muted px-2 text-[12px] text-muted-foreground">
              No score impact
            </span>
          ) : null}
        </div>
        <StatusBadge status={item.status} size="sm" />
      </div>

      {isRewriteCandidate ? (
        <div className="space-y-3">
          <OriginalContent
            variant={semantic === "opportunity" ? "opportunity" : semantic === "warning" ? "warning" : "issue"}
            label={
              semantic === "issue"
                ? "Current Text (Issue)"
                : semantic === "warning"
                ? "Current Text (Weakness)"
                : "Optimization Opportunity"
            }
            content={item.original}
            whyWeak={item.whyWeak ?? item.issueText}
            problems={item.problemDetails}
          />

          {hasImproved && (
            <ImprovedContent
              label={
                onlyAddsResult
                  ? "Add Your Result"
                  : semantic === "opportunity"
                    ? "Suggested Enhancement"
                    : "Recruiter-Optimized Replacement"
              }
              improved={item.improved!}
              whyBetter={item.improvementReasons}
              copyLabel="Copy Line"
            />
          )}
        </div>
      ) : (
        <div className="space-y-3 rounded-lg border border-success-line bg-success-soft p-4">
          <p className="text-[13.5px] leading-relaxed text-foreground">{item.original}</p>

          <div className="flex items-start gap-2 border-t border-success-line pt-3 text-[12.5px] text-muted-foreground">
            <CircleCheck className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
            <p className="leading-relaxed">
              <span className="font-semibold text-foreground">What works well: </span>
              {item.notes ?? "Already well written."}
            </p>
          </div>

          {item.evidenceBadges && item.evidenceBadges.length > 0 && (
            <ul className="flex flex-wrap gap-1.5" aria-label="Evidence in this line">
              {item.evidenceBadges.map((badge) => (
                <li
                  key={badge}
                  className="inline-flex h-5 items-center rounded-full border border-success-line bg-card px-2 text-[12px] font-medium text-success"
                >
                  {badge}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
