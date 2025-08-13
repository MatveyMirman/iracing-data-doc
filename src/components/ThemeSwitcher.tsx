"use client";
import * as React from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeSwitcher() {
  const [theme, setTheme] = React.useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as "light" | "dark") || "light";
    }
    return "light";
  });

  React.useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      aria-label="Toggle theme"
      className="rounded-full p-2 hover:bg-accent transition-colors"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      type="button"
    >
      {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
