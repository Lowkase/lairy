import { colorTokenNames } from "@lairy/tokens";
import { z } from "zod";

/** An entry's id, used as the target of relationships and useInstead rows.
 * Cross-entry references (does this id actually exist in the catalogue?)
 * are checked separately in catalogue.ts — Zod validates one entry at a
 * time and can't see its neighbours. */
export const EntryIdSchema = z.string().regex(/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/, {
  message: "Entry ids are kebab-case (e.g. \"callout\", \"drawer\").",
});
export type EntryId = z.infer<typeof EntryIdSchema>;

/** Every colour token's kebab-case name (docs/prd.md §7.1's "unknown token
 * names ... fail the build" — this enum is what makes that check happen). */
export const ColorTokenNameSchema = z.enum(colorTokenNames);
export type ColorTokenName = z.infer<typeof ColorTokenNameSchema>;

export const StatusSchema = z.enum(["draft", "stable", "locked", "deprecated"]);
export type Status = z.infer<typeof StatusSchema>;

export const SectionSchema = z.enum(["foundations", "components", "patterns"]);
export type Section = z.infer<typeof SectionSchema>;

export const MetaSchema = z.object({
  id: EntryIdSchema,
  name: z.string().min(1),
  section: SectionSchema,
  status: StatusSchema,
  version: z.string().min(1),
  updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "updated is an ISO date (YYYY-MM-DD)." }),
});
export type Meta = z.infer<typeof MetaSchema>;

export const RuleSchema = z.object({
  text: z.string().min(1),
  enforceable: z
    .object({
      kind: z.enum(["lint", "validator"]),
      id: z.string().min(1),
    })
    .optional(),
});
export type Rule = z.infer<typeof RuleSchema>;

export const RelationshipKindSchema = z.enum([
  "alternative",
  "composes-with",
  "contrasts-with",
  "often-confused-with",
]);
export type RelationshipKind = z.infer<typeof RelationshipKindSchema>;

export const RelationshipSchema = z.object({
  target: EntryIdSchema,
  kind: RelationshipKindSchema,
  text: z.string().min(1),
});
export type Relationship = z.infer<typeof RelationshipSchema>;

/** A titled accessibility callout, shared by Component and Foundation
 * entries (both the prototype's `coA11y`-shaped lists and Color's own
 * `colorA11y` use the same title+body pair). */
export const AccessibilityNoteSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
});
export type AccessibilityNote = z.infer<typeof AccessibilityNoteSchema>;

export const ExampleKindSchema = z.enum(["good", "bad", "demo"]);
export type ExampleKind = z.infer<typeof ExampleKindSchema>;

export const ExampleSchema = z.object({
  id: z.string().min(1),
  kind: ExampleKindSchema,
  title: z.string().min(1),
  caption: z.string().optional(),
  /** Repo-relative path to the TSX file this example is written as
   * (docs/build-guide.md §4 step 6) — never invented, always a real file. */
  source: z.string().min(1),
});
export type Example = z.infer<typeof ExampleSchema>;

export const ChangelogEntrySchema = z.object({
  version: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "date is an ISO date (YYYY-MM-DD)." }),
  text: z.string().min(1),
});
export type ChangelogEntry = z.infer<typeof ChangelogEntrySchema>;

/** The two-sentence opening pattern every Foundation/Component docs page
 * opens with (archive/v1/NOTES.md): a definition, then the boundary rule
 * against its nearest neighbour. */
export const OpeningDescriptionSchema = z.object({
  summary: z.string().min(1),
  boundary: z.string().min(1),
});
export type OpeningDescription = z.infer<typeof OpeningDescriptionSchema>;
