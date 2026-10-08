/** Anti-pattern: dials in a multi-select menu. Round means one-of everywhere
 * else in the system, so a menu that allows several must not use them.
 * Static markup — the component cannot produce this on purpose. */
export function SelectMultiBadRoundDialsExample() {
  return (
    <div className="flex w-full flex-col rounded-ds border border-border-2 bg-bg p-4">
      <span className="flex items-center gap-8 rounded-ds bg-panel-2 px-8 py-8 text-body text-fg">
        <span aria-hidden className="flex size-16 items-center justify-center rounded-full border border-accent">
          <span className="size-6 rounded-full bg-accent" />
        </span>
        Ingest
      </span>
      <span className="flex items-center gap-8 rounded-ds px-8 py-8 text-body text-fg">
        <span aria-hidden className="size-16 rounded-full border border-border-2" />
        Summarize
      </span>
    </div>
  );
}
