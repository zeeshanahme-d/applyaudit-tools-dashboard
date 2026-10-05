import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { appConfig } from "@/config/app";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";

interface DashboardHeaderProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

/** The menu button's id: focus returns here when the phone menu closes. */
export const MENU_BUTTON_ID = "app-menu-button";

/** Phones only; from tablets up the sidebar (rail or full) takes its place. */
export default function DashboardHeader({ isMobileOpen, setIsMobileOpen }: DashboardHeaderProps) {
  return (
    <header data-print="hide" className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-sidebar-border bg-sidebar px-4 md:hidden">
      <div className="flex items-center gap-2">
        <button
          id={MENU_BUTTON_ID}
          type="button"
          onClick={() => setIsMobileOpen(true)}
          aria-expanded={isMobileOpen}
          aria-controls="app-sidebar"
          aria-label="Open menu"
          className="flex size-11 items-center justify-center rounded-sm text-foreground transition-colors hover:bg-foreground/5 cursor-pointer"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
        <Link to="/dashboard" className="flex min-h-11 items-center rounded-sm" aria-label={`${appConfig.name} overview`}>
          <Logo />
        </Link>
      </div>
      <ThemeToggle className="rounded-sm" />
    </header>
  );
}
