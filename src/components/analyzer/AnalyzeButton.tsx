import { LoaderCircle, ArrowRight } from "lucide-react";
import { buttonClass } from "@/components/ui/button";

export interface AnalyzeButtonProps {
  onClick?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  label?: string;
  loadingLabel?: string;
  className?: string;
  size?: "default" | "lg";
}

export function AnalyzeButton({
  onClick,
  isLoading = false,
  disabled = false,
  label = "Analyze Now",
  loadingLabel = "Analyzing Profile...",
  className,
  size = "lg",
}: AnalyzeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      className={buttonClass({ size: size === "lg" ? "lg" : "md", className })}
    >
      {isLoading ? (
        <>
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          <span>{loadingLabel}</span>
        </>
      ) : (
        <>
          <span>{label}</span>
          <ArrowRight className="size-4" aria-hidden="true" />
        </>
      )}
    </button>
  );
}
