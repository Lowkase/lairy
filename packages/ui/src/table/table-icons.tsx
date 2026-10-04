import { icon } from "@lairy/tokens";
import type { ReactNode } from "react";

/**
 * The row and toolbar glyphs (archive/v1/Workspace Shell.dc.html's own
 * `tblIcon()`, ~14831), drawn locally rather than added to
 * `packages/ui/src/icons`'s Inline icon set — that set is governed by the
 * Icons foundation content entry (stable, 1.1.0, exactly five inline icons
 * today) and extending its catalogue is out of scope for this ticket, the
 * same call chip.ts's own dismiss glyph and checkbox.ts's own tick/dash
 * already made for their own local marks. Sized to that foundation's own
 * Inline scale (16px, 24-grid, `strokeInline`) rather than the prototype's
 * own literal 15px/1.9 so a row of these sits on the same baseline as any
 * other inline icon in the system, even though this set isn't added to its
 * catalogue.
 */
export type TableRowIconName =
  "run" | "duplicate" | "trash" | "more" | "archive" | "create" | "export";

const SIZE = Number.parseFloat(icon.inline);

const PATHS: Record<TableRowIconName, ReactNode> = {
  run: <path d="M7 4.5l12 7.5-12 7.5z" />,
  duplicate: (
    <>
      <rect x={8.5} y={8.5} width={11} height={11} rx={2} />
      <path d="M15.5 5.5H6.5A2 2 0 0 0 4.5 7.5v9" />
    </>
  ),
  trash: <path d="M4.5 7h15M9.5 7V4.5h5V7M7 7l1 12.5h8L17 7" />,
  more: (
    <>
      <circle cx={12} cy={5.5} r={1.4} fill="currentColor" stroke="none" />
      <circle cx={12} cy={12} r={1.4} fill="currentColor" stroke="none" />
      <circle cx={12} cy={18.5} r={1.4} fill="currentColor" stroke="none" />
    </>
  ),
  archive: (
    <>
      <rect x={4} y={5} width={16} height={4} rx={1} />
      <path d="M5.5 9v9.5h13V9M10 13h4" />
    </>
  ),
  create: <path d="M12 5v14M5 12h14" />,
  export: <path d="M12 15.5V4.5M8 8l4-3.5L16 8M5 16v3.5h14V16" />,
};

export interface TableRowIconProps {
  name: TableRowIconName;
  className?: string;
}

/** Always decorative — every call site below pairs it with a visible label
 * or an `aria-label` of its own, so the glyph itself is hidden from
 * assistive tech (Icons foundation accessibility "Never the only label"). */
export function TableRowIcon({ name, className }: TableRowIconProps) {
  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={icon.strokeInline}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
