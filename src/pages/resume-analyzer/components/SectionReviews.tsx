import { SectionAnalysisCard } from "@/components/results/SectionAnalysisCard";
import type { SectionReview } from "@/types/analysis";

/** Every section of the resume, with its line-by-line review. */
export function SectionReviews({ sections }: { sections: SectionReview[] }) {
  return (
    <section aria-labelledby="sections-title" className="space-y-4">
      <div>
        <h3 id="sections-title" className="font-display text-lg font-semibold tracking-tight text-foreground">
          Section-by-Section Analysis
        </h3>
        <p className="mt-0.5 text-[12.5px] text-muted-foreground">
          Lowest-scoring sections are expanded. Click any section header to inspect line reviews.
        </p>
      </div>

      <div className="space-y-3">
        {sections.map((sec) => (
          <SectionAnalysisCard key={sec.id} section={sec} />
        ))}
      </div>
    </section>
  );
}
