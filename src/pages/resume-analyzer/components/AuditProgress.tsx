import { AnalysisProgress } from "@/components/analyzer/AnalysisProgress";

const steps = [
  "Validating and extracting document text in memory...",
  "Parsing sections & assigning stable source references...",
  "Running deterministic rules (action verbs, metrics, contact info)...",
  "Reviewing bullet impact with AI...",
  "Synthesizing section scores & priority action plan...",
];

/** While the API works: what happens, how long it has taken, and a note if it runs long. */
export function AuditProgress() {
  return (
    <div className="mt-10">
      <AnalysisProgress
        title="Auditing Your Resume"
        steps={steps}
        slowAfterMs={40_000}
        slowMessage="Still working. The AI review of a detailed resume can take over a minute. Please keep this page open."
      />
    </div>
  );
}
