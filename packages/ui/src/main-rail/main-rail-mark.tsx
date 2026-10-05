/**
 * The brand mark (anatomy #6's "mark and wordmark"), ported from the
 * prototype's own inline SVG — three ascending strokes, used both in the
 * live left-dock lockup and in the Header page's own Do/don't demo. A
 * dedicated, component-scoped mark rather than an addition to the shared
 * Glyph set, the same precedent Callout's and Empty state's own icons
 * already set (packages/ui/src/callout/callout-icon.tsx,
 * packages/ui/src/empty-state/empty-state-icon.tsx) — the Icons
 * foundation's own Glyph family is a closed, named inventory, not one
 * components add their own marks to one at a time.
 */
export function MainRailMark() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 18 L10 6 M9 18 L15 6 M14 18 L20 6"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  );
}
