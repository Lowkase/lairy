"use client";

import { Header, MainRail, Subnav, type MainRailItem, type SubnavGroup } from "@lairy/ui";
import { useEffect, useState, type ReactNode } from "react";

export type ShellSection = "foundations" | "components" | "patterns";

function formatDate(d: Date): string {
  return d
    .toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
    .toUpperCase()
    .replace(/,/g, "");
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
}

/** A live, ticking clock (Content rule 3, "seconds are what make it read
 * as a live instrument"). Not a live region (Accessibility "Quiet
 * clock") — plain text re-rendered once a second. Starts `null` and fills
 * in after mount, so server and client render the same markup first paint
 * (a live clock can never match between server render and hydration). */
function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export interface ShellProps {
  children: ReactNode;
  section: ShellSection;
  moduleIcon: ReactNode;
  moduleLabel: string;
  moduleCode: string;
  /** The main rail's fixed item set, resolved server-side
   * (apps/docs/lib/shell-nav.tsx) — the Shell itself never imports
   * `@lairy/content` (see shell-nav.tsx's own comment for why). */
  items: MainRailItem[];
  /** The active section's own subnav group, resolved server-side. */
  group: SubnavGroup;
  /** The current entry's id, for the active marker in both rails
   * (main-rail.ts Accessibility "Current page", subnav.ts the same). */
  activeId?: string;
  /** Forces the starting theme (e.g. from a `?theme=` search param) — the
   * /dev/compare/[entry] route (LDS-016) loads a page in an iframe per
   * theme and needs each frame to start in the right one. Mirrors
   * ThemeToggle's own `initialTheme` prop. */
  initialTheme?: "dark" | "light";
}

/**
 * The persistent chrome around every view (CONTEXT.md "Shell"): main
 * rail, subnav rail and header. Used by the docs app's own
 * `/foundations/[id]`, `/components/[id]` and `/patterns/[id]` routes
 * (LDS-035, Desktop shell).
 */
export function Shell({
  children,
  section,
  moduleIcon,
  moduleLabel,
  moduleCode,
  items,
  group,
  activeId,
  initialTheme = "dark",
}: ShellProps) {
  const [theme, setTheme] = useState<"dark" | "light">(initialTheme);
  const [collapsed, setCollapsed] = useState(false);
  const [subnavHidden, setSubnavHidden] = useState(false);
  const now = useClock();

  useEffect(() => {
    document.documentElement.dataset.theme = theme === "light" ? "light" : "";
    return () => {
      delete document.documentElement.dataset.theme;
    };
  }, [theme]);

  return (
    <div className="flex h-screen flex-col bg-bg">
      <Header
        moduleIcon={moduleIcon}
        moduleLabel={moduleLabel}
        moduleCode={moduleCode}
        date={now ? formatDate(now) : ""}
        time={now ? formatTime(now) : ""}
        identityLabel="Appearance"
        theme={theme}
        onThemeChange={setTheme}
      />
      <div className="flex min-h-0 flex-1">
        <MainRail items={items} activeId={section} collapsed={collapsed} onCollapsedChange={setCollapsed} />
        <Subnav
          label={moduleLabel}
          groups={[group]}
          activeId={activeId}
          defaultExpandedId={group.id}
          hidden={subnavHidden}
          onHiddenChange={setSubnavHidden}
        />
        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="py-32 px-18">{children}</div>
        </main>
      </div>
    </div>
  );
}
