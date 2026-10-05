import type { CSSProperties } from "react";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { FileUploader } from "@/components/analyzer/FileUploader";
import { buttonClass } from "@/components/ui/button";
import { UPLOAD_LIMITS } from "@/config/upload-limits";
import { TOOLS, type Artifact, type Tool } from "@/data/tools";
import type { SessionAudit } from "@/pages/resume-analyzer/core/hook/useLastResumeAnalysis";

interface StartAnalysisProps {
  focus: Artifact;
  onFocusChange: (artifact: Artifact) => void;
  audit: SessionAudit | null;
  onFile: (file: File) => void;
  onTrySample: () => void;
  /** A file dropped elsewhere on the page that could not be used. */
  error: string | null;
}

const CHOICES: readonly { value: Artifact; label: string }[] = [
  { value: "resume", label: "Resume" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "job", label: "Job" },
];

/** The documents whose analysis is still being built: what it will read, said plainly. */
const NOT_YET: Record<Exclude<Artifact, "resume">, { title: string; body: string; tool: Tool }> = {
  linkedin: {
    title: "Your LinkedIn profile",
    body: "Recruiters look you up before they read your resume. LinkedIn analysis is still being built, so there is nothing to upload yet.",
    tool: TOOLS.linkedin,
  },
  job: {
    title: "A job you want",
    body: "Bring a job description to see how closely you match it. Job matching is still being built, so there is nothing to paste yet.",
    tool: TOOLS.resumeJob,
  },
};

/** What the first audit finds, each marked the way the report will mark it. One line each, so the action stays in view. */
const FINDS = [
  { title: "Content weaknesses", mark: "marker" },
  { title: "Evidence gaps", mark: "marker [--mark:var(--mark-issue)]" },
  { title: "Priority improvements", mark: "text-pen-green" },
];

/**
 * Opening a new analysis: pick the document, as you would pull a folder's
 * tab, and its sheet opens beneath. Only the resume can be read today; the
 * others say so and point back to it.
 */
export function StartAnalysis({ focus, onFocusChange, audit, onFile, onTrySample, error }: StartAnalysisProps) {
  return (
    <section aria-labelledby="start-title">
      <h2 id="start-title" className="text-[13px] font-medium text-muted-foreground">
        Start new analysis
      </h2>
      <fieldset className="mt-1.5">
        <legend className="font-serif text-[26px] font-medium leading-tight tracking-[-0.01em] sm:text-[28px]">
          What do you want to inspect?
        </legend>
        <div className="relative z-10 mt-4 -mb-px flex">
          {CHOICES.map((choice) => (
            <label
              key={choice.value}
              className={cn(
                "flex min-h-11 cursor-pointer select-none items-center rounded-t-[3px] px-4 text-[14px] font-medium transition-colors duration-150",
                "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring",
                focus === choice.value
                  ? "bg-paper text-paper-ink"
                  : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground active:bg-foreground/8"
              )}
            >
              <input
                type="radio"
                name="inspect"
                value={choice.value}
                checked={focus === choice.value}
                onChange={() => onFocusChange(choice.value)}
                className="sr-only"
              />
              {choice.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="paper rounded-tl-none px-5 py-6 sm:px-7">
        <div key={focus} className="animate-in fade-in-0 slide-in-from-bottom-1 duration-200 ease-out">
          {focus === "resume" ? (
            audit ? (
              <NextFixes audit={audit} onFile={onFile} onTrySample={onTrySample} />
            ) : (
              <FirstAudit onFile={onFile} onTrySample={onTrySample} />
            )
          ) : (
            <NotYet artifact={focus} onStartWithResume={() => onFocusChange("resume")} />
          )}
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-3 flex items-start gap-2 text-[13.5px] text-danger">
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </section>
  );
}

type DropProps = Pick<StartAnalysisProps, "onFile" | "onTrySample">;

/** On a tablet the panel is wide: what to read on the left, where to drop on the right. Beside the surface it stacks again. */
const SPLIT = "md:grid md:grid-cols-2 md:items-start md:gap-x-10 xl:block";

/** No audit yet in this session: the guided start. */
function FirstAudit({ onFile, onTrySample }: DropProps) {
  return (
    <div className={SPLIT}>
      <div>
        <h3 className="font-serif text-[24px] font-medium leading-tight">Your first audit</h3>
        <p className="mt-1.5 text-[14.5px] leading-relaxed text-paper-muted">
          Start with your resume. The analyzer reads every line and shows you:
        </p>
        <ul className="mt-3.5 space-y-2">
          {FINDS.map((find, index) => (
            <li key={find.title} className="text-[14.5px] leading-snug">
              <span className={cn("font-semibold", find.mark)} style={{ "--at": `${200 + index * 140}ms` } as CSSProperties}>
                {find.title}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <ResumeDrop onFile={onFile} onTrySample={onTrySample} className="mt-6 md:mt-0 xl:mt-6" />
    </div>
  );
}

/** An audit ran this session: what to fix first, then another resume. */
function NextFixes({ audit, onFile, onTrySample }: DropProps & { audit: SessionAudit }) {
  const fixes = audit.result.actionPlan.slice(0, 3);
  return (
    <div className={SPLIT}>
      <div>
        <h3 className="font-serif text-[24px] font-medium leading-tight">Fix these next</h3>
        <p className="mt-1.5 text-[14.5px] leading-relaxed text-paper-muted">
          From this session&apos;s audit of <span className="font-medium text-paper-ink">{audit.documentName}</span>.
        </p>
        {fixes.length > 0 ? (
          <ol className="mt-3 divide-y divide-paper-line border-y border-paper-line">
            {fixes.map((fix, index) => (
              <li key={fix.id ?? fix.title} className="flex items-start gap-3 py-2.5">
                <span className="w-3 shrink-0 font-serif text-[16px] italic leading-snug text-paper-muted">{index + 1}</span>
                <span className="min-w-0 flex-1 text-[14px] font-medium leading-snug">{fix.title}</span>
                {(fix.overallScoreImpact ?? 0) > 0 && (
                  <span className="shrink-0 text-[13px] font-semibold tabular-nums text-pen-green">+{fix.overallScoreImpact}</span>
                )}
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-3 text-[14px]">No scored issues left to fix.</p>
        )}
        <p className="mt-2.5 text-[12.5px] text-paper-muted">Nothing is saved: reloading the page clears this audit.</p>
      </div>

      <div className="mt-7 border-t border-paper-line pt-5 md:mt-0 md:border-t-0 md:pt-0 xl:mt-7 xl:border-t xl:pt-5">
        <h3 className="text-[14px] font-semibold">Audit another resume</h3>
        <ResumeDrop onFile={onFile} onTrySample={onTrySample} className="mt-3" />
      </div>
    </div>
  );
}

/** Choosing or dropping a resume starts its audit on the analyzer. */
function ResumeDrop({ onFile, onTrySample, className }: DropProps & { className?: string }) {
  return (
    <div className={className}>
      <FileUploader
        file={null}
        onFileSelect={(file) => file && onFile(file)}
        title="Drop your resume here"
        description={`PDF, DOCX or TXT. Up to ${UPLOAD_LIMITS.maxFileMb} MB and ${UPLOAD_LIMITS.maxPages} pages.`}
        chooseLabel="Analyze resume"
        primary
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <button type="button" onClick={onTrySample} className={buttonClass({ variant: "secondary", size: "sm" })}>
          Try the sample resume
        </button>
        <p className="text-[12.5px] text-paper-muted">Read in memory, never stored</p>
      </div>
    </div>
  );
}

function NotYet({ artifact, onStartWithResume }: { artifact: Exclude<Artifact, "resume">; onStartWithResume: () => void }) {
  const { title, body, tool } = NOT_YET[artifact];
  return (
    <>
      <h3 className="font-serif text-[24px] font-medium leading-tight">{title}</h3>
      <p className="mt-1.5 text-[14.5px] leading-relaxed text-paper-muted">{body}</p>
      <h4 className="mt-5 text-[12.5px] font-medium text-paper-muted">What it will inspect</h4>
      <ul className="mt-2 space-y-2">
        {tool.checks.map((check) => (
          <li key={check.title} className="flex items-start gap-2.5 text-[14px] leading-snug">
            <check.icon className="mt-0.5 size-4 shrink-0 text-paper-muted" aria-hidden="true" />
            {check.title}
          </li>
        ))}
      </ul>
      <button type="button" onClick={onStartWithResume} className={buttonClass({ className: "mt-6" })}>
        Start with your resume
      </button>
    </>
  );
}
