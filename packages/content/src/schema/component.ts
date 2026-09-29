import { z } from "zod";
import {
  ChangelogEntrySchema,
  ColorTokenNameSchema,
  EntryIdSchema,
  ExampleSchema,
  MetaSchema,
  OpeningDescriptionSchema,
  RelationshipSchema,
  RuleSchema,
} from "./shared";

/** One numbered part of a component's anatomy (archive/v1/NOTES.md's
 * "Anatomy section pattern" — measured diagram + legend). */
export const AnatomyPartSchema = z.object({
  number: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
});
export type AnatomyPart = z.infer<typeof AnatomyPartSchema>;

/** A row in the component's variants/tones grid (docs/prd.md §7.2). The
 * prototype's loose token-name prose (e.g. "--accent icon, title & fill")
 * is replaced here by the actual token names — see the entry's
 * extractionNotes for anywhere that replacement wasn't a clean 1:1 match. */
export const VariantSchema = z.object({
  name: z.string().min(1),
  tokens: z.array(ColorTokenNameSchema).min(1),
  description: z.string().min(1),
});
export type Variant = z.infer<typeof VariantSchema>;

export const UseInsteadSchema = z.object({
  target: EntryIdSchema,
  text: z.string().min(1),
});
export type UseInstead = z.infer<typeof UseInsteadSchema>;

export const UsageSchema = z.object({
  useWhen: z.array(z.string().min(1)).default([]),
  useInstead: z.array(UseInsteadSchema).default([]),
});
export type Usage = z.infer<typeof UsageSchema>;

export const AccessibilityNoteSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
});
export type AccessibilityNote = z.infer<typeof AccessibilityNoteSchema>;

/** One row of the component's Tokens section: the token(s) a part of the
 * component uses, and what for. */
export const TokenUsageSchema = z.object({
  tokens: z.array(ColorTokenNameSchema).min(1),
  usage: z.string().min(1),
});
export type TokenUsage = z.infer<typeof TokenUsageSchema>;

/** Annotation on one extracted prop — never a hand-written prop table
 * (docs/prd.md §7.2). Populated once react-docgen-typescript extraction
 * exists (LDS-009); the field itself is part of the schema now so later
 * component entries don't need a shape change. */
export const PropAnnotationSchema = z.object({
  prop: z.string().min(1),
  note: z.string().min(1),
});
export type PropAnnotation = z.infer<typeof PropAnnotationSchema>;

export const ComponentEntrySchema = z.object({
  meta: MetaSchema,
  /** One-line purpose. Required even for a draft stub — it's the one thing
   * a relationship or useInstead row needs to explain why it points here. */
  purpose: z.string().min(1),
  description: OpeningDescriptionSchema.optional(),
  anatomy: z.array(AnatomyPartSchema).default([]),
  /** Caption under the anatomy diagram (archive/v1/NOTES.md: "one line ...
   * explaining that each part takes an edge and positions are measured"). */
  anatomyCaption: z.string().optional(),
  variants: z.array(VariantSchema).default([]),
  /** Closing note under the variants/tones grid, when a style is
   * deliberately omitted (archive/v1/NOTES.md: "Close with a --faint note
   * explaining a deliberate omission"). */
  variantsNote: z.string().optional(),
  states: z.array(z.string().min(1)).default([]),
  usage: UsageSchema.default({ useWhen: [], useInstead: [] }),
  contentRules: z.array(RuleSchema).default([]),
  examples: z.array(ExampleSchema).default([]),
  accessibility: z.array(AccessibilityNoteSchema).default([]),
  tokens: z.array(TokenUsageSchema).default([]),
  propGuidance: z.array(PropAnnotationSchema).default([]),
  relationships: z.array(RelationshipSchema).default([]),
  changelog: z.array(ChangelogEntrySchema).default([]),
  /** Every place prose was restructured or a literal value was replaced by
   * a token name during extraction (ADR-0009). Empty for a draft stub that
   * has no extracted prose yet. */
  extractionNotes: z.array(z.string().min(1)).default([]),
});
export type ComponentEntry = z.infer<typeof ComponentEntrySchema>;
