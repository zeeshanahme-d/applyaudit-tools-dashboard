import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

/** The AI review was unavailable: every score still came from the rules. */
export function DeterministicModeNotice({ reason }: { reason?: string }) {
  return (
    <div className="mb-6 flex items-start gap-2.5 rounded-sm border border-warning-line bg-warning-soft p-3.5 text-[13.5px] text-foreground/90">
      <Info className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden="true" />
      <span>Core deterministic analysis is active. Qualitative AI suggestions were temporarily unavailable ({reason}).</span>
    </div>
  );
}

/** Doubts about how the file was read. Informational: they never change a score. */
export function ReadingNotes({ issues, className }: { issues: string[]; className?: string }) {
  return (
    <div className={cn("rounded-sm border border-warning-line bg-warning-soft p-4 text-[13.5px] text-foreground/90", className)}>
      <div className="flex items-center gap-2 font-semibold text-foreground">
        <Info className="size-4 shrink-0 text-warning" aria-hidden="true" />
        <span>Reading notes (parser warnings, do not affect your score)</span>
      </div>
      <ul className="mt-1.5 list-disc space-y-0.5 pl-10">
        {issues.map((issue) => (
          <li key={issue}>{issue}</li>
        ))}
      </ul>
    </div>
  );
}
