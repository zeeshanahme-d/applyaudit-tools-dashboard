import {
  Award,
  Briefcase,
  Calendar,
  CheckCircle,
  CheckCircle2,
  Contact,
  FileText,
  GitCompareArrows,
  Heading,
  Layers,
  Layout,
  ScanSearch,
  Search,
  Sparkles,
  Target,
  Type,
  User,
} from "lucide-react";
import { UpcomingAnalyzerPage } from "@/components/UpcomingAnalyzerPage";

/**
 * Tools whose API does not exist yet: the pages the Next.js app served for
 * them before the migration (its old URLs now redirect here), same copy, no
 * upload, no scores.
 * When a tool's API is built, replace its page here with the real one.
 */

/** Was the marketing site's /ats-checker. */
export function AtsChecker() {
  return (
    <UpcomingAnalyzerPage
      title="ATS Resume Checker"
      description="See how applicant tracking systems parse your resume. Identify unreadable layouts, missing section headers, and formatting red flags before applying."
      featuresHeading="What Our ATS Engine Will Check"
      features={[
        {
          icon: <Layout className="h-4 w-4" />,
          title: "Section Parsing",
          description: "Verifies Experience, Education, and Skills standard ATS headings",
        },
        {
          icon: <Type className="h-4 w-4" />,
          title: "Table & Column Check",
          description: "Detects multi-column traps and text layers that choke parsers",
        },
        {
          icon: <Contact className="h-4 w-4" />,
          title: "Contact Info Validation",
          description: "Ensures phone, email, location, and LinkedIn URLs are parsed",
        },
        {
          icon: <Calendar className="h-4 w-4" />,
          title: "Date Consistency",
          description: "Verifies dates are readable for automated chronological sorting",
        },
      ]}
    />
  );
}

/** Was the marketing site's /linkedin-analyzer. */
export function LinkedInAnalyzer() {
  return (
    <UpcomingAnalyzerPage
      title={"LinkedIn Profile Analyzer"}
      description={"Optimize your LinkedIn headline, About section, and skill tags for recruiter search algorithms. Upload your official profile PDF without connecting an account."}
      featuresHeading={"What The LinkedIn Analyzer Will Check"}
      features={[
        {
          icon: <Heading className="h-4 w-4" />,
          title: "Headline Keyword Audit",
          description: "Evaluates search terms that recruiters enter into LinkedIn Recruiter",
        },
        {
          icon: <User className="h-4 w-4" />,
          title: "About Section Hook",
          description: "Analyzes professional value proposition and recruiter engagement call to action",
        },
        {
          icon: <Briefcase className="h-4 w-4" />,
          title: "Experience Depth",
          description: "Scores achievement density and domain authority across past positions",
        },
        {
          icon: <Award className="h-4 w-4" />,
          title: "Skills & Endorsements",
          description: "Pinpoints high-demand industry skills missing from your profile highlights",
        },
      ]}
    />
  );
}

/** Was the marketing site's /resume-job-match (and /job-match). */
export function ResumeJobMatch() {
  return (
    <UpcomingAnalyzerPage
      title={"Resume + Job Match Analyzer"}
      description={"Compare your resume directly against any job description. Uncover high-priority keyword gaps, match percentages, and role-specific adjustments."}
      featuresHeading={"What The Job Match Engine Will Check"}
      features={[
        {
          icon: <Target className="h-4 w-4" />,
          title: "Skills Matching",
          description: "Compares hard & soft technical proficiencies against job requirements",
        },
        {
          icon: <Search className="h-4 w-4" />,
          title: "Keyword Gap Analysis",
          description: "Ranks missing keywords into Must-Have and Preferred buckets",
        },
        {
          icon: <Layers className="h-4 w-4" />,
          title: "Seniority Alignment",
          description: "Evaluates whether your bullet achievements reflect required level",
        },
        {
          icon: <CheckCircle className="h-4 w-4" />,
          title: "Section Tailoring",
          description: "Generates tailored recommendations for experience and summary sections",
        },
      ]}
    />
  );
}

/** Was the marketing site's /resume-linkedin-analysis. */
export function ResumeLinkedInAnalysis() {
  return (
    <UpcomingAnalyzerPage
      title={"Resume vs LinkedIn Profile Consistency"}
      description={"Recruiters cross-reference your resume with your LinkedIn profile. Discover conflicting employment dates, mismatched job titles, and desynchronized skills."}
      featuresHeading={"What The Consistency Check Will Compare"}
      features={[
        {
          icon: <Calendar className="h-4 w-4" />,
          title: "Date Conflict Detection",
          description: "Flags discrepancies in start/end employment dates between profiles",
        },
        {
          icon: <Briefcase className="h-4 w-4" />,
          title: "Job Title Alignment",
          description: "Detects seniority discrepancies that cause background check friction",
        },
        {
          icon: <CheckCircle2 className="h-4 w-4" />,
          title: "Skill Sync Check",
          description: "Finds high-value skills present in one profile but missing in the other",
        },
        {
          icon: <Sparkles className="h-4 w-4" />,
          title: "Project & Education Sync",
          description: "Verifies portfolio links, featured projects, and graduation dates match",
        },
      ]}
    />
  );
}

/** Was the marketing site's /linkedin-job-match. */
export function LinkedInJobMatch() {
  return (
    <UpcomingAnalyzerPage
      title={"LinkedIn + Job Match Analyzer"}
      description={"Optimize your LinkedIn profile for a specific dream role. Discover which search keywords recruiters will use to find applicants for this exact vacancy."}
      featuresHeading={"What This Analyzer Will Check"}
      features={[
        {
          icon: <Heading className="h-4 w-4" />,
          title: "Headline Target Match",
          description: "Scores how directly your current headline targets this specific job",
        },
        {
          icon: <User className="h-4 w-4" />,
          title: "About Section Alignment",
          description: "Checks if your narrative emphasizes skills the employer is seeking",
        },
        {
          icon: <Search className="h-4 w-4" />,
          title: "Recruiter Keyword Lift",
          description: "Identifies search terms recruiters use when hunting candidates for this role",
        },
        {
          icon: <Sparkles className="h-4 w-4" />,
          title: "Tailored Profile Tweaks",
          description: "Step-by-step instructions to optimize your profile specifically for this position",
        },
      ]}
    />
  );
}

/** Was the marketing site's /career-audit. */
export function CareerAudit() {
  return (
    <UpcomingAnalyzerPage
      title={"Complete Career Audit"}
      description={"The analyzer that combines your Resume, LinkedIn Profile, and Target Job Description into a unified Candidate Readiness Score with prioritized fixes."}
      featuresHeading={"What The Full Audit Will Cover"}
      features={[
        {
          icon: <FileText className="h-4 w-4" />,
          title: "Resume Quality",
          description: "Impact detection, bullet scoring, and professional summary audit",
        },
        {
          icon: <ScanSearch className="h-4 w-4" />,
          title: "ATS Verification",
          description: "Formatting checks, table/column warnings, and parser extraction",
        },
        {
          icon: <Target className="h-4 w-4" />,
          title: "Target Job Alignment",
          description: "Keyword gap, required vs preferred skills, and seniority fit",
        },
        {
          icon: <GitCompareArrows className="h-4 w-4" />,
          title: "Cross-Profile Consistency",
          description: "Identifies conflicting employment dates and title mismatches",
        },
      ]}
    />
  );
}
