import { propertyName } from "../ast";
import { createRule } from "../create-rule";
import { isLiteralValue } from "../values";

const SPACING =
  /^(?:padding|margin)(?:Top|Right|Bottom|Left|Block|Inline|BlockStart|BlockEnd|InlineStart|InlineEnd)?$|^(?:gap|rowGap|columnGap|inset)$|^(?:padding|margin)-(?:top|right|bottom|left|block|inline)$|^(?:row-gap|column-gap)$/;

export const noOffScaleSpacing = createRule(
  "no-off-scale-spacing",
  "Disallow literal padding, margin and gap values; spacing comes from the ramp.",
  (_context, report) => ({
    Property(node) {
      const name = propertyName(node);
      if (!name || !SPACING.test(name)) return;
      if (isLiteralValue(node.value, { allowZero: true })) {
        report(node, `Literal ${name} is not a ramp token; use a spacing token.`);
      }
    },
  }),
);
