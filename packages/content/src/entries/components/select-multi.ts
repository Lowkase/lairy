import { ComponentEntrySchema } from "../../schema/component";

/**
 * Draft stub. Select (Multi) has no ticket of its own yet
 * (reference/INDEX.md: `mt`, 5718–6084); this entry exists only so Chips'
 * (LDS-021) `alternative` relationship and its "use something else when"
 * row (docs/build-guide.md §3) have somewhere real to point. CONTEXT.md has
 * no glossary entry for Select (Multi), so `purpose` is paraphrased from
 * Chips' own Related-card sentence about it, the same way tabs.ts's stub
 * paraphrased Buttons' Related-card text — flagged, pending Select (Multi)'s
 * own ticket.
 */
export const selectMulti = ComponentEntrySchema.parse({
  meta: {
    id: "select-multi",
    name: "Select (Multi)",
    section: "components",
    status: "draft",
    version: "0.1.0",
    updated: "2026-10-01",
  },
  purpose: "Where removable chips live as tokens, once the option list is long enough to need a menu instead of a row.",
});
