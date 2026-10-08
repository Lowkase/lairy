import { Toast } from "../toast";

/** Do and don't, pair 3 (bad): the same event repeated down the corner — a
 * column of toasts is a queue nobody asked to read. */
export function ToastBadStackedRepeatsExample() {
  return (
    <div className="flex flex-col gap-8">
      <Toast intent="success" title="1 run exported" />
      <Toast intent="success" title="1 run exported" />
      <Toast intent="success" title="1 run exported" />
    </div>
  );
}
