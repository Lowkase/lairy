/** Good: only one section is ever expanded, so the column's height stays predictable. */
export function SubnavGoodOneSectionOpenExample() {
  return (
    <div className="flex flex-col gap-1 border border-border bg-panel p-12">
      <div className="flex items-center justify-between py-8 px-12 text-label tracking-tight-14 uppercase text-dim">
        <span>Operations</span>
        <span className="text-faint">4</span>
      </div>
      <div className="relative flex items-center justify-between py-8 px-12 text-label tracking-tight-14 uppercase text-fg">
        <span aria-hidden="true" className="absolute left-0 top-6 bottom-6 w-0 border-l-2 border-accent" />
        <span>Fleet</span>
        <span className="text-faint">3</span>
      </div>
      <div className="mt-4 mb-6 ml-12 flex flex-col gap-4 border-l border-border pl-12">
        <div className="relative rounded-ds bg-panel-2 py-8 px-12 text-small text-fg">
          <span aria-hidden="true" className="absolute left-0 top-1/2 h-16 w-0 -translate-y-1/2 border-l-2 border-accent" />
          Live vessels
        </div>
        <div className="py-8 px-12 text-small text-mute">Maintenance</div>
        <div className="py-8 px-12 text-small text-mute">Crew roster</div>
      </div>
      <div className="py-8 px-12 text-label tracking-tight-14 uppercase text-dim">Research</div>
      <div className="py-8 px-12 text-label tracking-tight-14 uppercase text-dim">Archive</div>
    </div>
  );
}
