import {
  Award,
  Briefcase,
  Calendar,
  CheckCircle,
  CheckCircle2,
  CircleCheck,
  Contact,
  FileText,
  GitCompareArrows,
  Heading,
  Layers,
  Layout,
  PenLine,
  ScanSearch,
  Search,
  Sparkles,
  Target,
  Type,
  User,
  type LucideIcon,
} from "lucide-react";

/** The documents an analysis reads: the three sheets on the overview's career surface. */
export type Artifact = "resume" | "linkedin" | "job";

/** One thing a tool inspects: shown on its page and in the overview's preview. */
export interface ToolCheck {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface Tool {
  /** A pair ("Resume ↔ Job") is two documents read side by side; ToolName draws the arrow. */
  name: string;
  to: string;
  /** One line: what it finds. */
  description: string;
  reads: readonly Artifact[];
  checks: readonly ToolCheck[];
  /** False until its API exists: marked "Soon", and its page says it is not available yet. */
  available: boolean;
}

const RESUME_JOB_CHECKS: readonly ToolCheck[] = [
  { icon: Target, title: "Skills Matching", description: "Compares hard & soft technical proficiencies against job requirements" },
  { icon: Search, title: "Keyword Gap Analysis", description: "Ranks missing keywords into Must-Have and Preferred buckets" },
  { icon: Layers, title: "Seniority Alignment", description: "Evaluates whether your bullet achievements reflect required level" },
  { icon: CheckCircle, title: "Section Tailoring", description: "Generates tailored recommendations for experience and summary sections" },
];

/**
 * Every tool once. The marketing site lists the same tools
 * (marketing/src/components/marketing/tools.ts); Job Match and Resume ↔ Job
 * are one tool there (Resume + Job Match), reached here by two routes.
 */
export const TOOLS = {
  resume: {
    name: "Resume Analyzer",
    to: "/resume-analyzer",
    description: "Find weak bullets, evidence gaps and priority improvements.",
    reads: ["resume"],
    checks: [
      { icon: Target, title: "Impact", description: "Action verbs, numbers for scope and results, and clear progression." },
      { icon: PenLine, title: "Every bullet", description: "Line by line: what is weak, why, and a rewrite you can copy." },
      { icon: CircleCheck, title: "Summary and sections", description: "Your summary, work history, skills, and the sections recruiters expect." },
      { icon: ScanSearch, title: "Readability", description: "Length, bullet size and structure, so a recruiter can skim it." },
    ],
    available: true,
  },
  ats: {
    name: "ATS Checker",
    to: "/ats-analyzer",
    description: "Check that applicant tracking systems can read every section.",
    reads: ["resume"],
    checks: [
      { icon: Layout, title: "Section Parsing", description: "Verifies Experience, Education, and Skills standard ATS headings" },
      { icon: Type, title: "Table & Column Check", description: "Detects multi-column traps and text layers that choke parsers" },
      { icon: Contact, title: "Contact Info Validation", description: "Ensures phone, email, location, and LinkedIn URLs are parsed" },
      { icon: Calendar, title: "Date Consistency", description: "Verifies dates are readable for automated chronological sorting" },
    ],
    available: false,
  },
  linkedin: {
    name: "LinkedIn Analyzer",
    to: "/linkedin-analyzer",
    description: "Review your headline, About and skills the way recruiters search.",
    reads: ["linkedin"],
    checks: [
      { icon: Heading, title: "Headline Keyword Audit", description: "Evaluates search terms that recruiters enter into LinkedIn Recruiter" },
      { icon: User, title: "About Section Hook", description: "Analyzes professional value proposition and recruiter engagement call to action" },
      { icon: Briefcase, title: "Experience Depth", description: "Scores achievement density and domain authority across past positions" },
      { icon: Award, title: "Skills & Endorsements", description: "Pinpoints high-demand industry skills missing from your profile highlights" },
    ],
    available: false,
  },
  jobMatch: {
    name: "Job Match",
    to: "/job-match",
    description: "Measure how closely your resume targets a job.",
    reads: ["resume", "job"],
    checks: RESUME_JOB_CHECKS,
    available: false,
  },
  resumeLinkedin: {
    name: "Resume ↔ LinkedIn",
    to: "/compare/resume-linkedin",
    description: "Catch dates, titles and skills that disagree between the two.",
    reads: ["resume", "linkedin"],
    checks: [
      { icon: Calendar, title: "Date Conflict Detection", description: "Flags discrepancies in start/end employment dates between profiles" },
      { icon: Briefcase, title: "Job Title Alignment", description: "Detects seniority discrepancies that cause background check friction" },
      { icon: CheckCircle2, title: "Skill Sync Check", description: "Finds high-value skills present in one profile but missing in the other" },
      { icon: Sparkles, title: "Project & Education Sync", description: "Verifies portfolio links, featured projects, and graduation dates match" },
    ],
    available: false,
  },
  resumeJob: {
    name: "Resume ↔ Job",
    to: "/compare/resume-job",
    description: "Measure how closely your resume targets this role.",
    reads: ["resume", "job"],
    checks: RESUME_JOB_CHECKS,
    available: false,
  },
  linkedinJob: {
    name: "LinkedIn ↔ Job",
    to: "/compare/linkedin-job",
    description: "See whether recruiters hiring for this role would find your profile.",
    reads: ["linkedin", "job"],
    checks: [
      { icon: Heading, title: "Headline Target Match", description: "Scores how directly your current headline targets this specific job" },
      { icon: User, title: "About Section Alignment", description: "Checks if your narrative emphasizes skills the employer is seeking" },
      { icon: Search, title: "Recruiter Keyword Lift", description: "Identifies search terms recruiters use when hunting candidates for this role" },
      { icon: Sparkles, title: "Tailored Profile Tweaks", description: "Step-by-step instructions to optimize your profile specifically for this position" },
    ],
    available: false,
  },
  careerAudit: {
    name: "Career Audit",
    to: "/career-audit",
    description: "Resume, LinkedIn and a target job in one review, with one ranked fix list.",
    reads: ["resume", "linkedin", "job"],
    checks: [
      { icon: FileText, title: "Resume Quality", description: "Impact detection, bullet scoring, and professional summary audit" },
      { icon: ScanSearch, title: "ATS Verification", description: "Formatting checks, table/column warnings, and parser extraction" },
      { icon: Target, title: "Target Job Alignment", description: "Keyword gap, required vs preferred skills, and seniority fit" },
      { icon: GitCompareArrows, title: "Cross-Profile Consistency", description: "Identifies conflicting employment dates and title mismatches" },
    ],
    available: false,
  },
} satisfies Record<string, Tool>;

export type NavItem = Pick<Tool, "name" | "to" | "available">;

/** The menu, in order. */
export const NAV_SECTIONS: readonly { label: string; items: readonly NavItem[] }[] = [
  { label: "Workspace", items: [{ name: "Overview", to: "/dashboard", available: true }] },
  { label: "Analyze", items: [TOOLS.resume, TOOLS.ats, TOOLS.linkedin, TOOLS.jobMatch] },
  { label: "Compare", items: [TOOLS.resumeLinkedin, TOOLS.resumeJob, TOOLS.linkedinJob] },
  { label: "Audit", items: [TOOLS.careerAudit] },
];

/** Where a path sits in the menu: its section and name, for the top bar. */
export function locate(pathname: string): { section: string; name: string } | null {
  for (const section of NAV_SECTIONS) {
    const item = section.items.find((navItem) => navItem.to === pathname);
    if (item) return { section: section.label, name: item.name };
  }
  return null;
}

/** The order an audit runs in: the overview's library, each tool once, numbered by step. */
export const AUDIT_STEPS: readonly { index: string; label: string; tools: readonly Tool[] }[] = [
  { index: "01", label: "Analyze", tools: [TOOLS.resume, TOOLS.ats, TOOLS.linkedin] },
  { index: "02", label: "Compare", tools: [TOOLS.resumeLinkedin] },
  { index: "03", label: "Match", tools: [TOOLS.resumeJob, TOOLS.linkedinJob] },
  { index: "04", label: "Audit", tools: [TOOLS.careerAudit] },
];
