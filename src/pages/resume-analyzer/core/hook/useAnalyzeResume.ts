import { useMutation } from "@tanstack/react-query";
import { trackEvent } from "@/lib/analytics";
import { analyzeResume } from "../_requests";

/** Every resume analysis, so the overview can read the latest one (useLastResumeAnalysis). */
export const RESUME_ANALYSIS_KEY = ["resume-analysis"] as const;

export function useAnalyzeResume() {
  return useMutation({
    mutationKey: RESUME_ANALYSIS_KEY,
    mutationFn: analyzeResume,
    // Kept in memory until the tab reloads, never stored: the overview still has it after the analyzer unmounts.
    // ponytail: every analysis of the session stays in memory; drop older ones if sessions run to dozens.
    gcTime: Infinity,
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
