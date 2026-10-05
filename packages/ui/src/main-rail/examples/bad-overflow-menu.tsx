import { Glyph } from "../../icons/glyph";

/**
 * Bad: items folded into a "more" overflow menu. A rail that hides items
 * behind a second interaction is no longer answerable by memory.
 */
export function MainRailBadOverflowMenuExample() {
  return (
    <div className="flex flex-col gap-4 border border-border bg-bg p-8">
      <div className="flex items-center gap-12 rounded-ds px-8 py-8 text-fg">
        <Glyph name="apps" size="rail" />
        <span className="text-label tracking-tight-8">Launcher</span>
      </div>
      <div className="relative flex items-center gap-12 rounded-ds px-8 py-8 text-fg">
        <span aria-hidden="true" className="absolute left-0 top-1/2 h-16 w-0 -translate-y-1/2 border-l-2 border-accent" />
        <Glyph name="grid" size="rail" />
        <span className="text-label tracking-tight-8">Fleet</span>
      </div>
      <div className="flex items-center gap-12 rounded-ds px-8 py-8 text-dim">
        <span className="flex size-22 shrink-0 items-center justify-center text-label">⋯</span>
        <span className="text-label tracking-tight-8">More</span>
      </div>
    </div>
  );
}
