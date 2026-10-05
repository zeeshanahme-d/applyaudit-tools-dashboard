import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { appConfig } from "@/config/app";
import type { Artifact } from "@/data/tools";
import { DropOverlay } from "@/components/analyzer/DropOverlay";
import { useFileDrop } from "@/hooks/use-file-drop";
import { validateResumeFile } from "@/lib/validate-resume-file";
import { handOffAudit, type HandedOffAudit } from "@/pages/resume-analyzer/core/_handoff";
import { useLastResumeAnalysis } from "@/pages/resume-analyzer/core/hook/useLastResumeAnalysis";
import { StartAnalysis } from "./components/StartAnalysis";
import { CareerSurface } from "./components/CareerSurface";
import { AnalysisLibrary } from "./components/AnalysisLibrary";

/**
 * The career workspace. Pick a document to inspect and the surface beside it
 * brings that document forward; once a resume has been audited in this tab,
 * its scores sit on its sheet and the next fixes lead the panel. Nothing is
 * stored, so a reload starts at the first audit again.
 */
export default function Dashboard() {
  const navigate = useNavigate();
  const audit = useLastResumeAnalysis();
  const [focus, setFocus] = useState<Artifact>("resume");
  const [dropError, setDropError] = useState<string | null>(null);

  // The analyzer takes it from here and starts at once.
  const start = (handoff: HandedOffAudit) => {
    handOffAudit(handoff);
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
    <div className="mx-auto w-full max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-10 lg:pt-10">
      <title>{`${appConfig.name}: ${appConfig.tagline}`}</title>

      <header>
        <p className="text-[13px] font-medium text-muted-foreground">Your career workspace</p>
        {/* Sized to stay on one line from tablets up, and to break once, after "Compare.", on phones. */}
        <h1 className="mt-2 font-serif text-[2.5rem] font-medium leading-[1.05] tracking-tight text-foreground sm:text-[3rem] md:text-[3.5rem] xl:text-[4rem]">
          Analyze. Compare. Improve.
        </h1>
        <p className="mt-3 max-w-xl text-[15.5px] leading-relaxed text-muted-foreground">
          Your resume, your LinkedIn profile and the job you want, inspected side by side.
        </p>
      </header>

      <div className="mt-10 grid items-start gap-14 xl:grid-cols-[minmax(0,23rem)_minmax(0,1fr)] xl:gap-12">
        <StartAnalysis
          focus={focus}
          onFocusChange={setFocus}
          audit={audit}
          onFile={(file) => start({ file })}
          onTrySample={() => start({ sample: true })}
          error={dropError}
        />
        {/* Beside the panel it stays in view, so each choice shows its sheets moving. */}
        <CareerSurface focus={focus} onFocusChange={setFocus} audit={audit} className="xl:sticky xl:top-20" />
      </div>

      <AnalysisLibrary className="mt-24" />

      {dragging && <DropOverlay label="Drop to audit your resume" />}
    </div>
  );
}
