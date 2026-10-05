import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonClass } from "@/components/ui/button";
import { IndexLabel } from "@/components/shared/index-label";
import { ToolName } from "@/components/shared/tool-name";
import { AUDIT_STEPS, TOOLS, type Artifact, type Tool } from "@/data/tools";
import { useSeen } from "@/hooks/use-seen";

const ALL = AUDIT_STEPS.flatMap((step) => step.tools);
const READY = ALL.filter((tool) => tool.available).length;

/**
 * Every analysis, set out as a report's contents in the order an audit runs.
 * Pointing at one (or tabbing to it) shows, beside the list, which documents
 * it reads and what it inspects.
 */
export function AnalysisLibrary({ className }: { className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const seen = useSeen(ref);
  const [previewed, setPreviewed] = useState<Tool>(TOOLS.resume);

  return (
    <section ref={ref} data-seen={seen || undefined} aria-labelledby="library-title" className={cn("hold-until-seen", className)}>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b border-border pb-4">
        <div>
          <h2 id="library-title" className="font-serif text-[26px] font-medium leading-tight tracking-[-0.01em] sm:text-[28px]">
            Analysis library
          </h2>
          <p className="mt-1 text-[14px] text-muted-foreground">Every analysis, in the order an audit runs.</p>
        </div>
        <p className="text-[13px] tabular-nums text-muted-foreground">
          {READY} of {ALL.length} ready now
        </p>
      </div>

      <div className="grid items-start gap-12 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <ol className="divide-y divide-border">
          {AUDIT_STEPS.map((step, stepIndex) => (
            <li key={step.index} className="grid gap-x-8 gap-y-3 py-6 md:grid-cols-[8.5rem_minmax(0,1fr)]">
              <h3 className="md:pt-2.5">
                <IndexLabel index={step.index} atMs={stepIndex * 120}>
                  {step.label}
                </IndexLabel>
              </h3>
              <ul className="border-l border-border">
                {step.tools.map((tool) => (
                  <li key={tool.to}>
                    <Link
                      to={tool.to}
                      onMouseEnter={() => setPreviewed(tool)}
                      onFocus={() => setPreviewed(tool)}
                      className={cn(
                        "group relative block py-2.5 pl-5 transition-opacity duration-150 active:opacity-70",
                        // The previewed tool marks its stretch of the margin rule, as the menu marks the current page.
                        "before:absolute before:inset-y-2.5 before:-left-px before:w-0.5 before:origin-top before:rounded-full before:bg-primary before:transition-[scale] before:duration-300 before:ease-out-quart",
                        tool === previewed ? "before:scale-y-100" : "before:scale-y-0"
                      )}
                    >
                      {/* The status follows the name, where the eye already is, not at the far edge of a wide row. */}
                      <span className="flex flex-wrap items-baseline gap-x-2.5">
                        <span className="text-[15px] font-semibold text-foreground underline-offset-4 group-hover:underline">
                          <ToolName name={tool.name} />
                        </span>
                        <span className={cn("text-[12px]", tool.available ? "font-medium text-success" : "text-muted-foreground")}>
                          {tool.available ? "Ready" : "Soon"}
                        </span>
                      </span>
                      <span className="mt-0.5 block text-[13.5px] leading-snug text-muted-foreground">{tool.description}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <ToolPreview tool={previewed} className="sticky top-20 mt-6 hidden xl:block" />
      </div>
    </section>
  );
}

function ToolPreview({ tool, className }: { tool: Tool; className?: string }) {
  return (
    <aside aria-label="Preview" className={cn("paper px-6 py-6", className)}>
      <div key={tool.to} className="animate-in fade-in-0 slide-in-from-bottom-1 duration-200 ease-out">
        <DocumentMap reads={tool.reads} />
        <p className="mt-5 font-serif text-[22px] font-medium leading-tight">
          <ToolName name={tool.name} />
        </p>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-paper-muted">{tool.description}</p>
        <h3 className="mt-5 text-[12.5px] font-medium text-paper-muted">What it inspects</h3>
        <ul className="mt-1.5 divide-y divide-paper-line border-y border-paper-line">
          {tool.checks.map((check) => (
            <li key={check.title} className="flex items-center gap-2.5 py-2 text-[13.5px]">
              <check.icon className="size-4 shrink-0 text-paper-muted" aria-hidden="true" />
              {check.title}
            </li>
          ))}
        </ul>
        <Link
          to={tool.to}
          className={buttonClass({ variant: tool.available ? "primary" : "secondary", size: "sm", className: "mt-5 w-full" })}
        >
          {tool.available ? "Open the analyzer" : "See what it will check"}
        </Link>
      </div>
    </aside>
  );
}

/** The career surface in miniature: the documents a tool reads, and the lines it draws between them. */
function DocumentMap({ reads }: { reads: readonly Artifact[] }) {
  const has = (artifact: Artifact) => reads.includes(artifact);
  const doc = (artifact: Artifact) =>
    has(artifact) ? "fill-paper-ink/6 stroke-paper-ink" : "fill-none stroke-paper-ink/25 [stroke-dasharray:3_3]";
  const label = (artifact: Artifact) => cn("text-[10px] font-medium", has(artifact) ? "fill-paper-ink" : "fill-paper-muted");
  const line = (on: boolean) => (on ? "stroke-primary" : "stroke-paper-ink/20");

  return (
    <svg viewBox="0 0 160 104" className="w-full max-w-60" fill="none" aria-hidden="true">
      <rect x="0.5" y="0.5" width="62" height="44" rx="2" className={doc("resume")} />
      <rect x="97.5" y="0.5" width="62" height="44" rx="2" className={doc("linkedin")} />
      <rect x="0.5" y="74.5" width="159" height="29" rx="2" className={doc("job")} />
      <text x="31.5" y="26" textAnchor="middle" className={label("resume")}>
        Resume
      </text>
      <text x="128.5" y="26" textAnchor="middle" className={label("linkedin")}>
        LinkedIn
      </text>
      <text x="80" y="93" textAnchor="middle" className={label("job")}>
        Target role
      </text>
      <path d="M63 22.5H97" className={line(has("resume") && has("linkedin"))} />
      <path d="M31.5 45V59.5H80" className={line(has("resume") && has("job"))} />
      <path d="M128.5 45V59.5H80" className={line(has("linkedin") && has("job"))} />
      <path d="M80 59.5V74" className={line(has("job") && reads.length > 1)} />
    </svg>
  );
}
