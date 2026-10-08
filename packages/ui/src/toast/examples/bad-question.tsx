import { Button } from "../../button/button";

/** Do and don't, pair 2 (bad): a question in a toast. It takes no focus
 * and leaves on a timer, so the answer is whatever the timeout chose.
 * Deliberately not a `Toast` — the component has no way to ask. */
export function ToastBadQuestionExample() {
  return (
    <div
      role="presentation"
      className="flex flex-col gap-12 rounded-ds border border-border bg-bg px-18 py-12 font-body text-body text-fg"
    >
      Delete 3 workflows?
      <div className="flex gap-8">
        <Button variant="primary">Delete</Button>
        <Button variant="secondary">Cancel</Button>
      </div>
    </div>
  );
}
