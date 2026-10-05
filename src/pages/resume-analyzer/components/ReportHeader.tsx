import { CircleCheck, Printer, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonClass } from "@/components/ui/button";
import type { AnalysisMeta } from "../core/_models";
import type { PageMode } from "./MarkedLine";

interface ReportHeaderProps {
  meta: AnalysisMeta;
  mode: PageMode;
  onModeChange: (mode: PageMode) => void;
  /** Whether any line has a rewrite to show. */
  hasRewrites: boolean;
  onReset: () => void;
}

const MODES: { id: PageMode; label: string }[] = [
  { id: "marked", label: "Marked up" },
  { id: "rewritten", label: "With rewrites" },
];

/** The report's title, that it finished, how to read the page, and the ways on: keep it, or start over. */
export function ReportHeader({ meta, mode, onModeChange, hasRewrites, onReset }: ReportHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <div>
        <div className="flex flex-wrap items-baseline gap-x-3">
          <h2 className="font-serif text-[30px] font-medium leading-tight tracking-[-0.01em] text-foreground">
            Your resume, marked up
          </h2>
          {/* Timing and flow are for development; users only need to know it is done. */}
          {import.meta.env.DEV && meta.processingTimeMs && (
            <span className="font-mono text-[12px] text-muted-foreground">({meta.processingTimeMs}ms)</span>
          )}
        </div>
        <p className="mt-1 flex items-center gap-1.5 text-[13px] text-muted-foreground">
          <CircleCheck className="size-3.5 text-success" aria-hidden="true" />
          Audit complete
        </p>
        {import.meta.env.DEV && meta.flow && <p className="font-mono text-[12px] text-muted-foreground">Flow: {meta.flow}</p>}
      </div>

      <div data-print="hide" className="flex flex-wrap items-center gap-2">
        {hasRewrites && (
          <div role="group" aria-label="Show the page" className="inline-flex rounded-sm border border-input p-0.5">
            {MODES.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={mode === option.id}
                onClick={() => onModeChange(option.id)}
                className={cn(
                  "h-8 pointer-coarse:h-11 cursor-pointer rounded-xs px-3 text-[13px] font-medium transition-colors duration-150",
                  mode === option.id ? "bg-cta text-cta-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
        <button type="button" onClick={() => window.print()} className={buttonClass({ variant: "secondary", size: "sm" })}>
          <Printer className="size-3.5" aria-hidden="true" /> Print or save as PDF
        </button>
        <button type="button" onClick={onReset} className={buttonClass({ variant: "secondary", size: "sm" })}>
          <RotateCcw className="size-3.5" aria-hidden="true" /> Audit another resume
        </button>
      </div>
    </div>
  );
}
