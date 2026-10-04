"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { useId, useRef, useState } from "react";
import { cn } from "../cn";

export interface TabItem {
  /** What `value`/`defaultValue`/`onChange` read and write — names the view,
   * never the act (Content rule 2). */
  value: string;
  label: ReactNode;
  /** Shown in --faint after the label, allowed only when the number is the
   * view's whole point (Content rule 4) — never a coloured badge. */
  count?: number;
  /** The view itself (anatomy #5) — only the selected tab's panel renders. */
  panel: ReactNode;
}

export interface TabsProps {
  /** Accessible name for the tablist, needed only when more than one
   * tablist is on the page at once. */
  label?: string;
  /** The fixed set of readings, two to five (Rules "Two to five"). Order is
   * meaning — the default view comes first and the row never reorders
   * itself with use (Rules "Order is meaning"). */
  tabs: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  id?: string;
  className?: string;
}

/**
 * Switches between views of the page the operator is already on — same
 * route, same header, same object; only the panel changes. There is one
 * style, and it is the underline (Rules "Underline only").
 */
export function Tabs({ label, tabs, value, defaultValue, onChange, id, className }: TabsProps) {
  const generatedId = useId();
  const tabsId = id ?? generatedId;
  const [uncontrolledValue, setUncontrolledValue] = useState(() => defaultValue ?? tabs[0]?.value);
  const selected = value !== undefined ? value : uncontrolledValue;
  const activeTab = tabs.find((tab) => tab.value === selected) ?? tabs[0];
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  function select(next: string) {
    if (value === undefined) setUncontrolledValue(next);
    onChange?.(next);
  }

  function moveTo(index: number) {
    const next = tabs[(index + tabs.length) % tabs.length];
    if (!next) return;
    select(next.value);
    tabRefs.current[next.value]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        moveTo(index + 1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        moveTo(index - 1);
        break;
      case "Home":
        event.preventDefault();
        moveTo(0);
        break;
      case "End":
        event.preventDefault();
        moveTo(tabs.length - 1);
        break;
      default:
        break;
    }
  }

  return (
    <div data-slot="tabs" id={tabsId} className={className}>
      <div role="tablist" aria-label={label} data-slot="tabs-list" className="flex gap-8 border-b border-border">
        {tabs.map((tab, index) => {
          const isSelected = tab.value === activeTab?.value;
          const tabId = `${tabsId}-tab-${tab.value}`;
          const panelId = `${tabsId}-panel-${tab.value}`;
          return (
            <button
              key={tab.value}
              ref={(node) => {
                tabRefs.current[tab.value] = node;
              }}
              type="button"
              role="tab"
              id={tabId}
              data-slot="tab"
              aria-selected={isSelected}
              aria-controls={panelId}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => select(tab.value)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                "-mb-px flex items-center gap-6 rounded-ds border-b-2 py-8 px-12 font-body text-label uppercase tracking-tight-14 transition-colors duration-160 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                isSelected ? "border-accent text-fg" : "border-transparent text-mute hover:text-fg",
              )}
            >
              {tab.label}
              {tab.count != null ? (
                <>
                  {" "}
                  <span className="text-faint">{tab.count}</span>
                </>
              ) : null}
            </button>
          );
        })}
      </div>
      {activeTab ? (
        <div
          role="tabpanel"
          id={`${tabsId}-panel-${activeTab.value}`}
          aria-labelledby={`${tabsId}-tab-${activeTab.value}`}
          tabIndex={0}
          data-slot="tabs-panel"
          className="border border-t-0 border-border bg-panel-2 p-16 text-small text-mute"
        >
          {activeTab.panel}
        </div>
      ) : null}
    </div>
  );
}
