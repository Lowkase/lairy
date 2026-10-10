"use client";

import { shell } from "@lairy/tokens";
import type { ReactElement, ReactNode } from "react";
import { cn } from "../cn";
import { InlineIcon } from "../icons/inline-icon";
import { Tooltip } from "../tooltip/tooltip";
import { MainRailMark } from "./main-rail-mark";

export interface MainRailItem {
  /** What `activeId` compares against — never the label (Content rule 4,
   * "the label in the rail matches the page title it opens, word for
   * word", so the id is the stable key, not the renamed-in-place text). */
  id: string;
  /** A noun, never a verb (Content rule 2). */
  label: string;
  /** Rendered at the rail's own 22px icon box regardless of size — pass an
   * icon already sized for that box (e.g. `<Glyph name="book" size="rail"
   * />`). */
  icon: ReactNode;
  href: string;
}

export interface MainRailProps {
  /** Order is fixed (mainNavRules "Order is fixed") — the rail never
   * reorders itself; callers own the order they pass. */
  items: MainRailItem[];
  activeId?: string;
  /** Two widths only (Rules "Two widths") — expanded (icon + label) or
   * collapsed (icon only). Controlled: the rail holds no width state of
   * its own. */
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  /** The way back to the launcher (anatomy #6, "Brand lockup"). */
  brandHref?: string;
  brandLabel?: string;
  /** The nav landmark's accessible name (Accessibility "Nav landmark").
   * Override when more than one instance renders on the same page (e.g. a
   * live specimen on this entry's own docs page, alongside the real
   * shell) so the two landmarks stay distinguishable. */
  navLabel?: string;
  className?: string;
}

/** Names an icon-only control while the rail is collapsed — the label is
 * `sr-only` there, so the Tooltip is how a sighted operator learns it. It
 * stays mounted when expanded (disabled) so toggling the rail never remounts
 * the control, which would drop its keyboard focus. */
function RailTooltip({
  label,
  collapsed,
  children,
}: {
  label: string;
  collapsed: boolean;
  children: ReactElement<Record<string, unknown>>;
}) {
  return (
    <Tooltip content={label} side="right" disabled={!collapsed} className="flex w-full">
      {children}
    </Tooltip>
  );
}

/**
 * The full-height column on the left that moves the operator between
 * workspaces — the one navigation in the product that never changes
 * (purpose). One level, never nests (Rules "One level").
 */
export function MainRail({
  items,
  activeId,
  collapsed,
  onCollapsedChange,
  brandHref = "/",
  brandLabel = "Lairy",
  navLabel = "Main",
  className,
}: MainRailProps) {
  return (
    <div
      data-slot="main-rail"
      className={cn("flex h-full flex-col overflow-hidden border-r border-border bg-bg", className)}
      style={{ width: collapsed ? shell.railWidthCollapsed : shell.railWidth }}
    >
      <nav aria-label={navLabel} className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <a
          href={brandHref}
          className="flex shrink-0 items-center gap-12 border-b border-border px-18 text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          style={{ height: shell.headerHeight }}
        >
          <span className="flex shrink-0 items-center justify-center">
            <MainRailMark />
          </span>
          <span
            className={cn(
              "truncate font-heading text-label font-semibold tracking-tight-20",
              collapsed && "sr-only",
            )}
          >
            {brandLabel.toUpperCase()}
          </span>
        </a>

        <ul className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-8">
          {items.map((item) => {
            const isActive = item.id === activeId;
            return (
              <li key={item.id}>
                <RailTooltip label={item.label} collapsed={collapsed}>
                  <a
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "relative flex w-full items-center gap-12 rounded-ds px-8 py-8 text-fg transition-colors duration-160 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                      !isActive && "hover:bg-panel-2",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute left-0 top-1/2 h-16 w-0 -translate-y-1/2 border-l-2",
                        isActive ? "border-accent" : "border-transparent",
                      )}
                    />
                    <span className="flex size-22 shrink-0 items-center justify-center">
                      {item.icon}
                    </span>
                    <span
                      className={cn(
                        "truncate text-label tracking-tight-8",
                        isActive && "text-accent",
                        collapsed && "sr-only",
                      )}
                    >
                      {item.label}
                    </span>
                  </a>
                </RailTooltip>
              </li>
            );
          })}
        </ul>

        <div className="mx-8 mb-8 flex shrink-0">
          <RailTooltip label="Expand" collapsed={collapsed}>
            <button
              type="button"
              onClick={() => onCollapsedChange(!collapsed)}
              className="flex w-full shrink-0 items-center gap-12 rounded-ds px-8 py-8 text-dim transition-colors duration-160 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <span className="flex size-22 shrink-0 items-center justify-center">
                <InlineIcon name="arrow" className={collapsed ? "-scale-x-100" : undefined} />
              </span>
              <span className={cn("text-label tracking-tight-8", collapsed && "sr-only")}>
                {collapsed ? "Expand" : "Collapse"}
              </span>
            </button>
          </RailTooltip>
        </div>
      </nav>
    </div>
  );
}
