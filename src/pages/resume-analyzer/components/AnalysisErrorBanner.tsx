import { CircleAlert } from "lucide-react";

/** Why nothing was analyzed: a file problem, or the API's own message. Announced when it appears. */
export function AnalysisErrorBanner({ message }: { message: string }) {
  return (
    <div role="alert" className="mt-6 flex items-start gap-3 rounded-sm border border-danger-line bg-danger-soft p-4">
      <CircleAlert className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden="true" />
      <div className="space-y-0.5 text-[13.5px]">
        <p className="font-semibold text-foreground">The audit did not run</p>
        <p className="text-foreground/85">{message}</p>
      </div>
    </div>
  );
}
