import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

/** Breadcrumb, title and what the analyzer does. */
export function ResumeAnalyzerHeader() {
  return (
    <header className="border-b border-border pb-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[12.5px] text-muted-foreground">
        <Link
          to="/dashboard"
          className="inline-flex min-h-6 items-center rounded-sm transition-colors hover:text-foreground pointer-coarse:min-h-11 pointer-coarse:min-w-11"
        >
          Tools
        </Link>
        <ChevronRight className="size-3.5" aria-hidden="true" />
        <span className="text-foreground">Resume Analyzer</span>
      </nav>
      <h1 className="mt-2 font-display text-[1.75rem] font-semibold leading-tight tracking-tight text-foreground sm:text-[2rem]">
        Resume Analyzer
      </h1>
      <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
        Get an actionable section-by-section audit of your resume. Discover weak bullet points, impact gaps, and
        prioritized line-by-line improvements.
      </p>
    </header>
  );
}
