import { CircleCheck, RotateCcw } from "lucide-react";
import { buttonClass } from "@/components/ui/button";
import type { AnalysisMeta } from "../core/_models";

interface ReportHeaderProps {
  meta: AnalysisMeta;
  onReset: () => void;
}

/** The report's title, that it finished, and the way to start over. */
export function ReportHeader({ meta, onReset }: ReportHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">Resume Audit Report</h2>
          {/* Timing and flow are for development; users only need to know it is done. */}
          {import.meta.env.DEV && meta.processingTimeMs && (
            <span className="text-[12px] font-mono text-muted-foreground">({meta.processingTimeMs}ms)</span>
          )}
        </div>
        <p className="mt-0.5 flex items-center gap-1.5 text-[12.5px] text-muted-foreground">
          <CircleCheck className="size-3.5 text-success" aria-hidden="true" />
          Analysis completed
        </p>
        {import.meta.env.DEV && meta.flow && <p className="text-[12px] font-mono text-muted-foreground">Flow: {meta.flow}</p>}
      </div>
      <button type="button" onClick={onReset} className={buttonClass({ variant: "secondary", size: "sm" })}>
        <RotateCcw className="size-3.5" aria-hidden="true" /> Analyze Another
      </button>
    </div>
  );
}
