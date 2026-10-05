import { AnalysisProgress } from "@/components/analyzer/AnalysisProgress";

const steps = [
  "Reading the text in memory",
  "Finding your sections and every bullet",
  "Checking the rules: action verbs, numbers, contact details",
  "Reviewing each bullet's impact with AI",
  "Scoring the sections and ranking the fixes",
];

/** While the API works: the page under the scanner, how long it has taken, and a note if it runs long. */
export function AuditProgress({ documentName }: { documentName?: string }) {
  return (
    <div className="mt-10">
      <AnalysisProgress
        title="Reading your resume"
        documentName={documentName}
        steps={steps}
        slowAfterMs={40_000}
        slowMessage="Still working. The AI review of a detailed resume can take over a minute. Please keep this page open."
      />
    </div>
  );
}
