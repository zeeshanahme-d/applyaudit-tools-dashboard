import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import DashboardHeader, { MENU_BUTTON_ID } from "./components/DashboardHeader";
import DashboardSidebar, { MENU_CLOSE_ID } from "./components/DashboardSidebar";

export default function DashboardLayout() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const { pathname } = useLocation();
    const mainRef = useRef<HTMLElement>(null);
    const previousPath = useRef(pathname);
    const wasMobileOpen = useRef(false);

    // A new page opens at its top, as a page load would.
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        if (!isMobileOpen) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsMobileOpen(false);
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [isMobileOpen]);

    // The phone menu only exists below the tablet breakpoint: widening the window closes it,
    // so the page behind it is never left inert.
    useEffect(() => {
        const wide = window.matchMedia("(min-width: 48rem)");
        const onChange = () => {
            if (wide.matches) setIsMobileOpen(false);
        };
        wide.addEventListener("change", onChange);
        return () => wide.removeEventListener("change", onChange);
    }, []);

    // Opening the phone menu moves focus into it; closing it returns focus to its button.
    useEffect(() => {
        if (isMobileOpen) document.getElementById(MENU_CLOSE_ID)?.focus();
        else if (wasMobileOpen.current) document.getElementById(MENU_BUTTON_ID)?.focus();
        wasMobileOpen.current = isMobileOpen;
    }, [isMobileOpen]);

    // After navigating, focus moves to the new page so a screen reader announces it.
    // Runs after the menu effect above, so a link chosen in the menu ends here. Not on first load.
    useEffect(() => {
        if (previousPath.current === pathname) return;
        previousPath.current = pathname;
        mainRef.current?.focus({ preventScroll: true });
    }, [pathname]);

    return (
        <div className="relative flex min-h-dvh">
            <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-60 focus:rounded-lg focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-float"
            >
                Skip to content
            </a>

            {/* Mobile scrim, as behind the marketing site's mobile menu */}
            {isMobileOpen && (
                <div
                    aria-hidden="true"
                    className="fixed inset-0 z-40 bg-background/70 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <DashboardSidebar
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
            />

            {/* The pages lie directly on the desk (the body's grained background); the paper is what rises.
                While the phone menu is open, everything here is out of reach (inert). */}
            <div inert={isMobileOpen} className="relative flex min-h-dvh min-w-0 flex-1 flex-col">
                <DashboardHeader isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

                {/* Focusable (not tabbable) for the skip link and route changes; no ring, it is a landing point. */}
                <main
                    id="main"
                    ref={mainRef}
                    tabIndex={-1}
                    className="flex-1 outline-none"
                >
                    {/* Each route arrives with a short fade and a 4px rise. */}
                    <div key={pathname} className="animate-in fade-in-0 slide-in-from-bottom-1 duration-200 ease-out">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
