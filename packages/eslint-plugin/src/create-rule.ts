import type { Rule } from "eslint";
import { ruleText } from "./rule-text";

export type Report = (node: unknown, detail: string) => void;

/** A Lairy lint rule. `id` is the `enforceable.id` tagged on a content rule;
 * every message quotes that rule's text, so docs, agent guidance and the
 * failing check all say the same sentence (PRD D6). */
export function createRule(
  id: string,
  description: string,
  listener: (context: Rule.RuleContext, report: Report) => Rule.RuleListener,
): Rule.RuleModule {
  return {
    meta: {
      type: "problem",
      docs: { description },
      schema: [],
      messages: { violation: '{{detail}} Lairy rule: "{{rule}}"' },
    },
    create(context) {
      const rule = ruleText(id);
      return listener(context, (node, detail) =>
        context.report({ node: node as never, messageId: "violation", data: { detail, rule } }),
      );
    },
  };
}
