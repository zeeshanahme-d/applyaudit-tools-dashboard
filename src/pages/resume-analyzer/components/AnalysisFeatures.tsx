import { CircleCheck, PenLine, ScanSearch, Target } from "lucide-react";

const features = [
  { icon: Target, title: "Overall & Impact Scoring", description: "Evaluates action verbs, quantifiable achievements, and clear career progression" },
  { icon: ScanSearch, title: "Readability & Structure", description: "Checks length, bullet size and structure, so your resume is easy to skim" },
  { icon: PenLine, title: "Bullet Quality & Rewrites", description: "Line-by-line review identifying weak bullets with actionable rewrites" },
  { icon: CircleCheck, title: "Summary & Section Check", description: "Audits professional summary, work history, and technical proficiencies" },
];

/** What the audit looks at, beside the upload. */
export function AnalysisFeatures() {
  return (
    <aside aria-labelledby="analyze-title" className="rounded-xl border border-border bg-card p-5 shadow-raised">
      <h2 id="analyze-title" className="text-[13px] font-semibold text-foreground">
        What We Analyze In Your Resume
      </h2>
      <ul className="mt-4 space-y-4">
        {features.map((f) => (
          <li key={f.title} className="flex gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <f.icon className="size-4" aria-hidden="true" />
            </span>
            <span className="text-[12.5px] leading-snug">
              <span className="block font-semibold text-foreground">{f.title}</span>
              <span className="mt-0.5 block text-muted-foreground">{f.description}</span>
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
