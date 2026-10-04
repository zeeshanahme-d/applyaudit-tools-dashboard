import { Link, NavLink } from "react-router-dom";
import { ChevronLeft, ChevronRight, LayoutDashboard, ShieldCheck, X } from "lucide-react";
import { appConfig } from "@/config/app";
import { cn } from "@/lib/utils";
import { Logo, LogoMark } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { TOOL_SECTIONS, type Tool } from "@/data/tools";

interface DashboardSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileOpen: boolean;
  setIsMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type NavItem = Pick<Tool, "name" | "to" | "icon" | "available">;

const SECTIONS: readonly { label: string; tools: readonly NavItem[] }[] = [
  { label: "Workspace", tools: [{ name: "Overview", to: "/dashboard", icon: LayoutDashboard, available: true }] },
  ...TOOL_SECTIONS,
];

/** The phone menu's close button: focus lands here when the menu opens. */
export const MENU_CLOSE_ID = "app-menu-close";

const iconButton =
  "flex size-8 pointer-coarse:size-11 items-center justify-center rounded-sm text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground cursor-pointer";

/**
 * Three widths: a drawer on phones, an icon rail on tablets, the full sidebar
 * on desktop (collapsible to the rail). Class names are written out in full
 * below because Tailwind only generates classes it can read in the source.
 */
export default function DashboardSidebar({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}: DashboardSidebarProps) {
  const navItem = ({ name, to, icon: Icon, available }: NavItem) => (
    <NavLink
      key={to}
      to={to}
      onClick={() => setIsMobileOpen(false)}
      title={available ? name : `${name} (coming soon)`}
      className={({ isActive }) =>
        cn(
          "group relative flex h-9 pointer-coarse:h-11 items-center gap-3 rounded-md px-2.5 text-[13px] font-medium transition-colors duration-150",
          "md:max-lg:justify-center md:max-lg:px-0",
          isCollapsed && "lg:justify-center lg:px-0",
          isActive
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
        )
      }
    >
      {({ isActive }) => (
        <>
          {/* The audit mark's rule, at the sidebar's edge: the page you are on. */}
          <span
            aria-hidden="true"
            className={cn(
              "absolute -left-3 top-2 bottom-2 w-0.75 rounded-r-full bg-primary transition-[scale,opacity] duration-200 ease-out",
              isActive ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
            )}
          />
          <Icon
            className={cn(
              "size-4 shrink-0 transition-colors duration-150",
              isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
            )}
            aria-hidden="true"
          />
          <span className={cn("min-w-0 flex-1 truncate", "md:max-lg:sr-only", isCollapsed && "lg:sr-only")}>{name}</span>
          {!available && (
            <span className={cn("text-[12px] font-normal text-muted-foreground", "md:max-lg:hidden", isCollapsed && "lg:hidden")}>
              Soon
            </span>
          )}
        </>
      )}
    </NavLink>
  );

  return (
    <aside
      id="app-sidebar"
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex h-dvh w-62 shrink-0 flex-col bg-sidebar text-sidebar-foreground max-md:border-r max-md:border-sidebar-border max-md:shadow-float",
        "duration-200 ease-out-quart",
        "md:sticky md:top-0 md:w-16 md:translate-x-0",
        isCollapsed ? "lg:w-16" : "lg:w-62",
        // Closed on phones: off screen and out of the tab order. Visibility switches on at once
        // when opening (so focus can move in) and off only after the slide when closing.
        isMobileOpen
          ? "translate-x-0 transition-[translate,width]"
          : "max-md:invisible max-md:-translate-x-full transition-[translate,width,visibility]"
      )}
    >
      <div
        className={cn(
          "flex h-14 shrink-0 items-center justify-between gap-2 px-4",
          "md:max-lg:justify-center md:max-lg:px-0",
          isCollapsed && "lg:justify-center lg:px-0"
        )}
      >
        <Link
          to="/dashboard"
          className={cn("flex min-h-11 items-center rounded-sm", isCollapsed && "lg:hidden")}
          aria-label={`${appConfig.name} overview`}
        >
          <Logo className="md:max-lg:hidden" />
          <LogoMark className="hidden md:max-lg:flex" />
        </Link>
        {/* Collapsed on desktop, the brand mark is the way back: hovering or focusing it shows the expand icon. */}
        {isCollapsed && (
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            aria-label="Expand sidebar"
            title="Expand sidebar"
            className="group/expand relative hidden size-9 items-center justify-center rounded-md cursor-pointer pointer-coarse:size-11 lg:flex"
          >
            <LogoMark className="transition-opacity duration-150 group-hover/expand:opacity-0 group-focus-visible/expand:opacity-0" />
            <span
              aria-hidden="true"
              className="absolute inset-0 flex items-center justify-center rounded-md bg-muted text-foreground opacity-0 transition-opacity duration-150 group-hover/expand:opacity-100 group-focus-visible/expand:opacity-100"
            >
              <ChevronRight className="size-4" />
            </span>
          </button>
        )}
        <button
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          aria-label="Collapse sidebar"
          className={cn(iconButton, "hidden", !isCollapsed && "lg:flex")}
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </button>
        <button
          id={MENU_CLOSE_ID}
          type="button"
          onClick={() => setIsMobileOpen(false)}
          aria-label="Close menu"
          className={cn(iconButton, "md:hidden")}
        >
          <X className="size-4.5" aria-hidden="true" />
        </button>
      </div>

      <nav aria-label="Tools" className="flex-1 overflow-y-auto px-3 pb-4 pt-2">
        {SECTIONS.map((section, index) => (
          <div key={section.label} className={cn(index > 0 && "mt-5")}>
            <p className={cn("px-2.5 pb-1.5 text-[12px] font-medium text-muted-foreground", "md:max-lg:hidden", isCollapsed && "lg:hidden")}>
              {section.label}
            </p>
            {index > 0 && (
              <div aria-hidden="true" className={cn("mx-2 mb-2 hidden border-t border-sidebar-border", "md:max-lg:block", isCollapsed && "lg:block")} />
            )}
            <div className="flex flex-col gap-0.5">{section.tools.map((tool) => navItem(tool))}</div>
          </div>
        ))}
      </nav>

      <div className={cn("shrink-0 border-t border-sidebar-border p-3", "md:max-lg:px-0", isCollapsed && "lg:px-0")}>
        <div className={cn("flex items-center gap-2", "md:max-lg:justify-center", isCollapsed && "lg:justify-center")}>
          <div className={cn("flex min-w-0 flex-1 items-start gap-2 px-1", "md:max-lg:hidden", isCollapsed && "lg:hidden")}>
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
            <p className="text-[12px] leading-snug text-muted-foreground">
              <span className="block font-medium text-foreground">Private session</span>
              Uploads are processed in memory and not stored.
            </p>
          </div>
          <ThemeToggle className="size-8 pointer-coarse:size-11 shrink-0 rounded-sm" menuPosition="left-0 bottom-full mb-2" />
        </div>
      </div>
    </aside>
  );
}
