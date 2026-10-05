/** Good: uppercase sections, sentence-case pages — the case change tells the two levels apart. */
export function SubnavGoodCaseSignalsLevelExample() {
  return (
    <div className="flex flex-col gap-1 border border-border bg-panel p-12">
      <div className="py-8 px-12 text-label tracking-tight-14 uppercase text-fg">Operations</div>
      <div className="mt-4 mb-6 ml-12 flex flex-col gap-4 border-l border-border pl-12">
        <div className="text-small text-mute">Live vessels</div>
        <div className="text-small text-mute">Maintenance</div>
      </div>
    </div>
  );
}
