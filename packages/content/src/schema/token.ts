import { z } from "zod";

/** A token's value: a single value for a non-themeable or theme-independent
 * token (spacing, radius, motion, --alarm), or one value per theme for a
 * themeable colour token. */
export const TokenValueSchema = z.union([
  z.string().min(1),
  z.object({ dark: z.string().min(1), light: z.string().min(1) }),
]);
export type TokenValue = z.infer<typeof TokenValueSchema>;

/** A Token entry (docs/prd.md §7.2). Unlike Foundation/Component/Pattern
 * entries, a token isn't keyed by the shared Meta shape — it's named by its
 * CSS variable name, which is already unique and already what content and
 * prose reference it by (ADR-0008). */
export const TokenEntrySchema = z
  .object({
    name: z.string().regex(/^--[a-z][a-z0-9-]*$/, {
      message: "Token entry names are CSS custom property names (e.g. \"--accent\").",
    }),
    group: z.string().min(1),
    value: TokenValueSchema,
    /** false = identical in every theme by design (AGENTS.md rule 4). */
    themeable: z.boolean(),
    useFor: z.array(z.string().min(1)).min(1),
    neverFor: z.array(z.string().min(1)).default([]),
    /** Required when themeable is false, or when the token is an exception
     * to its group's usual rule (docs/prd.md §7.2). */
    rationale: z.string().min(1).optional(),
  })
  .superRefine((entry, ctx) => {
    if (!entry.themeable && !entry.rationale) {
      ctx.addIssue({
        code: "custom",
        path: ["rationale"],
        message: `"${entry.name}" is non-themeable, which requires a rationale (docs/prd.md §7.2).`,
      });
    }
  });
export type TokenEntry = z.infer<typeof TokenEntrySchema>;
