import { EmptyState } from "../empty-state";

export function EmptyStateNoResultsExample() {
  return (
    <EmptyState
      kind="no-results"
      headline="No runs match FAILED"
      body="Six runs are hidden by this filter."
      action={{ label: "Clear filter" }}
    />
  );
}
