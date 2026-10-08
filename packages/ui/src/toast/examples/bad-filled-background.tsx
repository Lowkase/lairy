/** Do and don't, pair 1 (bad): the surface filled with the intent colour,
 * so a corner report outshouts the workspace. Deliberately not a `Toast` —
 * the component has no such variant. */
export function ToastBadFilledBackgroundExample() {
  return (
    <div
      role="presentation"
      className="rounded-ds bg-accent px-18 py-12 font-body text-body text-bg"
    >
      Workflow approved
    </div>
  );
}
