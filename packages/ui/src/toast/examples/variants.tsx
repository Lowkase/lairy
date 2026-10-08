import { Toast } from "../toast";

/** The four intents side by side, as they sit in the docs' Variants grid. */
export function ToastVariantsExample() {
  return (
    <div className="flex flex-col gap-12">
      <Toast intent="success" title="Workflow approved" detail="Export resumed · 7 queued items cleared" />
      <Toast intent="fail" title="Run failed" detail="Normalize step timed out after 30s" />
      <Toast intent="info" title="Sync scheduled" detail="Next integrity sweep starts at 15:00" />
      <Toast intent="neutral" title="Draft saved" detail="No checks were run on this change" />
    </div>
  );
}
