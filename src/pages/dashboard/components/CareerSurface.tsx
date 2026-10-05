import { useRef, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { GradeMark } from "@/components/results/GradeMark";
import { SCORE_TONES } from "@/components/results/semantic-tokens";
import { IndexLabel } from "@/components/shared/index-label";
import { getScoreState } from "@/types/analysis";
import type { Artifact } from "@/data/tools";
import { useSeen } from "@/hooks/use-seen";
import type { SessionAudit } from "@/pages/resume-analyzer/core/hook/useLastResumeAnalysis";

interface CareerSurfaceProps {
  focus: Artifact;
  onFocusChange: (artifact: Artifact) => void;
  audit: SessionAudit | null;
  className?: string;
}

/** The resume's sections (the API's section ids) and the profile sections a comparison reads them against, row by row. */
const ROWS = [
  { section: "sec-summary", resume: "Summary", linkedin: "About" },
  { section: "sec-experience", resume: "Experience", linkedin: "Experience" },
  { section: "sec-skills", resume: "Skills", linkedin: "Skills" },
  { section: "sec-projects", resume: "Projects", linkedin: "Featured" },
] as const;

const JOB_ROWS = ["Requirements", "Skills", "Seniority"] as const;

/** The sheets each inspection reads; the others step back. */
const INVOLVED: Record<Artifact, readonly Artifact[]> = {
  resume: ["resume"],
  linkedin: ["linkedin", "resume"],
  job: ["job", "resume"],
};

/** Widths of the unread lines on a blank sheet. */
const BLANKS = ["w-2/5", "w-3/5", "w-1/3", "w-1/2"];

/** One load sequence: the sheets land one after another, then the lines between them. */
const ENTER = "animate-in fade-in-0 slide-in-from-bottom-3 duration-600 ease-out-expo fill-mode-backwards";
const at = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });

/**
 * The overview's signature: the resume, the LinkedIn profile and the target
 * role as sheets on the desk, joined by what the tools do with them. Rows
 * compare across (02), both sheets match down into the role (03), and the
 * three together are the audit (04). Picking what to inspect brings its
 * sheets forward: the profile squares up with the resume, the role draws
 * its line up to it. A score appears only where an analysis really ran.
 */
export function CareerSurface({ focus, onFocusChange, audit, className }: CareerSurfaceProps) {
  const ref = useRef<HTMLElement>(null);
  const seen = useSeen(ref);
  const comparing = focus === "linkedin";
  const matching = focus === "job";
  const result = audit?.result;
  // The breakdown has no ids; this label is the API's (modules/scoring/resume-score.ts).
  const evidence = result?.breakdown.find((item) => item.label === "Evidence & Impact");

  const sheetProps = (artifact: Artifact, className: string, delayMs = 0) => {
    const involved = INVOLVED[focus].includes(artifact);
    return {
      onClick: () => onFocusChange(artifact),
      style: at(delayMs),
      className: cn(
        // min-w-0: a sheet never grows past its column (a no-wrap detail line set its minimum on phones).
        "paper min-w-0 transition-[translate,rotate,opacity] duration-500 ease-out-quart",
        ENTER,
        !involved && "cursor-pointer opacity-70 hover:opacity-90",
        // A sheet not being read lies a little loose on the desk; reading it squares it up.
        artifact === "linkedin" && !comparing && "translate-x-1.5 translate-y-2.5 rotate-[0.8deg]",
        artifact === "job" && !matching && "translate-y-2 -rotate-[0.5deg]",
        className
      ),
    };
  };

  return (
    <figure
      ref={ref}
      data-seen={seen || undefined}
      className={cn(
        "hold-until-seen relative px-3 pb-4 pt-3 [--gutter:1.5rem] [--mid:calc((100%-var(--gutter))/4)] sm:px-7 sm:pb-6 sm:pt-5 sm:[--gutter:3.5rem]",
        className
      )}
    >
      <CropMarks />

      {/* 02 / Compare: a dimension line from the middle of the resume to the middle of the profile. */}
      <div className={cn("relative mb-3 h-7", ENTER)} style={at(420)}>
        <div className="absolute inset-x-(--mid) inset-y-0 flex items-center gap-2">
          <Rule active={comparing} className="h-2.5 w-px" />
          <Rule active={comparing} className="h-px flex-1" />
          <IndexLabel index="02" atMs={460}>
            Compare
          </IndexLabel>
          <Rule active={comparing} className="h-px flex-1" />
          <Rule active={comparing} className="h-2.5 w-px" />
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_var(--gutter)_minmax(0,1fr)] grid-rows-[repeat(6,auto)]">
        <div {...sheetProps("resume", "col-start-1 row-span-6 row-start-1 grid grid-rows-subgrid pb-1")}>
          <SheetHead
            title="Resume"
            detail={audit ? audit.documentName : "Not analyzed yet"}
            grade={result && seen ? <GradeMark score={result.overall.score} size={60} delayMs={400} /> : <GradeSlot />}
          />
          {ROWS.map((row, index) => {
            const section = result?.sections.find((candidate) => candidate.id === row.section);
            return (
              <SheetRow key={row.section} label={row.resume}>
                {!result ? (
                  <Blank width={BLANKS[index]} />
                ) : section ? (
                  <Score value={section.score} atMs={600 + index * 80} />
                ) : (
                  <span className="text-[11.5px] text-paper-muted">Not found</span>
                )}
              </SheetRow>
            );
          })}
          {evidence && (
            <div className="flex min-h-9 items-center justify-between gap-2 border-t-[3px] border-double border-paper-line px-3 text-[12.5px] sm:px-4 sm:text-[13px]">
              <span className="font-semibold">Evidence</span>
              <Score value={evidence.score} atMs={920} />
            </div>
          )}
        </div>

        {/* The rows a comparison reads against each other: drawn across the gap while it is picked. */}
        {ROWS.map((row, index) => (
          <span key={row.section} aria-hidden="true" className="relative col-start-2 h-px self-center" style={{ gridRow: index + 2 }}>
            <span
              className={cn(
                "absolute inset-0 origin-left bg-primary transition-[scale] duration-400 ease-out-quart",
                comparing ? "scale-x-100" : "scale-x-0"
              )}
              style={{ transitionDelay: comparing ? `${120 + index * 60}ms` : "0ms" }}
            />
            {["-left-0.5", "-right-0.5"].map((side) => (
              <span
                key={side}
                className={cn(
                  "absolute -top-0.5 size-1.5 rounded-full bg-primary transition-opacity duration-300",
                  side,
                  comparing ? "opacity-100" : "opacity-0"
                )}
              />
            ))}
          </span>
        ))}

        <div {...sheetProps("linkedin", "col-start-3 row-span-6 row-start-1 grid grid-rows-subgrid pb-1", 90)}>
          <SheetHead title="LinkedIn" detail="Coming soon" grade={<GradeSlot />} />
          {ROWS.map((row, index) => (
            <SheetRow key={row.section} label={row.linkedin}>
              <Blank width={BLANKS[(index + 2) % BLANKS.length]} />
            </SheetRow>
          ))}
        </div>
      </div>

      {/* 03 / Match: both sheets lead down into the role; the resume's line is the one Job Match draws. */}
      <div className={cn("relative h-16 sm:h-20", ENTER)} style={at(480)}>
        <span aria-hidden="true" className="absolute left-(--mid) right-1/2 top-0 h-1/2 rounded-bl-[4px] border-b border-l border-foreground/20" />
        <span aria-hidden="true" className="absolute left-1/2 right-(--mid) top-0 h-1/2 rounded-br-[4px] border-b border-r border-foreground/20" />
        <span aria-hidden="true" className="absolute left-1/2 top-1/2 h-1/2 w-px bg-foreground/20" />
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-0 transition-[clip-path] duration-550 ease-out-quart",
            matching ? "[clip-path:inset(0)]" : "[clip-path:inset(0_0_100%_0)]"
          )}
        >
          <span className="absolute left-(--mid) right-1/2 top-0 h-1/2 rounded-bl-[4px] border-b border-l border-primary" />
          <span className="absolute left-1/2 top-1/2 h-1/2 w-px bg-primary" />
        </span>
        <span className="absolute left-1/2 top-1/2 ml-3 mt-2.5 sm:mt-4">
          <IndexLabel index="03" atMs={520}>
            Match
          </IndexLabel>
        </span>
      </div>

      <div {...sheetProps("job", "", 180)}>
        <SheetHead title="Target role" detail="Coming soon" grade={<GradeSlot />} />
        <div className="grid grid-cols-3 border-t border-paper-line">
          {JOB_ROWS.map((label, index) => (
            <div key={label} className={cn("min-w-0 px-3 pb-3 pt-2 sm:px-4", index > 0 && "border-l border-paper-line")}>
              <p className="truncate text-[12px] text-paper-muted sm:text-[12.5px]">{label}</p>
              <div className="mt-2 space-y-1.5">
                <Blank width="w-4/5" />
                <Blank width={BLANKS[index]} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <figcaption className={cn("mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1.5", ENTER)} style={at(560)}>
        <IndexLabel index="04" atMs={600}>
          Audit
        </IndexLabel>
        <span className="text-[13px] text-muted-foreground">
          All three read together become one{" "}
          <Link
            to="/career-audit"
            className="font-medium text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
          >
            Career Audit
          </Link>
          , coming soon.
        </span>
      </figcaption>
    </figure>
  );
}

function SheetHead({ title, detail, grade }: { title: string; detail: string; grade: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-2 px-3 pb-2.5 pt-3 sm:px-4 sm:pt-3.5">
      <div className="min-w-0">
        <p className="font-serif text-[16px] font-semibold leading-tight sm:text-[18px]">{title}</p>
        <p className="mt-0.5 truncate text-[11.5px] text-paper-muted sm:text-[12px]">{detail}</p>
      </div>
      {/* On phones the grade sits at 85%, so the sheet's name keeps its room beside it. */}
      <span className="shrink-0 max-sm:zoom-[0.85]">{grade}</span>
    </div>
  );
}

function SheetRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-h-9 items-center justify-between gap-2 border-t border-paper-line px-3 text-[12.5px] sm:px-4 sm:text-[13px]">
      {/* The label keeps its width; an unread line shrinks to fit beside it. */}
      <span className="shrink-0">{label}</span>
      {children}
    </div>
  );
}

/** A score in its band's pen, fading in once the surface is on screen. */
function Score({ value, atMs }: { value: number; atMs: number }) {
  return (
    <span
      className={cn(
        "font-serif text-[16px] font-medium italic tabular-nums animate-in fade-in-0 duration-500 fill-mode-backwards",
        SCORE_TONES[getScoreState(value).colorToken].text
      )}
      style={at(atMs)}
    >
      {value}
    </span>
  );
}

/** Where a grade goes before there is one: an empty pen circle, the size of GradeMark at 60. */
function GradeSlot() {
  return (
    <span className="grid h-[42px] w-[60px] shrink-0 place-items-center rounded-[50%] border border-dashed border-paper-ink/25 font-serif text-[15px] italic text-paper-muted">
      <span aria-hidden="true">–</span>
      <span className="sr-only">No score yet</span>
    </span>
  );
}

/** A line of the document, not read yet. */
function Blank({ width }: { width: string }) {
  return <span aria-hidden="true" className={cn("block h-1.5 rounded-full bg-paper-ink/10", width)} />;
}

/** A line of the drawing: faint at rest, highlighter while its inspection is picked. */
function Rule({ active, className }: { active: boolean; className: string }) {
  return <span aria-hidden="true" className={cn("transition-colors duration-500", active ? "bg-primary" : "bg-foreground/20", className)} />;
}

/** The corners of the inspection area, as a print is marked for trimming. */
function CropMarks() {
  return ["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"].map(
    (corner) => <span key={corner} aria-hidden="true" className={cn("absolute size-3 border-foreground/20", corner)} />
  );
}
