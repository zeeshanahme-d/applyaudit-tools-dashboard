import { UpcomingAnalyzerPage } from "@/components/UpcomingAnalyzerPage";
import { TOOLS } from "@/data/tools";

/**
 * Tools whose API does not exist yet: the pages the Next.js app served for
 * them before the migration (its old URLs now redirect here), same copy, no
 * upload, no scores. What each checks lives with the tool (data/tools.ts).
 * When a tool's API is built, replace its page here with the real one.
 */

/** Was the marketing site's /ats-checker. */
export function AtsChecker() {
  return (
    <UpcomingAnalyzerPage
      title="ATS Resume Checker"
      description="See how applicant tracking systems parse your resume. Identify unreadable layouts, missing section headers, and formatting red flags before applying."
      featuresHeading="What Our ATS Engine Will Check"
      features={TOOLS.ats.checks}
    />
  );
}

/** Was the marketing site's /linkedin-analyzer. */
export function LinkedInAnalyzer() {
  return (
    <UpcomingAnalyzerPage
      title="LinkedIn Profile Analyzer"
      description="Optimize your LinkedIn headline, About section, and skill tags for recruiter search algorithms. Upload your official profile PDF without connecting an account."
      featuresHeading="What The LinkedIn Analyzer Will Check"
      features={TOOLS.linkedin.checks}
    />
  );
}

/** Was the marketing site's /resume-job-match (and /job-match). */
export function ResumeJobMatch() {
  return (
    <UpcomingAnalyzerPage
      title="Resume + Job Match Analyzer"
      description="Compare your resume directly against any job description. Uncover high-priority keyword gaps, match percentages, and role-specific adjustments."
      featuresHeading="What The Job Match Engine Will Check"
      features={TOOLS.resumeJob.checks}
    />
  );
}

/** Was the marketing site's /resume-linkedin-analysis. */
export function ResumeLinkedInAnalysis() {
  return (
    <UpcomingAnalyzerPage
      title="Resume vs LinkedIn Profile Consistency"
      description="Recruiters cross-reference your resume with your LinkedIn profile. Discover conflicting employment dates, mismatched job titles, and desynchronized skills."
      featuresHeading="What The Consistency Check Will Compare"
      features={TOOLS.resumeLinkedin.checks}
    />
  );
}

/** Was the marketing site's /linkedin-job-match. */
export function LinkedInJobMatch() {
  return (
    <UpcomingAnalyzerPage
      title="LinkedIn + Job Match Analyzer"
      description="Optimize your LinkedIn profile for a specific dream role. Discover which search keywords recruiters will use to find applicants for this exact vacancy."
      featuresHeading="What This Analyzer Will Check"
      features={TOOLS.linkedinJob.checks}
    />
  );
}

/** Was the marketing site's /career-audit. */
export function CareerAudit() {
  return (
    <UpcomingAnalyzerPage
      title="Complete Career Audit"
      description="The analyzer that combines your Resume, LinkedIn Profile, and Target Job Description into a unified Candidate Readiness Score with prioritized fixes."
      featuresHeading="What The Full Audit Will Cover"
      features={TOOLS.careerAudit.checks}
    />
  );
}
