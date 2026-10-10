import type { Node } from "estree";
import { propertyName } from "../ast";
import { createRule } from "../create-rule";

function isPositive(node: Node | null | undefined): boolean {
  if (!node) return false;
  if (node.type === "Literal") return Number(node.value) > 0;
  if ((node.type as string) === "JSXExpressionContainer") {
    return isPositive((node as unknown as { expression: Node }).expression);
  }
  return false;
}

export const noPositiveTabindex = createRule(
  "no-positive-tabindex",
  "Disallow a positive tabindex; tab order follows source order.",
  (_context, report) => ({
    JSXAttribute(node: Node) {
      const attr = node as unknown as { name: { type: string; name: string }; value: Node | null };
      if (
        attr.name.type === "JSXIdentifier" &&
        /^tabindex$/i.test(attr.name.name) &&
        isPositive(attr.value)
      ) {
        report(node, "Positive tabindex overrides source order.");
      }
    },
    Property(node) {
      if (/^tabindex$/i.test(propertyName(node) ?? "") && isPositive(node.value)) {
        report(node, "Positive tabindex overrides source order.");
      }
    },
  }),
);
