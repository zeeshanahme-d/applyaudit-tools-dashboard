import { cn } from "@/lib/utils";

/**
 * The marketing site's button (marketing/src/components/ui/button-variants.ts),
 * for links and buttons alike. Hover deepens the tone and lifts 1px (not under
 * reduced motion), pressing sets it back down. Radius 6px, like every control.
 */
const base = [
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-sm",
  "transition-[background-color,border-color,color,box-shadow,translate] duration-150 ease-out",
  "motion-safe:hover:-translate-y-px active:translate-y-0",
  "disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
];

const variants = {
  primary: [
    "bg-cta font-semibold tracking-[-0.005em] text-white hover:bg-cta-hover",
    // A light top edge, a hairline edge, and a short shadow in the button's own tone.
    "shadow-[inset_0_1px_0_rgb(255_255_255/0.2),inset_0_0_0_1px_rgb(0_0_0/0.1),0_1px_2px_rgb(14_20_36/0.14),0_4px_12px_-6px_var(--cta)]",
    "hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.2),inset_0_0_0_1px_rgb(0_0_0/0.12),0_2px_4px_rgb(14_20_36/0.12),0_8px_18px_-8px_var(--cta)]",
    "active:shadow-[inset_0_1px_0_rgb(255_255_255/0.2),inset_0_0_0_1px_rgb(0_0_0/0.12),0_1px_2px_rgb(14_20_36/0.14)]",
  ],
  secondary: "border border-border bg-card font-medium text-foreground shadow-raised hover:border-foreground/20",
  ghost: "font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
};

const sizes = {
  sm: "h-9 px-3.5 text-[13px] pointer-coarse:h-11",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

export function buttonClass({
  variant = "primary",
  size = "md",
  className,
}: { variant?: keyof typeof variants; size?: keyof typeof sizes; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}
