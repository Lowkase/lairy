"use client";

import { shell } from "@lairy/tokens";
import type { MainRailItem, SubnavGroup } from "@lairy/ui";
import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";

// `min-h-0`, `min-w-0`, `inset-0` and the bare `-0` offsets below are set
// via inline style, not their Tailwind class: this repo's theme resets
// `--spacing-*: initial` (ADR-0003/ADR-0004, tailwind-theme.css) and
// replaces it with a fixed ramp starting at 4px (packages/tokens/tokens/
// spacing.json has no 0 step), which silently drops every utility that
// resolves its "0" through that scale — confirmed absent from a production
// build (`apps/docs/.next/static/chunks/*.css` has no `.min-h-0`, `.min-w-0`
// or `.inset-0` rule, even though several shipped components use them:
// Shell, MainRail, Subnav, Header, Table...). Flagged as its own
// needs-triage issue (found during LDS-036) rather than fixed here, since
// the fix reaches into already-locked components this ticket doesn't own.

export type PhoneShellLayout = "tabs" | "menu";

export interface PhoneShellProps {
  /** Which of the two proposed layouts to render (LDS-036 — at most one
   * alternative to the recommendation). */
  layout: PhoneShellLayout;
  /** The main rail's fixed item set, same data the desktop Shell uses
   * (apps/docs/lib/shell-nav.tsx) — kept real so the links actually go
   * somewhere, not a mock. */
  items: MainRailItem[];
  /** The section being demonstrated, so its own subnav group is reachable. */
  activeSectionId: string;
  moduleIcon: ReactNode;
  moduleLabel: string;
  group: SubnavGroup;
  /** The subnav page treated as "current" for this demo, so the active-page
   * marker has something to point at. */
  activePageId?: string;
  children: ReactNode;
}

/**
 * Traps Tab inside `panelRef`, closes on Escape, and returns focus to
 * `triggerRef` on close — the same behaviour Header's own menu implements
 * inline (packages/ui/src/header/header.tsx), repeated here for the two
 * full-screen nav overlays below rather than factored out, since nothing
 * else in this proposal needs a third copy.
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

function SubnavPagesList({ group, activePageId }: { group: SubnavGroup; activePageId?: string }) {
  return (
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
                className="absolute top-1/2 h-16 -translate-y-1/2 border-l-2 border-accent"
                style={{ left: 0, width: 0 }}
              />
            ) : null}
            {page.label}
          </a>
        );
      })}
    </div>
  );
}

function OverlayPanel({
  label,
  panelRef,
  onClose,
  children,
}: {
  label: string;
  panelRef: RefObject<HTMLDivElement | null>;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="animate-panel-in fixed z-20 flex flex-col bg-bg"
      style={{ inset: 0 }}
    >
      <div
        className="flex shrink-0 items-center justify-between gap-12 border-b border-border px-16"
        style={{ minHeight: shell.headerHeight, paddingTop: "env(safe-area-inset-top)" }}
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
      <nav aria-label={label} className="flex-1 overflow-y-auto p-12" style={{ minHeight: 0 }}>
        {children}
      </nav>
    </div>
  );
}

/**
 * The phone shell proposal (LDS-036, docs/prd.md §8.6 D19). Two full
 * layouts behind one `layout` prop, each covering the same four parts —
 * main rail, subnav rail, header, content — reshaped for a 390px viewport
 * instead of the desktop Shell's three fixed-width columns
 * (apps/docs/components/shell.tsx), which has no room to spare below
 * tablet width.
 *
 * Deliberately self-contained: it does not touch Shell, Header, MainRail or
 * Subnav. Those are shipped, screenshotted components; this is a proposal
 * for Cory to react to before any of them grow phone-specific behaviour.
 */
export function PhoneShell({
  layout,
  items,
  activeSectionId,
  moduleIcon,
  moduleLabel,
  group,
  activePageId,
  children,
}: PhoneShellProps) {
  const [subnavOpen, setSubnavOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const subnavTriggerRef = useRef<HTMLButtonElement>(null);
  const subnavPanelRef = useRef<HTMLDivElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);

  useOverlayFocusTrap(subnavOpen, subnavPanelRef, subnavTriggerRef, () => setSubnavOpen(false));
  useOverlayFocusTrap(menuOpen, menuPanelRef, menuTriggerRef, () => setMenuOpen(false));

  return (
    <div className="flex h-full flex-col bg-bg">
      <header
        data-slot="phone-header"
        className="flex shrink-0 items-center justify-between gap-12 border-b border-border bg-bg/60 px-16 backdrop-blur-sm"
        style={{ minHeight: shell.headerHeight, paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="flex items-center gap-8" style={{ minWidth: 0 }}>
          <span aria-hidden="true" className="flex shrink-0 items-center justify-center text-accent">
            {moduleIcon}
          </span>
          <span className="truncate font-heading text-label font-semibold tracking-tight-20 text-fg">
            {moduleLabel.toUpperCase()}
          </span>
        </div>

        {layout === "tabs" ? (
          <button
            ref={subnavTriggerRef}
            type="button"
            aria-haspopup="dialog"
            aria-expanded={subnavOpen}
            onClick={() => setSubnavOpen(true)}
            className="min-h-44 shrink-0 rounded-ds border border-border-2 py-8 px-16 text-label uppercase tracking-tight-8 text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            Pages
          </button>
        ) : (
          <button
            ref={menuTriggerRef}
            type="button"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
            className="min-h-44 shrink-0 rounded-ds border border-border-2 py-8 px-16 text-label uppercase tracking-tight-8 text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            Menu
          </button>
        )}
      </header>

      {layout === "tabs" ? (
        <>
          <main className="order-1 flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
            <div className="py-16 px-16">{children}</div>
          </main>
          <nav
            aria-label="Main"
            className="order-2 flex shrink-0 border-t border-border bg-bg"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <ul className="flex w-full">
              {items.map((item) => {
                const isActive = item.id === activeSectionId;
                return (
                  <li key={item.id} className="flex-1">
                    <a
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex min-h-44 flex-col items-center justify-center gap-4 py-8 transition-colors duration-160 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
                        isActive ? "text-fg" : "text-dim"
                      }`}
                    >
                      <span className="flex size-22 shrink-0 items-center justify-center">{item.icon}</span>
                      <span className="text-micro tracking-tight-6">{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </>
      ) : (
        <main className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
          <div className="py-16 px-16">{children}</div>
        </main>
      )}

      {layout === "tabs" && subnavOpen ? (
        <OverlayPanel label={`${moduleLabel} pages`} panelRef={subnavPanelRef} onClose={() => setSubnavOpen(false)}>
          <SubnavPagesList group={group} activePageId={activePageId} />
        </OverlayPanel>
      ) : null}

      {layout === "menu" && menuOpen ? (
        <OverlayPanel label="Menu" panelRef={menuPanelRef} onClose={() => setMenuOpen(false)}>
          <div className="flex flex-col gap-4 border-b border-border pb-12">
            <div className="py-8 px-4 text-label uppercase tracking-tight-14 text-dim">Sections</div>
            {items.map((item) => {
              const isActive = item.id === activeSectionId;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative flex min-h-44 items-center gap-12 rounded-ds py-8 px-12 text-body transition-colors duration-160 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
                    isActive ? "bg-panel-2 text-fg" : "text-mute hover:bg-panel-2 hover:text-fg"
                  }`}
                >
                  {isActive ? (
                    <span
                      aria-hidden="true"
                      className="absolute top-1/2 h-16 -translate-y-1/2 border-l-2 border-accent"
                      style={{ left: 0, width: 0 }}
                    />
                  ) : null}
                  <span className="flex size-22 shrink-0 items-center justify-center">{item.icon}</span>
                  {item.label}
                </a>
              );
            })}
          </div>
          <div className="pt-12">
            <SubnavPagesList group={group} activePageId={activePageId} />
          </div>
        </OverlayPanel>
      ) : null}
    </div>
  );
}
