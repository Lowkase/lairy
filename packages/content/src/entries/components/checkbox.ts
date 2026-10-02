import { ComponentEntrySchema } from "../../schema/component";

/**
 * Draft stub. Checkbox has no ticket of its own yet (reference/INDEX.md:
 * `cb`); named alongside Switch in Text input's (LDS-028) own "use
 * something else when" row ("The answer is yes or no — that is a Checkbox
 * or a Switch"). That row's own structured `useInstead` target is
 * `checkbox` (see text-input.ts's extractionNotes for why Switch, the
 * row's other named alternative, isn't a second structured target). No
 * CONTEXT.md glossary entry exists for Checkbox, so `purpose` is
 * paraphrased from that same sentence — flagged, pending Checkbox's own
 * ticket.
 */
export const checkbox = ComponentEntrySchema.parse({
  meta: {
    id: "checkbox",
    name: "Checkbox",
    section: "components",
    status: "draft",
    version: "0.1.0",
    updated: "2026-10-02",
  },
  purpose: "Answers yes or no, in place, for a question a text input would otherwise turn into guessing.",
});
