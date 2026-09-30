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
      "font-size": [
        { text: ["display", "title", "metric", "small", "label", "callout-title", "micro", "body", "section", "doc-title"] },
      ],
      "font-family": [{ font: ["heading", "body"] }],
      "font-weight": [{ font: ["regular", "semibold"] }],
      tracking: [
        {
          tracking: [
            "tight-6",
            "tight-8",
            "tight-10",
            "tight-12",
            "tight-14",
            "tight-16",
            "tight-20",
            "tight-neg-1",
            "tight-neg-2",
          ],
        },
      ],
      rounded: [{ rounded: ["ds", "chip"] }],
      shadow: [
        {
          shadow: [
            "bubble",
            "menu",
            "overlay",
            "overlay-horizontal",
            "hover-lift",
            "hover-lift-accent",
            "press",
            "press-primary",
          ],
        },
      ],
      ease: [{ ease: ["standard", "symmetric", "draw"] }],
      animate: [
        {
          animate: [
            "fade-in",
            "rise-in",
            "panel-in",
            "widget-in",
            "drawer-in",
            "draw-in",
            "pulse",
            "breathe",
            "shimmer",
            "sweepline",
          ],
        },
      ],
    },
  },
});
