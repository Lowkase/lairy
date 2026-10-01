import { Glyph, InlineIcon, type GlyphName, type InlineIconName } from "@lairy/ui/icons";
import { ThemeToggle } from "../../../components/theme-toggle";
import { DevSection } from "../tokens/dev-section";

// The seventeen-mark inventory (Icons foundation, icoDocs icoGlyphSet /
// icoInlineSet) — which SVG exists under which name, now that it lives in
// the icon components themselves rather than the Foundation entry
// (packages/content/src/entries/foundations/icons.ts extractionNotes).
const GLYPHS: { name: GlyphName; use: string }[] = [
  { name: "apps", use: "Launcher" },
  { name: "rings", use: "Overview" },
  { name: "wave", use: "Signals" },
  { name: "nodes", use: "Automations" },
  { name: "hex", use: "Fleet" },
  { name: "scan", use: "Research · empty" },
  { name: "grid", use: "Workspaces" },
  { name: "check", use: "Next actions" },
  { name: "build", use: "Settings" },
  { name: "book", use: "Docs" },
  { name: "pot", use: "Archive" },
  { name: "cmd", use: "Command" },
];

const INLINE_ICONS: { name: InlineIconName; use: string }[] = [
  { name: "open", use: "Open · external" },
  { name: "gear", use: "Settings row" },
  { name: "spark", use: "Agent · generated" },
  { name: "arrow", use: "Shortcut · go" },
  { name: "drain", use: "Destructive verb" },
];

export default function IconsDevPage() {
  return (
    <ThemeToggle>
      <div className="flex flex-col gap-32">
        <div className="flex flex-col gap-8">
          <h1 className="font-heading font-semibold text-doc-title tracking-tight-neg-2 text-fg">
            Icons — both families
          </h1>
          <p className="text-small text-mute">
            Twelve glyphs on the 40 grid, five inline icons on the 24 grid (Icons foundation). Every mark draws in a
            single currentColor pass — toggle the theme above to see it hold.
          </p>
        </div>

        <DevSection number="01" title="Glyphs" meta="40 grid · stroke 2.2">
          <div className="grid grid-cols-2 gap-22 tablet:grid-cols-4 desktop:grid-cols-6">
            {GLYPHS.map((g) => (
              <div key={g.name} className="flex flex-col items-center gap-8 text-center">
                <span className="flex items-center justify-center text-fg">
                  <Glyph name={g.name} size="tile" label={g.use} />
                </span>
                <span className="text-small text-fg">{g.name}</span>
                {/* text-mute, not text-faint: --faint fails the 4.5:1 AA
                    floor for normal-size text in the light theme (3.69:1,
                    measured via axe) — --mute clears it in both themes. */}
                <span className="text-micro uppercase tracking-tight-20 text-mute">{g.use}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-micro uppercase tracking-tight-20 text-mute">Rail size (22px)</span>
            <div className="flex flex-wrap items-center gap-16 rounded-ds border border-border bg-panel p-16 text-fg">
              {GLYPHS.map((g) => (
                <Glyph key={g.name} name={g.name} size="rail" label={g.use} />
              ))}
            </div>
          </div>
        </DevSection>

        <DevSection number="02" title="Inline icons" meta="24 grid · stroke 2 · fixed 16px">
          <div className="grid grid-cols-1 gap-12 tablet:grid-cols-2 desktop:grid-cols-3">
            {INLINE_ICONS.map((i) => (
              <div key={i.name} className="flex items-center gap-12 border border-border p-12 text-dim">
                <span className="flex w-16 shrink-0 items-center justify-center">
                  <InlineIcon name={i.name} label={i.use} />
                </span>
                <span className="flex min-w-0 flex-col gap-4">
                  <span className="text-small text-fg">{i.name}</span>
                  <span className="text-micro uppercase tracking-tight-6 text-mute">{i.use}</span>
                </span>
              </div>
            ))}
          </div>
        </DevSection>
      </div>
    </ThemeToggle>
  );
}
