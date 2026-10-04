import { useAfterFirstPaint } from "@/hooks/use-after-first-paint";
import { cn } from "@/lib/utils";
import { getScoreState, type ScoreState } from "@/types/analysis";
import { SCORE_TONES } from "./semantic-tokens";

export interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showStatusBadge?: boolean;
  className?: string;
}

export function ScoreRing({
  score,
  size = 140,
  strokeWidth = 8,
  label,
  showStatusBadge = true,
  className,
}: ScoreRingProps) {
  const scoreState: ScoreState = getScoreState(score);
  const tone = SCORE_TONES[scoreState.colorToken];

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  // The ring draws from empty once the page has painted.
  const mounted = useAfterFirstPaint();

  return (
    <div className={cn("inline-flex flex-col items-center", className)}>
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
          <circle cx={size / 2} cy={size / 2} r={radius} className="stroke-muted" fill="none" strokeWidth={strokeWidth} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className={cn(tone.stroke, "transition-[stroke-dashoffset] duration-1000 ease-out-expo")}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={mounted ? offset : circumference}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span
            className="font-display font-semibold tabular-nums leading-none tracking-tight text-foreground"
            style={{ fontSize: Math.round(size * 0.27) }}
          >
            {score}
          </span>
          <span className="mt-1 text-[12px] font-medium text-muted-foreground">/ 100</span>
        </div>
      </div>

      {showStatusBadge && (
        <div className="mt-3 flex flex-col items-center gap-1">
          <span className={cn("inline-flex h-6 items-center rounded-full border px-2.5 text-xs font-medium", tone.badge)}>
            {scoreState.status}
          </span>
          {label && <span className="text-xs text-muted-foreground">{label}</span>}
        </div>
      )}
    </div>
  );
}
