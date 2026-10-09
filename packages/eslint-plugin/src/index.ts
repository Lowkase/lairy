import type { ESLint, Linter } from "eslint";
import { noArbitraryTailwindValue } from "./rules/no-arbitrary-tailwind-value";
import { noHardcodedColor } from "./rules/no-hardcoded-color";
import { noOffScaleSize } from "./rules/no-off-scale-size";
import { noOffScaleSpacing } from "./rules/no-off-scale-spacing";
import { noPositiveTabindex } from "./rules/no-positive-tabindex";
import { noRemovedFocusOutline } from "./rules/no-removed-focus-outline";

/** Keyed by the `enforceable.id` tagged on the content rule each one checks. */
export const rules = {
  "no-arbitrary-tailwind-value": noArbitraryTailwindValue,
  "no-hardcoded-color": noHardcodedColor,
  "no-off-scale-size": noOffScaleSize,
  "no-off-scale-spacing": noOffScaleSpacing,
  "no-positive-tabindex": noPositiveTabindex,
  "no-removed-focus-outline": noRemovedFocusOutline,
};

export const plugin: ESLint.Plugin = { meta: { name: "@lairy/eslint-plugin" }, rules };

/** Flat-config preset: every rule on, as errors. */
export const recommended: Linter.Config = {
  plugins: { lairy: plugin },
  rules: Object.fromEntries(Object.keys(rules).map((id) => [`lairy/${id}`, "error"])),
};

export default plugin;
