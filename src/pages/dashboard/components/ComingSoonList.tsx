import { Link } from "react-router-dom";
import { TOOL_SECTIONS } from "@/data/tools";

const UPCOMING = TOOL_SECTIONS.flatMap((section) => section.tools).filter((tool) => !tool.available);

/** The tools still being built: what each will do, one line each. */
export function ComingSoonList() {
  return (
    <section aria-labelledby="soon-title">
      <h2 id="soon-title" className="font-serif text-[24px] font-medium tracking-[-0.01em] text-foreground">
        Being built next
      </h2>
      <ul className="mt-4 grid border-t border-border sm:grid-cols-2 sm:gap-x-10">
        {UPCOMING.map((tool) => (
          <li key={tool.to} className="border-b border-border">
            <Link
              to={tool.to}
              className="group flex items-start gap-3 py-3.5 transition-colors"
            >
              <tool.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground group-hover:text-foreground" aria-hidden="true" />
              <span className="min-w-0">
                <span className="block text-[14px] font-semibold text-foreground underline-offset-4 group-hover:underline">
                  {tool.name}
                </span>
                <span className="mt-0.5 block text-[13px] leading-snug text-muted-foreground">{tool.description}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
