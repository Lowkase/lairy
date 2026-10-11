import { icon } from "@lairy/tokens";

export interface HeaderIdentityIconProps {
  /** `trigger` is the bar's identity square (19px, with side ears); `menu`
   * is the smaller copy beside the operator's name in the open menu (16px,
   * no ears) — the two drawings the prototype's avatar button and operator
   * menu each carry. */
  variant?: "trigger" | "menu";
}

/**
 * The identity-square mark (anatomy #4), ported from the prototype's own
 * inline SVG — an ID badge, not a person silhouette, so it never reads as
 * a real photo avatar. A dedicated, component-scoped icon rather than an
 * addition to the shared Glyph/Inline sets, the same precedent Callout's
 * and Empty state's own icons already set.
 */
export function HeaderIdentityIcon({ variant = "trigger" }: HeaderIdentityIconProps) {
  const size = Number.parseFloat(variant === "trigger" ? icon.identity : icon.inline);
  return (
    <svg
      width={size}
      height={size}
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
      <circle cx="12" cy="2.6" r="1.4" />
      {variant === "trigger" ? <path d="M1.6 13v3M22.4 13v3" /> : null}
      <path d="M9 13v1.6M15 13v1.6" />
      <path d="M9.5 17.2h5" />
    </svg>
  );
}
