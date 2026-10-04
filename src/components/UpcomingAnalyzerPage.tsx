import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { ChevronRight, Clock } from "lucide-react";
import { FeatureCard } from "@/components/FeatureCard";
import { buttonClass } from "@/components/ui/button";

export interface AnalyzerFeature {
  icon: ReactNode;
  title: string;
  description: string;
}

export interface UpcomingAnalyzerPageProps {
  /** Breadcrumb label and H1. */
  title: string;
  /** What this analyzer will do, in plain language. */
  description: string;
  /** Heading above the capability grid. */
  featuresHeading: string;
  features: AnalyzerFeature[];
  /** What the visitor can genuinely use right now. */
  availableNow?: { href: string; label: string };
}

/**
 * Landing page for an analyzer whose API does not exist yet.
 *
 * Deliberately has no upload control and no sample results. Showing a working
 * form or a specimen score for a feature that cannot run would be fake
 * urgency and fabricated output (CLAUDE.md §2.4 and §36.12); a plain "not
 * built yet" costs us nothing and keeps the product honest.
 */
export function UpcomingAnalyzerPage({
  title,
  description,
  featuresHeading,
  features,
  availableNow = { href: "/resume-analyzer", label: "Analyze your resume" },
}: UpcomingAnalyzerPageProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-10 lg:pt-10">
      <title>{title}</title>

      <header className="border-b border-border pb-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[12.5px] text-muted-foreground">
          <Link to="/dashboard" className="inline-flex min-h-6 items-center rounded-sm transition-colors hover:text-foreground pointer-coarse:min-h-11 pointer-coarse:min-w-11">
            Tools
          </Link>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <span className="text-foreground">{title}</span>
        </nav>
        <h1 className="mt-2 font-display text-[1.75rem] font-semibold leading-tight tracking-tight text-foreground sm:text-[2rem]">
          {title}
        </h1>
        <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">{description}</p>
      </header>

      <div className="mt-6 flex flex-col gap-5 rounded-xl border border-dashed border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-warning-soft text-warning">
            <Clock className="size-5" aria-hidden="true" />
          </span>
          <div className="space-y-1">
            <h2 className="text-[15px] font-semibold text-foreground">Not available yet</h2>
            <p className="max-w-lg text-[13px] leading-relaxed text-muted-foreground">
              We&apos;re still building this analyzer. It isn&apos;t accepting uploads, and we&apos;d rather show you
              nothing than show you a score we didn&apos;t actually calculate.
            </p>
          </div>
        </div>
        <Link to={availableNow.href} className={buttonClass({ size: "sm", className: "shrink-0" })}>
          {availableNow.label}
        </Link>
      </div>

      <section aria-labelledby="features-title" className="mt-10 space-y-4">
        <h2 id="features-title" className="text-[13px] font-semibold text-foreground">
          {featuresHeading}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>
    </div>
  );
}
