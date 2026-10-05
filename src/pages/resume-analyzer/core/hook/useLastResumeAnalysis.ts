import { useMutationState } from "@tanstack/react-query";
import type { AnalysisResponse, AnalyzeResumePayload, ResumeAnalysisResult } from "../_models";
import { RESUME_ANALYSIS_KEY } from "./useAnalyzeResume";

export interface SessionAudit {
  result: ResumeAnalysisResult;
  /** "resume.pdf", or "Sample resume". */
  documentName: string;
}

/**
 * The newest resume analysis that succeeded in this tab, from the query
 * client's memory. Nothing is stored, so a reload clears it.
 */
export function useLastResumeAnalysis(): SessionAudit | null {
  const audits = useMutationState({
    filters: { mutationKey: RESUME_ANALYSIS_KEY, status: "success" },
    select: (mutation): SessionAudit => {
      const payload = mutation.state.variables as AnalyzeResumePayload;
      return {
        result: (mutation.state.data as AnalysisResponse).data,
        documentName: payload.useSample ? "Sample resume" : (payload.file?.name ?? "Your resume"),
      };
    },
  });
  return audits.at(-1) ?? null;
}
