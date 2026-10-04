import { cn } from "@/lib/utils";
import { appConfig } from "@/config/app";

/** The mark alone: an ink tile with an audit tick and one indigo marker. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px] bg-foreground text-background shadow-[inset_0_1px_0_rgb(255_255_255/0.15)]",
        className
      )}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
        <path d="M6.5 12.5l3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
    </span>
  );
}

/** The mark and the name. Name from config. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 font-semibold tracking-tight text-foreground", className)}>
      <LogoMark />
      <span className="font-display text-[15px] font-bold tracking-[-0.02em]">{appConfig.name}</span>
    </span>
  );
}
