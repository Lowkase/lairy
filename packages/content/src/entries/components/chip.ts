import { ComponentEntrySchema } from "../../schema/component";

/**
 * Draft stub. Chips has no ticket of its own yet (reference/INDEX.md: `chip`,
 * 6085–6380); this entry exists only so Buttons' (LDS-018) `often-confused-with`
 * relationship and its "use something else when" row (docs/build-guide.md §3)
 * have somewhere real to point. `purpose` is CONTEXT.md's own glossary
 * definition, verbatim.
 */
export const chip = ComponentEntrySchema.parse({
  meta: {
    id: "chip",
    name: "Chips",
    section: "components",
    status: "draft",
    version: "0.1.0",
    updated: "2026-10-01",
  },
  purpose: "A round-ended token representing a value the operator chose, such as a filter. The operator can dismiss it.",
});
