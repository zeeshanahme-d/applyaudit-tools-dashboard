/**
 * Client-side resume file validation — UX protection only.
 * Backend validation in src/modules/documents/validator.ts remains the security boundary.
 * Page count needs the file read, so only the server checks it (before any AI call).
 */
import { UPLOAD_LIMITS } from "@/config/upload-limits";

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

const ALLOWED_EXTENSIONS = new Set(["pdf", "docx", "txt"]);

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "text/plain",
  "application/octet-stream", // Some browsers send octet-stream
]);

const MAX_FILE_SIZE_BYTES = UPLOAD_LIMITS.maxFileMb * 1024 * 1024;

export function validateResumeFile(file: File | null | undefined): FileValidationResult {
  if (!file) {
    return { valid: false, error: "No file selected. Please upload a PDF, DOCX, or TXT file." };
  }

  if (file.size === 0) {
    return { valid: false, error: "The selected file is empty (0 bytes)." };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return {
      valid: false,
      error: `Unsupported file type '.${ext}'. Please upload a .pdf, .docx, or .txt file.`,
    };
  }

  if (file.type && file.type !== "" && !ALLOWED_MIME_TYPES.has(file.type)) {
    return {
      valid: false,
      error: `Unsupported file format. Expected PDF, DOCX, or TXT but received '${file.type}'.`,
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the ${UPLOAD_LIMITS.maxFileMb} MB limit.`,
    };
  }

  return { valid: true };
}

/**
 * The request body for one analysis. The sample resume is sent only when it
 * was asked for: "Analyze Resume" with no file is a validation error, never
 * a silent switch to the sample (which once ran, and was paid for, that way).
 */
export function resumeFormData(file: File | null | undefined, useSample: boolean): FormData {
  const form = new FormData();
  if (useSample) {
    form.append("useSample", "true");
    return form;
  }
  const validation = validateResumeFile(file);
  if (!validation.valid || !file) throw new Error(validation.error ?? "Please choose a resume file.");
  form.append("resume", file);
  return form;
}
