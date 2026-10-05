import type { CSSProperties, ReactNode } from "react";
import { Check, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AnalysisState } from "@/types/analysis";

/**
 * One row of the marked-up page: the resume's text, and the editor's note in
 * the margin beside it. The margin column appears once the sheet is wide
 * enough (a container query on the sheet); narrower, the note sits under the line.
 */
export function PaperRow({ children, note, className }: { children: ReactNode; note?: ReactNode; className?: string }) {
  return (
    <div className={cn("grid gap-x-7 gap-y-1 @2xl:grid-cols-[minmax(0,1fr)_13.5rem]", className)}>
      <div className="min-w-0">{children}</div>
      {note && <div className="min-w-0 pl-5 @2xl:pl-0 @2xl:pt-0.5">{note}</div>}
    </div>
  );
}

/** How each state is marked on the text: a highlighter, a pencil underline, or nothing (strong). */
const MARKS: Record<AnalysisState, string> = {
  issue: "marker [--mark:var(--mark-issue)]",
  warning: "marker [--mark:var(--mark-warning)]",
  opportunity: "pencil-underline",
  strong: "",
};

/** The text as marked. `atMs` staggers the highlighter, so the page marks itself top to bottom. */
export function MarkedText({ state, atMs, children }: { state: AnalysisState; atMs?: number; children: ReactNode }) {
  if (state === "strong") return <>{children}</>;
  return (
    <span className={MARKS[state]} style={atMs === undefined ? undefined : ({ "--at": `${atMs}ms` } as CSSProperties)}>
      {children}
    </span>
  );
}

/** What a screen reader hears before a marked line: the mark's meaning, since color carries none for it. */
const SPOKEN: Record<AnalysisState | "rewritten", string> = {
  issue: "Problem: ",
  warning: "Weakness: ",
  opportunity: "Optional idea: ",
  strong: "Strong: ",
  rewritten: "Suggested rewrite: ",
};

/** The left gutter: a tick for a strong line, a pen for a rewritten one, a bullet for the rest. */
export function Gutter({ state }: { state: AnalysisState | "rewritten" }) {
  return (
    <>
      {state === "strong" ? (
        <Check className="absolute left-0 top-[0.4em] size-3.5 text-pen-green" strokeWidth={3} aria-hidden="true" />
      ) : state === "rewritten" ? (
        <PenLine className="absolute left-0 top-[0.4em] size-3.5 text-pen-green" aria-hidden="true" />
      ) : (
        <span aria-hidden="true" className="absolute left-1 top-0 text-paper-muted">
          •
        </span>
      )}
      <span className="sr-only">{SPOKEN[state]}</span>
    </>
  );
}

/** A rewrite's "[ ]" placeholders, drawn as blanks to fill in with real numbers. */
export function WithBlanks({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\[[^\]]*\])/).map((part, index) =>
        /^\[[^\]]*\]$/.test(part) ? (
          <span key={index} className="rounded-xs border border-dashed border-pen-blue px-0.5 text-pen-blue">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
}

/** A small pen-written toggle in the margin: "See the rewrite", "Section notes". */
export const noteToggle =
  "mt-1 inline-flex min-h-6 cursor-pointer items-center gap-1 rounded-sm text-[12.5px] font-semibold text-paper-ink underline decoration-paper-ink/30 underline-offset-[3px] transition-colors hover:decoration-paper-ink pointer-coarse:min-h-11";
