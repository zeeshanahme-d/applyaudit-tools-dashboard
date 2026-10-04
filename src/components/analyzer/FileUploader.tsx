import { useState, useCallback, useId, type DragEvent } from "react";
import { Upload, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { validateResumeFile } from "@/lib/validate-resume-file";

export interface FileUploaderProps {
  title?: string;
  description?: string;
  accept?: string;
  onFileSelect?: (file: File | null) => void;
  className?: string;
  icon?: React.ReactNode;
}

export function FileUploader({
  title = "Upload Document",
  description = "PDF, DOCX, or TXT",
  accept = ".pdf,.docx,.txt",
  onFileSelect,
  className,
  icon,
}: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const errorId = useId();

  const handleDrag = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragOut = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const validateAndSet = useCallback(
    (selected: File | undefined) => {
      if (!selected) return;
      setError(null);

      // Use centralized validator for both browse and drag-and-drop
      const validation = validateResumeFile(selected);
      if (!validation.valid) {
        setError(validation.error || "Invalid file");
        return;
      }

      setFile(selected);
      onFileSelect?.(selected);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      const dropped = e.dataTransfer.files[0];
      validateAndSet(dropped);
    },
    [validateAndSet]
  );

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setError(null);
    onFileSelect?.(null);
  };

  return (
    <div className={cn("w-full", className)}>
      <label
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "relative flex min-h-48 cursor-pointer select-none flex-col items-center justify-center rounded-xl border border-dashed p-6 transition-[border-color,background-color] duration-200 sm:p-8",
          "focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/40",
          isDragOver
            ? "border-primary bg-accent"
            : "border-input bg-surface/50 hover:border-primary/60 hover:bg-surface",
          file && "border-success-line bg-success-soft",
          error && "border-danger-line bg-danger-soft"
        )}
      >
        {/* Visually hidden, not display:none, so the keyboard can reach it. */}
        <input
          type="file"
          accept={accept}
          className="sr-only"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(e) => validateAndSet(e.target.files?.[0])}
        />

        {file ? (
          <div className="flex w-full max-w-sm items-center justify-between rounded-lg border border-border bg-card px-3 py-2.5 shadow-raised">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-success-soft text-success">
                <Check className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-foreground">{file.name}</p>
                <p className="text-[12px] tabular-nums text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB • Ready to analyze
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="flex size-8 pointer-coarse:size-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
              title="Remove file"
              aria-label="Remove file"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl border border-border bg-card text-primary shadow-raised">
              {icon ?? <Upload className="size-5" aria-hidden="true" />}
            </div>
            <p className="mb-1 text-[14px] font-semibold text-foreground">{title}</p>
            <p className="mx-auto mb-4 max-w-xs text-[12.5px] text-muted-foreground">{description}</p>
            <span className="inline-flex h-8 items-center rounded-md border border-border bg-card px-3 text-[12.5px] font-medium text-foreground shadow-raised">
              Browse from computer
            </span>
          </div>
        )}

        {/* Announced when it appears, and tied to the file input. */}
        {error && (
          <p id={errorId} role="alert" className="mt-3 text-[12.5px] font-medium text-danger">
            {error}
          </p>
        )}
      </label>
    </div>
  );
}
