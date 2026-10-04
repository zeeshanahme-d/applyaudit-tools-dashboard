import { CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function StrengthList({
  strengths,
  className,
}: {
  strengths: string[];
  className?: string;
}) {
  if (!strengths || strengths.length === 0) return null;

  return (
    <div className={cn("space-y-2.5", className)}>
      <p className="text-[12.5px] font-semibold text-foreground">What You Did Well</p>
      <ul className="space-y-2 text-[13px]">
        {strengths.map((s, idx) => (
          <li key={idx} className="flex items-start gap-2.5 text-foreground/90">
            <CircleCheck className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
            <span className="leading-relaxed">{s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
