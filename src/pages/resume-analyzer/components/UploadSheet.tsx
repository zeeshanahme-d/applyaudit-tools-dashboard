import { ResumeUploader } from "@/components/analyzer/ResumeUploader";
import { AnalyzeButton } from "@/components/analyzer/AnalyzeButton";
import { buttonClass } from "@/components/ui/button";

interface UploadSheetProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  onAnalyze: () => void;
  onTrySample: () => void;
}

/**
 * A blank sheet on the desk, waiting for a resume. The audit button appears
 * once there is a file to audit, so it never runs on nothing.
 */
export function UploadSheet({ file, onFileSelect, onAnalyze, onTrySample }: UploadSheetProps) {
  return (
    <section aria-label="Choose your resume" className="paper px-5 py-6 sm:px-10 sm:py-10">
      <ResumeUploader file={file} onFileSelect={onFileSelect} />

      <div className="mt-6 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button type="button" onClick={onTrySample} className={buttonClass({ variant: "secondary", size: "sm" })}>
          Try the sample resume
        </button>
        {file ? (
          <AnalyzeButton onClick={onAnalyze} label="Audit my resume" />
        ) : (
          <p className="text-center text-[13px] text-paper-muted sm:text-right">You can also drop the file anywhere on this page.</p>
        )}
      </div>
    </section>
  );
}
