"use client";

import { icon, shell } from "@lairy/tokens";
import { useState } from "react";
import { cn } from "../cn";

export interface SubnavPage {
  id: string;
  /** Sentence case, names the thing not the act (Content rule 2). */
  label: string;
  href: string;
}

export interface SubnavGroup {
  id: string;
  /** Uppercase, one or two words (Content rule 1). */
  label: string;
  /** Present only where it is true (anatomy #3) — omit for a section with
   * no children. */
  count?: number;
  pages: SubnavPage[];
}

export interface SubnavProps {
  /** Labels the nav landmark with the workspace name (Accessibility "Nav
   * landmark, per workspace"). */
  label: string;
  groups: SubnavGroup[];
  activeId?: string;
  /** Two levels, one open (Rules "Two levels, one open") — which group is
   * expanded is this component's own disclosure state, not the caller's. */
  defaultExpandedId?: string;
  /** Sticky, never fixed (Rules "Sticky, never fixed") — hiding the column
   * reclaims its width for the content; it never overlays it. Controlled:
   * the column holds no hidden state of its own. */
  hidden: boolean;
  onHiddenChange: (hidden: boolean) => void;
  className?: string;
}

const STUB_WIDTH = Number.parseFloat(icon.glyphRail);
const STUB_HEIGHT = Number.parseFloat(icon.glyphTile);

/**
 * The column of pages inside one workspace, docked to the right of the
 * main rail — the one navigation that changes with the route (purpose).
 * There is no third level (variantsNote): a page that needs children has
 * outgrown the subnav.
 */
export function Subnav({
  label,
  groups,
  activeId,
  defaultExpandedId,
  hidden,
  onHiddenChange,
  className,
}: SubnavProps) {
  const [expandedId, setExpandedId] = useState<string | undefined>(
    () => defaultExpandedId ?? groups.find((g) => g.pages.some((p) => p.id === activeId))?.id ?? groups[0]?.id,
  );

  if (hidden) {
    return (
      <button
        type="button"
        onClick={() => onHiddenChange(false)}
        title="Show pages"
        className={cn(
          "flex shrink-0 items-center justify-center border-y border-r border-border bg-panel text-mute transition-colors duration-160 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          className,
        )}
        style={{ width: STUB_WIDTH, height: STUB_HEIGHT }}
      >
        <span aria-hidden="true" className="text-label">
          ›
        </span>
        <span className="sr-only">Show pages</span>
      </button>
    );
  }

  return (
    <div
      data-slot="subnav"
      className={cn("flex h-full flex-col overflow-hidden border-r border-border bg-panel", className)}
      style={{ width: shell.subnavWidth }}
    >
      <nav aria-label={label} className="flex min-h-0 flex-1 flex-col overflow-y-auto p-12">
        {groups.map((group) => {
          const isExpanded = group.id === expandedId;
          const hasActive = group.pages.some((p) => p.id === activeId);
          return (
            <div key={group.id} className="flex flex-col">
              <button
                type="button"
                aria-expanded={isExpanded}
                onClick={() => setExpandedId(isExpanded ? undefined : group.id)}
                className={cn(
                  "relative flex items-center justify-between gap-12 rounded-ds py-8 px-12 text-label tracking-tight-14 uppercase transition-colors duration-160 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                  hasActive ? "text-fg" : "text-dim hover:bg-panel-2 hover:text-fg",
                )}
              >
                {hasActive ? (
                  <span aria-hidden="true" className="absolute left-0 top-6 bottom-6 w-0 border-l-2 border-accent" />
                ) : null}
                <span className="truncate">{group.label}</span>
                {group.count != null ? <span className="text-faint">{group.count}</span> : null}
              </button>
              {isExpanded ? (
                <div className="mt-4 mb-6 ml-12 flex flex-col gap-4 border-l border-border pl-12">
                  {group.pages.map((page) => {
                    const isActive = page.id === activeId;
                    return (
                      <a
                        key={page.id}
                        href={page.href}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "relative rounded-ds py-8 px-12 text-small transition-colors duration-160 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                          isActive ? "bg-panel-2 text-fg" : "text-mute hover:bg-panel-2 hover:text-fg",
                        )}
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
              ) : null}
            </div>
          );
        })}
      </nav>
      <button
        type="button"
        onClick={() => onHiddenChange(true)}
        className="flex shrink-0 items-center gap-8 border-t border-border py-12 px-12 text-micro tracking-tight-16 uppercase text-mute transition-colors duration-160 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        <span aria-hidden="true">‹</span> Hide
      </button>
    </div>
  );
}
