import { cn } from "@/lib/utils";

export interface FeatureCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-5 shadow-raised", className)}>
      {icon && (
        <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">{icon}</div>
      )}
      <h3 className="mb-1 text-[13.5px] font-semibold text-foreground">{title}</h3>
      <p className="text-[12.5px] leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}
