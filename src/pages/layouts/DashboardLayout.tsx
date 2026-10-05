import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import DashboardHeader, { MENU_BUTTON_ID } from "./components/DashboardHeader";
import DashboardSidebar, { MENU_CLOSE_ID } from "./components/DashboardSidebar";

export default function DashboardLayout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { pathname } = useLocation();
    const mainRef = useRef<HTMLElement>(null);
    const previousPath = useRef(pathname);
    const wasMenuOpen = useRef(false);

    // A new page opens at its top, as a page load would.
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        if (!isMenuOpen) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsMenuOpen(false);
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [isMenuOpen]);

    // The menu is a drawer only below the desktop breakpoint: widening the window closes it,
    // so the page behind it is never left inert.
    useEffect(() => {
        const wide = window.matchMedia("(min-width: 64rem)");
        const onChange = () => {
            if (wide.matches) setIsMenuOpen(false);
        };
        wide.addEventListener("change", onChange);
        return () => wide.removeEventListener("change", onChange);
    }, []);

    // Opening the menu moves focus into it; closing it returns focus to its button.
    useEffect(() => {
        if (isMenuOpen) document.getElementById(MENU_CLOSE_ID)?.focus();
        else if (wasMenuOpen.current) document.getElementById(MENU_BUTTON_ID)?.focus();
        wasMenuOpen.current = isMenuOpen;
    }, [isMenuOpen]);

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

            {isMenuOpen && (
                <div
                    aria-hidden="true"
                    className="fixed inset-0 z-40 bg-background/70 animate-in fade-in-0 duration-200 lg:hidden"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}

            <DashboardSidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            {/* The pages lie directly on the desk (the body's grained background); the paper is what rises.
                While the menu drawer is open, everything here is out of reach (inert). */}
            <div inert={isMenuOpen} className="relative flex min-h-dvh min-w-0 flex-1 flex-col">
                <DashboardHeader isMenuOpen={isMenuOpen} onOpenMenu={() => setIsMenuOpen(true)} />

                {/* Focusable (not tabbable) for the skip link and route changes; no ring, it is a landing point. */}
                <main id="main" ref={mainRef} tabIndex={-1} className="flex-1 outline-none">
                    {/* Each route arrives with a short fade and a 4px rise. */}
                    <div key={pathname} className="animate-in fade-in-0 slide-in-from-bottom-1 duration-200 ease-out">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
