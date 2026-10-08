/** Anti-pattern: the set replaced by a count, so the operator has to reopen
 * the menu to learn what they chose. Static markup — the component cannot
 * produce this on purpose. */
export function SelectMultiBadCountInsteadOfSetExample() {
  return (
    <div className="flex h-44 w-full items-center justify-between rounded-ds border border-border-2 bg-bg px-12">
      <span className="text-small text-fg">2 stages selected</span>
      <span aria-hidden className="text-micro text-mute">
        ▾
      </span>
    </div>
  );
}
