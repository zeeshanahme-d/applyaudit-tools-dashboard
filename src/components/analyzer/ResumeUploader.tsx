import { FileUploader } from "./FileUploader";
import { UPLOAD_LIMITS } from "@/config/upload-limits";

export interface ResumeUploaderProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  className?: string;
}

export function ResumeUploader({ file, onFileSelect, className }: ResumeUploaderProps) {
  return (
    <FileUploader
      file={file}
      title="Drop your resume here"
      description={`PDF, DOCX or TXT. Up to ${UPLOAD_LIMITS.maxFileMb} MB and ${UPLOAD_LIMITS.maxPages} pages.`}
      accept=".pdf,.docx,.txt"
      onFileSelect={onFileSelect}
      className={className}
    />
  );
}
