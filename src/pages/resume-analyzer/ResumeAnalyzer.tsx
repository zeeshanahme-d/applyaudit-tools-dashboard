import { useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { validateResumeFile } from "@/lib/validate-resume-file";
import { useAnalyzeResume } from "./core/hook/useAnalyzeResume";
import { ResumeAnalyzerHeader } from "./components/ResumeAnalyzerHeader";
import { AnalysisErrorBanner } from "./components/AnalysisErrorBanner";
import { UploadPanel } from "./components/UploadPanel";
import { AnalysisFeatures } from "./components/AnalysisFeatures";
import { AuditProgress } from "./components/AuditProgress";
import { AnalysisReport } from "./components/AnalysisReport";

export default function ResumeAnalyzer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const mutation = useAnalyzeResume();

  const startAnalysis = (useSample = false) => {
    // Checked before anything is sent: no request, no progress screen.
    if (!useSample) {
      const validation = validateResumeFile(selectedFile);
      if (!validation.valid) {
        setFileError(validation.error ?? "Please choose a resume file.");
        return;
      }
    }
    setFileError(null);
    trackEvent("resume_analysis_started", { hasFile: Boolean(selectedFile), useSample });
    mutation.mutate({ file: selectedFile, useSample });
  };

  const selectFile = (file: File | null) => {
    setSelectedFile(file);
    setFileError(null);
  };

  const handleReset = () => {
    mutation.reset();
    selectFile(null);
  };

  const errorMessage = fileError ?? (mutation.isError ? mutation.error?.message : null);
  const report = mutation.data;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-10 lg:pt-10">
      <title>Free Resume Analyzer</title>

      <ResumeAnalyzerHeader />

      {errorMessage && <AnalysisErrorBanner message={errorMessage} />}

      {/* Hidden, not unmounted, while the request runs: the uploader keeps the
          chosen file, so after an error it still shows exactly what a retry sends. */}
      {!mutation.isSuccess && (
        <div hidden={mutation.isPending} className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <UploadPanel
            onFileSelect={selectFile}
            onAnalyze={() => startAnalysis(false)}
            onTrySample={() => startAnalysis(true)}
          />
          <AnalysisFeatures />
        </div>
      )}

      {mutation.isPending && <AuditProgress />}

      {mutation.isSuccess && report?.data && (
        <AnalysisReport result={report.data} meta={report.meta} onReset={handleReset} />
      )}
    </div>
  );
}
