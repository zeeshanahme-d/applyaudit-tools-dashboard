import { useEffect, useRef, useState } from "react";
import { DropOverlay } from "@/components/analyzer/DropOverlay";
import { useFileDrop } from "@/hooks/use-file-drop";
import { trackEvent } from "@/lib/analytics";
import { validateResumeFile } from "@/lib/validate-resume-file";
import { useAnalyzeResume } from "./core/hook/useAnalyzeResume";
import { takeHandedOffAudit } from "./core/_handoff";
import { ResumeAnalyzerHeader } from "./components/ResumeAnalyzerHeader";
import { AnalysisErrorBanner } from "./components/AnalysisErrorBanner";
import { UploadSheet } from "./components/UploadSheet";
import { EditorChecks } from "./components/EditorChecks";
import { AuditProgress } from "./components/AuditProgress";
import { AnalysisReport } from "./components/AnalysisReport";

export default function ResumeAnalyzer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const mutation = useAnalyzeResume();

  const startAnalysis = (useSample: boolean, file = selectedFile) => {
    // Checked before anything is sent: no request, no progress screen.
    if (!useSample) {
      const validation = validateResumeFile(file);
      if (!validation.valid) {
        setFileError(validation.error ?? "Please choose a resume file.");
        return;
      }
    }
    setFileError(null);
    trackEvent("resume_analysis_started", { hasFile: Boolean(file), useSample });
    mutation.mutate({ file, useSample });
  };

  const selectFile = (file: File | null) => {
    setSelectedFile(file);
    setFileError(null);
  };

  const handleReset = () => {
    mutation.reset();
    selectFile(null);
  };

  // A resume dropped on the overview arrives here and starts at once (once, even in Strict Mode).
  const tookHandoff = useRef(false);
  useEffect(() => {
    if (tookHandoff.current) return;
    tookHandoff.current = true;
    const audit = takeHandedOffAudit();
    if (!audit) return;
    if ("file" in audit) {
      selectFile(audit.file);
      startAnalysis(false, audit.file);
    } else {
      startAnalysis(true);
    }
  });

  // While choosing, a file dropped anywhere on the page is chosen.
  const choosing = !mutation.isPending && !mutation.isSuccess;
  const dragging = useFileDrop((file) => {
    const validation = validateResumeFile(file);
    if (!validation.valid) {
      setFileError(validation.error ?? "Please choose a resume file.");
      return;
    }
    selectFile(file);
  }, choosing);

  const errorMessage = fileError ?? (mutation.isError ? mutation.error?.message : null);
  const report = mutation.data;
  const documentName = mutation.variables?.useSample ? "the sample resume" : mutation.variables?.file?.name;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-10 lg:pt-12">
      <title>Free Resume Analyzer</title>

      <ResumeAnalyzerHeader withIntro={!mutation.isSuccess} />

      {errorMessage && <AnalysisErrorBanner message={errorMessage} />}

      {/* Hidden, not unmounted, while the request runs: after an error the sheet
          still shows exactly the file a retry sends. */}
      {!mutation.isSuccess && (
        <div hidden={mutation.isPending} className="mt-8 space-y-14">
          <UploadSheet
            file={selectedFile}
            onFileSelect={selectFile}
            onAnalyze={() => startAnalysis(false)}
            onTrySample={() => startAnalysis(true)}
          />
          <EditorChecks />
        </div>
      )}

      {mutation.isPending && <AuditProgress documentName={documentName} />}

      {mutation.isSuccess && report?.data && (
        <AnalysisReport key={mutation.submittedAt} result={report.data} meta={report.meta} onReset={handleReset} />
      )}

      {dragging && <DropOverlay label="Drop to choose this resume" />}
    </div>
  );
}
