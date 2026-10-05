import { FileUploader } from "@/components/analyzer/FileUploader";
import { buttonClass } from "@/components/ui/button";
import { UPLOAD_LIMITS } from "@/config/upload-limits";

interface StartSheetProps {
  onFile: (file: File) => void;
  onTrySample: () => void;
}

/** A blank sheet: drop or choose a resume and the audit starts on the analyzer. */
export function StartSheet({ onFile, onTrySample }: StartSheetProps) {
  return (
    <section aria-label="Start an audit" className="paper px-5 py-6 sm:px-8 sm:py-8">
      <FileUploader
        file={null}
        onFileSelect={(file) => file && onFile(file)}
        title="Drop your resume here"
        description={`PDF, DOCX or TXT. Up to ${UPLOAD_LIMITS.maxFileMb} MB and ${UPLOAD_LIMITS.maxPages} pages.`}
        chooseLabel="Choose a file"
      />
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <button type="button" onClick={onTrySample} className={buttonClass({ variant: "secondary", size: "sm" })}>
          Try the sample resume
        </button>
        <p className="text-[12.5px] text-paper-muted">Read in memory, never stored</p>
      </div>
    </section>
  );
}
