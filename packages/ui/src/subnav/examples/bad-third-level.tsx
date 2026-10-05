/** Bad: a third level of nesting. There is no third level — a page that needs children has outgrown the subnav. */
export function SubnavBadThirdLevelExample() {
  return (
    <div className="flex flex-col gap-1 border border-border bg-panel p-12">
      <div className="py-8 px-12 text-label tracking-tight-14 uppercase text-fg">Fleet</div>
      <div className="mt-4 mb-6 ml-12 flex flex-col gap-4 border-l border-border pl-12">
        <div className="text-small text-fg">Live vessels</div>
        <div className="mt-4 ml-12 flex flex-col gap-4 border-l border-border pl-12 text-micro text-mute">
          <div>Vessel 04</div>
          <div>Vessel 07</div>
        </div>
      </div>
    </div>
  );
}
