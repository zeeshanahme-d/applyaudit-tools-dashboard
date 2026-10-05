import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { getSemanticState } from "@/components/results/semantic-tokens";
import type { ResumeAnalysisResult } from "../core/_models";
import type { PageMode } from "./MarkedLine";
import { MissingSection, PaperSection } from "./PaperSection";

/** Places on the page to point at, by data-source: a line id, a section id, or "missing:<name>". */
export interface PageFocus {
  ids: string[];
  /** A new key replays the pointer, even for the same places. */
  key: number;
}

interface MarkedUpResumeProps {
  result: ResumeAnalysisResult;
  mode: PageMode;
  focus: PageFocus | null;
  className?: string;
}

/** Read as notes on the whole page, not as a section of it. */
const PAGE_NOTE_IDS = new Set(["readability"]);

/**
 * The resume, as the editor marked it: header, sections in order, missing
 * sections drawn in where they belong, and the notes on the page as a whole
 * at the foot. The highlighter marks it top to bottom once the sheet is down.
 */
export function MarkedUpResume({ result, mode, focus, className }: MarkedUpResumeProps) {
  const pageRef = useRef<HTMLElement>(null);
  const sections = result.sections.filter((section) => !PAGE_NOTE_IDS.has(section.id));
  const pageNotes = result.sections.filter((section) => PAGE_NOTE_IDS.has(section.id));

  const lineDelays = new Map<string, number>();
  for (const section of sections) {
    for (const line of section.lineReviews ?? []) {
      if (getSemanticState(line.status) !== "strong") lineDelays.set(line.id, 550 + lineDelays.size * 110);
    }
  }

  // A fix chosen in the plan: point at its places on the page and bring the first into view.
  useEffect(() => {
    const page = pageRef.current;
    if (!focus || !page) return;
    const targets = focus.ids.flatMap((id) => [...page.querySelectorAll<HTMLElement>(`[data-source="${CSS.escape(id)}"]`)]);
    for (const target of targets) {
      target.classList.remove("attention");
      void target.offsetWidth; // restart the animation
      target.classList.add("attention");
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    targets[0]?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  }, [focus]);

  return (
    <article
      ref={pageRef}
      aria-label="Your resume, marked up"
      className={cn(
        "paper @container px-5 py-8 sm:px-10 sm:py-12",
        "animate-in fade-in-0 slide-in-from-bottom-4 duration-500 ease-out",
        className
      )}
    >
      {sections.map((section) => (
        <PaperSection key={section.id} section={section} mode={mode} lineDelays={lineDelays} />
      ))}
      {(result.stats?.missingSections ?? []).map((name) => (
        <MissingSection key={name} name={name} />
      ))}
      {pageNotes.length > 0 && (
        <div className="mt-10 border-t border-dashed border-paper-line">
          {pageNotes.map((section) => (
            <PaperSection key={section.id} section={section} mode={mode} lineDelays={lineDelays} />
          ))}
        </div>
      )}
    </article>
  );
}
