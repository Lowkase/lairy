import { Glyph } from "../../icons/glyph";

/** Good: three zones, one accent, and the bar reads in half a second. */
export function HeaderGoodChromeOnlyExample() {
  return (
    <div className="flex items-center justify-between gap-18 border border-border bg-bg px-22 py-12">
      <div className="flex items-center gap-8">
        <span aria-hidden="true" className="flex items-center text-accent">
          <Glyph name="grid" size="rail" />
        </span>
        <span className="text-label tracking-tight-20 text-fg">COMPONENTS</span>
      </div>
      <div className="flex items-center gap-8 text-dim">
        <span className="text-label tracking-tight-14">WED 23 AUG 2026</span>
        <span aria-hidden="true" className="h-12 w-0 border-l border-border-2" />
        <span className="text-label tracking-tight-14 text-mute">14:02:07</span>
      </div>
    </div>
  );
}
