import { ResumeUploader } from "@/components/analyzer/ResumeUploader";
import { AnalyzeButton } from "@/components/analyzer/AnalyzeButton";
import { buttonClass } from "@/components/ui/button";

interface UploadPanelProps {
  onFileSelect: (file: File | null) => void;
  onAnalyze: () => void;
  onTrySample: () => void;
}

/** Choose a resume and start the audit, or try the built-in sample. */
export function UploadPanel({ onFileSelect, onAnalyze, onTrySample }: UploadPanelProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-raised sm:p-6">
      <ResumeUploader onFileSelect={onFileSelect} />

      <div className="mt-5 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button type="button" onClick={onTrySample} className={buttonClass({ variant: "ghost", size: "sm" })}>
          Try with sample resume
        </button>

        <AnalyzeButton onClick={onAnalyze} label="Analyze Resume" loadingLabel="Auditing Resume..." />
      </div>
    </div>
  );
}
