import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { CopyImprovementButton } from "@/components/results/CopyImprovementButton";
import { SCORE_TONES } from "@/components/results/semantic-tokens";
import { getScoreState, type AnalysisState, type LineReviewItem, type SectionReview } from "@/types/analysis";
import { MarkedLine, type PageMode } from "./MarkedLine";
import { PaperRow, WithBlanks, noteToggle } from "@/components/paper/paper-parts";

interface PaperSectionProps {
  section: SectionReview;
  mode: PageMode;
  /** When each marked line's highlighter sweeps, by line id. */
  lineDelays: Map<string, number>;
}

/** "3. Experience & Bullet Point Impact" as a resume would title it: "Experience". */
function paperHeading(name: string) {
  return name.replace(/^\d+\.\s*/, "").split(" & ")[0];
}

/**
 * One section of the resume on the page, with its score in the margin and
 * the section's full notes one click away. Three shapes: the header (name
 * and contact lines), a section with text (a paragraph, or bullets grouped
 * by role), and a section reviewed as a whole, whose text the API does not
 * return (skills, for one): the page says what was found instead.
 */
export function PaperSection({ section, mode, lineDelays }: PaperSectionProps) {
  const [notesOpen, setNotesOpen] = useState(false);
  const notesId = useId();
  const headingId = useId();
  const lines = section.lineReviews ?? [];
  const isHeader = section.id === "sec-contact";
  const hasText = Boolean(section.currentContent) || lines.length > 0;

  const scoreNote = (
    <SectionScoreNote section={section} open={notesOpen} onToggle={() => setNotesOpen(!notesOpen)} controls={notesId} />
  );
  const notes = (
    <div id={notesId} hidden={!notesOpen} className="mb-4 mt-3">
      {/* A section without text shows its summary as its body; the rest carry it here. */}
      <SectionNotes section={section} withSummary={hasText} />
    </div>
  );

  if (isHeader) {
    const [name, title, ...details] = (section.currentContent ?? "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    return (
      <section data-source={section.id} aria-labelledby={headingId} className="pb-4">
        <h3 id={headingId} className="sr-only">
          {paperHeading(section.name)}
        </h3>
        <PaperRow note={scoreNote}>
          {name && <p className="font-serif text-[30px] font-semibold leading-tight tracking-[-0.01em]">{name}</p>}
          {title && <p className="mt-1 text-[15px]">{title}</p>}
          {details.length > 0 && (
            <p className="mt-1.5 flex flex-wrap gap-x-4 gap-y-0.5 text-[13.5px] text-paper-muted">
              {details.map((detail) => (
                <span key={detail}>{detail}</span>
              ))}
            </p>
          )}
          {/* What is missing, written in where it belongs, as an editor's caret. */}
          {section.score < 100 && section.issues.length > 0 && (
            <ul className="mt-3 space-y-0.5">
              {section.issues.map((issue) => (
                <li key={issue} className="flex gap-2 text-[13.5px] text-pen-red">
                  <span aria-hidden="true" className="font-serif font-bold">
                    ‸
                  </span>
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          )}
        </PaperRow>
        {notes}
      </section>
    );
  }

  return (
    <section data-source={section.id} aria-labelledby={headingId} className="pt-7">
      <PaperRow note={scoreNote}>
        <h3
          id={headingId}
          className="border-b border-paper-ink/60 pb-1 font-serif text-[18px] font-semibold tracking-[-0.005em]"
        >
          {paperHeading(section.name)}
        </h3>
      </PaperRow>
      {notes}

      {(section.role || section.company || section.dates) && (
        <p className="mt-2 text-[14px]">
          {[section.role, section.company].filter(Boolean).join(" at ")}
          {section.dates && <span className="text-paper-muted"> ({section.dates})</span>}
        </p>
      )}

      {section.currentContent && <TextBlock section={section} mode={mode} />}

      {groupByEntry(lines).map((group) => (
        <div key={group.entry || "lines"} className="mt-3">
          {group.entry && <p className="mb-1 font-serif text-[16px] font-semibold italic">{group.entry}</p>}
          {group.lines.map((line) => (
            <MarkedLine key={line.id} item={line} mode={mode} atMs={lineDelays.get(line.id)} />
          ))}
        </div>
      ))}

      {!hasText && (
        <PaperRow className="mt-2.5">
          <p className="font-serif text-[16px] italic leading-relaxed text-paper-muted">{section.summary}</p>
        </PaperRow>
      )}
    </section>
  );
}

/** A section missing from the resume: a dashed box where it belongs. */
export function MissingSection({ name }: { name: string }) {
  return (
    <section data-source={`missing:${name}`} aria-label={`${name}, missing`} className="pt-7">
      <PaperRow note={<p className="text-[13px] leading-snug text-pen-red">Not found on your resume. Add this section.</p>}>
        <p className="rounded-[3px] border-2 border-dashed border-pen-red/45 px-4 py-2.5 font-serif text-[18px] font-semibold text-pen-red">
          <span aria-hidden="true" className="mr-1.5">
            ‸
          </span>
          {name}
        </p>
      </PaperRow>
    </section>
  );
}

/** The bullets of one role together: "IR Solutions — Bullet 1" belongs under "IR Solutions". */
function groupByEntry(lines: LineReviewItem[]) {
  const groups: { entry: string; lines: LineReviewItem[] }[] = [];
  for (const line of lines) {
    const entry = line.label.includes(" — ") ? line.label.split(" — ")[0] : "";
    const last = groups.at(-1);
    if (last && last.entry === entry) last.lines.push(line);
    else groups.push({ entry, lines: [line] });
  }
  return groups;
}

/** The margin pen for a passage, and its vertical line: the editor's mark for "this whole paragraph". */
const PASSAGE: Record<AnalysisState, { pen: string; rule: string }> = {
  issue: { pen: "text-pen-red", rule: "border-pen-red/70" },
  warning: { pen: "text-pen-amber", rule: "border-pen-amber/70" },
  opportunity: { pen: "text-pen-blue", rule: "border-dotted border-pen-blue" },
  strong: { pen: "text-pen-green", rule: "border-transparent" },
};

/** A paragraph section (the summary): marked as a passage, with its rewrite. */
function TextBlock({ section, mode }: { section: SectionReview; mode: PageMode }) {
  const [open, setOpen] = useState(false);
  const detailId = useId();
  const issues = section.score < 100 ? section.issues : [];
  const opportunities = section.opportunities ?? [];
  const state: AnalysisState = issues.length > 0 ? "issue" : opportunities.length > 0 ? "opportunity" : "strong";
  const reason = issues[0] ?? opportunities[0];
  const rewritten = mode === "rewritten" && Boolean(section.improvedContent);
  const look = PASSAGE[state];

  return (
    <div className="mt-2.5">
      <PaperRow
        note={
          <div className="text-[13px] leading-snug">
            {reason && <p className={cn("line-clamp-4", look.pen)}>{reason}</p>}
            {(section.improvedContent || section.whyWeak || (section.problems?.length ?? 0) > 0) && (
              <button
                type="button"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                aria-controls={detailId}
                className={noteToggle}
              >
                {open ? "Hide notes" : section.improvedContent ? "See the rewrite" : "How to fix it"}
              </button>
            )}
          </div>
        }
      >
        {rewritten ? (
          <div className="border-l-[3px] border-pen-green/70 pl-3.5">
            <p className="font-serif text-[16px] leading-[1.6] text-pen-green">
              <span className="sr-only">Suggested rewrite: </span>
              <WithBlanks text={section.improvedContent!} />
            </p>
            <del className="mt-1.5 block text-[12.5px] leading-snug text-paper-muted decoration-pen-red/60">
              {section.currentContent}
            </del>
          </div>
        ) : (
          <p className={cn("border-l-[3px] pl-3.5 font-serif text-[16px] leading-[1.6]", look.rule)}>{section.currentContent}</p>
        )}
      </PaperRow>

      <div id={detailId} hidden={!open} className="mb-2 ml-4 mt-2.5">
        <div className="rounded-[3px] border border-paper-line bg-paper-ink/3 p-4 text-[13.5px] leading-relaxed">
          {section.whyWeak && <p>{section.whyWeak}</p>}
          {section.problems && section.problems.length > 0 && (
            <ul className="mt-2 space-y-1">
              {section.problems.map((problem) => (
                <li key={problem} className="flex gap-2">
                  <span aria-hidden="true" className={look.pen}>
                    ✕
                  </span>
                  <span>{problem}</span>
                </li>
              ))}
            </ul>
          )}
          {section.improvedContent && (
            <div className={cn("border-l-2 border-pen-green pl-3.5", (section.whyWeak || section.problems?.length) && "mt-4")}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[12.5px] font-semibold text-pen-green">
                  {section.score === 100 ? "Optional rewrite" : "Suggested rewrite"}
                </p>
                <CopyImprovementButton text={section.improvedContent} label="Copy rewrite" />
              </div>
              <p className="mt-1.5 font-serif text-[16px] leading-[1.55]">
                <WithBlanks text={section.improvedContent} />
              </p>
              {section.whyBetter && section.whyBetter.length > 0 && (
                <ul className="mt-2 space-y-0.5 text-[12.5px] text-paper-muted">
                  {section.whyBetter.map((reason) => (
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
        </div>
      </div>
    </div>
  );
}

interface SectionScoreNoteProps {
  section: SectionReview;
  open: boolean;
  onToggle: () => void;
  controls: string;
}

/** The section's grade in the margin, kept short so the text beside it starts right under its heading. */
function SectionScoreNote({ section, open, onToggle, controls }: SectionScoreNoteProps) {
  const tone = SCORE_TONES[getScoreState(section.score).colorToken];
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 text-[13px] leading-snug">
      <p className="flex items-baseline gap-x-2">
        <span className="sr-only">Section score</span>
        <span className={cn("font-serif text-[21px] font-medium italic leading-none tabular-nums", tone.text)}>
          {section.score}
        </span>
        <span className="text-paper-muted">{section.status}</span>
      </p>
      <button type="button" onClick={onToggle} aria-expanded={open} aria-controls={controls} className={noteToggle}>
        {open ? "Hide section notes" : "Section notes"}
      </button>
    </div>
  );
}

/** Everything the review says about a section: what it could reach, what works, what lowers its score, what is optional, and the arithmetic. */
function SectionNotes({ section, withSummary }: { section: SectionReview; withSummary: boolean }) {
  const issues = section.score < 100 ? section.issues : [];
  const deductions = section.score < 100 ? (section.deductions ?? []) : [];
  const opportunities = section.opportunities ?? [];

  return (
    <div className="space-y-3 rounded-[3px] border border-paper-line bg-paper-ink/3 p-4 text-[13.5px] leading-relaxed">
      <div>
        <p className="text-[12.5px] font-semibold text-paper-muted">{section.name}</p>
        {section.potentialScore > section.score && (
          <p className="text-[12.5px] text-paper-muted">
            Up to {section.potentialScore} in this section, from {section.score}
          </p>
        )}
      </div>
      {withSummary && section.summary && <p>{section.summary}</p>}
      <NoteList title="What works" items={section.strengths} mark="✓" pen="text-pen-green" />
      <NoteList title="Lowers your score" items={issues} mark="✕" pen="text-pen-red" />
      <NoteList title="Optional, no score change" items={opportunities} mark="○" pen="text-pen-blue" />
      {deductions.length > 0 && (
        <div>
          <p className="font-semibold tabular-nums">
            Section score: 100 − {100 - section.score} = {section.score}
          </p>
          <ul className="mt-1 divide-y divide-paper-line">
            {deductions.map((deduction) => (
              <li key={deduction.id} className="flex items-start justify-between gap-4 py-1.5">
                <span>{deduction.reason}</span>
                <span className="shrink-0 font-semibold tabular-nums text-pen-red">{deduction.points} pts</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {section.strengths.length + issues.length + opportunities.length + deductions.length === 0 && !withSummary && (
        <p className="text-paper-muted">Nothing more to note here.</p>
      )}
    </div>
  );
}

function NoteList({ title, items, mark, pen }: { title: string; items: string[]; mark: string; pen: string }) {
  if (items.length === 0) return null;
  return (
    <div>
      <p className="font-semibold">{title}</p>
      <ul className="mt-1 space-y-1">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span aria-hidden="true" className={cn("shrink-0", pen)}>
              {mark}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
