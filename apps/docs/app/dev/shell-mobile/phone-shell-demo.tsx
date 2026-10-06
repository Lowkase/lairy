"use client";

import type { MainRailItem, SubnavGroup } from "@lairy/ui";
import { useEffect, useState, type ReactNode } from "react";
import { PhoneShell, type PhoneShellLayout } from "@/components/phone-shell";

const LAYOUTS: { value: PhoneShellLayout; label: string }[] = [
  { value: "tabs", label: "Recommended · Tab bar" },
  { value: "menu", label: "Alternative · Menu" },
];

/**
 * The toolbar above the phone frame is dev-only harness, not part of the
 * proposal itself — it exists so one route can show both candidate layouts
 * (LDS-036 acceptance criterion: "one recommended ... and at most one
 * alternative") and both themes without separate pages. Doesn't reuse
 * `components/theme-toggle.tsx`: that wrapper pads its children for a
 * normal docs page, which fights the phone frame's own full-height layout.
 */
export function PhoneShellDemo({
  items,
  activeSectionId,
  moduleIcon,
  moduleLabel,
  group,
  activePageId,
  initialTheme = "dark",
  children,
}: {
  items: MainRailItem[];
  activeSectionId: string;
  moduleIcon: ReactNode;
  moduleLabel: string;
  group: SubnavGroup;
  activePageId?: string;
  initialTheme?: "dark" | "light";
  children: ReactNode;
}) {
  const [layout, setLayout] = useState<PhoneShellLayout>("tabs");
  const [theme, setTheme] = useState<"dark" | "light">(initialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme === "light" ? "light" : "";
    return () => {
      delete document.documentElement.dataset.theme;
    };
  }, [theme]);

  return (
    <div className="flex h-screen flex-col bg-bg">
      <div className="flex shrink-0 flex-wrap items-center gap-8 border-b border-border-2 py-12 px-16">
        <span className="text-micro uppercase tracking-tight-6 text-mute">Layout</span>
        {LAYOUTS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            aria-pressed={layout === value}
            onClick={() => setLayout(value)}
            className={`rounded-ds border py-6 px-12 text-label uppercase tracking-tight-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
              layout === value ? "border-accent-line text-fg" : "border-border text-dim hover:text-fg"
            }`}
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
          className="ml-auto rounded-ds border border-border-2 py-6 px-12 text-label uppercase tracking-tight-6 text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          Theme: {theme}
        </button>
      </div>
      {/* min-height:0 inline — see the note atop components/phone-shell.tsx. */}
      <div className="flex-1" style={{ minHeight: 0 }}>
        <PhoneShell
          layout={layout}
          items={items}
          activeSectionId={activeSectionId}
          moduleIcon={moduleIcon}
          moduleLabel={moduleLabel}
          group={group}
          activePageId={activePageId}
        >
          {children}
        </PhoneShell>
      </div>
    </div>
  );
}
