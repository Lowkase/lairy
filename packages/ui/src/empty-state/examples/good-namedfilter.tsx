import { EmptyState } from "../empty-state";

export function EmptyStateGoodNamedfilterExample() {
  return (
    <EmptyState
      kind="no-results"
      headline="No runs match FAILED"
      body="Six runs are hidden by this filter."
      action={{ label: "Clear filter" }}
    />
  );
}
