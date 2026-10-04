import { FileText } from "lucide-react";
import { FileUploader } from "./FileUploader";
import { UPLOAD_LIMITS } from "@/config/upload-limits";

export interface ResumeUploaderProps {
  onFileSelect?: (file: File | null) => void;
  className?: string;
}

export function ResumeUploader({ onFileSelect, className }: ResumeUploaderProps) {
  return (
    <FileUploader
      title="Upload Your Resume"
      description={`PDF, DOCX, or TXT. Up to ${UPLOAD_LIMITS.maxFileMb} MB and ${UPLOAD_LIMITS.maxPages} pages.`}
      accept=".pdf,.docx,.txt"
      icon={<FileText className="h-5 w-5" />}
      onFileSelect={onFileSelect}
      className={className}
    />
  );
}
