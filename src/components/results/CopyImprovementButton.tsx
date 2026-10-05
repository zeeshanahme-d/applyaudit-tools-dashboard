import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CopyImprovementButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
}

/** Copies a rewrite. Reads on the desk and on paper alike (it uses the surface's tokens). */
export function CopyImprovementButton({
  text,
  label = "Copy rewrite",
  copiedLabel = "Copied",
  className,
}: CopyImprovementButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard write failed
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "inline-flex h-8 pointer-coarse:h-11 select-none items-center justify-center gap-1.5 rounded-sm border px-3 text-[12.5px] font-medium transition-colors duration-150 cursor-pointer active:translate-y-px",
        copied
          ? "border-success-line bg-success-soft text-success"
          : "border-input text-foreground hover:border-foreground/40 hover:bg-foreground/5",
        className
      )}
    >
      {copied ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  );
}
