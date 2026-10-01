import { icon, space } from "@lairy/tokens";
import { cva } from "class-variance-authority";
import type { ReactNode } from "react";
import { cn } from "../cn";

// No `transition-colors`: `color`/`border-color`/`background-color` here are
// theme-swapped custom properties (--accent, --border, …), and animating
// them means a theme toggle passes through intermediate colours for the
// transition's duration — including combinations that fail AA contrast
// (caught by axe in apps/docs/e2e/chip.spec.ts), the same gap button.tsx's
// own comment already documents for exactly this reason. States snap
// instantly instead.
const chipPill = cva(
  "inline-flex items-center gap-8 rounded-chip border py-6 px-12 font-body text-label uppercase tracking-tight-10 focus-visible:outline-none focus-visible:border-accent-line focus-visible:ring-2 focus-visible:ring-accent-soft focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
  {
    variants: {
      // Filter and Toggle (Chips Variants): "same shape" per the entry's
      // own description — both empty, since the two differ only in how a
      // consumer groups chips (mutually exclusive vs. freely combined),
      // never in the chip's own rendered treatment. Named here anyway so
      // the component carries the entry's variant names exactly (build
      // guide §4 step 4), surfaced to consumers and tests via `data-variant`.
      variant: {
        filter: "",
        toggle: "",
      },
      pressed: {
        // Active (Chips Variants): not a fourth variant, the on state of a
        // Filter or Toggle chip — amber border, soft amber fill, the only
        // visual treatment for on (Chips Accessibility "Never colour
        // alone"). Label stays --fg, not --accent: bare --accent text over
        // --accent-soft measures 2.84:1 in the light theme (axe,
        // apps/docs/e2e/chip.spec.ts), the same class of gap badge.tsx's
        // Fail and button.tsx's Danger already route around — the border
        // and fill alone carry the tone. Hover only lightens the resting
        // border and label (chipTokens' own "Hover border and label" row);
        // an already on chip keeps its one treatment.
        true: "cursor-pointer border-accent bg-accent-soft text-fg",
        false: "cursor-pointer border-border text-dim hover:border-border-2 hover:text-fg",
      },
    },
    defaultVariants: { variant: "filter", pressed: false },
  },
);

const DISMISS_SIZE = Number.parseFloat(space["8"]);
const DISMISS_HIT = Number.parseFloat(space["4"]);

/** The prototype's own dismiss cross (archive/v1/Workspace Shell.dc.html
 * chip-x, ~15451), drawn locally rather than added to
 * `packages/ui/src/icons`' Inline icon set — that set is governed by the
 * Icons foundation content entry (stable, 1.1.0, exactly five inline icons
 * today) and extending its catalogue is out of scope for this ticket (Chips
 * extractionNotes). Stroke reuses that foundation's own `strokeInline`
 * token rather than the prototype's literal 3, which exceeds the
 * foundation's own 24-grid stroke rule. */
function ChipDismissGlyph() {
  return (
    <svg
      width={DISMISS_SIZE}
      height={DISMISS_SIZE}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={icon.strokeInline}
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export interface ChipProps {
  /** One or two words naming the value this chip carries, never a verb
   * (Chips Content rule 2). */
  children: ReactNode;
  /** Filter (default) or Toggle (Chips Variants) — same rendered treatment
   * either way; names which grouping pattern the chip belongs to, carried
   * through as `data-variant` for consumers and tests. Ignored when
   * `removable` is set. */
  variant?: "filter" | "toggle";
  /** Whether a Filter or Toggle chip is currently on — Active (Chips
   * Variants) is this prop set to `true`, not a fourth variant. Ignored
   * when `removable` is set. */
  pressed?: boolean;
  /** Toggles `pressed`. The caller decides whether a group of chips stays
   * mutually exclusive (Filter) or combines freely (Toggle, Chips
   * Variants) — the chip itself only renders the on/off treatment. */
  onPressedChange?: (pressed: boolean) => void;
  /** Renders the Removable variant: a plain, non-pressable label plus a
   * separately labelled dismiss target (Chips anatomy #4). The body carries
   * an already-committed value — the × is the only way out (Chips Variants
   * "Removable"). */
  removable?: boolean;
  /** Called when the dismiss target is activated. Its own accessible name
   * is "Remove {children}", never a bare "close" (Chips Accessibility "Two
   * targets, two labels"). */
  onRemove?: () => void;
  className?: string;
}

/**
 * A round-ended token representing a value the operator chose, such as a
 * filter (CONTEXT.md). The operator can dismiss it — the one thing a Badge
 * never allows (Chips description).
 */
export function Chip({
  children,
  variant = "filter",
  pressed,
  onPressedChange,
  removable,
  onRemove,
  className,
}: ChipProps) {
  if (removable) {
    return (
      <span
        data-slot="chip"
        data-variant="removable"
        className={cn(chipPill({ pressed: false }), "cursor-default pr-8", className)}
      >
        <span data-slot="chip-label">{children}</span>
        <button
          type="button"
          data-slot="chip-dismiss"
          aria-label={`Remove ${children}`}
          onClick={onRemove}
          style={{ margin: -DISMISS_HIT, padding: DISMISS_HIT }}
          // `rounded-chip`, not `rounded-full`: the dismiss control is
          // interactive (a click handler, its own hit area, its own focus
          // ring) rather than a layout-free mark, and `radius-chip`'s own
          // description reserves the bare circle utility for marks that
          // hold no layout (AGENTS.md rule 5, packages/tokens/tokens/radius.json).
          className="flex shrink-0 cursor-pointer rounded-chip text-mute hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          <ChipDismissGlyph />
        </button>
      </span>
    );
  }

  // Filter / Toggle (and Active, its on state): the whole pill is one real
  // `<button>`, never the prototype's own `<div onClick tabIndex>` (Chips
  // extractionNotes — the same "always a real button" precedent button.tsx
  // set).
  return (
    <button
      type="button"
      data-slot="chip"
      data-variant={variant}
      aria-pressed={pressed ?? false}
      // Stays `undefined`, never a wrapping closure, when the caller omits
      // `onPressedChange` — a function value here, even an inert one, can't
      // cross into a Server Component's rendered tree (the same reason
      // Button's own `onClick` prop passes straight through rather than
      // always wrapping it).
      onClick={onPressedChange ? () => onPressedChange(!pressed) : undefined}
      className={cn(chipPill({ variant, pressed: !!pressed }), className)}
    >
      {children}
    </button>
  );
}
