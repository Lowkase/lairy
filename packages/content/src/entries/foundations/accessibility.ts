import { FoundationEntrySchema } from "../../schema/foundation";

/**
 * Draft stub. Accessibility has no ticket of its own yet; this entry
 * exists only so Color's `composes-with` relationship (docs/build-guide.md
 * §3: "if the target has no entry yet, create a stub with status draft")
 * has somewhere real to point. `description` is the prototype's own
 * opening two-sentence block (archive/v1/Workspace Shell.dc.html:2622–2623),
 * verbatim — inline `<span>` colour styling on "Color", "Motion" and
 * "Icons" is dropped as markup, not content.
 */
export const accessibility = FoundationEntrySchema.parse({
  meta: {
    id: "accessibility",
    name: "Accessibility",
    section: "foundations",
    status: "draft",
    version: "0.1.0",
    updated: "2026-09-30",
  },
  description: {
    summary:
      "This page is not a checklist to be audited against later. It is the set of floors every other foundation was built on top of.",
    boundary:
      "The reasoning runs one way: the grey ramp exists because four levels of text had to clear their ratios in both themes, amber owns action because it is the one hue that holds under deuteranopia, and the loop set is two long because a third moving thing in peripheral vision is indistinguishable from an alarm. So the rules below are not additions to the system — removing any one of them would require redrawing Color, Motion or Icons. Every figure here is enforced somewhere else and cross-referenced to it.",
  },
});
