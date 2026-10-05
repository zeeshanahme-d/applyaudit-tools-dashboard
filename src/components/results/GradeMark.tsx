import { useEffect, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { getScoreState } from "@/types/analysis";
import { SCORE_TONES } from "./semantic-tokens";

export interface GradeMarkProps {
  score: number;
  /** Width in px; the height follows. */
  size?: number;
  /** When the circle starts drawing, in ms. */
  delayMs?: number;
  className?: string;
}

/** A loop drawn by hand: it starts top right and overshoots its start, as a pen does. */
const LOOP = "M150 24C112 4 44 9 21 49C2 86 46 127 108 126C166 125 197 93 185 57C176 31 142 14 92 19";

/**
 * The score as an editor grades a paper: a serif number with a pen circle
 * around it, in the color of its band. Meant for paper (the pens read on it).
 * The number counts up once while the circle draws; with reduced motion it
 * is simply there.
 */
export function GradeMark({ score, size = 168, delayMs = 0, className }: GradeMarkProps) {
  const tone = SCORE_TONES[getScoreState(score).colorToken];
  const shown = useCountUp(score, delayMs);

  return (
    <span
      className={cn("relative inline-grid shrink-0 place-items-center", className)}
      style={{ width: size, height: size * 0.7 }}
    >
      <svg viewBox="0 0 206 140" className="absolute inset-0 size-full overflow-visible" fill="none" aria-hidden="true">
        <path
          d={LOOP}
          pathLength={1}
          className={cn("draw-stroke", tone.stroke)}
          strokeWidth={size > 120 ? 3.2 : 4.2}
          strokeLinecap="round"
          style={{ "--at": `${delayMs}ms` } as CSSProperties}
        />
      </svg>
      <span
        aria-hidden="true"
        className="font-serif font-medium italic leading-none tracking-[-0.03em] tabular-nums"
        style={{ fontSize: Math.round(size * 0.36) }}
      >
        {shown}
      </span>
      <span className="sr-only">{score} out of 100</span>
    </span>
  );
}

/** 0 to `target` in about a second, easing out; at once when motion is reduced. */
function useCountUp(target: number, delayMs: number) {
  const [value, setValue] = useState(() => (prefersReducedMotion() ? target : 0));

  useEffect(() => {
    if (prefersReducedMotion()) {
      setValue(target);
      return;
    }
    let frame = 0;
    const start = performance.now() + delayMs;
    const tick = (now: number) => {
      const t = Math.min(Math.max((now - start) / 1000, 0), 1);
      setValue(Math.round(target * (1 - Math.pow(1 - t, 4))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, delayMs]);

  return value;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
