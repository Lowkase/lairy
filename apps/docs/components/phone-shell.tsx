"use client";

import type { MainRailItem, SubnavGroup } from "@lairy/ui";
import { useEffect, useRef, type RefObject } from "react";

/**
 * Traps Tab inside `panelRef`, closes on Escape, and returns focus to
 * `triggerRef` on close — the same behaviour Header's own identity menu
 * implements inline (packages/ui/src/header/header.tsx), repeated here for
 * the phone shell's own full-screen Pages overlay rather than factored out
 * across packages, since nothing else needs a third copy (LDS-036).
 */
function useOverlayFocusTrap(
  open: boolean,
  panelRef: RefObject<HTMLDivElement | null>,
  triggerRef: RefObject<HTMLButtonElement | null>,
  onClose: () => void,
) {
  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const focusables = () =>
      panel ? Array.from(panel.querySelectorAll<HTMLElement>("button, [href]")) : [];
    focusables()[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
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

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, panelRef, triggerRef, onClose]);
}

export interface PhoneTabBarProps {
  /** The main rail's fixed item set, the same data the desktop MainRail
   * uses (apps/docs/lib/shell-nav.tsx) — kept real so the links go
   * somewhere, not a mock. */
  items: MainRailItem[];
  activeId?: string;
}

/**
 * The phone shell's main navigation (LDS-037, the approved layout from
 * LDS-036): a persistent bottom tab bar standing in for the desktop
 * MainRail below tablet width — one tap per section, mirroring the rail's
 * own "never changes" role (CONTEXT.md "Main rail"). A sibling of
 * `<main>` in Shell's own flex column, not `position: fixed` — it owns a
 * real row in the layout, so content never needs bottom padding to clear
 * it.
 */
export function PhoneTabBar({ items, activeId }: PhoneTabBarProps) {
  return (
    <nav
      aria-label="Main"
      className="flex shrink-0 border-t border-border bg-bg tablet:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="flex w-full">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id} className="flex-1">
              <a
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-44 flex-col items-center justify-center gap-4 py-8 transition-colors duration-160 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
                  isActive ? "text-fg" : "text-dim"
                }`}
              >
                <span className="flex size-22 shrink-0 items-center justify-center">
                  {item.icon}
                </span>
                <span className="text-micro tracking-tight-6">{item.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export interface PhonePagesOverlayProps {
  /** The overlay's own accessible name (Accessibility "Nav landmark, per
   * workspace") — distinct from the desktop Subnav's own `label` so the
   * two never collide if ever queried together. */
  label: string;
  group: SubnavGroup;
  activePageId?: string;
  onClose: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}

/**
 * The phone shell's reach to subnav pages (LDS-037): a full-screen overlay
 * opened by the header's "Pages" trigger, scoped to the active section's
 * own pages — the same scope as the desktop Subnav column it replaces
 * below tablet width.
 */
export function PhonePagesOverlay({
  label,
  group,
  activePageId,
  onClose,
  triggerRef,
}: PhonePagesOverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useOverlayFocusTrap(true, panelRef, triggerRef, onClose);

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="animate-panel-in fixed inset-0 z-20 flex flex-col bg-bg"
    >
      <div
        className="flex shrink-0 items-center justify-between gap-12 border-b border-border px-16"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <span className="text-label uppercase tracking-tight-14 text-dim">{label}</span>
        <button
          type="button"
          onClick={onClose}
          className="min-h-44 rounded-ds border border-border-2 py-8 px-16 text-label uppercase tracking-tight-8 text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          Close
        </button>
      </div>
      <nav aria-label={label} className="min-h-0 flex-1 overflow-y-auto p-12">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-12 py-8 px-4 text-label uppercase tracking-tight-14 text-dim">
            <span className="truncate">{group.label}</span>
            {group.count != null ? <span className="text-faint">{group.count}</span> : null}
          </div>
          {group.pages.map((page) => {
            const isActive = page.id === activePageId;
            return (
              <a
                key={page.id}
                href={page.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex min-h-44 items-center rounded-ds py-8 px-12 text-body transition-colors duration-160 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
                  isActive ? "bg-panel-2 text-fg" : "text-mute hover:bg-panel-2 hover:text-fg"
                }`}
              >
                {isActive ? (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-1/2 h-16 w-0 -translate-y-1/2 border-l-2 border-accent"
                  />
                ) : null}
                {page.label}
              </a>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
