import type { CnFunction } from "cn";
import { createCn } from "cn/config";
import { colorTokenNames } from "@lairy/tokens";

/**
 * `cn`'s default tables are compiled from tailwind-merge's stock config,
 * which knows nothing about our tokens (ADR-0003 removes Tailwind's default
 * theme entirely). Without this, classes that share a prefix with a
 * differently-typed default utility — `text-label` (a font-size) alongside
 * `text-bg` (a color) — get misclassified into the same conflict group and
 * one silently drops the other.
 */
export const cn: CnFunction = createCn({
  extend: {
    classGroups: {
      "bg-color": [{ bg: colorTokenNames }],
      "text-color": [{ text: colorTokenNames }],
      "border-color": [{ border: colorTokenNames }],
      "ring-color": [{ ring: ["accent-line"] }],
      "ring-offset-color": [{ "ring-offset": ["bg"] }],
      "font-size": [{ text: ["small", "label", "callout-title"] }],
      "font-family": [{ font: ["heading", "body"] }],
      "font-weight": [{ font: ["regular", "semibold"] }],
      tracking: [{ tracking: ["tight-6"] }],
      rounded: [{ rounded: ["ds"] }],
    },
  },
});
