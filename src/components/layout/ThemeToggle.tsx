import {
  useEffect,
} from "react";

import {
  useThemeStore,
} from "../../store/themeStore";

export default function ThemeToggle() {
  const theme =
    useThemeStore(
      (state) => state.theme,
    );

  const toggleTheme =
    useThemeStore(
      (state) =>
        state.toggleTheme,
    );

  useEffect(() => {
    const root =
      document.documentElement;

    root.classList.toggle(
      "theme-light",
      theme === "light",
    );

    root.classList.toggle(
      "theme-dark",
      theme === "dark",
    );

    root.setAttribute(
      "data-theme",
      theme,
    );
  }, [theme]);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        theme === "dark"
          ? "Switch to light theme"
          : "Switch to dark theme"
      }
      title={
        theme === "dark"
          ? "Switch to light theme"
          : "Switch to dark theme"
      }
      className="fixed bottom-6 right-6 z-[100] flex h-12 w-12 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-xl text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950"
    >
      {theme === "dark"
        ? "☀️"
        : "🌙"}
    </button>
  );
}