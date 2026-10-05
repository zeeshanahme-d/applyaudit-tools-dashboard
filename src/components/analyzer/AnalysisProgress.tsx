import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AnalysisProgressProps {
  /** What the work involves. Shown as a description, not ticked off: the browser cannot see the server's progress. */
  steps?: string[];
  className?: string;
  title?: string;
  /** What is being read, named above the sheet. */
  documentName?: string;
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

/** The shape of a page while its words are unknown: a name, a title, then sections of lines. */
const SKELETON: Array<string | null> = [
  "h-5 w-2/5",
  "mt-2.5 h-3 w-1/4",
  "mt-2 h-2.5 w-3/5",
  null,
  "h-3.5 w-1/5",
  "mt-3 h-2.5 w-full",
  "mt-2.5 h-2.5 w-11/12",
  "mt-2.5 h-2.5 w-4/5",
  null,
  "h-3.5 w-1/4",
  "mt-3 h-2.5 w-full",
  "mt-2.5 h-2.5 w-10/12",
  "mt-2.5 h-2.5 w-full",
  "mt-2.5 h-2.5 w-3/4",
  "mt-2.5 h-2.5 w-11/12",
  null,
  "h-3.5 w-1/5",
  "mt-3 h-2.5 w-9/12",
  "mt-2.5 h-2.5 w-2/3",
];

/**
 * An honest wait: the page under a scanner, the real elapsed time and what
 * the work involves. Never a step or percentage the server did not report:
 * the scan band moves the whole time because nobody knows how far along it is.
 */
export function AnalysisProgress({
  steps = defaultSteps,
  className,
  title = "Reading your document",
  documentName,
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
    <div aria-busy="true" className={cn("grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-12", className)}>
      <div className="lg:order-2">
        <h2 className="font-serif text-[28px] font-medium leading-tight tracking-[-0.01em] text-foreground">{title}</h2>
        <p className="mt-1.5 text-[13.5px] text-muted-foreground">Processed in memory, never stored</p>
        <p className="mt-5 font-serif text-[44px] font-medium italic leading-none tabular-nums text-foreground" aria-hidden="true">
          {elapsed}s
        </p>

        <p className="mt-7 text-[12.5px] font-medium text-muted-foreground">What happens</p>
        <ul className="mt-3 space-y-2.5 border-l border-border pl-4">
          {steps.map((step) => (
            <li key={step} className="text-[13.5px] leading-snug text-foreground/90">
              {step}
            </li>
          ))}
        </ul>

        {/* The live region exists from the start, so the message is announced when it appears. */}
        <div role="status">
          {isSlow && (
            <p className="mt-6 flex items-start gap-2 rounded-sm border border-warning-line bg-warning-soft p-3 text-[13px] leading-relaxed text-foreground/90">
              <Clock className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden="true" />
              <span>{slowMessage}</span>
            </p>
          )}
        </div>
      </div>

      <div className="lg:order-1">
        {documentName && (
          <p className="mb-2.5 truncate text-[12.5px] text-muted-foreground">
            On the desk: <span className="font-medium text-foreground">{documentName}</span>
          </p>
        )}
        <div className="paper relative min-h-104 w-full max-w-2xl overflow-hidden px-7 py-9 sm:px-12 sm:py-12">
          <div aria-hidden="true">
            {SKELETON.map((bar, index) =>
              bar ? <div key={index} className={cn("rounded-full bg-paper-ink/10", bar)} /> : <div key={index} className="h-7" />
            )}
          </div>
          {/* The scanner: highlighter light passing down the page and back. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="scan-sweep absolute inset-x-0 top-0 h-full">
              <div className="h-24 -translate-y-full bg-linear-to-b from-transparent to-cta/30" />
              <div className="h-0.5 -translate-y-24 bg-cta" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
