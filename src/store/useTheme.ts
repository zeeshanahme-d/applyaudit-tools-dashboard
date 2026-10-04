import { create } from "zustand";

/** Follow the system, or force one. The app is dark-first: dark until the visitor picks otherwise. */
export type Theme = "system" | "light" | "dark";

/** Same key as index.html's pre-paint script. */
const STORAGE_KEY = "theme";
const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

interface ThemeStore {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const getStoredTheme = (): Theme => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === "system" || stored === "light" || stored === "dark") return stored;
    } catch {
        // Storage blocked: the default.
    }
    return "dark";
};

/** Sets the `.dark` class the tokens key off. Colors switch at once, without transitions, as on the marketing site. */
const applyTheme = (theme: Theme) => {
    const pause = document.createElement("style");
    pause.textContent = "*,*::before,*::after{transition:none!important}";
    document.head.appendChild(pause);
    document.documentElement.classList.toggle("dark", theme === "dark" || (theme === "system" && darkQuery.matches));
    void window.getComputedStyle(document.body).opacity;
    setTimeout(() => pause.remove(), 1);
};

const initialTheme = getStoredTheme();
applyTheme(initialTheme);

export const useTheme = create<ThemeStore>((set) => ({
    theme: initialTheme,
    setTheme: (theme) => {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch {
            // Not remembered, still applied.
        }
        applyTheme(theme);
        set({ theme });
    },
}));

darkQuery.addEventListener("change", () => {
    if (useTheme.getState().theme === "system") applyTheme("system");
});
