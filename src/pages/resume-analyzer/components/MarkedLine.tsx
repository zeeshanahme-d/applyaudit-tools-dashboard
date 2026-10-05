import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { CopyImprovementButton } from "@/components/results/CopyImprovementButton";
import { getSemanticState } from "@/components/results/semantic-tokens";
import type { AnalysisState, LineReviewItem } from "@/types/analysis";
import { Gutter, MarkedText, PaperRow, WithBlanks, noteToggle } from "@/components/paper/paper-parts";

export type PageMode = "marked" | "rewritten";

/** The margin note's pen, by state. */
const PEN: Record<AnalysisState, string> = {
  issue: "text-pen-red",
  warning: "text-pen-amber",
  opportunity: "text-pen-blue",
  strong: "text-pen-green",
};

interface MarkedLineProps {
  item: LineReviewItem;
  mode: PageMode;
  /** When this line's highlighter sweeps, in ms. */
  atMs?: number;
}

/**
 * One line of the resume as the editor marked it: highlighted by what is
 * wrong, a short note in the margin, and the full review (problems, the
 * rewrite, why it is better) one click away. With rewrites on, the line
 * reads as rewritten, the original struck through beneath it.
 */
export function MarkedLine({ item, mode, atMs }: MarkedLineProps) {
  const state = getSemanticState(item.status);
  const [open, setOpen] = useState(false);
  const detailId = useId();
  const rewritten = mode === "rewritten" && state !== "strong" && Boolean(item.improved);
  const reason = item.whyWeak ?? item.problemDetails?.[0] ?? item.issueText;
  const points = item.scoreImpact && item.scoreImpact < 0 ? item.scoreImpact : null;
  const toggleLabel = open
    ? "Hide notes"
    : state === "strong"
      ? "Why it works"
      : item.improved
        ? "See the rewrite"
        : "How to fix it";

  return (
    <div data-source={item.id} className="-mx-2 rounded-xs px-2 py-1.5">
      <PaperRow
        note={
          <div className="text-[13px] leading-snug">
            {state === "strong" ? (
              <p className="text-pen-green">
                <span className="font-semibold">Strong</span>
                {item.evidenceBadges && item.evidenceBadges.length > 0 && <span>: {item.evidenceBadges.join(", ")}</span>}
              </p>
            ) : (
              <p className={PEN[state]}>
                {points !== null && <span className="mr-1.5 font-semibold tabular-nums">{points} pts</span>}
                {reason && <span className="line-clamp-3">{reason}</span>}
              </p>
            )}
            <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls={detailId} className={noteToggle}>
              {toggleLabel}
            </button>
          </div>
        }
      >
        <p className="relative pl-5 font-serif text-[16px] leading-[1.6]">
          <Gutter state={rewritten ? "rewritten" : state} />
          {rewritten ? (
            <>
              <span className="text-pen-green">
                <WithBlanks text={item.improved!} />
              </span>
              <del className="mt-0.5 block font-sans text-[12.5px] leading-snug text-paper-muted decoration-pen-red/60">
                {item.original}
              </del>
            </>
          ) : (
            <MarkedText state={state} atMs={atMs}>
              {item.original}
            </MarkedText>
          )}
        </p>
      </PaperRow>

      <div id={detailId} hidden={!open} className="mb-2 ml-5 mt-2.5">
        <LineReviewDetail item={item} state={state} />
      </div>
    </div>
  );
}

/** Everything the review says about one line: its label, what is wrong, the rewrite and why it is better. */
function LineReviewDetail({ item, state }: { item: LineReviewItem; state: AnalysisState }) {
  // The wording is already fine and only a place for the candidate's number
  // was added: say so, rather than presenting it as a rewrite.
  const onlyAddsResult =
    item.improvementReasons?.length === 1 && item.improvementReasons[0] === "Shows where your real result goes";

  return (
    <div className="rounded-[3px] border border-paper-line bg-paper-ink/3 p-4 text-[13.5px] leading-relaxed">
      <p className="text-[12.5px] font-semibold text-paper-muted">{item.label}</p>

      {state === "strong" ? (
        <p className="mt-1.5">{item.notes ?? "Already well written."}</p>
      ) : (
        <>
          {(item.whyWeak ?? item.issueText) && <p className="mt-1.5">{item.whyWeak ?? item.issueText}</p>}
          {item.problemDetails && item.problemDetails.length > 0 && (
            <ul className="mt-2 space-y-1">
              {item.problemDetails.map((problem) => (
                <li key={problem} className="flex gap-2">
                  <span aria-hidden="true" className={cn("shrink-0", PEN[state])}>
                    ✕
                  </span>
                  <span>{problem}</span>
                </li>
              ))}
            </ul>
          )}
          {item.improved && (
            <div className="mt-4 border-l-2 border-pen-green pl-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[12.5px] font-semibold text-pen-green">
                  {onlyAddsResult ? "Add your result" : state === "opportunity" ? "Suggested wording" : "Suggested rewrite"}
                </p>
                <CopyImprovementButton text={item.improved} label="Copy line" />
              </div>
              <p className="mt-1.5 font-serif text-[16px] leading-[1.55]">
                <WithBlanks text={item.improved} />
              </p>
              {item.improved.includes("[") && (
                <p className="mt-1.5 text-[12.5px] text-paper-muted">
                  Replace each [ ] with your real number, or delete it if you don&apos;t know it. Never guess.
                </p>
              )}
              {item.improvementReasons && item.improvementReasons.length > 0 && (
                <ul className="mt-2 space-y-0.5 text-[12.5px] text-paper-muted">
                  {item.improvementReasons.map((reason) => (
                    <li key={reason} className="flex gap-2">
                      <span aria-hidden="true" className="text-pen-green">
                        ✓
                      </span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      )}

      {item.evidenceBadges && item.evidenceBadges.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Evidence in this line">
          {item.evidenceBadges.map((badge) => (
            <li key={badge} className="inline-flex h-6 items-center rounded-full border border-success-line px-2.5 text-[12px] font-medium text-pen-green">
              {badge}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
