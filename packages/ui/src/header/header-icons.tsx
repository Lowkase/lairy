import { icon } from "@lairy/tokens";

const SIZE = Number.parseFloat(icon.inline);

/**
 * The identity-square mark (anatomy #4), ported from the prototype's own
 * inline SVG — an ID badge, not a person silhouette, so it never reads as
 * a real photo avatar. A dedicated, component-scoped icon rather than an
 * addition to the shared Glyph/Inline sets, the same precedent Callout's
 * and Empty state's own icons already set.
 */
export function HeaderIdentityIcon() {
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
      <rect x="4" y="8" width="16" height="12" rx="3" />
      <path d="M12 3v5" />
      <path d="M9 13.5v1.5M15 13.5v1.5" />
      <path d="M9.5 17.2h5" />
    </svg>
  );
}
