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
export function ScoreBreakdown({ title, items, className }: ScoreBreakdownProps) {
  const mounted = useAfterFirstPaint();

  return (
    <div className={className}>
      {title && <h3 className="mb-4 text-[14px] font-semibold text-foreground">{title}</h3>}

      <div className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
        {items.map((item) => {
          const state: ScoreState = getScoreState(item.score);
          const tone = SCORE_TONES[state.colorToken];

          return (
            <div key={item.label}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[14px] font-semibold text-foreground">{item.label}</span>
                <span className="font-serif text-[24px] font-medium italic leading-none tabular-nums text-foreground">
                  {item.score}
                </span>
              </div>

              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-foreground/10" aria-hidden="true">
                <div
                  className={cn("h-full origin-left rounded-full transition-transform duration-1000 ease-out-expo", tone.bar)}
                  style={{ transform: `scaleX(${mounted ? item.score / 100 : 0})` }}
                />
              </div>
              <p className={cn("mt-2 text-[12.5px] font-medium", tone.text)}>{state.status}</p>
              {item.detail && <p className="mt-1 text-[13px] text-foreground/85">{item.detail}</p>}
              {item.help && <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">{item.help}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
