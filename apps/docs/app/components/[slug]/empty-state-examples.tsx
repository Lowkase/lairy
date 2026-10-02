import {
  EmptyStateBadApologyExample,
  EmptyStateBadDashedboxExample,
  EmptyStateFirstRunExample,
  EmptyStateGoodNamedfilterExample,
  EmptyStateGoodNamewhohasaccessExample,
  EmptyStateGoodOnewayforwardExample,
  EmptyStateNoResultsExample,
  EmptyStateRestrictedExample,
} from "@lairy/ui/empty-state/examples";
import type { ComponentType } from "react";

/**
 * Content entries reference examples by id (docs/prd.md §7.1); content
 * itself never imports `ui` at runtime (docs/prd.md §6.1), so the docs app
 * is what resolves an id to the real example component. One map like this
 * per component, keyed by the component's own example ids.
 */
export const EMPTY_STATE_EXAMPLES: Record<string, ComponentType> = {
  "first-run": EmptyStateFirstRunExample,
  "no-results": EmptyStateNoResultsExample,
  restricted: EmptyStateRestrictedExample,
  "good-onewayforward": EmptyStateGoodOnewayforwardExample,
  "bad-apology": EmptyStateBadApologyExample,
  "good-namedfilter": EmptyStateGoodNamedfilterExample,
  "bad-dashedbox": EmptyStateBadDashedboxExample,
  "good-namewhohasaccess": EmptyStateGoodNamewhohasaccessExample,
};
