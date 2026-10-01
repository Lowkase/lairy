import {
  ChipActiveExample,
  ChipBadTonalExample,
  ChipBadToomanyExample,
  ChipBadVerbExample,
  ChipFilterExample,
  ChipGoodFewfacetsExample,
  ChipGoodOntoneExample,
  ChipGoodRemovableExample,
  ChipRemovableExample,
  ChipToggleExample,
} from "@lairy/ui/chip/examples";
import type { ComponentType } from "react";

/**
 * Content entries reference examples by id (docs/prd.md §7.1); content
 * itself never imports `ui` at runtime (docs/prd.md §6.1), so the docs app
 * is what resolves an id to the real example component. One map like this
 * per component, keyed by the component's own example ids.
 */
export const CHIP_EXAMPLES: Record<string, ComponentType> = {
  filter: ChipFilterExample,
  toggle: ChipToggleExample,
  removable: ChipRemovableExample,
  active: ChipActiveExample,
  "good-ontone": ChipGoodOntoneExample,
  "bad-tonal": ChipBadTonalExample,
  "good-fewfacets": ChipGoodFewfacetsExample,
  "bad-toomany": ChipBadToomanyExample,
  "good-removable": ChipGoodRemovableExample,
  "bad-verb": ChipBadVerbExample,
};
