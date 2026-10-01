import { ComponentEntrySchema } from "../../schema/component";

/**
 * Draft stub. Switch has no ticket of its own yet (reference/INDEX.md: `sw`,
 * 5093–5393); this entry exists only so Buttons' (LDS-018) "use something
 * else when" row (docs/build-guide.md §3) has somewhere real to point.
 * CONTEXT.md has no glossary entry for Switch, so `purpose` is paraphrased
 * from Buttons' own useInstead sentence about it, flagged, pending Switch's
 * own ticket. Exported as `switchComponent` — `switch` is a reserved word
 * and can't be a binding name — but `meta.id` stays the plain "switch".
 */
export const switchComponent = ComponentEntrySchema.parse({
  meta: {
    id: "switch",
    name: "Switch",
    section: "components",
    status: "draft",
    version: "0.1.0",
    updated: "2026-10-01",
  },
  purpose: "Flips one setting on or off in place.",
});
