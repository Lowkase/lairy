import { ComponentEntrySchema } from "../../schema/component";

/**
 * Draft stub. Select has no ticket of its own yet (reference/INDEX.md:
 * `sel`, 5718 onward precedes Select (Multi)'s own range); this entry
 * exists only so Text input's (LDS-028) `alternative` relationship and its
 * "use something else when" row (docs/build-guide.md §3) have somewhere
 * real to point. Distinct from `select-multi` (Select (Multi), LDS-021's
 * stub): that entry is the multi-value menu Chips' removable variant
 * carries tokens for, this one is the single-value picker Text input's own
 * row names. CONTEXT.md has no glossary entry for Select, so `purpose` is
 * paraphrased from Text input's own Related-card sentence about it, the
 * same way select-multi.ts's stub paraphrased Chips' own text — flagged,
 * pending Select's own ticket.
 */
export const select = ComponentEntrySchema.parse({
  meta: {
    id: "select",
    name: "Select",
    section: "components",
    status: "draft",
    version: "0.1.0",
    updated: "2026-10-02",
  },
  purpose:
    "Inherits the text input's own box exactly, for a value whose legal answers are a known list rather than free text.",
});
