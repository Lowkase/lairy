// Typed re-exports of the generated token values. The CSS custom properties
// in ./css/tokens.css and the Tailwind theme in ./css/tailwind-theme.css are
// the tokens apps actually style with; this module exists for consumers that
// need the raw values (tests, the MCP server, non-Tailwind code).
import { color } from "./tokens.generated";

export * from "./tokens.generated";

/** Alarm is identical in every theme by design (ADR-0007). Derived from the
 * generated `color.alarm` group so it can't drift as alarm variants are added. */
export const NON_THEMEABLE_COLOR_KEYS = Object.keys(color.alarm) as (keyof typeof color.alarm)[];
