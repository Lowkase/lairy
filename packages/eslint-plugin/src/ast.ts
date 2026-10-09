import type { Rule } from "eslint";
import type { Node } from "estree";

export const CLASS_HELPERS = new Set(["cn", "clsx", "cva", "twMerge", "tv", "classNames"]);

type AnyNode = Node & { type: string; parent?: AnyNode };

/** A string-bearing node with its raw text. */
export interface TextNode {
  node: Node;
  text: string;
}

/** All string literals and template chunks beneath `root`, inclusive. */
export function collectStrings(root: Node, context: Rule.RuleContext): TextNode[] {
  const out: TextNode[] = [];
  const keys = context.sourceCode.visitorKeys;
  const walk = (node: AnyNode) => {
    if (node.type === "Literal" && typeof (node as { value?: unknown }).value === "string") {
      out.push({ node, text: (node as unknown as { value: string }).value });
      return;
    }
    if (node.type === "TemplateElement") {
      out.push({ node, text: (node as unknown as { value: { cooked: string } }).value.cooked });
      return;
    }
    for (const key of keys[node.type] ?? []) {
      const child = (node as unknown as Record<string, unknown>)[key];
      for (const item of Array.isArray(child) ? child : [child]) {
        if (item && typeof (item as AnyNode).type === "string") walk(item as AnyNode);
      }
    }
  };
  walk(root as AnyNode);
  return out;
}

/** Strings that hold Tailwind classes: `className`/`class` attributes and the
 * arguments of cn/clsx/cva/twMerge-style helpers. Each node appears once. */
export function onClassStrings(
  context: Rule.RuleContext,
  visit: (entry: TextNode) => void,
): Rule.RuleListener {
  const seen = new WeakSet<object>();
  const emit = (root: Node) => {
    for (const entry of collectStrings(root, context)) {
      if (seen.has(entry.node)) continue;
      seen.add(entry.node);
      visit(entry);
    }
  };
  return {
    JSXAttribute(node: Node) {
      const attr = node as unknown as { name: { type: string; name: string }; value: Node | null };
      if (
        attr.name.type === "JSXIdentifier" &&
        /^(className|class)$/.test(attr.name.name) &&
        attr.value
      ) {
        emit(attr.value);
      }
    },
    CallExpression(node) {
      if (node.callee.type === "Identifier" && CLASS_HELPERS.has(node.callee.name)) {
        for (const arg of node.arguments) emit(arg);
      }
    },
  };
}

/** Split a Tailwind class string into `{ variants, utility }` pieces,
 * respecting brackets so `[&>svg]:size-4` and `w-[calc(1px+2px)]` stay whole. */
export function parseClasses(text: string): { variants: string[]; utility: string }[] {
  const classes: string[] = [];
  let current = "";
  let depth = 0;
  for (const ch of text) {
    if (ch === "[" || ch === "(") depth++;
    if (ch === "]" || ch === ")") depth = Math.max(0, depth - 1);
    if (/\s/.test(ch) && depth === 0) {
      if (current) classes.push(current);
      current = "";
    } else current += ch;
  }
  if (current) classes.push(current);
  return classes.map((cls) => {
    const parts: string[] = [];
    let part = "";
    let d = 0;
    for (const ch of cls) {
      if (ch === "[" || ch === "(") d++;
      if (ch === "]" || ch === ")") d = Math.max(0, d - 1);
      if (ch === ":" && d === 0) {
        parts.push(part);
        part = "";
      } else part += ch;
    }
    parts.push(part);
    const utility = (parts.pop() ?? "").replace(/^!/, "").replace(/!$/, "");
    return { variants: parts, utility };
  });
}

/** Name of an object property key (`fontSize`, `"font-size"`), if static. */
export function propertyName(node: Node): string | undefined {
  if (node.type !== "Property") return undefined;
  const { key, computed } = node;
  if (!computed && key.type === "Identifier") return key.name;
  if (key.type === "Literal" && typeof key.value === "string") return key.value;
  return undefined;
}
