import { useAfterFirstPaint } from "@/hooks/use-after-first-paint";
import { cn } from "@/lib/utils";
import { getScoreState, type ScoreState } from "@/types/analysis";
import { SCORE_TONES } from "./semantic-tokens";

export interface ScoreItem {
  label: string;
  score: number;
  /** The counts behind the score. */
  detail?: string;
  /** How the score is calculated. */
  help?: string;
}

export interface ScoreBreakdownProps {
  title?: string;
  items: ScoreItem[];
  className?: string;
}

/** Each factor: its score, the counts behind it, how it is calculated. Frameless; the page places it. */
export function ScoreBreakdown({
  title = "Category Breakdown",
  items,
  className,
}: ScoreBreakdownProps) {
  const mounted = useAfterFirstPaint();

  return (
    <div className={cn("space-y-4", className)}>
      {title && <h3 className="text-[13px] font-semibold text-foreground">{title}</h3>}

      <div className="space-y-4">
        {items.map((item) => {
          const state: ScoreState = getScoreState(item.score);
          const tone = SCORE_TONES[state.colorToken];

          return (
            <div key={item.label}>
              <div className="flex items-center justify-between gap-3 text-[13px]">
                <span className="font-medium text-foreground">{item.label}</span>
                <span className="flex items-center gap-2.5">
                  <span className={cn("text-[12px] font-medium", tone.text)}>{state.status}</span>
                  <span className="w-8 text-right font-semibold tabular-nums text-foreground">{item.score}</span>
                </span>
              </div>

              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("h-full origin-left rounded-full transition-transform duration-1000 ease-out-expo", tone.bar)}
                  style={{ transform: `scaleX(${mounted ? item.score / 100 : 0})` }}
                />
              </div>
              {item.detail && <p className="mt-1.5 text-[12px] text-muted-foreground">{item.detail}</p>}
              {item.help && <p className="mt-0.5 text-[12px] leading-snug text-muted-foreground">{item.help}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
