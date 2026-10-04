import { cn } from "@/lib/utils";
import { SEMANTIC_TOKENS, type SemanticVariant } from "./semantic-tokens";

/**
 * Scored issues and optional improvements, kept visibly apart: an issue took
 * points, an improvement never does.
 */
export function IssueList({
  issues = [],
  opportunities = [],
  isPerfectScore = false,
  className,
}: {
  issues?: string[];
  opportunities?: string[];
  isPerfectScore?: boolean;
  className?: string;
}) {
  const hasIssues = issues.length > 0 && !isPerfectScore;
  const hasOpportunities = opportunities.length > 0;

  if (!hasIssues && !hasOpportunities) return null;

  return (
    <div className={cn("space-y-5", className)}>
      {hasIssues && <FindingList items={issues} token={SEMANTIC_TOKENS.issue} title="Scoring Issues" note="Affect your score" />}
      {hasOpportunities && (
        <FindingList
          items={opportunities}
          token={SEMANTIC_TOKENS.opportunity}
          title="Optional Improvements"
          note="Do not affect your score"
        />
      )}
    </div>
  );
}

function FindingList({
  items,
  token,
  title,
  note,
}: {
  items: string[];
  token: SemanticVariant;
  title: string;
  note: string;
}) {
  return (
    <div className="space-y-2.5">
      <p className="flex flex-wrap items-baseline gap-x-2 text-[12.5px] font-semibold text-foreground">
        {title}
        <span className="text-[12px] font-normal text-muted-foreground">{note}</span>
      </p>
      <ul className="space-y-2 text-[13px]">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2.5 text-foreground/90">
            <token.Icon className={cn("mt-0.5 size-4 shrink-0", token.text)} aria-hidden="true" />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
