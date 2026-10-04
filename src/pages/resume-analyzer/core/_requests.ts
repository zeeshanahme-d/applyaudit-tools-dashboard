import { appConfig } from "@/config/app";
import { resumeFormData } from "@/lib/validate-resume-file";
import type { AnalysisResponse, AnalyzeResumePayload } from "./_models";

/** POST /api/analyze/resume: the uploaded file, or the built-in sample, analyzed by the API. */
export async function analyzeResume(payload: AnalyzeResumePayload): Promise<AnalysisResponse> {
  const formData = resumeFormData(payload.file, payload.useSample);

  const res = await fetch(`${appConfig.apiUrl}/api/analyze/resume`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  const json: AnalysisResponse | null = await res.json().catch(() => null);

  if (!res.ok || !json?.success) {
    throw new Error(
      json?.error?.message || "Failed to analyze resume. Please try again in a moment."
    );
  }

  return json;
}
