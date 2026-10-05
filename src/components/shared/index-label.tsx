import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface IndexLabelProps {
  /** The step's number in the audit's order, "01" to "04". */
  index: string;
  children: ReactNode;
  /** When the rule draws in, in ms. */
  atMs?: number;
  className?: string;
}

/** A step of the audit, as a report numbers it: a short rule draws down, then "02 / Compare". */
export function IndexLabel({ index, children, atMs = 0, className }: IndexLabelProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-2 whitespace-nowrap text-[12px] font-medium text-muted-foreground", className)}
      style={{ "--at": `${atMs}ms` } as CSSProperties}
    >
      <span aria-hidden="true" className="index-tick h-3 w-px bg-current" />
      <span className="tabular-nums text-foreground">{index}</span>
      <span aria-hidden="true">/</span>
      {children}
    </span>
  );
}
