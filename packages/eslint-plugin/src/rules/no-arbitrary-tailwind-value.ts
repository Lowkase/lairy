import { onClassStrings, parseClasses } from "../ast";
import { createRule } from "../create-rule";

const NEGATIVE_MARGIN = /^-m[xytrblse]?-/;

/** `[scrollbar-color:var(--mute)_transparent]` names a token and a keyword —
 * no literal. Anything carrying a digit or `#` once var() refs are removed
 * (`[10.5px]`, `[#fff]`, `[calc(var(--x)+4px)]`) is a literal. */
function onlyTokenRefs(utility: string): boolean {
  return !/[\d#]/.test(utility.replace(/var\(--[\w-]+\)/g, ""));
}

export const noArbitraryTailwindValue = createRule(
  "no-arbitrary-tailwind-value",
  "Disallow arbitrary Tailwind values, arbitrary properties and negative margins.",
  (context, report) =>
    onClassStrings(context, ({ node, text }) => {
      for (const { utility } of parseClasses(text)) {
        if (utility.startsWith("[") && onlyTokenRefs(utility.slice(utility.indexOf(":")))) {
          continue;
        }
        if (utility.startsWith("[")) {
          report(node, `Arbitrary property "${utility}" is off-system.`);
        } else if (/-\[.+\]/.test(utility)) {
          report(node, `Arbitrary value "${utility}" is off-system; use a token utility.`);
        } else if (NEGATIVE_MARGIN.test(utility)) {
          report(node, `Negative margin "${utility}" is a magic offset.`);
        }
      }
    }),
);
