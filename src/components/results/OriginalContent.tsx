import { cn } from "@/lib/utils";
import { SEMANTIC_TOKENS } from "./semantic-tokens";

export interface OriginalContentProps {
  label?: string;
  content: string;
  problemLine?: string;
  problems?: string[];
  whyWeak?: string;
  className?: string;
  variant?: "issue" | "warning" | "opportunity";
}

const WORDING = {
  issue: { label: "Current Content", whyWeak: "Why it is weak:", problems: "Problems detected:" },
  warning: { label: "Current Content (Weakness)", whyWeak: "Why it needs improvement:", problems: "Problems detected:" },
  opportunity: { label: "Optimization Opportunity", whyWeak: "Why this could be stronger:", problems: "Opportunities detected:" },
};

export function OriginalContent({
  label,
  content,
  problemLine,
  problems,
  whyWeak,
  className,
  variant = "issue",
}: OriginalContentProps) {
  const token = SEMANTIC_TOKENS[variant];
  const wording = WORDING[variant];

  return (
    <div className={cn("space-y-3 rounded-lg border p-4", token.panel, className)}>
      <div className={cn("flex items-center gap-1.5 text-[12.5px] font-semibold", token.text)}>
        <token.Icon className="size-4" aria-hidden="true" />
        {label ?? wording.label}
      </div>

      {/* The line as written */}
      <p className="rounded-md border border-border bg-card px-3.5 py-2.5 text-[13.5px] leading-relaxed text-foreground">
        {problemLine ?? content}
      </p>

      {whyWeak && (
        <div className="space-y-1 text-[12.5px]">
          <p className="font-semibold text-foreground">{wording.whyWeak}</p>
          <p className="leading-relaxed text-muted-foreground">{whyWeak}</p>
        </div>
      )}

      {problems && problems.length > 0 && (
        <div className="space-y-1.5 border-t border-border pt-3">
          <p className="text-[12.5px] font-semibold text-foreground">{wording.problems}</p>
          <ul className="grid grid-cols-1 gap-1.5 text-[12.5px] text-foreground/90 sm:grid-cols-2">
            {problems.map((p, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", token.dot)} aria-hidden="true" />
                <span className="leading-snug">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
