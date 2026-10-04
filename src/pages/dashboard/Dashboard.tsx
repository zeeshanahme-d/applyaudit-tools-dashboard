import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ClockFading, FileUp, FlaskConical, LayoutList, type LucideIcon } from "lucide-react";
import { appConfig } from "@/config/app";
import { UPLOAD_LIMITS } from "@/config/upload-limits";
import { cn } from "@/lib/utils";
import { buttonClass } from "@/components/ui/button";
import { ScoreRing } from "@/components/results/ScoreRing";
import { SCORE_TONES } from "@/components/results/semantic-tokens";
import { useAfterFirstPaint } from "@/hooks/use-after-first-paint";
import { getScoreState } from "@/types/analysis";
import { TOOL_SECTIONS, type Tool } from "@/data/tools";

/**
 * The real result of the built-in sample resume (the API's own sample,
 * scored by the same rules as any upload), shown as an example of what an
 * audit returns. Never presented as the visitor's data: nothing they upload
 * is stored, so there is no history to show. Update if the scoring changes.
 */
const SAMPLE_AUDIT = {
  score: 92,
  recoverable: 8,
  strongBullets: { strong: 5, total: 7 },
  factors: [
    { label: "Action verbs", value: 86 },
    { label: "Evidence & impact", value: 88 },
    { label: "Contact & links", value: 100 },
    { label: "Section coverage", value: 100 },
  ],
};

const QUICK_ACTIONS: { label: string; detail: string; to: string; icon: LucideIcon }[] = [
  { label: "Analyze a resume", detail: "Upload a PDF, DOCX or TXT file", to: "/resume-analyzer", icon: FileUp },
  { label: "Try the sample resume", detail: "On the analyzer, choose Try with sample resume", to: "/resume-analyzer", icon: FlaskConical },
  { label: "See all tools", detail: "What's ready and what's coming", to: "#tools", icon: LayoutList },
];

/** What happens to an upload, in order. */
const AUDIT_STEPS = [
  { title: "Upload your resume", detail: "Read in memory, not stored." },
  { title: "See every score explained", detail: "Four scored factors, each point accounted for." },
  { title: "Fix what matters first", detail: "Changes ranked by the points they add." },
];

/** One load sequence: each block rises 8px into place, a beat after the one before. */
const ENTER = "animate-in fade-in-0 slide-in-from-bottom-2 duration-300 ease-out fill-mode-both";
const at = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });

function greeting(hour: number) {
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  const tools = TOOL_SECTIONS.flatMap((section) => section.tools);
  const ready = tools.filter((tool) => tool.available).length;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-10 lg:pt-11">
      <title>{`${appConfig.name} — ${appConfig.tagline}`}</title>

      {/* Level 1: where you are, and the one thing to do */}
      <header className={cn(ENTER, "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between")}>
        <div>
          <p className="text-[13.5px] text-muted-foreground">{greeting(new Date().getHours())}</p>
          <h1 className="mt-1 font-display text-[1.75rem] font-semibold leading-[1.15] tracking-tight text-foreground sm:text-[2.125rem]">
            Your career workspace
          </h1>
          <p className="mt-2 max-w-xl text-[14.5px] leading-relaxed text-muted-foreground">
            Find the weaknesses in your resume before you apply, and fix the ones that cost you most first.
          </p>
        </div>
        <Link to="/resume-analyzer" className={buttonClass({ className: "w-full shrink-0 sm:w-auto" })}>
          <FileUp className="size-4" aria-hidden="true" />
          Analyze resume
        </Link>
      </header>

      {/* Level 2: the first useful step, beside what supports it */}
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <StartPanel />

        <div className="grid content-start items-start gap-5 md:grid-cols-2 lg:grid-cols-1">
          <section
            aria-labelledby="activity-title"
            className={cn(ENTER, "rounded-lg border border-border bg-card p-5 shadow-raised")}
            style={at(120)}
          >
            <h2 id="activity-title" className="text-[15px] font-semibold text-foreground">
              Recent activity
            </h2>
            <div className="mt-4 flex gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <ClockFading className="size-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-[13.5px] font-medium text-foreground">Nothing saved here</p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">
                  Your resume and its audit are not stored. Each audit stays in the tab where you run it.
                </p>
              </div>
            </div>
          </section>

          <section aria-labelledby="actions-title" className={ENTER} style={at(180)}>
            <h2 id="actions-title" className="text-[15px] font-semibold text-foreground">
              Quick actions
            </h2>
            <ul className="mt-3 space-y-2">
              {QUICK_ACTIONS.map((action) => {
                const body = (
                  <>
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                      <action.icon className="size-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13.5px] font-medium text-foreground">{action.label}</span>
                      <span className="block text-[12.5px] leading-snug text-muted-foreground">{action.detail}</span>
                    </span>
                    <ChevronRight
                      className="size-4 shrink-0 text-muted-foreground/60 transition-[translate,color] duration-200 group-hover:translate-x-0.5 group-hover:text-foreground"
                      aria-hidden="true"
                    />
                  </>
                );
                const className =
                  "group flex items-center gap-3 rounded-lg border border-border bg-card px-3.5 py-3 shadow-raised transition-[translate,box-shadow,border-color] duration-200 ease-out hover:-translate-y-px hover:border-foreground/15 hover:shadow-float";
                return (
                  <li key={action.label}>
                    {action.to.startsWith("#") ? (
                      <a href={action.to} className={className}>
                        {body}
                      </a>
                    ) : (
                      <Link to={action.to} className={className}>
                        {body}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>

      {/* Level 3: every tool, one index */}
      <section id="tools" aria-labelledby="tools-title" className={cn(ENTER, "mt-12 scroll-mt-20")} style={at(240)}>
        <div className="flex items-baseline justify-between gap-3">
          <h2 id="tools-title" className="font-display text-lg font-semibold tracking-[-0.01em] text-foreground">
            Tools
          </h2>
          <p className="text-[13px] text-muted-foreground">
            {ready} ready, {tools.length - ready} coming soon
          </p>
        </div>
        <div className="mt-3 overflow-hidden rounded-lg border border-border bg-card shadow-raised">
          {TOOL_SECTIONS.map((section, index) => (
            <div key={section.label} className={cn(index > 0 && "border-t border-border")}>
              <h3 className="bg-surface/70 px-5 py-2 text-[12px] font-medium text-muted-foreground">{section.label}</h3>
              <ul className="divide-y divide-border">
                {section.tools.map((tool) => (
                  <ToolRow key={tool.to} tool={tool} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/** The new-visitor state, and the only state: nothing is stored, so every visit starts here. */
function StartPanel() {
  const shown = useAfterFirstPaint();

  return (
    <section
      aria-labelledby="start-title"
      className={cn(ENTER, "overflow-hidden rounded-lg border border-border bg-card shadow-raised lg:col-span-2")}
      style={at(60)}
    >
      <div className="grid h-full md:grid-cols-[minmax(0,1fr)_minmax(0,18.5rem)]">
        <div className="flex flex-col p-6 sm:p-7">
          <h2 id="start-title" className="font-display text-xl font-semibold tracking-[-0.015em] text-foreground">
            Start with your resume
          </h2>
          <p className="mt-2 max-w-md text-[14px] leading-relaxed text-muted-foreground">
            Analyze your resume and get a complete quality audit: every score explained, every bullet reviewed, and
            the fixes ranked by how much they move your score.
          </p>
          <ol className="mt-6 space-y-3.5">
            {AUDIT_STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-surface font-mono text-[12px] font-semibold text-muted-foreground">
                  {index + 1}
                </span>
                <span className="text-[13px] leading-snug">
                  <span className="block font-medium text-foreground">{step.title}</span>
                  <span className="block text-muted-foreground">{step.detail}</span>
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-auto flex flex-col gap-3 pt-7 sm:flex-row sm:items-center sm:gap-4">
            {/* On phones the page's own button sits just above: one is enough. */}
            <Link to="/resume-analyzer" className={buttonClass({ variant: "secondary", className: "max-sm:hidden" })}>
              Analyze resume
            </Link>
            <p className="text-[12.5px] text-muted-foreground">
              PDF, DOCX or TXT, up to {UPLOAD_LIMITS.maxFileMb} MB and {UPLOAD_LIMITS.maxPages} pages
            </p>
          </div>
        </div>

        {/* What a finished audit looks like: the real report's own ring and meters */}
        <div className="border-t border-border bg-surface/60 p-6 sm:p-7 md:border-l md:border-t-0">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-[13px] font-semibold text-foreground">What an audit shows</h3>
            <span className="text-[12px] text-muted-foreground">Sample resume</span>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <ScoreRing score={SAMPLE_AUDIT.score} size={84} strokeWidth={7} showStatusBadge={false} />
            <div className="space-y-1 text-[12.5px]">
              <p className="font-display text-[15px] font-semibold text-foreground">Resume quality</p>
              <p className="text-muted-foreground">
                {SAMPLE_AUDIT.strongBullets.strong} of {SAMPLE_AUDIT.strongBullets.total} bullets strong
              </p>
              <p className="font-medium text-success">+{SAMPLE_AUDIT.recoverable} points recoverable</p>
            </div>
          </div>

          <dl className="mt-5 space-y-3">
            {SAMPLE_AUDIT.factors.map((factor) => (
              <div key={factor.label}>
                <div className="flex items-baseline justify-between text-[12.5px]">
                  <dt className="text-muted-foreground">{factor.label}</dt>
                  <dd className="font-mono font-semibold tabular-nums text-foreground">{factor.value}</dd>
                </div>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                  <div
                    className={cn(
                      "h-full origin-left rounded-full transition-transform duration-700 ease-out-expo",
                      SCORE_TONES[getScoreState(factor.value).colorToken].bar
                    )}
                    style={{ transform: `scaleX(${shown ? factor.value / 100 : 0})` }}
                  />
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function ToolRow({ tool }: { tool: Tool }) {
  const status = tool.available ? "Ready" : "Coming soon";
  const statusClass = tool.available ? "font-medium text-success" : "text-muted-foreground";

  return (
    <li>
      <Link to={tool.to} className="group flex items-center gap-4 px-5 py-3.5 transition-colors duration-150 hover:bg-muted/40">
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-md",
            tool.available ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
          )}
        >
          <tool.icon className="size-4" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[14px] font-medium text-foreground">{tool.name}</span>
          <span className="mt-0.5 block text-[13px] leading-snug text-muted-foreground max-sm:line-clamp-2">{tool.description}</span>
          <span className={cn("mt-1 block text-[12px] sm:hidden", statusClass)}>{status}</span>
        </span>
        <span className={cn("hidden shrink-0 text-[12.5px] sm:block", statusClass)}>{status}</span>
        <ChevronRight
          className="size-4 shrink-0 text-muted-foreground/60 transition-[translate,color] duration-200 group-hover:translate-x-0.5 group-hover:text-foreground"
          aria-hidden="true"
        />
      </Link>
    </li>
  );
}
