import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { CopyImprovementButton } from "./CopyImprovementButton";

export interface ImprovedContentProps {
  label?: string;
  improved: string;
  whyBetter?: string[];
  copyLabel?: string;
  className?: string;
}

export function ImprovedContent({
  label = "Recommended Improved Version",
  improved,
  whyBetter,
  copyLabel = "Copy Improved Version",
  className,
}: ImprovedContentProps) {
  return (
    <div className={cn("space-y-3 rounded-lg border border-success-line bg-success-soft p-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-success">
          <Sparkles className="size-4" aria-hidden="true" />
          {label}
        </div>
        <CopyImprovementButton text={improved} label={copyLabel} />
      </div>

      {/* The suggested replacement */}
      <p className="rounded-md border border-border bg-card px-3.5 py-2.5 text-[13.5px] leading-relaxed text-foreground">
        {improved}
      </p>

      {improved.includes("[") && (
        <p className="text-[12.5px] text-muted-foreground">
          Replace each <span className="font-mono text-foreground">[ ]</span> with your real number, or delete it if you
          don&apos;t know it. Never guess.
        </p>
      )}

      {whyBetter && whyBetter.length > 0 && (
        <div className="space-y-1.5 border-t border-success-line pt-3">
          <p className="text-[12.5px] font-semibold text-foreground">Why this is better:</p>
          <ul className="grid grid-cols-1 gap-1.5 text-[12.5px] text-foreground/90 sm:grid-cols-2">
            {whyBetter.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden="true" />
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
