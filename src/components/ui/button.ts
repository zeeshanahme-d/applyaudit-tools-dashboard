import { cn } from "@/lib/utils";

/**
 * Buttons and button-styled links. The primary is the highlighter: yellow
 * with ink text in both themes, and the only yellow control on a screen.
 * Hover lifts 1px (not under reduced motion), pressing sets it back down.
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
    "bg-cta font-semibold text-cta-foreground hover:bg-cta-hover",
    // An ink hairline and a short shadow: a sticky note lifted off the desk.
    "shadow-[inset_0_0_0_1px_rgb(26_26_16/0.14),0_1px_2px_rgb(0_0_0/0.25)]",
    "hover:shadow-[inset_0_0_0_1px_rgb(26_26_16/0.16),0_6px_16px_-6px_rgb(255_212_59/0.45)]",
  ],
  secondary: "border border-input bg-transparent font-medium text-foreground hover:border-foreground/40 hover:bg-foreground/5",
  ghost: "font-medium text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
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
