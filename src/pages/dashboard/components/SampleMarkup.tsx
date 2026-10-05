import { GradeMark } from "@/components/results/GradeMark";
import { Gutter, MarkedText, PaperRow } from "@/components/paper/paper-parts";
import type { AnalysisState } from "@/types/analysis";

/**
 * Four lines of the built-in sample resume, with the marks and notes the
 * analyzer really gives them (the API's own sample, scored by the same rules
 * as any upload). An example of what comes back, never shown as the
 * visitor's data. Update if the scoring changes.
 */
const SAMPLE = {
  score: 92,
  potential: 100,
  entry: "Acme Cloud Inc.",
  lines: [
    {
      state: "strong",
      text: "Architected and deployed a multi-tenant design system in React and Tailwind CSS, adopted across 14 internal product teams.",
      note: "Scope, Ownership, Technical specificity, Production",
    },
    {
      state: "issue",
      text: "Responsible for assisting junior engineers with code reviews and bug triage.",
      note: "Starts with \"Responsible\" instead of what you did.",
      points: -6,
    },
    {
      state: "strong",
      text: "Optimized bundle sizes and implemented route-based code splitting, reducing initial page load times by 38%.",
      note: "Outcome",
    },
    {
      state: "warning",
      text: "Worked on multiple features and assisted with QA regression testing.",
      note: "Worked on multiple features is vague and does not clearly state the contribution.",
      points: -2,
    },
  ] satisfies Array<{ state: AnalysisState; text: string; note: string; points?: number }>,
};

const PEN: Record<AnalysisState, string> = {
  issue: "text-pen-red",
  warning: "text-pen-amber",
  opportunity: "text-pen-blue",
  strong: "text-pen-green",
};

/** What an audit gives back, shown on paper rather than described. */
export function SampleMarkup() {
  return (
    <section aria-labelledby="sample-title">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 id="sample-title" className="font-serif text-[28px] font-medium tracking-[-0.01em] text-foreground">
          What comes back
        </h2>
        <p className="text-[13.5px] text-muted-foreground">The sample resume, as the analyzer marked it</p>
      </div>

      <div className="paper @container mt-5 px-5 py-7 sm:px-10 sm:py-9 lg:rotate-[-0.4deg]">
        <PaperRow
          note={
            <div className="flex items-center gap-3 @2xl:-mt-4">
              <GradeMark score={SAMPLE.score} size={104} delayMs={250} />
              <p className="text-[13px] leading-snug text-paper-muted">
                Up to {SAMPLE.potential}
                <span className="block font-semibold text-pen-green">+{SAMPLE.potential - SAMPLE.score} to win back</span>
              </p>
            </div>
          }
        >
          <h3 className="border-b border-paper-ink/60 pb-1 font-serif text-[18px] font-semibold">Experience</h3>
          <p className="mt-3 font-serif text-[16px] font-semibold italic">{SAMPLE.entry}</p>
        </PaperRow>

        <div className="mt-1">
          {SAMPLE.lines.map((line, index) => (
            <PaperRow
              key={line.text}
              className="py-1.5"
              note={
                <p className={`text-[13px] leading-snug ${PEN[line.state]}`}>
                  {"points" in line && <span className="mr-1.5 font-semibold tabular-nums">{line.points} pts</span>}
                  {line.state === "strong" && <span className="font-semibold">Strong: </span>}
                  {line.note}
                </p>
              }
            >
              <p className="relative pl-5 font-serif text-[16px] leading-[1.6]">
                <Gutter state={line.state} />
                <MarkedText state={line.state} atMs={700 + index * 160}>
                  {line.text}
                </MarkedText>
              </p>
            </PaperRow>
          ))}
        </div>
      </div>
    </section>
  );
}
