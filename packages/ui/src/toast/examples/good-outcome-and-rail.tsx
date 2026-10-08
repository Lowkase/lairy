import { Toast } from "../toast";

/** Do and don't, pair 1 (good): the outcome in the title, the consequence
 * underneath, and a rail carrying the intent. */
export function ToastGoodOutcomeAndRailExample() {
  return <Toast intent="success" title="Workflow approved" detail="Export resumed · 7 items cleared" />;
}
