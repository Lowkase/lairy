"use client";

import { icon, shell } from "@lairy/tokens";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../cn";
import { HeaderIdentityIcon } from "./header-icons";

export interface HeaderMenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  onSelect: () => void;
}

export interface HeaderProps {
  /** The selected top-level rail item's own glyph (anatomy #2) — never a
   * sub-page (Content rule 1). */
  moduleIcon: ReactNode;
  moduleLabel: string;
  moduleCode?: string;
  /** Pre-formatted by the caller (Content rule 2, "WED 23 AUG 2026"). */
  date: string;
  /** Pre-formatted, 24-hour with seconds (Content rule 3). */
  time: string;
  /** The operator's own name, for the identity square's accessible name
   * (Accessibility "Named identity control") — never shown as visible
   * text, initials or a count (Content rule 5). */
  identityLabel: string;
  identityStatus?: string;
  /** The shell's own theme toggle (LDS-035 acceptance criterion), surfaced
   * as the identity menu's Appearance control — the same place the
   * prototype's own operator menu puts it. */
  theme: "dark" | "light";
  onThemeChange: (theme: "dark" | "light") => void;
  /** Extra rows below Appearance (e.g. preferences, sign out) — optional;
   * the docs app itself passes none, having no operator account. */
  menuItems?: HeaderMenuItem[];
  /** Drops the date, clock and module code (Phone shell, LDS-037,
   * docs/prd.md §8.6) — the operator's own device already shows a clock,
   * and 390px has no room for both. The identity control stays in every
   * width: appearance must stay reachable (flagged undecided in LDS-036,
   * resolved here by keeping the one control that's already accessible
   * and tested, rather than inventing a second one). */
  compact?: boolean;
  /** An extra control rendered before the identity button — the phone
   * shell's own "Pages" trigger (LDS-037). Omitted at tablet and up. */
  trailingAction?: ReactNode;
  className?: string;
}

/**
 * The bar across the top naming the current module, with the date, clock
 * and identity mark (CONTEXT.md) — chrome, not content (boundary).
 */
export function Header({
  moduleIcon,
  moduleLabel,
  moduleCode,
  date,
  time,
  identityLabel,
  identityStatus,
  theme,
  onThemeChange,
  menuItems = [],
  compact = false,
  trailingAction,
  className,
}: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const panel = panelRef.current;
    const focusables = () =>
      panel ? Array.from(panel.querySelectorAll<HTMLElement>("button, [href]")) : [];
    focusables()[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    function onPointerDown(event: MouseEvent) {
      if (panel?.contains(event.target as Node) || triggerRef.current?.contains(event.target as Node)) return;
      setMenuOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [menuOpen]);

  return (
    <header
      data-slot="header"
      className={cn(
        "relative flex shrink-0 items-center justify-between gap-18 border-b border-border bg-bg/60 px-22 backdrop-blur-sm",
        className,
      )}
      style={{ height: shell.headerHeight }}
    >
      <div className="flex min-w-0 items-center gap-8">
        <span aria-hidden="true" className="flex shrink-0 items-center justify-center text-accent">
          {moduleIcon}
        </span>
        <span className="truncate font-heading text-label font-semibold tracking-tight-20 text-accent">
          {moduleLabel.toUpperCase()}
        </span>
        {!compact && moduleCode ? (
          <>
            <span aria-hidden="true" className="h-12 w-0 border-l border-accent-line" />
            <span className="whitespace-nowrap text-micro tracking-tight-14 text-dim">{moduleCode}</span>
          </>
        ) : null}
      </div>

      <div className="flex items-center gap-18">
        {!compact ? (
          <div className="flex items-center gap-8">
            <span className="whitespace-nowrap text-label tracking-tight-14 text-dim">{date}</span>
            <span aria-hidden="true" className="h-12 w-0 border-l border-border-2" />
            <span
              data-slot="header-time"
              className="whitespace-nowrap text-label tracking-tight-14 text-mute"
            >
              {time}
            </span>
          </div>
        ) : null}

        {trailingAction}

        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="true"
          aria-expanded={menuOpen}
          aria-label={identityStatus ? `${identityLabel}, ${identityStatus}` : identityLabel}
          onClick={() => setMenuOpen((open) => !open)}
          style={{ width: icon.glyphTile, height: icon.glyphTile }}
          className="relative flex shrink-0 items-center justify-center rounded-ds border border-border-2 text-fg transition-colors duration-160 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          <HeaderIdentityIcon />
          <span
            aria-hidden="true"
            className="absolute -bottom-2 -right-2 size-8 animate-pulse rounded-full border-2 border-bg bg-accent"
          />
        </button>

        {menuOpen ? (
          <div
            ref={panelRef}
            role="region"
            aria-label={`${identityLabel} menu`}
            className="absolute top-full right-18 z-20 mt-8 overflow-hidden rounded-ds border border-border-2 bg-bg shadow-menu"
          >
            <div className="flex items-center gap-12 border-b border-border p-16">
              <span className="flex size-32 shrink-0 items-center justify-center rounded-ds border border-border-2 text-fg">
                <HeaderIdentityIcon />
              </span>
              <div className="min-w-0">
                <div className="truncate text-body text-fg">{identityLabel}</div>
                {identityStatus ? (
                  <div className="truncate text-micro tracking-tight-10 text-mute">{identityStatus}</div>
                ) : null}
              </div>
            </div>

            <div className="border-b border-border p-16">
              <div className="mb-8 text-micro uppercase tracking-tight-16 text-mute">Appearance</div>
              <div className="grid grid-cols-2 gap-6">
                {(["dark", "light"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={theme === value}
                    onClick={() => {
                      onThemeChange(value);
                      setMenuOpen(false);
                      triggerRef.current?.focus();
                    }}
                    className={cn(
                      "rounded-ds border py-8 text-label uppercase tracking-tight-8 transition-colors duration-160 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line",
                      theme === value ? "border-accent-line text-fg" : "border-border text-dim hover:text-fg",
                    )}
                  >
                    {`Theme: ${value}`}
                  </button>
                ))}
              </div>
            </div>

            {menuItems.length > 0 ? (
              <div className="p-6">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      item.onSelect();
                      setMenuOpen(false);
                      triggerRef.current?.focus();
                    }}
                    className="flex w-full items-center gap-12 rounded-ds p-12 text-left text-body text-dim transition-colors duration-160 hover:bg-panel-2 hover:text-fg"
                  >
                    {item.icon ? (
                      <span className="flex size-16 shrink-0 items-center justify-center">{item.icon}</span>
                    ) : null}
                    {item.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </header>
  );
}
