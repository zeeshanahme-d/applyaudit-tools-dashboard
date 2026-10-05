import { Check } from "lucide-react";

/** How to read the page's marks: each one shown as it appears, on a scrap of paper. */
export function MarkLegend() {
  return (
    <ul aria-label="How to read the marks" className="flex flex-wrap gap-x-5 gap-y-2.5 text-[13px] text-muted-foreground">
      <li className="flex items-center gap-2">
        <span className="rounded-xs bg-paper px-1.5 py-0.5 font-serif text-[14px] text-paper-ink">
          <span className="marker [--mark:var(--mark-issue)]">Problem</span>
        </span>
        lowers your score
      </li>
      <li className="flex items-center gap-2">
        <span className="rounded-xs bg-paper px-1.5 py-0.5 font-serif text-[14px] text-paper-ink">
          <span className="marker">Weakness</span>
        </span>
        worth fixing
      </li>
      <li className="flex items-center gap-2">
        <span className="rounded-xs bg-paper px-1.5 py-0.5 font-serif text-[14px] text-paper-ink">
          <span className="pencil-underline">Optional</span>
        </span>
        a suggestion only
      </li>
      <li className="flex items-center gap-2">
        <span className="flex items-center gap-1 rounded-xs bg-paper px-1.5 py-0.5 font-serif text-[14px] text-paper-ink">
          <Check className="size-3.5 text-pen-green" strokeWidth={3} aria-hidden="true" />
          Strong
        </span>
        keep as it is
      </li>
    </ul>
  );
}
