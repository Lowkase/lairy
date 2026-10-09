import type { Node } from "estree";

const LENGTH = /(?<![\w.-])-?(?:\d*\.)?\d+(?:px|rem|em)\b/;

/** True for a numeric or length-bearing string literal — a value that should
 * have been a token. `var(--x)`, keywords and `0` pass. */
export function isLiteralValue(node: Node, { allowZero = false } = {}): boolean {
  if ((node.type as string) === "JSXExpressionContainer") {
    return isLiteralValue((node as unknown as { expression: Node }).expression, { allowZero });
  }
  if (node.type === "Literal") {
    if (typeof node.value === "number") return !(allowZero && node.value === 0);
    if (typeof node.value === "string") {
      const text = node.value.replace(/var\([^)]*\)/g, "").trim();
      if (/^-?(?:\d*\.)?\d+$/.test(text)) return !(allowZero && Number(text) === 0);
      return LENGTH.test(text);
    }
    return false;
  }
  if (node.type === "TemplateLiteral" && node.expressions.length === 0) {
    return isLiteralValue({ type: "Literal", value: node.quasis[0]?.value.cooked ?? "" } as Node, {
      allowZero,
    });
  }
  return false;
}
