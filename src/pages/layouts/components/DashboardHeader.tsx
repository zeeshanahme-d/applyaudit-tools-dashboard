import { Link, useLocation } from "react-router-dom";
import { Menu, ShieldCheck } from "lucide-react";
import { appConfig } from "@/config/app";
import { locate } from "@/data/tools";
import { LogoMark } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { ToolName } from "@/components/shared/tool-name";

interface DashboardHeaderProps {
  isMenuOpen: boolean;
  onOpenMenu: () => void;
}

/** The menu button's id: focus returns here when the menu drawer closes. */
export const MENU_BUTTON_ID = "app-menu-button";

/** The product bar: where you are, the session's privacy, the theme. Below desktop it also opens the menu. */
export default function DashboardHeader({ isMenuOpen, onOpenMenu }: DashboardHeaderProps) {
  const { pathname } = useLocation();
  const place = locate(pathname);

  return (
    <header data-print="hide" className="sticky top-0 z-30 border-b border-border bg-background bg-(image:--grain)">
      {/* The pages' own container, so where-you-are lines up with each page's content at any width. */}
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-2 px-4 sm:px-6 lg:px-10">
        <button
          id={MENU_BUTTON_ID}
          type="button"
          onClick={onOpenMenu}
          aria-expanded={isMenuOpen}
          aria-controls="app-sidebar"
          aria-label="Open menu"
          className="-ml-2.5 flex size-11 cursor-pointer items-center justify-center rounded-sm text-foreground transition-colors hover:bg-foreground/5 lg:hidden"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
        <Link to="/dashboard" className="mr-1 flex min-h-11 items-center rounded-sm lg:hidden" aria-label={`${appConfig.name} overview`}>
          <LogoMark />
        </Link>

        {place && (
          <p className="min-w-0 truncate text-[13px] text-muted-foreground">
            <span className="max-sm:sr-only">{place.section}</span>
            <span aria-hidden="true" className="mx-2 text-foreground/25 max-sm:hidden">
              /
            </span>
            <span className="font-medium text-foreground">
              <ToolName name={place.name} />
            </span>
          </p>
        )}

        <div className="ml-auto flex shrink-0 items-center gap-3">
          <p className="flex items-center gap-1.5 text-[12.5px] text-muted-foreground" title="Uploads are read in memory and never stored.">
            <ShieldCheck className="size-4 text-success" aria-hidden="true" />
            <span className="max-sm:sr-only">Private session</span>
          </p>
          <ThemeToggle className="rounded-sm" />
        </div>
      </div>
    </header>
  );
}
