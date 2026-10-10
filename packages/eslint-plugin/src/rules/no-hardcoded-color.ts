import type { Node } from "estree";
import { collectStrings } from "../ast";
import { createRule } from "../create-rule";

const HEX = /(^|[^\w&#/-])#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})(?![\w-])/i;
const FUNCTION = /(?<![\w-])(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/i;
const NON_COLOR_ATTRIBUTES = new Set(["href", "id", "htmlFor", "xlinkHref", "to", "src"]);

export const noHardcodedColor = createRule(
  "no-hardcoded-color",
  "Disallow hex and colour-function literals; colour comes from tokens.",
  (context, report) => ({
    Program(program) {
      for (const { node, text } of collectStrings(program as Node, context)) {
        const parent = (
          node as { parent?: { type: string; name?: { name?: string }; source?: unknown } }
        ).parent;
        if (parent?.type === "ImportDeclaration" || parent?.type === "ExportNamedDeclaration")
          continue;
        if (parent?.type === "ExportAllDeclaration") continue;
        if (parent?.type === "JSXAttribute" && NON_COLOR_ATTRIBUTES.has(parent.name?.name ?? ""))
          continue;
        const withoutUrls = text.replace(/url\([^)]*\)/gi, "");
        const hex = HEX.exec(withoutUrls);
        if (hex) {
          report(node, `Hard-coded colour "${hex[0].trim().replace(/^[^#]*/, "")}".`);
        } else if (FUNCTION.test(withoutUrls)) {
          report(node, "Hard-coded colour function; use a colour token.");
        }
      }
    },
  }),
);
