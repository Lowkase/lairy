/** Bad: indent as the only signal, with both levels in the same case — it disappears the moment a label wraps. */
export function SubnavBadIndentOnlyExample() {
  return (
    <div className="flex flex-col gap-1 border border-border bg-panel p-12">
      <div className="py-8 px-12 text-small text-fg">Operations</div>
      <div className="ml-12 flex flex-col gap-4 pl-12 text-small text-mute">
        <div>Live vessels</div>
        <div>Maintenance that runs long enough to wrap onto a second line</div>
      </div>
    </div>
  );
}
