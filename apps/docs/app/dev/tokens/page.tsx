import { breakpoint, duration, easing, leading, shadow, space, text, tracking, zIndex } from "@lairy/tokens";
import { ThemeToggle } from "../../../components/theme-toggle";
import { alarmInkPairing, contrastPairings } from "./contrast";
import { DECISIONS } from "./decisions";
import { DevSection } from "./dev-section";
import { ReplayDemo } from "./replay-demo";

const TYPE_SCALE = [
  {
    name: "Display",
    use: "Page hero only",
    className: "font-heading font-semibold text-display tracking-tight-neg-2",
    sizePx: text.display,
    leadingValue: leading.display,
    trackingValue: tracking.tightNeg2,
    sample: "Operate with certainty",
  },
  {
    name: "Doc title",
    use: "Docs page title",
    className: "font-heading font-semibold text-doc-title tracking-tight-neg-2",
    sizePx: text.docTitle,
    leadingValue: leading.docTitle,
    trackingValue: tracking.tightNeg2,
    sample: "Callout",
  },
  {
    name: "Title",
    use: "Workspace name",
    className: "font-heading font-semibold text-title tracking-tight-neg-2",
    sizePx: text.title,
    leadingValue: leading.title,
    trackingValue: tracking.tightNeg2,
    sample: "Northwind Ops",
  },
  {
    name: "Metric",
    use: "Numbers in stat cards",
    className: "font-heading font-semibold text-metric tracking-tight-neg-1",
    sizePx: text.metric,
    leadingValue: leading.metric,
    trackingValue: tracking.tightNeg1,
    sample: "99.98%",
  },
  {
    name: "Section",
    use: "Section titles",
    className: "font-heading font-semibold text-section",
    sizePx: text.section,
    leadingValue: leading.section,
    trackingValue: undefined,
    sample: "Foundations",
  },
  {
    name: "Body",
    use: "Rows, paragraphs",
    className: "font-body text-body",
    sizePx: text.body,
    leadingValue: leading.body,
    trackingValue: undefined,
    sample: "A Callout reports a standing condition inside the panel it belongs to.",
  },
  {
    name: "Small",
    use: "Rows, hints, buttons, card body",
    className: "font-body text-small",
    sizePx: text.small,
    leadingValue: leading.small,
    trackingValue: undefined,
    sample: "Eighteen of twenty-five documented.",
  },
  {
    name: "Label",
    use: "Uppercase panel headers, chips",
    className: "font-body text-label uppercase tracking-tight-16",
    sizePx: text.label,
    leadingValue: leading.label,
    trackingValue: tracking.tight16,
    sample: "Use when",
  },
  {
    name: "Micro",
    use: "Uppercase codes, badges, table headers",
    className: "font-body text-micro uppercase tracking-tight-20",
    sizePx: text.micro,
    leadingValue: leading.micro,
    trackingValue: tracking.tight20,
    sample: "AUT·02",
  },
] as const;

// Tailwind's scanner needs the literal class text in source (a template
// literal like `w-${step}` is invisible to it), so each step's width utility
// is spelled out here instead of interpolated.
const SPACING_STEPS: { step: string; px: string; className: string }[] = [
  { step: "4", px: space["4"], className: "w-4" },
  { step: "6", px: space["6"], className: "w-6" },
  { step: "8", px: space["8"], className: "w-8" },
  { step: "12", px: space["12"], className: "w-12" },
  { step: "16", px: space["16"], className: "w-16" },
  { step: "18", px: space["18"], className: "w-18" },
  { step: "22", px: space["22"], className: "w-22" },
  { step: "32", px: space["32"], className: "w-32" },
  { step: "44", px: space["44"], className: "w-44" },
];

const SHADOW_DEMOS: { name: keyof typeof shadow; use: string; className: string }[] = [
  { name: "bubble", use: "Tooltip only", className: "shadow-bubble" },
  { name: "menu", use: "Select, popover, overflow", className: "shadow-menu" },
  { name: "overlay", use: "Modal, command bar", className: "shadow-overlay" },
  { name: "hoverLift", use: "Hover — secondary/ghost", className: "shadow-hover-lift" },
  { name: "hoverLiftAccent", use: "Hover — primary (amber)", className: "shadow-hover-lift-accent" },
  { name: "press", use: "Press — secondary/ghost", className: "shadow-press" },
  { name: "pressPrimary", use: "Press — primary", className: "shadow-press-primary" },
];

const Z_LADDER: { name: keyof typeof zIndex; label: string }[] = [
  { name: "toast", label: "Toast" },
  { name: "overlay", label: "Modal · drawer" },
  { name: "commandBar", label: "Command bar" },
  { name: "railStub", label: "Rail stub" },
  { name: "chrome", label: "Chrome" },
];

function ContrastTable({ theme }: { theme: "dark" | "light" }) {
  const rows = contrastPairings(theme);
  return (
    <div className="flex flex-col gap-4">
      <div className="text-micro uppercase tracking-tight-20 text-faint">{theme}</div>
      <table className="w-full border-collapse text-small">
        <thead>
          <tr className="border-b border-border text-micro uppercase tracking-tight-20 text-faint">
            <th className="py-4 text-left font-body font-regular">Text</th>
            <th className="py-4 text-left font-body font-regular">On</th>
            <th className="py-4 text-left font-body font-regular">Ratio</th>
            <th className="py-4 text-left font-body font-regular">AA</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.fgToken} className="border-b border-border">
              <td className="py-6">
                <span
                  className="mr-8 inline-block h-16 w-16 rounded-ds border border-border-2 align-middle"
                  style={{ background: r.fg }}
                />
                <code className="text-mute">--{r.fgToken}</code>
              </td>
              <td className="py-6">
                <code className="text-mute">--{r.bgToken}</code>
              </td>
              <td className="py-6 text-dim">{r.ratio.toFixed(2)}:1</td>
              <td className="py-6">
                <span className={r.level === "fail" ? "text-alarm" : "text-dim"}>{r.level}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DecisionCard({ decision, index }: { decision: (typeof DECISIONS)[number]; index: number }) {
  return (
    <div className="flex flex-col gap-12 rounded-ds border border-accent-line bg-accent-soft p-16 tablet:flex-row">
      <a
        href={decision.screenshot.src}
        target="_blank"
        rel="noreferrer"
        className="block shrink-0 overflow-hidden rounded-ds border border-border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        style={{ width: 96, height: 96 }}
      >
        {/* Full baseline page capture (LDS-010), not a pre-cropped excerpt —
            open it to see the actual evidence in context. Fixed px thumbnail:
            a photographic preview, not a spacing-scale UI element. */}
        <img
          src={decision.screenshot.src}
          alt={decision.screenshot.alt}
          className="h-full w-full object-cover object-top"
        />
      </a>
      <div className="flex flex-1 flex-col gap-12">
        <div className="flex items-baseline gap-12">
          <span className="text-micro uppercase tracking-tight-20 text-accent">Decision {index + 1}</span>
          <h3 className="font-heading font-semibold text-small text-fg">{decision.title}</h3>
        </div>
        <p className="text-small text-dim">{decision.question}</p>
        <div className="flex flex-col gap-4">
          <span className="text-micro uppercase tracking-tight-20 text-faint">Evidence</span>
          <ul className="flex flex-col gap-4 text-small text-dim">
            {decision.evidence.map((e) => (
              <li key={e} className="border-l-2 border-border-2 pl-12">
                {e}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-4">
          <span className="text-micro uppercase tracking-tight-20 text-faint">Recommendation</span>
          <p className="text-small text-fg">{decision.recommendation}</p>
        </div>
        <span className="text-micro text-faint">
          {decision.source} ·{" "}
          <a href={decision.screenshot.src} target="_blank" rel="noreferrer" className="underline">
            full prototype screenshot ↗
          </a>
        </span>
      </div>
    </div>
  );
}

export default function TokensDevPage() {
  return (
    <ThemeToggle>
      <div className="flex flex-col gap-32">
        <div className="flex flex-col gap-8">
          <h1 className="font-heading font-semibold text-doc-title tracking-tight-neg-2 text-fg">
            Tokens — full set and decisions review
          </h1>
          <p className="text-small text-mute">
            Every token in both themes, and the five open questions LDS-012 exists to settle. Toggle the theme above;
            the colour pairings table below always shows both themes at once.
          </p>
        </div>

        <DevSection number="01" title="Colour pairings and contrast" meta="AA = 4.5:1, large text/UI = 3:1">
          <div className="grid grid-cols-1 gap-22 tablet:grid-cols-2">
            <ContrastTable theme="dark" />
            <ContrastTable theme="light" />
          </div>
          <div className="flex items-center gap-12 rounded-ds border border-alarm-line p-12">
            <span className="inline-block h-16 w-16 rounded-ds border border-border-2" style={{ background: alarmInkPairing().bg }} />
            <span className="text-small text-dim">
              <code className="text-mute">--alarm-ink</code> on <code className="text-mute">--alarm</code> (non-themeable,
              same in both themes): {alarmInkPairing().ratio.toFixed(2)}:1 — {alarmInkPairing().level}
            </span>
          </div>
        </DevSection>

        <DevSection number="02" title="Type scale" meta="docs/prd.md §8.2">
          <div className="flex flex-col gap-16">
            {TYPE_SCALE.map((style) => (
              <div key={style.name} className="flex flex-col gap-4 border-b border-border pb-16">
                <div className="flex items-baseline gap-12">
                  <span className="shrink-0 text-micro uppercase tracking-tight-20 text-faint">{style.name}</span>
                  <span className="text-micro text-faint">{style.use}</span>
                </div>
                <div className={style.className + " text-fg"}>{style.sample}</div>
                <div className="text-micro text-faint">
                  {style.sizePx} · leading {style.leadingValue}
                  {style.trackingValue ? ` · tracking ${style.trackingValue}` : ""}
                </div>
              </div>
            ))}
          </div>
        </DevSection>

        <DevSection number="03" title="Spacing ramp" meta="docs/prd.md §8.3">
          <div className="flex flex-col gap-8">
            {SPACING_STEPS.map(({ step, px, className }) => (
              <div key={step} className="flex items-center gap-12">
                <span className="w-32 shrink-0 text-micro text-faint">{step}</span>
                <div className={`h-16 rounded-ds border border-accent-line bg-accent-soft ${className}`} />
                <span className="text-micro text-faint">{px}</span>
              </div>
            ))}
          </div>
        </DevSection>

        <DevSection number="04" title="Radius" meta="docs/prd.md §8.4 — locked">
          <div className="flex items-end gap-22">
            <div className="flex flex-col items-center gap-8">
              <div className="h-44 w-44 rounded-ds border border-border-2 bg-panel" />
              <span className="text-micro text-faint">rounded-ds · 2px</span>
            </div>
            <div className="flex flex-col items-center gap-8">
              <div className="h-32 w-44 rounded-chip border border-border-2 bg-panel" />
              <span className="text-micro text-faint">rounded-chip · 20px shape</span>
            </div>
            <div className="flex flex-col items-center gap-8">
              <div className="h-44 w-44 rounded-full border border-border-2 bg-panel" />
              <span className="text-micro text-faint">rounded-full · marks with no layout only</span>
            </div>
          </div>
        </DevSection>

        <DevSection number="05" title="Motion" meta="docs/prd.md §8.5">
          <div className="flex flex-col gap-4">
            <span className="text-micro uppercase tracking-tight-20 text-faint">Easing · duration</span>
            <p className="text-small text-dim">
              standard <code className="text-mute">{easing.standard}</code> · symmetric{" "}
              <code className="text-mute">{easing.symmetric}</code> · draw <code className="text-mute">{easing.draw}</code>
              <br />
              instant <code className="text-mute">{duration.instant}</code> · control{" "}
              <code className="text-mute">{duration.control}</code> · panel <code className="text-mute">{duration.panel}</code> ·
              reveal <code className="text-mute">{duration.reveal}</code>
            </p>
          </div>
          <div className="grid grid-cols-1 gap-16 tablet:grid-cols-2">
            <div className="flex flex-col gap-8">
              <span className="text-micro uppercase tracking-tight-20 text-faint">Loops (always on)</span>
              <div className="flex flex-col gap-12">
                <div className="flex items-center gap-12">
                  <span className="h-16 w-16 shrink-0 animate-pulse rounded-full bg-accent" />
                  <span className="text-small text-dim">pulse — 2.6s ease-in-out infinite</span>
                </div>
                <div className="flex items-center gap-12">
                  <span className="h-16 w-16 shrink-0 animate-breathe rounded-full bg-accent" />
                  <span className="text-small text-dim">breathe — 2s ease-in-out infinite</span>
                </div>
                <div className="flex items-center gap-12">
                  <div className="relative h-16 w-44 shrink-0 overflow-hidden rounded-ds border border-border bg-panel">
                    <span
                      className="absolute inset-y-0 h-full w-44 animate-shimmer"
                      style={{
                        backgroundImage: "linear-gradient(90deg, var(--panel-2) 0%, var(--border-2) 50%, var(--panel-2) 100%)",
                        backgroundSize: "440px 100%",
                      }}
                    />
                  </div>
                  <span className="text-small text-dim">shimmer — 1.2s linear infinite</span>
                </div>
                <div className="flex items-center gap-12">
                  <div className="relative h-16 w-44 shrink-0 overflow-hidden rounded-ds border border-border bg-panel">
                    <span className="absolute inset-y-0 h-16 w-16 animate-sweepline bg-accent" />
                  </div>
                  <span className="text-small text-dim">sweepline — 1.8s symmetric infinite</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-8">
              <span className="text-micro uppercase tracking-tight-20 text-faint">Entrances (replay)</span>
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                  <ReplayDemo><span className="h-16 w-16 animate-fade-in rounded-ds bg-accent" /></ReplayDemo>
                  <span className="text-micro text-faint">fade-in — control (180ms) · ease</span>
                </div>
                <div className="flex flex-col gap-4">
                  <ReplayDemo><span className="h-16 w-16 animate-rise-in rounded-ds bg-accent" /></ReplayDemo>
                  <span className="text-micro text-faint">rise-in — 280ms · standard (off the named scale, see decisions)</span>
                </div>
                <div className="flex flex-col gap-4">
                  <ReplayDemo><span className="h-16 w-16 animate-panel-in rounded-ds bg-accent" /></ReplayDemo>
                  <span className="text-micro text-faint">panel-in — panel (260ms) · standard</span>
                </div>
                <div className="flex flex-col gap-4">
                  <ReplayDemo><span className="h-16 w-44 animate-widget-in rounded-ds bg-accent" /></ReplayDemo>
                  <span className="text-micro text-faint">widget-in — reveal (500ms) · standard</span>
                </div>
                <div className="flex flex-col gap-4">
                  <ReplayDemo><span className="h-32 w-16 animate-drawer-in rounded-ds bg-accent" /></ReplayDemo>
                  <span className="text-micro text-faint">drawer-in — panel (260ms) · standard</span>
                </div>
                <div className="flex flex-col gap-4">
                  <ReplayDemo>
                    <svg viewBox="0 0 100 20" className="h-16 w-44">
                      <line
                        x1="4"
                        y1="10"
                        x2="96"
                        y2="10"
                        stroke="var(--accent)"
                        strokeWidth={2}
                        pathLength={1}
                        strokeDasharray={1}
                        strokeDashoffset={1}
                        className="animate-draw-in"
                      />
                    </svg>
                  </ReplayDemo>
                  <span className="text-micro text-faint">draw-in — 800ms fallback · draw (real uses pass their own duration)</span>
                </div>
              </div>
            </div>
          </div>
        </DevSection>

        <DevSection number="06" title="Elevation" meta="Elevation foundation">
          <div className="grid grid-cols-2 gap-32 p-16 tablet:grid-cols-4">
            {SHADOW_DEMOS.map((s) => (
              <div key={s.name} className="flex flex-col items-center gap-8">
                <div className={`h-44 w-44 rounded-ds bg-bg ${s.className}`} />
                <span className="text-center text-micro text-faint">
                  {s.name} · {s.use}
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-micro uppercase tracking-tight-20 text-faint">z ladder (top to bottom)</span>
            <ol className="flex flex-col gap-4">
              {Z_LADDER.map((z) => (
                <li key={z.name} className="flex items-center gap-12 text-small text-dim">
                  <code className="w-32 text-mute">{zIndex[z.name]}</code>
                  {z.label}
                </li>
              ))}
            </ol>
          </div>
        </DevSection>

        <DevSection number="07" title="Breakpoints" meta="docs/prd.md §8.6 — resize to see this change">
          <div className="rounded-ds border border-accent-line bg-accent-soft p-16 text-center text-small text-fg">
            <span className="tablet:hidden">Phone — &lt;{breakpoint.tablet}</span>
            <span className="hidden tablet:inline desktop:hidden">
              Tablet — {breakpoint.tablet}–{breakpoint.desktop}
            </span>
            <span className="hidden desktop:inline wide:hidden">
              Desktop — {breakpoint.desktop}–{breakpoint.wide}
            </span>
            <span className="hidden wide:inline">Wide — {breakpoint.wide}+</span>
          </div>
        </DevSection>

        <DevSection number="08" title="Decisions needed" meta="review:cory — settle before merge">
          <div className="flex flex-col gap-16">
            {DECISIONS.map((d, i) => (
              <DecisionCard key={d.id} decision={d} index={i} />
            ))}
          </div>
        </DevSection>
      </div>
    </ThemeToggle>
  );
}
