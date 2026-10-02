import { EmptyState } from "../empty-state";

export function EmptyStateGoodOnewayforwardExample() {
  return (
    <EmptyState
      kind="first-run"
      headline="No workflows yet"
      body="A workflow chains steps into one run you can schedule."
      action={{ label: "New workflow" }}
    />
  );
}
