import { icon } from "@lairy/tokens";
import type { ReactNode } from "react";

/**
 * The five inline icons, 24-grid (Icons foundation, icoDocs icoInlineSet;
 * paths ported from the prototype's icon()). Sits on a text baseline: menu
 * rows, command palette results, a leading mark inside a Button.
 */
export type InlineIconName = "open" | "spark" | "gear" | "drain" | "arrow";

const STROKE = icon.strokeInline;
const SIZE = Number.parseFloat(icon.inline);

const PATHS: Record<InlineIconName, ReactNode> = {
  open: (
    <>
      <rect x={3} y={4} width={18} height={16} rx={2} />
      <path d="M3 9h18" />
    </>
  ),
  spark: <path d="M12 3l1.6 4.8L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.2z" />,
  gear: (
    <>
      <circle cx={12} cy={12} r={3} />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
    </>
  ),
  drain: <path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12" />,
  arrow: <path d="M4 17l6-6-6-6M12 19h8" />,
};

export interface InlineIconProps {
  name: InlineIconName;
  /** An accessible name, for an inline icon that is the only content of its
   * control (Icons foundation accessibility "Never the only label"). Omit
   * when a text label already sits beside the icon — it is then purely
   * decorative and hidden from assistive tech. */
  label?: string;
  className?: string;
}

/**
 * An inline icon, ported from the prototype's icon(). Fixed at 16px — the
 * Inline icon scale is sized to match 14px body text, not a range like
 * Glyph's rail/tile. Colour comes from currentColor only (Icons foundation
 * Construction rule 3) — there is no colour prop; set it on an ancestor
 * element instead.
 */
export function InlineIcon({ name, label, className }: InlineIconProps) {
  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={STROKE}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {PATHS[name]}
    </svg>
  );
}
