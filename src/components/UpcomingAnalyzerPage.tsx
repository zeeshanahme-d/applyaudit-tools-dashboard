import { Link } from "react-router-dom";
import { buttonClass } from "@/components/ui/button";
import type { ToolCheck } from "@/data/tools";

export interface UpcomingAnalyzerPageProps {
  /** The page's H1. */
  title: string;
  /** What this analyzer will do, in plain language. */
  description: string;
  /** Heading above the list of checks. */
  featuresHeading: string;
  features: readonly ToolCheck[];
  /** What the visitor can genuinely use right now. */
  availableNow?: { href: string; label: string };
}

/**
 * Landing page for an analyzer whose API does not exist yet.
 *
 * Deliberately has no upload control and no sample results. Showing a working
 * form or a specimen score for a feature that cannot run would be fake
 * urgency and fabricated output (CLAUDE.md §2.4 and §36.12); a plain "not
 * built yet" costs us nothing and keeps the product honest. On the desk it is
 * an empty sheet: nothing to mark yet.
 */
export function UpcomingAnalyzerPage({
  title,
  description,
  featuresHeading,
  features,
  availableNow = { href: "/resume-analyzer", label: "Audit your resume" },
}: UpcomingAnalyzerPageProps) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-10 lg:pt-12">
      <title>{title}</title>

      <header>
        <p className="text-[13.5px] font-medium text-muted-foreground">Coming soon</p>
        <h1 className="mt-1.5 font-serif text-[2.25rem] font-medium leading-[1.1] tracking-[-0.015em] text-foreground sm:text-[2.75rem]">
          {title}
        </h1>
        <p className="mt-2.5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">{description}</p>
      </header>

      <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
        <section aria-labelledby="not-yet-title" className="paper flex min-h-72 flex-col items-center justify-center px-6 py-10 text-center sm:px-12">
          <h2 id="not-yet-title" className="font-serif text-[26px] font-medium leading-tight">
            Not available yet
          </h2>
          <p className="mt-2.5 max-w-md text-[14px] leading-relaxed text-paper-muted">
            We&apos;re still building this analyzer. It isn&apos;t accepting uploads, and we&apos;d rather show you
            nothing than show you a score we didn&apos;t actually calculate.
          </p>
          <Link to={availableNow.href} className={buttonClass({ size: "md", className: "mt-6" })}>
            {availableNow.label}
          </Link>
        </section>

        <section aria-labelledby="features-title">
          <h2 id="features-title" className="font-serif text-[22px] font-medium text-foreground">
            {featuresHeading}
          </h2>
          <dl className="mt-4 divide-y divide-border border-y border-border">
            {features.map((feature) => (
              <div key={feature.title} className="flex gap-3 py-3">
                <feature.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <div>
                  <dt className="text-[14px] font-semibold text-foreground">{feature.title}</dt>
                  <dd className="mt-0.5 text-[13.5px] leading-relaxed text-muted-foreground">{feature.description}</dd>
                </div>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}
