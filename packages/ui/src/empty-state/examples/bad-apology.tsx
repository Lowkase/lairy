import { EmptyState } from "../empty-state";

export function EmptyStateBadApologyExample() {
  return (
    <EmptyState
      kind="first-run"
      headline="Oops — nothing to see here!"
      body="Sorry, we couldn’t find anything for you right now. Why not try again later?"
      action={{ label: "New workflow" }}
    />
  );
}
