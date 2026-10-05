import { Glyph } from "../../icons/glyph";

/**
 * Good: hover fills with --panel-2 and takes no rail; only the active row
 * keeps the 2px amber rail and label (Content/States, "the two never look
 * alike").
 */
export function MainRailGoodHoverNoRailExample() {
  return (
    <div className="flex flex-col gap-4 border border-border bg-bg p-8">
      <div className="flex items-center gap-12 rounded-ds bg-panel-2 px-8 py-8 text-fg">
        <Glyph name="apps" size="rail" />
        <span className="text-label tracking-tight-8">Signals</span>
      </div>
      <div className="relative flex items-center gap-12 rounded-ds px-8 py-8 text-fg">
        <span aria-hidden="true" className="absolute left-0 top-1/2 h-16 w-0 -translate-y-1/2 border-l-2 border-accent" />
        <Glyph name="grid" size="rail" />
        <span className="text-label tracking-tight-8">Fleet</span>
      </div>
    </div>
  );
}
