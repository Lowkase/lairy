import {
  BadgeBadDotonlyExample,
  BadgeBadLongExample,
  BadgeBadStackExample,
  BadgeFailExample,
  BadgeGoodInlineExample,
  BadgeGoodShortExample,
  BadgeGoodWordExample,
  BadgeInfoExample,
  BadgeNeutralExample,
  BadgeSuccessExample,
} from "@lairy/ui/badge/examples";
import type { ComponentType } from "react";

/**
 * Content entries reference examples by id (docs/prd.md §7.1); content
 * itself never imports `ui` at runtime (docs/prd.md §6.1), so the docs app
 * is what resolves an id to the real example component. One map like this
 * per component, keyed by the component's own example ids.
 */
export const BADGE_EXAMPLES: Record<string, ComponentType> = {
  neutral: BadgeNeutralExample,
  info: BadgeInfoExample,
  success: BadgeSuccessExample,
  fail: BadgeFailExample,
  "good-inline": BadgeGoodInlineExample,
  "bad-stack": BadgeBadStackExample,
  "good-short": BadgeGoodShortExample,
  "bad-long": BadgeBadLongExample,
  "good-word": BadgeGoodWordExample,
  "bad-dotonly": BadgeBadDotonlyExample,
};
