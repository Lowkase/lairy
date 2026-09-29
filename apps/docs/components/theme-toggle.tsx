"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Themed custom properties are aliased once at :root by the Tailwind theme
 * (--color-bg: var(--bg), etc.), so the override has to live on the same
 * element as :root — a nested [data-theme] wrapper only reassigns --bg
 * locally and the alias still resolves against :root's original value.
 */
export function ThemeToggle({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    document.documentElement.dataset.theme = theme === "light" ? "light" : "";
    return () => {
      delete document.documentElement.dataset.theme;
    };
  }, [theme]);

  return (
    <div className="min-h-screen bg-bg">
      <div className="flex items-center gap-8 border-b border-border-2 py-16 px-18">
        <button
          type="button"
          onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
          className="ml-auto rounded-ds border border-border-2 py-6 px-12 text-label uppercase tracking-tight-6 text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          Theme: {theme}
        </button>
      </div>
      <div className="py-16 px-18">{children}</div>
    </div>
  );
}
