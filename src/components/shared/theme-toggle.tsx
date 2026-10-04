import { useEffect, useId, useRef, useState } from "react";
import { Sun, Moon, Laptop, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme, type Theme } from "@/store/useTheme";

interface ThemeOption {
  value: Theme;
  label: string;
  icon: typeof Sun;
}

const themeOptions: ThemeOption[] = [
  { value: "system", label: "System", icon: Laptop },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];

/** The marketing site's theme menu. `menuPosition` places the menu: below, right-aligned by default. */
export function ThemeToggle({
  className,
  menuPosition = "right-0 top-full mt-2",
}: {
  className?: string;
  menuPosition?: string;
}) {
  const { theme: activeTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  // One id per toggle: the header and the sidebar each render one.
  const menuId = useId();

  // Close on outside click or Escape.
  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const ActiveIcon = themeOptions.find((option) => option.value === activeTheme)?.icon ?? Laptop;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        aria-label={`Theme: ${activeTheme}`}
        className={cn(
          "flex h-9 w-9 pointer-coarse:size-11 items-center justify-center rounded-lg text-muted-foreground transition-colors cursor-pointer",
          "hover:bg-muted hover:text-foreground",
          isOpen && "bg-muted text-foreground",
          className
        )}
      >
        <ActiveIcon className="h-4 w-4" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          id={menuId}
          role="group"
          aria-label="Theme"
          className={cn(
            "absolute z-50 w-40 rounded-xl border border-border bg-popover p-1 shadow-float animate-in fade-in-0 zoom-in-95 duration-150",
            menuPosition
          )}
        >
          {themeOptions.map((item) => {
            const isSelected = activeTheme === item.value;
            return (
              <button
                key={item.value}
                type="button"
                aria-pressed={isSelected}
                onClick={() => {
                  setTheme(item.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 pointer-coarse:min-h-11 text-left text-[13px] font-medium transition-colors cursor-pointer",
                  isSelected ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" aria-hidden="true" />
                <span className="flex-1">{item.label}</span>
                {isSelected && <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
