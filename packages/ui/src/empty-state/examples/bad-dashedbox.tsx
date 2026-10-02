import { EmptyState } from "../empty-state";

export function EmptyStateBadDashedboxExample() {
  return (
    <div className="rounded-ds border border-dashed border-border-2 p-18">
      <EmptyState kind="restricted" headline="No data" />
    </div>
  );
}
