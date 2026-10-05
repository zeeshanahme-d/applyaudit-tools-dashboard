import { FileUp } from "lucide-react";

/** Shown while a file is dragged over the page: the whole desk takes it. Visual only; the window handles the drop. */
export function DropOverlay({ label }: { label: string }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-60 flex items-center justify-center bg-background/75 p-6 backdrop-blur-[2px] animate-in fade-in-0 duration-150"
    >
      <div className="flex size-full max-h-136 max-w-3xl flex-col items-center justify-center rounded-md border-2 border-dashed border-cta text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-cta text-cta-foreground">
          <FileUp className="size-6" />
        </span>
        <p className="mt-5 font-serif text-[30px] font-medium leading-tight text-foreground">{label}</p>
        <p className="mt-2 text-[14px] text-muted-foreground">Read in memory, never stored</p>
      </div>
    </div>
  );
}
