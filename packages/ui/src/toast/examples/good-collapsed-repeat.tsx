import { Toast } from "../toast";

/** Do and don't, pair 3 (good): repeats of the same event collapse into
 * one counted toast rather than a stack. */
export function ToastGoodCollapsedRepeatExample() {
  return <Toast intent="success" title="3 runs exported" count={3} detail="Grouped from 3 messages" />;
}
