import { icon } from "@lairy/tokens";

const SIZE = Number.parseFloat(icon.glyphRail);

/**
 * The mark for Empty state (anatomy #2), ported from the prototype's own
 * inline SVG. A dedicated, component-scoped icon rather than an addition to
 * the shared Glyph set, the same precedent Callout's own tone icon already
 * set (packages/ui/src/callout/callout-icon.tsx) — the Icons foundation's
 * own Glyph family is a closed, named inventory (packages/content/src/entries/foundations/icons.ts:
 * "Twelve glyphs on the 40 grid"), not one components add their own marks
 * to one at a time.
 */
export function EmptyStateIcon() {
  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3.5" y="4.5" width="17" height="15" />
      <path d="M3.5 9.5h17M9 4.5v15" />
    </svg>
  );
}
