/**
 * The tool's name and what it gives back. The sidebar shows where you are, so
 * no breadcrumb; once the report is on the desk, the name alone.
 */
export function ResumeAnalyzerHeader({ withIntro = true }: { withIntro?: boolean }) {
  return (
    <header>
      <h1 className="font-serif text-[2.25rem] font-medium leading-[1.1] tracking-[-0.015em] text-foreground sm:text-[2.75rem]">
        Resume Analyzer
      </h1>
      {withIntro && (
        <p className="mt-2.5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          Your resume comes back marked up: weak lines highlighted, every score explained, and the fixes ranked by the
          points they add.
        </p>
      )}
    </header>
  );
}
