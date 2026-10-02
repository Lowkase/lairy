import { EmptyState } from "../empty-state";

export function EmptyStateRestrictedExample() {
  return (
    <EmptyState
      kind="restricted"
      headline="Not visible to you"
      body="Ask the workspace owner to grant access to Fleet."
    />
  );
}
