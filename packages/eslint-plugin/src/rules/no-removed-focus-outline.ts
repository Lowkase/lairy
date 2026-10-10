import type { Node, Property } from "estree";
import { collectStrings, onClassStrings, parseClasses, propertyName } from "../ast";
import { createRule } from "../create-rule";

const REMOVED = new Set(["outline-none", "outline-0", "outline-hidden"]);
const FOCUS_VARIANTS = new Set(["focus", "focus-visible", "focus-within"]);
const CSS_REMOVED = /outline(?:-style)?\s*:\s*(?:none|0)\s*(?:;|$|!)/i;

export const noRemovedFocusOutline = createRule(
  "no-removed-focus-outline",
  "Disallow removing the focus outline without a replacement.",
  (context, report) => ({
    ...onClassStrings(context, ({ node, text }) => {
      const classes = parseClasses(text);
      const replaced = classes.some(
        ({ variants, utility }) =>
          utility === "focus-ring" ||
          (variants.some((v) => FOCUS_VARIANTS.has(v)) &&
            (/^(?:ring|shadow)/.test(utility) ||
              (utility.startsWith("outline-") && !REMOVED.has(utility)))),
      );
      if (replaced) return;
      for (const { utility } of classes) {
        if (REMOVED.has(utility))
          report(node, `"${utility}" removes the focus outline with no replacement.`);
      }
    }),
    ObjectExpression(node) {
      const props = node.properties.filter((p): p is Property => p.type === "Property");
      const replaced = props.some((p) => propertyName(p) === "boxShadow");
      if (replaced) return;
      for (const prop of props) {
        const name = propertyName(prop);
        if (name !== "outline" && name !== "outlineStyle") continue;
        const value = prop.value;
        if (
          value.type === "Literal" &&
          (value.value === 0 || value.value === "0" || value.value === "none")
        ) {
          report(
            prop,
            "Setting the outline to none removes the focus outline with no replacement.",
          );
        }
      }
    },
    Program(program) {
      for (const { node, text } of collectStrings(program as Node, context)) {
        if (CSS_REMOVED.test(text))
          report(node, "Setting the outline to none removes the focus outline.");
      }
    },
  }),
);
