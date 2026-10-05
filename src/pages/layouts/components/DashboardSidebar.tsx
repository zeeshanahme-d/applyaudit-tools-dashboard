import { useId, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, ChevronLeft, ChevronRight, LayoutDashboard, ShieldCheck, X } from "lucide-react";
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

const TOOLS = TOOL_SECTIONS.flatMap((section) => section.tools);
const READY: readonly NavItem[] = [
  { name: "Overview", to: "/dashboard", icon: LayoutDashboard, available: true },
  ...TOOLS.filter((tool) => tool.available),
];
const UPCOMING: readonly NavItem[] = TOOLS.filter((tool) => !tool.available);

export const MENU_CLOSE_ID = "app-menu-close";

const iconButton =
  "flex size-8 pointer-coarse:size-11 items-center justify-center rounded-sm text-muted-foreground transition-colors duration-150 hover:bg-foreground/5 hover:text-foreground cursor-pointer";


export default function DashboardSidebar({isCollapsed,setIsCollapsed,isMobileOpen,setIsMobileOpen,}: DashboardSidebarProps) {
  const { pathname } = useLocation();
  const upcomingId = useId();
  const [upcomingChoice, setUpcomingChoice] = useState<boolean | null>(null);
  const showUpcoming = upcomingChoice ?? UPCOMING.some((tool) => tool.to === pathname);
  const railHidden = cn("md:max-lg:sr-only", isCollapsed && "lg:sr-only");

  const navItem = ({ name, to, icon: Icon, available }: NavItem) => (
    <NavLink
      key={to}
      to={to}
      onClick={() => setIsMobileOpen(false)}
      title={available ? name : `${name} (coming soon)`}
      className={({ isActive }) =>
        cn(
          "group relative flex h-9 pointer-coarse:h-11 items-center gap-3 rounded-sm px-2.5 text-[13.5px] font-medium transition-colors duration-150",
          "md:max-lg:justify-center md:max-lg:px-0",
          isCollapsed && "lg:justify-center lg:px-0",
          isActive ? "text-foreground" : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
        )
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-[5px] transition-colors duration-150",
              isActive && "md:max-lg:bg-cta md:max-lg:text-cta-foreground",
              isActive && isCollapsed && "lg:bg-cta lg:text-cta-foreground",
              !isActive && "group-hover:text-foreground"
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
          </span>
          {/* Padded so the chip's overhang is not cut by the truncation. */}
          <span className={cn("-mx-1.5 min-w-0 flex-1 truncate px-1.5 py-0.5", railHidden)}>
            {/* The page you are on is highlighted, as a marker would: ink on yellow. */}
            <span className={cn(isActive && "marker-chip")}>{name}</span>
          </span>
        </>
      )}
    </NavLink>
  );

  return (
    <aside
      id="app-sidebar"
      data-print="hide"
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex h-dvh w-62 shrink-0 flex-col bg-sidebar text-sidebar-foreground max-md:shadow-float",
        "border-r border-sidebar-border duration-200 ease-out-quart",
        "md:sticky md:top-0 md:w-16 md:translate-x-0",
        isCollapsed ? "lg:w-16" : "lg:w-62",
        isMobileOpen
          ? "translate-x-0 transition-[translate,width]"
          : "max-md:invisible max-md:-translate-x-full transition-[translate,width,visibility]"
      )}
    >
      <div
        className={cn(
          "flex h-16 shrink-0 items-center justify-between gap-2 px-4",
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
              className="absolute inset-0 flex items-center justify-center rounded-md bg-foreground/8 text-foreground opacity-0 transition-opacity duration-150 group-hover/expand:opacity-100 group-focus-visible/expand:opacity-100"
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

      <nav aria-label="Tools" className="flex-1 overflow-y-auto px-3 pb-4 pt-3">
        <div className="flex flex-col gap-0.5">{READY.map((tool) => navItem(tool))}</div>

        <div className={cn("mt-6", "md:max-lg:hidden", isCollapsed && "lg:hidden")}>
          <button
            type="button"
            onClick={() => setUpcomingChoice(!showUpcoming)}
            aria-expanded={showUpcoming}
            aria-controls={upcomingId}
            className="flex h-8 pointer-coarse:h-11 w-full cursor-pointer items-center justify-between rounded-sm px-2.5 text-[12.5px] font-medium text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
          >
            <span>
              Coming soon <span className="tabular-nums">({UPCOMING.length})</span>
            </span>
            <ChevronDown
              className={cn("size-3.5 transition-transform duration-200", showUpcoming && "rotate-180")}
              aria-hidden="true"
            />
          </button>
          <div id={upcomingId} hidden={!showUpcoming} className="mt-1 flex flex-col gap-0.5">
            {UPCOMING.map((tool) => navItem(tool))}
          </div>
        </div>
      </nav>

      <div className={cn("shrink-0 border-t border-sidebar-border p-3", "md:max-lg:px-0", isCollapsed && "lg:px-0")}>
        <div className={cn("flex items-center gap-2", "md:max-lg:justify-center", isCollapsed && "lg:justify-center")}>
          <div className={cn("flex min-w-0 flex-1 items-start gap-2 px-1", "md:max-lg:hidden", isCollapsed && "lg:hidden")}>
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
            <p className="text-[12px] leading-snug text-muted-foreground">
              <span className="block font-medium text-foreground">Private session</span>
              Uploads are read in memory and never stored.
            </p>
          </div>
          <ThemeToggle className="size-8 pointer-coarse:size-11 shrink-0 rounded-sm" menuPosition="left-0 bottom-full mb-2" />
        </div>
      </div>
    </aside>
  );
}
