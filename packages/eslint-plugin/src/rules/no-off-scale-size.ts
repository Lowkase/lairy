import type { Node } from "estree";
import { collectStrings, propertyName } from "../ast";
import { createRule } from "../create-rule";
import { isLiteralValue } from "../values";

const CSS_FONT_SIZE = /font-size\s*:\s*(?!var\(|inherit|initial|unset)[^;]*\d/i;

export const noOffScaleSize = createRule(
  "no-off-scale-size",
  "Disallow literal font sizes; type size comes from the scale.",
  (context, report) => ({
    Property(node) {
      const name = propertyName(node);
      if (name !== "fontSize" && name !== "font-size") return;
      if (isLiteralValue(node.value))
        report(node, "Literal font size is off the type scale; use a text-* token.");
    },
    JSXAttribute(node: Node) {
      const attr = node as unknown as { name: { type: string; name: string }; value: Node | null };
      if (attr.name.type !== "JSXIdentifier" || attr.name.name !== "fontSize" || !attr.value)
        return;
      if (isLiteralValue(attr.value))
        report(node, "Literal font size is off the type scale; use a text-* token.");
    },
    Program(program) {
      for (const { node, text } of collectStrings(program as Node, context)) {
        if (CSS_FONT_SIZE.test(text))
          report(node, "Literal font-size is off the type scale; use a text-* token.");
      }
    },
  }),
);
