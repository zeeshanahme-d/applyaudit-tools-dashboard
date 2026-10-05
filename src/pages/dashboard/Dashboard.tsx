import { useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { CircleAlert } from "lucide-react";
import { appConfig } from "@/config/app";
import { cn } from "@/lib/utils";
import { DropOverlay } from "@/components/analyzer/DropOverlay";
import { useFileDrop } from "@/hooks/use-file-drop";
import { validateResumeFile } from "@/lib/validate-resume-file";
import { handOffAudit, type HandedOffAudit } from "@/pages/resume-analyzer/core/_handoff";
import { StartSheet } from "./components/StartSheet";
import { SampleMarkup } from "./components/SampleMarkup";
import { ComingSoonList } from "./components/ComingSoonList";

/** One load sequence: each block rises into place, a beat after the one before. */
const ENTER = "animate-in fade-in-0 slide-in-from-bottom-3 duration-500 ease-out fill-mode-both";
const at = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });

function greeting(hour: number) {
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 18) return "Good afternoon";
  return "Good evening";
}

/**
 * The desk, empty: the one thing to do (put a resume on it), what comes back,
 * and what is being built. Nothing is stored, so every visit starts here.
 */
export default function Dashboard() {
  const navigate = useNavigate();
  const [dropError, setDropError] = useState<string | null>(null);

  // The analyzer takes it from here and starts at once.
  const start = (audit: HandedOffAudit) => {
    handOffAudit(audit);
    navigate("/resume-analyzer");
  };

  const dragging = useFileDrop((file) => {
    const validation = validateResumeFile(file);
    if (!validation.valid) {
      setDropError(validation.error ?? "Please choose a resume file.");
      return;
    }
    start({ file });
  });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-10 lg:pt-14">
      <title>{`${appConfig.name}: ${appConfig.tagline}`}</title>

      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,27rem)] lg:gap-16">
        <header className={ENTER}>
          <p className="text-[14px] text-muted-foreground">{greeting(new Date().getHours())}</p>
          <h1 className="mt-2 font-serif text-[2.5rem] font-medium leading-[1.05] tracking-[-0.02em] text-foreground sm:text-[3.5rem]">
            Get your resume marked up before a recruiter reads it.
          </h1>
          <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-muted-foreground">
            Put it on the desk. Every line is checked, the weak ones are highlighted, and the fixes are ranked by the
            points they add.
          </p>
        </header>

        <div className={ENTER} style={at(120)}>
          <StartSheet onFile={(file) => start({ file })} onTrySample={() => start({ sample: true })} />
          {dropError && (
            <p role="alert" className="mt-3 flex items-start gap-2 text-[13.5px] text-danger">
              <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {dropError}
            </p>
          )}
        </div>
      </div>

      <div className={cn(ENTER, "mt-20")} style={at(260)}>
        <SampleMarkup />
      </div>

      <div className={cn(ENTER, "mt-20")} style={at(360)}>
        <ComingSoonList />
      </div>

      {dragging && <DropOverlay label="Drop to audit your resume" />}
    </div>
  );
}
