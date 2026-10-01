import type { ComponentEntry } from "./schema/component";
import type { FoundationEntry } from "./schema/foundation";
import type { TokenEntry } from "./schema/token";
import { badge } from "./entries/components/badge";
import { button } from "./entries/components/button";
import { callout } from "./entries/components/callout";
import { card } from "./entries/components/card";
import { chip } from "./entries/components/chip";
import { emptyState } from "./entries/components/empty-state";
import { modal } from "./entries/components/modal";
import { progress } from "./entries/components/progress";
import { selectMulti } from "./entries/components/select-multi";
import { switchComponent } from "./entries/components/switch";
import { tabs } from "./entries/components/tabs";
import { text } from "./entries/components/text";
import { toast } from "./entries/components/toast";
import { accessibility } from "./entries/foundations/accessibility";
import { color as colorFoundation } from "./entries/foundations/color";
import { elevation } from "./entries/foundations/elevation";
import { icons } from "./entries/foundations/icons";
import { motion } from "./entries/foundations/motion";
import { radius } from "./entries/foundations/radius";
import { spacing } from "./entries/foundations/spacing";
import { typography } from "./entries/foundations/typography";
import { visualization } from "./entries/foundations/visualization";
import { alarmTokens } from "./entries/tokens/alarm";
import { breakpointTokens } from "./entries/tokens/breakpoint";
import { colorTokens } from "./entries/tokens/color";
import { elevationTokens } from "./entries/tokens/elevation";
import { iconTokens } from "./entries/tokens/icon";
import { motionTokens } from "./entries/tokens/motion";
import { radiusTokens } from "./entries/tokens/radius";
import { spacingTokens } from "./entries/tokens/spacing";
import { typographyTokens } from "./entries/tokens/typography";
import { extractProps, type ExtractedProp } from "./props";

/** Every populated entry. Pattern entries join this list as their tickets
 * land (docs/prd.md §7) — the schema already exists (./schema/pattern). */
const components: ComponentEntry[] = [
  callout,
  toast,
  modal,
  badge,
  card,
  button,
  chip,
  progress,
  selectMulti,
  tabs,
  switchComponent,
  text,
  emptyState,
];

/** Every Foundation entry (docs/prd.md §7.2 — LDS-014, extended by
 * LDS-015). */
const foundations: FoundationEntry[] = [
  colorFoundation,
  typography,
  spacing,
  radius,
  icons,
  elevation,
  motion,
  visualization,
  accessibility,
];

/** Every token entry (docs/prd.md §7.2, §9 — LDS-013). */
const tokens: TokenEntry[] = [
  ...colorTokens,
  ...alarmTokens,
  ...typographyTokens,
  ...spacingTokens,
  ...radiusTokens,
  ...iconTokens,
  ...motionTokens,
  ...elevationTokens,
  ...breakpointTokens,
];

/** One extracted prop, with its content-authored guidance note merged in
 * by name (docs/prd.md §7.2 — "annotations on extracted props only, never
 * a hand-written prop table"). */
export interface ComponentProp extends ExtractedProp {
  guidance?: string;
}

/** Extracts `entry`'s real props and merges in its `propGuidance` by prop
 * name. Throws when guidance names a prop that isn't part of the extracted
 * API (LDS-009 acceptance criterion: "guidance naming an unknown prop fails
 * the build") — the one check that makes D5 ("documented API can never
 * disagree with the real one") actually hold. Returns undefined for a
 * component with no `ui` implementation yet, in which case there is
 * nothing to check `propGuidance` against. */
function buildComponentProps(entry: ComponentEntry): ComponentProp[] | undefined {
  const extracted = extractProps(entry.meta.id);
  if (!extracted) return undefined;

  const guidanceByProp = new Map(entry.propGuidance.map((g) => [g.prop, g.note]));
  for (const propName of guidanceByProp.keys()) {
    if (!extracted.some((prop) => prop.name === propName)) {
      throw new Error(
        `@lairy/content: "${entry.meta.id}" propGuidance names unknown prop "${propName}" — it isn't part of the component's extracted API (docs/prd.md D5, LDS-009).`,
      );
    }
  }

  return extracted.map((prop) => ({ ...prop, guidance: guidanceByProp.get(prop.name) }));
}

/** Exported for its own tests (catalogue.test.ts) — duplicate ids and
 * dangling relationship/useInstead targets, run against synthetic entries
 * rather than only the real catalogue below. */
export function validateCatalogue(entries: ComponentEntry[]): Map<string, ComponentEntry> {
  const byId = new Map<string, ComponentEntry>();
  for (const entry of entries) {
    const { id } = entry.meta;
    if (byId.has(id)) {
      throw new Error(`@lairy/content: duplicate entry id "${id}" (docs/prd.md §7, ADR-0001).`);
    }
    byId.set(id, entry);
  }

  for (const entry of entries) {
    for (const relationship of entry.relationships) {
      if (!byId.has(relationship.target)) {
        throw new Error(
          `@lairy/content: "${entry.meta.id}" has a relationship targeting unknown entry "${relationship.target}" (docs/build-guide.md §3: create a draft stub for any target with no entry yet).`,
        );
      }
    }
    for (const useInstead of entry.usage.useInstead) {
      if (!byId.has(useInstead.target)) {
        throw new Error(
          `@lairy/content: "${entry.meta.id}" has a useInstead row targeting unknown entry "${useInstead.target}" (docs/build-guide.md §3: create a draft stub for any target with no entry yet).`,
        );
      }
    }
    // Throws if propGuidance names a prop the extracted API doesn't have.
    buildComponentProps(entry);
  }

  return byId;
}

/** Validated at import time: a broken entry throws here, which is what
 * makes bad content fail the build (docs/prd.md §7, ADR-0001) — any
 * consumer that imports this module (the docs app, the MCP server)
 * evaluates it, so a broken entry can't reach production undetected. */
export const componentsById = validateCatalogue(components);

export function listComponents(): ComponentEntry[] {
  return [...componentsById.values()];
}

export function getComponent(id: string): ComponentEntry | undefined {
  return componentsById.get(id);
}

/** Extracted props merged with `propGuidance`, by component id. Undefined
 * for a component with no `ui` implementation yet (docs/prd.md D5,
 * LDS-009). */
export function getComponentProps(id: string): ComponentProp[] | undefined {
  const entry = componentsById.get(id);
  return entry && buildComponentProps(entry);
}

/** Exported for its own tests — a duplicate token name, run against
 * synthetic entries rather than only the real catalogue below. */
export function validateTokenCatalogue(entries: TokenEntry[]): Map<string, TokenEntry> {
  const byName = new Map<string, TokenEntry>();
  for (const entry of entries) {
    if (byName.has(entry.name)) {
      throw new Error(`@lairy/content: duplicate token name "${entry.name}" (docs/prd.md §7).`);
    }
    byName.set(entry.name, entry);
  }
  return byName;
}

/** Validated at import time, same as `componentsById` above. Computed ahead
 * of `foundationsById` (below) so a foundation's `scales[].tokens` can be
 * checked against it — a Scale now references any token group, not only
 * colour (LDS-015), so the closed-enum check `ColorTokenNameSchema` used to
 * provide no longer covers it; this is that check's catalogue-level
 * replacement, the same pattern as the dangling-relationship check below. */
export const tokensByName = validateTokenCatalogue(tokens);

export function listTokens(): TokenEntry[] {
  return [...tokensByName.values()];
}

export function getToken(name: string): TokenEntry | undefined {
  return tokensByName.get(name);
}

/** Exported for its own tests — duplicate ids, dangling relationship
 * targets and unknown scale tokens, run against synthetic entries rather
 * than only the real catalogue below. Foundations relate only to other
 * foundations so far (docs/prd.md §9's `get_foundation`, LDS-014), so this
 * checks relationship targets against the foundations list alone, the same
 * way `validateTokenCatalogue` above checks only within its own list.
 * `knownTokens` is optional so the unit tests exercising duplicate-id and
 * dangling-relationship behaviour (catalogue.test.ts) don't also have to
 * supply a token catalogue; the real call below always passes one. */
export function validateFoundationCatalogue(
  entries: FoundationEntry[],
  knownTokens?: Map<string, TokenEntry>,
): Map<string, FoundationEntry> {
  const byId = new Map<string, FoundationEntry>();
  for (const entry of entries) {
    const { id } = entry.meta;
    if (byId.has(id)) {
      throw new Error(`@lairy/content: duplicate entry id "${id}" (docs/prd.md §7, ADR-0001).`);
    }
    byId.set(id, entry);
  }

  for (const entry of entries) {
    for (const relationship of entry.relationships) {
      if (!byId.has(relationship.target)) {
        throw new Error(
          `@lairy/content: "${entry.meta.id}" has a relationship targeting unknown entry "${relationship.target}" (docs/build-guide.md §3: create a draft stub for any target with no entry yet).`,
        );
      }
    }
    if (knownTokens) {
      for (const scale of entry.scales) {
        for (const tokenName of scale.tokens) {
          if (!knownTokens.has(`--${tokenName}`)) {
            throw new Error(
              `@lairy/content: "${entry.meta.id}" scale "${scale.name}" references unknown token "--${tokenName}" (docs/prd.md §7: an unknown token name fails the build).`,
            );
          }
        }
      }
    }
  }

  return byId;
}

/** Validated at import time, same as `componentsById` above. */
export const foundationsById = validateFoundationCatalogue(foundations, tokensByName);

export function listFoundations(): FoundationEntry[] {
  return [...foundationsById.values()];
}

export function getFoundation(id: string): FoundationEntry | undefined {
  return foundationsById.get(id);
}
