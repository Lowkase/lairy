"use client";

import { space } from "@lairy/tokens";
import type { CSSProperties, KeyboardEvent, ReactNode, RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "../cn";
import { TableRowIcon, type TableRowIconName } from "./table-icons";

export interface TableColumn<Row> {
  key: string;
  header: string;
  align?: "right";
  /** A CSS grid track size ("120px", "minmax(160px,1fr)", …) for this
   * column's own content — the operator's data decides how wide an id or a
   * timestamp needs to be, which is not a design-system size (AGENTS.md
   * rule 1 governs the component's own tokens, not a consumer's column
   * widths; see table.ts's extractionNotes). Defaults to a flexible track
   * that shares the remaining space evenly. */
  width?: string;
  render: (row: Row) => ReactNode;
}

export interface TableRowAction<Row> {
  key: string;
  label: string;
  icon: TableRowIconName;
  onAction: (row: Row) => void;
  /** The two or three frequent verbs render inline as icons (anatomy #5);
   * everything else sits in the row's own overflow menu. */
  overflowOnly?: boolean;
  /** Below the menu's own DESTRUCTIVE divider (anatomy #5). Never renders
   * inline — a destructive verb always sits in the overflow menu. */
  destructive?: boolean;
}

export interface TableBulkAction {
  key: string;
  label: string;
  icon: TableRowIconName;
  onAction: (selectedIds: string[]) => void;
  destructive?: boolean;
}

export interface TableProps<Row> {
  /** Accessible name for the grid. */
  label: string;
  columns: TableColumn<Row>[];
  rows: Row[];
  getRowId: (row: Row) => string;
  /** Names a row for its checkbox's own accessible name ("Select {label}").
   * Defaults to the row's id. */
  getRowLabel?: (row: Row) => string;
  /** Reserved whether or not a row has any (anatomy #5) — the column never
   * appears or disappears with content. */
  rowActions?: TableRowAction<Row>[];
  /** The toolbar's selection-state verbs (Zones "Toolbar — selection").
   * Omit entirely for a table with no bulk actions. */
  bulkActions?: TableBulkAction[];
  /** Whether rows can be selected at all (Zones, anatomy #2). A table with
   * nothing to bulk-act on can turn this off and drop the toolbar and
   * select column entirely. */
  selectable?: boolean;
  /** The idle toolbar's row count, e.g. "214 RUNS" (Zones "Toolbar —
   * idle"). */
  countLabel?: ReactNode;
  /** The idle toolbar's trailing actions — EXPORT, the one primary CREATE
   * (Zones "Toolbar — idle"). What a table creates or exports is the
   * consuming app's own business, not this component's. */
  toolbarActions?: ReactNode;
  selected?: string[];
  defaultSelected?: string[];
  onSelectedChange?: (ids: string[]) => void;
  className?: string;
}

const ACTION_BOX = Number.parseFloat(space["32"]);
const ACTION_GAP = Number.parseFloat(space["4"]);
const SELECT_COLUMN = space["32"];

function RowCheckbox({
  checked,
  indeterminate = false,
  label,
  onChange,
}: {
  checked: boolean;
  indeterminate?: boolean;
  label: string;
  onChange: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const marked = checked || indeterminate;

  return (
    <label className="flex cursor-pointer items-center justify-center">
      <input
        ref={inputRef}
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        aria-label={label}
        onChange={onChange}
      />
      <span
        aria-hidden="true"
        className={cn(
          "flex size-18 shrink-0 items-center justify-center rounded-ds border text-bg transition-colors peer-hover:border-fg peer-focus-visible:border-accent-2-line peer-focus-visible:ring-2 peer-focus-visible:ring-accent-2-soft peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-bg",
          marked ? "border-accent-2 bg-accent-2" : "border-border-2 bg-transparent",
        )}
      >
        {marked ? (
          <svg
            width={12}
            height={12}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {indeterminate ? <path d="M6 12h12" /> : <path d="M20 6 9 17l-5-5" />}
          </svg>
        ) : null}
      </span>
    </label>
  );
}

function RowMenu<Row>({
  row,
  actions,
  open,
  onOpenChange,
  triggerRef,
}: {
  row: Row;
  actions: TableRowAction<Row>[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!open) return;
    itemRefs.current[0]?.focus();

    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (menuRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      onOpenChange(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open, onOpenChange, triggerRef]);

  if (!open) return null;

  // Portalled to the body and positioned from the trigger's own rect
  // (computed fresh on every open render, rather than an ordinary
  // `absolute` child of the row) so the menu can escape the grid's own
  // `overflow-x-auto` wrapper — a CSS limitation, not a choice: a
  // non-`visible` `overflow-x` forces `overflow-y` to clip too (the UA
  // "overflow computed value" fixup), so any row near the scrolled-right
  // edge would otherwise have its own menu cut off. Not tracked across
  // scroll/resize while open — flagged as a scope cut below.
  const rect = triggerRef.current?.getBoundingClientRect();
  if (!rect) return null;

  function close() {
    onOpenChange(false);
    triggerRef.current?.focus();
  }

  function moveFocus(from: number, delta: number) {
    const count = actions.length;
    const next = (from + delta + count) % count;
    itemRefs.current[next]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveFocus(index, 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveFocus(index, -1);
        break;
      case "Tab":
        // Trapped (AGENTS.md rule 7): Tab/Shift+Tab cycle the menu's own
        // items instead of leaving it for whatever the page renders next.
        event.preventDefault();
        moveFocus(index, event.shiftKey ? -1 : 1);
        break;
      case "Home":
        event.preventDefault();
        itemRefs.current[0]?.focus();
        break;
      case "End":
        event.preventDefault();
        itemRefs.current[actions.length - 1]?.focus();
        break;
      case "Escape":
        event.preventDefault();
        close();
        break;
      default:
        break;
    }
  }

  const regular = actions.filter((a) => !a.destructive);
  const destructive = actions.filter((a) => a.destructive);
  let cursor = 0;

  function renderItem(action: TableRowAction<Row>) {
    const index = cursor++;
    return (
      <button
        key={action.key}
        ref={(node) => {
          itemRefs.current[index] = node;
        }}
        type="button"
        role="menuitem"
        tabIndex={-1}
        onClick={() => {
          action.onAction(row);
          close();
        }}
        onKeyDown={(event) => handleKeyDown(event, index)}
        className={cn(
          "flex w-full items-center gap-8 rounded-ds px-12 py-8 text-left font-body text-small transition-colors",
          action.destructive ? "text-fg hover:bg-alarm-soft" : "text-dim hover:bg-panel-2",
        )}
      >
        <TableRowIcon name={action.icon} />
        {action.label}
      </button>
    );
  }

  const style: CSSProperties = {
    position: "fixed",
    top: rect.bottom + 6,
    right: window.innerWidth - rect.right,
  };

  return createPortal(
    <div
      ref={menuRef}
      role="menu"
      aria-label="Row actions"
      style={style}
      className="z-20 min-w-44 animate-panel-in whitespace-nowrap rounded-ds border border-border-2 bg-bg p-6 shadow-menu"
    >
      {regular.map(renderItem)}
      {destructive.length > 0 ? (
        <>
          <div className="mx-4 my-6 border-t border-border" />
          <div className="px-12 py-4 font-body text-micro uppercase tracking-tight-16 text-faint">
            Destructive
          </div>
          {destructive.map(renderItem)}
        </>
      ) : null}
    </div>,
    document.body,
  );
}

/**
 * A list of records the operator works on, not a grid of numbers they read
 * (purpose). Rows are selectable, actions live on the row and in a toolbar
 * that swaps when a selection exists, and the columns are the few facts
 * needed to decide which row to act on.
 */
export function Table<Row>({
  label,
  columns,
  rows,
  getRowId,
  getRowLabel,
  rowActions = [],
  bulkActions = [],
  selectable = true,
  countLabel,
  toolbarActions,
  selected,
  defaultSelected,
  onSelectedChange,
  className,
}: TableProps<Row>) {
  const [uncontrolledSelected, setUncontrolledSelected] = useState<string[]>(defaultSelected ?? []);
  const selectedIds = selected !== undefined ? selected : uncontrolledSelected;
  const selectedSet = new Set(selectedIds);
  const [openMenuRowId, setOpenMenuRowId] = useState<string | null>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  function setSelected(next: string[]) {
    if (selected === undefined) setUncontrolledSelected(next);
    onSelectedChange?.(next);
  }

  function toggleRow(id: string) {
    setSelected(selectedSet.has(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]);
  }

  function toggleAll() {
    setSelected(selectedSet.size === rows.length ? [] : rows.map(getRowId));
  }

  const allSelected = rows.length > 0 && selectedSet.size === rows.length;
  const someSelected = selectedSet.size > 0 && !allSelected;
  const hasSelection = selectable && selectedSet.size > 0;

  const inlineActions = rowActions.filter((a) => !a.overflowOnly);
  const overflowActions = rowActions.filter((a) => a.overflowOnly);
  const actionSlots = inlineActions.length + (overflowActions.length > 0 ? 1 : 0);
  const actionsWidth =
    actionSlots > 0 ? actionSlots * ACTION_BOX + Math.max(0, actionSlots - 1) * ACTION_GAP : 0;

  const gridTemplate = [
    selectable ? SELECT_COLUMN : null,
    ...columns.map((c) => c.width ?? "minmax(160px,1fr)"),
    actionSlots > 0 ? `${actionsWidth}px` : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div data-slot="table" className={cn("border border-border bg-panel", className)}>
      {selectable ? (
        <div className="flex min-h-44 items-center justify-between gap-16 border-b border-border bg-panel-2 py-12 px-18">
          {hasSelection ? (
            <div className="flex flex-1 items-center gap-16">
              <span
                role="status"
                aria-live="polite"
                className="flex items-center gap-8 rounded-chip border border-accent-2-line bg-accent-2-soft py-6 px-12"
              >
                <span className="size-6 rounded-full bg-accent-2" aria-hidden="true" />
                <span className="font-body text-label tracking-tight-10 text-accent-2">
                  {selectedSet.size} selected
                </span>
              </span>
              <div className="flex items-center gap-8">
                {bulkActions.map((action) => (
                  <button
                    key={action.key}
                    type="button"
                    onClick={() => action.onAction(Array.from(selectedSet))}
                    className={cn(
                      "flex items-center gap-6 rounded-ds border py-8 px-12 font-body text-label uppercase tracking-tight-8",
                      action.destructive
                        ? "border-alarm-line text-fg hover:bg-alarm-soft"
                        : "border-border-2 text-fg hover:bg-panel",
                    )}
                  >
                    <TableRowIcon name={action.icon} />
                    {action.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setSelected([])}
                className="ml-auto font-body text-label tracking-tight-10 text-mute underline underline-offset-4 hover:text-fg"
              >
                Clear
              </button>
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-between gap-16">
              <span className="font-body text-label tracking-tight-14 text-mute">{countLabel}</span>
              {toolbarActions ? (
                <div className="flex items-center gap-8">{toolbarActions}</div>
              ) : null}
            </div>
          )}
        </div>
      ) : null}

      <div role="grid" aria-label={label} className="overflow-x-auto p-6">
        <div
          role="row"
          className="grid items-center gap-12 border-b border-border py-12 px-12"
          style={{ gridTemplateColumns: gridTemplate, width: "max-content", minWidth: "100%" }}
        >
          {selectable ? (
            <span role="columnheader" aria-label="Select all rows">
              <RowCheckbox
                checked={allSelected}
                indeterminate={someSelected}
                label="Select all rows"
                onChange={toggleAll}
              />
            </span>
          ) : null}
          {columns.map((column) => (
            <span
              key={column.key}
              role="columnheader"
              className={cn(
                "min-w-0 truncate font-body text-micro uppercase tracking-tight-16 text-mute",
                column.align === "right" && "text-right",
              )}
            >
              {column.header}
            </span>
          ))}
          {actionSlots > 0 ? <span role="columnheader" aria-hidden="true" /> : null}
        </div>

        {rows.map((row) => {
          const id = getRowId(row);
          const isSelected = selectedSet.has(id);
          const isMenuOpen = openMenuRowId === id;
          const rowLabel = getRowLabel?.(row) ?? id;

          return (
            <div
              key={id}
              role="row"
              aria-selected={selectable ? isSelected : undefined}
              className={cn(
                "group relative grid items-center gap-12 rounded-ds py-12 px-12 transition-colors",
                isMenuOpen && "z-10",
                isSelected ? "bg-accent-2-soft" : "hover:bg-panel-2",
              )}
              style={{ gridTemplateColumns: gridTemplate, width: "max-content", minWidth: "100%" }}
            >
              {isSelected ? (
                <span
                  className="absolute inset-y-6 left-0 border-l-2 border-accent-2"
                  aria-hidden="true"
                />
              ) : null}
              {selectable ? (
                <span role="gridcell">
                  <RowCheckbox
                    checked={isSelected}
                    label={`Select ${rowLabel}`}
                    onChange={() => toggleRow(id)}
                  />
                </span>
              ) : null}
              {columns.map((column) => (
                <span
                  key={column.key}
                  role="gridcell"
                  className={cn(
                    "min-w-0 font-body text-label text-dim",
                    column.align === "right" && "text-right",
                  )}
                >
                  {column.render(row)}
                </span>
              ))}
              {actionSlots > 0 ? (
                <span
                  role="gridcell"
                  className="flex items-center justify-end gap-4 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100"
                >
                  {inlineActions.map((action) => (
                    <button
                      key={action.key}
                      type="button"
                      title={action.label}
                      aria-label={`${action.label} ${rowLabel}`}
                      onClick={() => action.onAction(row)}
                      className="flex size-32 items-center justify-center rounded-ds text-mute transition-colors hover:bg-panel-2 hover:text-fg"
                    >
                      <TableRowIcon name={action.icon} />
                    </button>
                  ))}
                  {overflowActions.length > 0 ? (
                    <span className="relative flex">
                      <button
                        ref={(node) => {
                          triggerRefs.current[id] = node;
                        }}
                        type="button"
                        title="More"
                        aria-label={`More actions for ${rowLabel}`}
                        aria-haspopup="menu"
                        aria-expanded={isMenuOpen}
                        onClick={() => setOpenMenuRowId(isMenuOpen ? null : id)}
                        className={cn(
                          "flex size-32 items-center justify-center rounded-ds transition-colors hover:bg-panel-2",
                          isMenuOpen ? "bg-panel-2 text-fg" : "text-mute",
                        )}
                      >
                        <TableRowIcon name="more" />
                      </button>
                      <RowMenu
                        row={row}
                        actions={overflowActions}
                        open={isMenuOpen}
                        onOpenChange={(next) => setOpenMenuRowId(next ? id : null)}
                        triggerRef={{ current: triggerRefs.current[id] ?? null }}
                      />
                    </span>
                  ) : null}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
