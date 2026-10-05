import { Glyph } from "../../icons/glyph";

/** Bad: a fourth zone. Search, counts and page actions each have a home already. */
export function HeaderBadFourthZoneExample() {
  return (
    <div className="flex items-center justify-between gap-18 border border-border bg-bg px-22 py-12">
      <div className="flex items-center gap-8">
        <span aria-hidden="true" className="flex items-center text-accent">
          <Glyph name="grid" size="rail" />
        </span>
        <span className="text-label tracking-tight-20 text-fg">COMPONENTS</span>
      </div>
      <div className="rounded-ds border border-border-2 py-4 px-12 text-small text-mute">Search…</div>
      <div className="rounded-ds bg-accent py-4 px-12 text-small text-bg">New</div>
      <div className="flex items-center gap-8 text-dim">
        <span className="text-label tracking-tight-14">14:02:07</span>
      </div>
    </div>
  );
}
