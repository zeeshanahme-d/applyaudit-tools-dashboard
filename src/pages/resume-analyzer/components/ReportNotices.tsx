import { Info } from "lucide-react";

/** The AI review was unavailable: every score still came from the rules. */
export function DeterministicModeNotice({ reason }: { reason?: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-warning-line bg-warning-soft p-3.5 text-[13px] text-foreground/90">
      <Info className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden="true" />
      <span>Core deterministic analysis is active. Qualitative AI suggestions were temporarily unavailable ({reason}).</span>
    </div>
  );
}

/** Doubts about how the file was read. Informational: they never change a score. */
export function ReadingNotes({ issues }: { issues: string[] }) {
  return (
    <div className="space-y-1.5 rounded-lg border border-warning-line bg-warning-soft p-4 text-[13px] text-foreground/90">
      <div className="flex items-center gap-2 font-semibold text-foreground">
        <Info className="size-4 shrink-0 text-warning" aria-hidden="true" />
        <span>Reading notes (parser warnings, do not affect your score)</span>
      </div>
      <ul className="list-disc space-y-0.5 pl-10">
        {issues.map((issue) => (
          <li key={issue}>{issue}</li>
        ))}
      </ul>
    </div>
  );
}
