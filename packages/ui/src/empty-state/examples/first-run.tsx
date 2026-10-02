import { EmptyState } from "../empty-state";

export function EmptyStateFirstRunExample() {
  return (
    <EmptyState
      kind="first-run"
      headline="No runs in this window"
      body="Runs from the last 24 hours appear here once a workflow is scheduled."
      action={{ label: "Schedule a run" }}
    />
  );
}
