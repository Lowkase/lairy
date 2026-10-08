import { Toast } from "../toast";

/** Do and don't, pair 2 (good): a failure may carry one amber link to
 * where the operator can look. */
export function ToastGoodFailureLinkExample() {
  return (
    <Toast
      intent="fail"
      title="Run failed"
      detail="Normalize timed out after 30s"
      action={{ label: "View log", href: "#log" }}
    />
  );
}
