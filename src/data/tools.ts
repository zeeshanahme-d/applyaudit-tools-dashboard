import { Briefcase, FileDiff, FileText, GitCompareArrows, Layers, ScanSearch, Target, type LucideIcon } from "lucide-react";
import { LinkedinIcon } from "@/components/shared/linkedin-icon";

export interface Tool {
  name: string;
  to: string;
  description: string;
  icon: LucideIcon | typeof LinkedinIcon;
  /** False until its API exists: marked "Soon", and its page says it is not available yet. */
  available: boolean;
}

/**
 * Every tool, in sidebar order. Names and descriptions are the marketing
 * site's (marketing/src/components/marketing/tools.ts). Job Match and
 * Resume vs Job are one tool there (Resume + Job Match).
 */
export const TOOL_SECTIONS: readonly { label: string; tools: readonly Tool[] }[] = [
  {
    label: "Analyze",
    tools: [
      {
        name: "Resume Analyzer",
        to: "/resume-analyzer",
        description: "A section-by-section audit with explained scores, line-by-line feedback and a ranked action plan.",
        icon: FileText,
        available: true,
      },
      {
        name: "ATS Checker",
        to: "/ats-analyzer",
        description: "See how well applicant tracking systems can read your resume.",
        icon: ScanSearch,
        available: false,
      },
      {
        name: "LinkedIn Analyzer",
        to: "/linkedin-analyzer",
        description: "Improve your LinkedIn profile for recruiters and search visibility.",
        icon: LinkedinIcon,
        available: false,
      },
      {
        name: "Job Match",
        to: "/job-match",
        description: "See how closely your resume matches a job description and find keyword gaps.",
        icon: Target,
        available: false,
      },
    ],
  },
  {
    label: "Compare",
    tools: [
      {
        name: "Resume vs LinkedIn",
        to: "/compare/resume-linkedin",
        description: "Find inconsistent dates, titles and skills between your resume and LinkedIn.",
        icon: GitCompareArrows,
        available: false,
      },
      {
        name: "Resume vs Job",
        to: "/compare/resume-job",
        description: "See how closely your resume matches a job description and find keyword gaps.",
        icon: FileDiff,
        available: false,
      },
      {
        name: "LinkedIn vs Job",
        to: "/compare/linkedin-job",
        description: "Align your LinkedIn profile with a target role and its search terms.",
        icon: Briefcase,
        available: false,
      },
    ],
  },
  {
    label: "Audit",
    tools: [
      {
        name: "Career Audit",
        to: "/career-audit",
        description: "Resume, LinkedIn and a job description in one readiness review with prioritized fixes.",
        icon: Layers,
        available: false,
      },
    ],
  },
];
