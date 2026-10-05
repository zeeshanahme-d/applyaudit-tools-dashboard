import { cn } from "@/lib/utils";
import { appConfig } from "@/config/app";

/** The mark alone: a paper tile with an audit tick and a stroke of highlighter under it. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative flex size-7 shrink-0 items-center justify-center rounded-[5px] bg-paper text-paper-ink shadow-[inset_0_0_0_1px_rgb(0_0_0/0.1)]",
        className
      )}
    >
      <svg viewBox="0 0 24 24" className="size-4.5" fill="none">
        <path d="M4 16.5h16" className="stroke-cta" strokeWidth="5" strokeLinecap="round" opacity="0.9" />
        <path d="M6.5 11.5l3.5 3.5 7.5-8.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/** The mark and the name. Name from config. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-foreground", className)}>
      <LogoMark />
      <span className="font-serif text-[18px] font-semibold tracking-[-0.01em]">{appConfig.name}</span>
    </span>
  );
}
