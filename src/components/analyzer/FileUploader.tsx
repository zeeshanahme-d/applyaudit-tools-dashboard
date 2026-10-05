import { useState, useCallback, useId, type DragEvent, type ReactNode } from "react";
import { FileUp, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { validateResumeFile } from "@/lib/validate-resume-file";
import { buttonClass } from "@/components/ui/button";

export interface FileUploaderProps {
  /** The chosen file: the page owns it, so what is shown is always what will be sent. */
  file: File | null;
  /** Called with a valid file, or null when it is removed. Invalid files never reach the page. */
  onFileSelect: (file: File | null) => void;
  title?: string;
  description?: string;
  /** The words on the visible "choose" control. */
  chooseLabel?: string;
  /** Draw the "choose" control as the page's main action (the highlighter), where choosing a file starts the work. */
  primary?: boolean;
  accept?: string;
  className?: string;
  icon?: ReactNode;
}

/**
 * A drop area on paper: drop a file on it, or choose one (the whole area is
 * the file input's label, so a click or the keyboard opens the picker).
 * Made for the paper surface; its colors come from the paper's tokens.
 */
export function FileUploader({
  file,
  onFileSelect,
  title = "Drop your document here",
  description = "PDF, DOCX or TXT",
  chooseLabel = "Choose a file",
  primary = false,
  accept = ".pdf,.docx,.txt",
  className,
  icon,
}: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const errorId = useId();

  const stop = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const validateAndSet = useCallback(
    (selected: File | undefined) => {
      if (!selected) return;
      // The same validator for browse and drop.
      const validation = validateResumeFile(selected);
      if (!validation.valid) {
        setError(validation.error || "Invalid file");
        return;
      }
      setError(null);
      onFileSelect(selected);
    },
    [onFileSelect]
  );

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setError(null);
    onFileSelect(null);
  };

  return (
    <div className={cn("w-full", className)}>
      <label
        onDragEnter={(e) => {
          stop(e);
          setIsDragOver(true);
        }}
        onDragLeave={(e) => {
          stop(e);
          setIsDragOver(false);
        }}
        onDragOver={stop}
        onDrop={(e) => {
          stop(e);
          setIsDragOver(false);
          validateAndSet(e.dataTransfer.files[0]);
        }}
        className={cn(
          "relative flex min-h-56 cursor-pointer select-none flex-col items-center justify-center rounded-[3px] border-2 border-dashed px-6 py-8 text-center transition-[border-color,background-color] duration-200",
          "focus-within:border-paper-ink",
          isDragOver ? "border-paper-ink bg-mark-warning/35" : "border-paper-line hover:border-paper-ink/40 hover:bg-paper-ink/2.5",
          error && !isDragOver && "border-pen-red/50"
        )}
      >
        {/* Visually hidden, not display:none, so the keyboard can reach it. */}
        <input
          type="file"
          accept={accept}
          className="sr-only"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(e) => {
            validateAndSet(e.target.files?.[0]);
            // Choosing the same file again still fires a change.
            e.target.value = "";
          }}
        />

        {file ? (
          <span className="flex w-full max-w-md items-center gap-3 rounded-[3px] border border-paper-line bg-paper px-3.5 py-3 text-left shadow-[0_1px_2px_rgb(0_0_0/0.06)]">
            <FileText className="size-5 shrink-0 text-paper-ink" aria-hidden="true" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[14px] font-semibold text-paper-ink">{file.name}</span>
              <span className="block text-[12.5px] tabular-nums text-paper-muted">
                {(file.size / 1024).toFixed(1)} KB, ready to audit
              </span>
            </span>
            <button
              type="button"
              onClick={handleRemove}
              className="flex size-8 pointer-coarse:size-11 shrink-0 items-center justify-center rounded-sm text-paper-muted transition-colors hover:bg-paper-ink/5 hover:text-paper-ink cursor-pointer"
              title="Remove file"
              aria-label="Remove file"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </span>
        ) : (
          <>
            <span className="mb-4 flex size-12 items-center justify-center rounded-full border border-paper-line text-paper-ink">
              {icon ?? <FileUp className="size-5" aria-hidden="true" />}
            </span>
            <span className="block font-serif text-[22px] font-medium leading-tight text-paper-ink">{title}</span>
            <span className="mt-1.5 block max-w-xs text-[13px] text-paper-muted">{description}</span>
            <span
              className={
                primary
                  ? buttonClass({ className: "mt-5" })
                  : "mt-5 inline-flex h-10 items-center rounded-sm border border-paper-ink/80 px-4 text-[13.5px] font-semibold text-paper-ink transition-colors hover:bg-paper-ink hover:text-paper"
              }
            >
              {chooseLabel}
            </span>
          </>
        )}

        {/* Announced when it appears, and tied to the file input. */}
        {error && (
          <span id={errorId} role="alert" className="mt-4 block text-[13px] font-medium text-pen-red">
            {error}
          </span>
        )}
      </label>
    </div>
  );
}
