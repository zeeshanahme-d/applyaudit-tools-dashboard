export type AnalyticsEvent =
  | "resume_analysis_started"
  | "resume_analysis_completed"
  | "resume_analysis_failed"
  | "ats_analysis_started"
  | "ats_analysis_completed"
  | "ats_analysis_failed"
  | "linkedin_analysis_started"
  | "linkedin_analysis_completed"
  | "linkedin_analysis_failed"
  | "resume_job_match_started"
  | "resume_job_match_completed"
  | "resume_job_match_failed"
  | "resume_linkedin_analysis_started"
  | "resume_linkedin_analysis_completed"
  | "resume_linkedin_analysis_failed"
  | "linkedin_job_match_started"
  | "linkedin_job_match_completed"
  | "linkedin_job_match_failed"
  | "career_audit_started"
  | "career_audit_completed"
  | "career_audit_failed";

/**
 * Safe client-side analytics dispatcher.
 * STRICT PRIVACY RULE: NEVER send document content, resume text, or PII to analytics.
 */
export function trackEvent(event: AnalyticsEvent,metadata?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") return;

  // Dispatch custom browser event for integrations or telemetry
  window.dispatchEvent(
    new CustomEvent("applyaudit:event", {
      detail: {
        event,
        timestamp: new Date().toISOString(),
        metadata,
      },
    })
  );

  if (import.meta.env.DEV) {
    console.debug(`[Analytics Event] ${event}`, metadata ?? {});
  }
}
