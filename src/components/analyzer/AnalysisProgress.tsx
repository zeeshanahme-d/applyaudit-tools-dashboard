import { useEffect, useState } from "react";
import { Clock, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AnalysisProgressProps {
  /** What the work involves. Shown as a description, not ticked off: the browser cannot see the server's progress. */
  steps?: string[];
  className?: string;
  title?: string;
  /** Shown once the work has taken `slowAfterMs`, so the user knows to wait. */
  slowMessage?: string;
  slowAfterMs?: number;
}

const defaultSteps = [
  "Extracting document text & metadata...",
  "Parsing experience, education & technical skills...",
  "Evaluating industry benchmarks & ATS compatibility...",
  "Synthesizing actionable improvements & rewrite suggestions...",
];

/** An honest wait: real elapsed time and an indeterminate bar, never a step or percentage the server did not report. */
export function AnalysisProgress({
  steps = defaultSteps,
  className,
  title = "Analyzing Document",
  slowMessage,
  slowAfterMs = 40_000,
}: AnalysisProgressProps) {
  const [elapsed, setElapsed] = useState(0);
  const isSlow = Boolean(slowMessage) && elapsed * 1000 >= slowAfterMs;

  // Mounted only while the work runs, so the clock starts and stops with it.
  useEffect(() => {
    const timer = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      aria-busy="true"
      className={cn("mx-auto w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card shadow-raised", className)}
    >
      <div className="relative h-0.5 overflow-hidden bg-muted" aria-hidden="true">
        <div className="indeterminate-bar absolute inset-y-0 left-0 w-1/3 rounded-full bg-primary" />
      </div>

      <div className="flex items-center gap-3.5 border-b border-border px-6 py-5">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>
          <p className="mt-0.5 text-[12.5px] text-muted-foreground">Processed in memory, not stored</p>
        </div>
        <span className="shrink-0 text-[12.5px] tabular-nums text-muted-foreground" aria-hidden="true">
          {elapsed}s
        </span>
      </div>

      <div className="px-6 py-5">
        <p className="text-[12px] font-medium text-muted-foreground">What happens</p>
        <ul className="mt-3 space-y-2.5">
          {steps.map((step) => (
            <li key={step} className="flex items-start gap-3 text-[13px] leading-snug text-foreground/90">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground" aria-hidden="true" />
              {step}
            </li>
          ))}
        </ul>
      </div>

      {/* The live region exists from the start, so the message is announced when it appears. */}
      <div role="status">
        {isSlow && (
          <p className="mx-4 mb-4 flex items-start gap-2 rounded-lg border border-warning-line bg-warning-soft p-3 text-[12.5px] leading-relaxed text-foreground/90">
            <Clock className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden="true" />
            <span>{slowMessage}</span>
          </p>
        )}
      </div>
    </div>
  );
}
