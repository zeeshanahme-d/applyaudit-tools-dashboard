import { TOOLS } from "@/data/tools";
import { MarkLegend } from "./MarkLegend";

/** Under the blank sheet: what the audit looks at, side by side, and how its marks will read. */
export function EditorChecks() {
  return (
    <section aria-labelledby="checks-title">
      <h2 id="checks-title" className="font-serif text-[24px] font-medium tracking-[-0.01em] text-foreground">
        What the editor checks
      </h2>
      <dl className="mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
        {TOOLS.resume.checks.map((check) => (
          <div key={check.title} className="border-t border-border pt-4">
            <dt className="flex items-center gap-2 text-[14.5px] font-semibold text-foreground">
              <check.icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
              {check.title}
            </dt>
            <dd className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">{check.description}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-9 flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
        <h3 className="shrink-0 text-[13.5px] font-semibold text-foreground">How the marks read</h3>
        <MarkLegend />
      </div>
    </section>
  );
}
