import { ComponentEntrySchema } from "../../schema/component";

/**
 * Draft stub. Textarea has no ticket of its own yet (reference/INDEX.md:
 * `ta`, logic constants `taAnatomy`/`taLog` near text-input.ts's own
 * `inAnatomy`/`inLog`); this entry exists only so Text input's (LDS-028)
 * `alternative` relationship and its "use something else when" row
 * (docs/build-guide.md §3) have somewhere real to point. CONTEXT.md has no
 * glossary entry for Textarea, so `purpose` is paraphrased from Text
 * input's own boundary/Related-card sentences about it, the same way
 * select-multi.ts's stub paraphrased Chips' own Related-card text —
 * flagged, pending Textarea's own ticket.
 */
export const textarea = ComponentEntrySchema.parse({
  meta: {
    id: "textarea",
    name: "Textarea",
    section: "components",
    status: "draft",
    version: "0.1.0",
    updated: "2026-10-02",
  },
  purpose:
    "The text input's own box grown a line taller and resizable vertically, for an answer that runs past one line.",
});
