import {
  LoadingBadGenericslabsExample,
  LoadingBadReplacedataExample,
  LoadingBadSpinnerExample,
  LoadingGoodMatchedgeometryExample,
  LoadingGoodNamedphaseExample,
  LoadingGoodRowcaretExample,
  LoadingInlineCaretExample,
  LoadingSkeletonExample,
  LoadingSweepStackExample,
} from "@lairy/ui/loading/examples";
import type { ComponentType } from "react";

/**
 * Content entries reference examples by id (docs/prd.md §7.1); content
 * itself never imports `ui` at runtime (docs/prd.md §6.1), so the docs app
 * is what resolves an id to the real example component. One map like this
 * per component, keyed by the component's own example ids.
 */
export const LOADING_EXAMPLES: Record<string, ComponentType> = {
  "sweep-stack": LoadingSweepStackExample,
  skeleton: LoadingSkeletonExample,
  "inline-caret": LoadingInlineCaretExample,
  "good-namedphase": LoadingGoodNamedphaseExample,
  "bad-spinner": LoadingBadSpinnerExample,
  "good-matchedgeometry": LoadingGoodMatchedgeometryExample,
  "bad-genericslabs": LoadingBadGenericslabsExample,
  "good-rowcaret": LoadingGoodRowcaretExample,
  "bad-replacedata": LoadingBadReplacedataExample,
};
