import { useMutation } from "@tanstack/react-query";
import { trackEvent } from "@/lib/analytics";
import { analyzeResume } from "../_requests";

export function useAnalyzeResume() {
  return useMutation({
    mutationFn: analyzeResume,
    onSuccess: (data) => {
      trackEvent("resume_analysis_completed", {
        score: data.data.overall.score,
        mode: data.meta?.analysisMode,
      });
    },
    onError: (err: Error) => {
      trackEvent("resume_analysis_failed", { error: err.message });
    },
  });
}
