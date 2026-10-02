import {
  ScrollbarBadWidenedExample,
  ScrollbarGoodQuietExample,
  ScrollbarPanelExample,
} from "@lairy/ui/scrollbar/examples";
import type { ComponentType } from "react";

/**
 * Content entries reference examples by id (docs/prd.md §7.1); content
 * itself never imports `ui` at runtime (docs/prd.md §6.1), so the docs app
 * is what resolves an id to the real example component. One map like this
 * per component, keyed by the component's own example ids.
 */
export const SCROLLBAR_EXAMPLES: Record<string, ComponentType> = {
  panel: ScrollbarPanelExample,
  "good-quiet": ScrollbarGoodQuietExample,
  "bad-widened": ScrollbarBadWidenedExample,
};
