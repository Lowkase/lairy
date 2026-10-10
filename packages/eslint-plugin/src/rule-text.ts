import { listComponents, listFoundations, listPatterns, type Rule } from "@lairy/content";

/** Every content rule tagged `enforceable: { kind: "lint" }`, by lint id. */
export function lintRules(): Map<string, Rule> {
  const found = new Map<string, Rule>();
  const groups: Rule[][] = [
    ...listFoundations().map((entry) => entry.principles),
    ...listComponents().map((entry) => entry.contentRules),
    ...listPatterns().map((entry) => entry.rules),
  ];
  for (const rule of groups.flat()) {
    if (rule.enforceable?.kind === "lint") found.set(rule.enforceable.id, rule);
  }
  return found;
}

/** The content rule text a lint rule enforces, quoted in its messages (D6). */
export function ruleText(id: string): string {
  const rule = lintRules().get(id);
  if (!rule) throw new Error(`No content rule is tagged enforceable: lint for "${id}".`);
  return rule.text;
}
