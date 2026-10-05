import { Link, NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { appConfig } from "@/config/app";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/logo";
import { ToolName } from "@/components/shared/tool-name";
import { NAV_SECTIONS } from "@/data/tools";

interface DashboardSidebarProps {
  /** Below desktop the menu is a drawer: open or not. From desktop up it is always there. */
  isOpen: boolean;
  onClose: () => void;
}

export const MENU_CLOSE_ID = "app-menu-close";

/**
 * The menu: each section hangs off a thin margin rule, like a report's
 * contents, and the page you are on marks its stretch of that rule.
 */
export default function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  return (
    <aside
      id="app-sidebar"
      data-print="hide"
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex h-dvh w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
        "duration-200 ease-out-quart lg:sticky lg:top-0 lg:w-60 lg:translate-x-0",
        isOpen
          ? "translate-x-0 shadow-float transition-[translate] lg:shadow-none"
          : "max-lg:invisible max-lg:-translate-x-full transition-[translate,visibility]"
      )}
    >
      <div className="flex h-14 shrink-0 items-center justify-between pl-5 pr-3">
        <Link to="/dashboard" onClick={onClose} className="flex min-h-11 items-center rounded-sm" aria-label={`${appConfig.name} overview`}>
          <Logo />
        </Link>
        <button
          id={MENU_CLOSE_ID}
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex size-11 cursor-pointer items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground lg:hidden"
        >
          <X className="size-4.5" aria-hidden="true" />
        </button>
      </div>

      <nav aria-label="Tools" className="flex-1 overflow-y-auto px-5 pb-8 pt-5">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="mt-7 first:mt-0">
            <h2 className="text-[11.5px] font-medium text-muted-foreground">{section.label}</h2>
            <ul className="mt-2 border-l border-sidebar-border">
              {section.items.map(({ name, to, available }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        "relative flex min-h-9 items-center gap-2 py-1.5 pl-4 pr-1 text-[13.5px] transition-colors duration-150 pointer-coarse:min-h-11",
                        // The page's stretch of the margin rule: it grows in when the page becomes current.
                        "before:absolute before:inset-y-1.5 before:-left-px before:w-0.5 before:origin-top before:rounded-full before:transition-[scale,background-color] before:duration-300 before:ease-out-quart",
                        isActive
                          ? "font-semibold text-foreground before:scale-y-100 before:bg-sidebar-primary"
                          : "text-muted-foreground before:scale-y-0 before:bg-foreground/30 hover:text-foreground hover:before:scale-y-100 active:before:bg-foreground/60"
                      )
                    }
                  >
                    <span className="min-w-0 flex-1 truncate">
                      <ToolName name={name} />
                    </span>
                    {!available && <span className="text-[11.5px] font-normal text-muted-foreground/80">Soon</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
