import type { ComponentEntry } from "./schema/component";
import { badge } from "./entries/components/badge";
import { callout } from "./entries/components/callout";
import { card } from "./entries/components/card";
import { modal } from "./entries/components/modal";
import { toast } from "./entries/components/toast";

/** Every populated entry. Token/Foundation/Pattern entries join this list as
 * their tickets land (docs/prd.md §7) — the schemas already exist
 * (./schema/token, ./schema/foundation, ./schema/pattern). */
const components: ComponentEntry[] = [callout, toast, modal, badge, card];

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
