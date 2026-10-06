// Builds CSS custom properties, the Tailwind theme and typed TS exports from
// the DTCG token source in tokens/. Run with `pnpm --filter @lairy/tokens run generate`.
import { mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import StyleDictionary from "style-dictionary";
import { formats, transformGroups } from "style-dictionary/enums";

const dir = path.dirname(fileURLToPath(import.meta.url));
const cssDir = path.join(dir, "src/css");
mkdirSync(cssDir, { recursive: true });

const readTokens = (file) => JSON.parse(readFileSync(path.join(dir, file), "utf8"));

const dark = readTokens("tokens/color.dark.json");
const light = readTokens("tokens/color.light.json");
const alarm = readTokens("tokens/color.alarm.json");
const spacing = readTokens("tokens/spacing.json");
const radiusTokens = readTokens("tokens/radius.json");
const typography = readTokens("tokens/typography.json");
const iconTokens = readTokens("tokens/icon.json");
const motion = readTokens("tokens/motion.json");
const elevation = readTokens("tokens/elevation.json");
const breakpoint = readTokens("tokens/breakpoint.json");
const shellTokens = readTokens("tokens/shell.json");
const popoverTokens = readTokens("tokens/popover.json");

const camel = (s) => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const val = (t) => t.$value;

// Named entrances and loops (Motion foundation motEntrances/motTokens). Each
// keyframe body below is copied verbatim from the prototype's own @keyframes
// rules (archive/v1/Workspace Shell.dc.html lines 45-58) — nothing here is
// invented geometry. Duration/easing pairings reuse the named motion tokens
// wherever a call site in the prototype maps cleanly onto one (grep for
// `animation:` in the same file); the exceptions carry their own harvested
// literal and a citation:
// - rise-in: the one non-chart (toast) call site uses .28s, which doesn't
//   match any of the four named durations and is flagged as such in
//   reference/token-harvest.md §5 — harvested literally, not snapped.
// - draw-in: the source's own draw() helper defaults to `dur || 800`; every
//   real call site passes its own duration because a line's duration is set
//   by its length, not a token (Motion page motDocs).
const ANIMATIONS = [
  {
    name: "fade-in",
    keyframeBody: "0% { opacity: 0; } 100% { opacity: 1; }",
    duration: val(motion.duration.control),
    easing: "ease",
    note: "Scrims and backdrops (fadeIn .18s ease both, every scrim call site).",
  },
  {
    name: "rise-in",
    keyframeBody: "from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; }",
    duration: "280ms",
    easing: val(motion.easing.standard),
    note: "Toast entrance (riseIn .28s cubic-bezier(.4,0,.2,1) both) — 280ms is off the named scale, harvested as-is.",
  },
  {
    name: "panel-in",
    keyframeBody: "0% { opacity: 0; transform: translateY(12px) scale(.99); } 100% { opacity: 1; transform: none; }",
    duration: val(motion.duration.panel),
    easing: val(motion.easing.standard),
    note: "Layout-shift entrances — dock, drawer, cards, panels. Overlay call sites (menu 160ms, modal 220ms, command bar 240ms) commonly override this default.",
  },
  {
    name: "widget-in",
    keyframeBody: "0% { opacity: 0; transform: translateY(16px); } 100% { opacity: 1; transform: none; }",
    duration: val(motion.duration.reveal),
    easing: val(motion.easing.standard),
    note: "Full-width widgets and hero rows (widgetIn .5s cubic-bezier(.4,0,.2,1) both).",
  },
  {
    name: "drawer-in",
    keyframeBody: "from { transform: translateX(100%); } to { transform: none; }",
    duration: val(motion.duration.panel),
    easing: val(motion.easing.standard),
    note: "The drawer, entering from its edge (drawerIn .26s cubic-bezier(.4,0,.2,1) both).",
  },
  {
    name: "draw-in",
    keyframeBody: "to { stroke-dashoffset: 0; }",
    duration: "800ms",
    easing: val(motion.easing.draw),
    note: "Blueprint line-draw. Every call site passes its own duration (draw(delay, dur) => dur || 800) — 800ms is the source's own fallback, not a fixed step.",
  },
  {
    name: "pulse",
    keyframeBody: "0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .3; transform: scale(.8); }",
    duration: "2.6s",
    easing: "ease-in-out",
    iteration: "infinite",
    note: "Live-status pulse (Motion page motTokens: '2.6s ease-in-out').",
  },
  {
    name: "breathe",
    keyframeBody: "0%, 100% { opacity: .45; } 50% { opacity: 1; }",
    duration: "2s",
    easing: "ease-in-out",
    iteration: "infinite",
    note: "Live-status breathe loop (Motion page motTokens: '2s ease-in-out').",
  },
  {
    name: "shimmer",
    keyframeBody: "0% { background-position: -220px 0; } 100% { background-position: 220px 0; }",
    duration: "1.2s",
    easing: "linear",
    iteration: "infinite",
    note: "Loading skeleton shimmer (animation: shimmer 1.2s linear infinite, every call site).",
  },
  {
    name: "sweepline",
    keyframeBody: "0% { transform: translateX(-110%); } 100% { transform: translateX(320%); }",
    duration: "1.8s",
    easing: val(motion.easing.symmetric),
    iteration: "infinite",
    note: "The sweeping progress line (Motion page motTokens: '1.8s cubic-bezier(.45,0,.55,1)', every call site).",
    // The generic freeze-at-last-keyframe reduced-motion rule below would
    // leave this fully translated past the track (its 100% frame), not "a
    // static amber segment" the way the Motion page's own accessibilityNotes
    // ("Reduced motion is honoured") describe it — so this animation gets
    // its own override instead of relying on the generic one.
    reducedMotion: "animation: none; transform: translateX(105%);",
  },
  {
    name: "caretblink",
    keyframeBody: "0%, 48% { opacity: 1; } 49%, 100% { opacity: .12; }",
    duration: "1s",
    easing: "steps(1,end)",
    iteration: "infinite",
    note: "Loading's caret (animation: caretblink 1s steps(1,end) infinite, every call site) — named in the Motion page's own Loops paragraph alongside sweepline and shimmer, wired up here for the first time now that Loading (LDS-025) is its first consumer.",
    // Same reasoning as sweepline's own override above: the generic rule
    // would freeze this at its 100% frame (opacity .12, nearly invisible),
    // not "the caret stays lit" the Motion page's own accessibilityNotes
    // promise.
    reducedMotion: "animation: none; opacity: 1;",
  },
];

// ---------------------------------------------------------------------------
// 1. CSS custom properties: dark on :root, light on [data-theme="light"].
// ---------------------------------------------------------------------------

function buildCssTheme({ name, source, selector }) {
  return new StyleDictionary({
    source,
    platforms: {
      css: {
        transformGroup: transformGroups.css,
        buildPath: cssDir + "/",
        files: [
          {
            destination: `_${name}.css`,
            format: formats.cssVariables,
            options: { selector, outputReferences: false },
          },
        ],
      },
    },
  });
}

const SHARED = [
  "tokens/spacing.json",
  "tokens/radius.json",
  "tokens/typography.json",
  "tokens/icon.json",
  "tokens/motion.json",
  "tokens/elevation.json",
  "tokens/breakpoint.json",
  "tokens/shell.json",
  "tokens/popover.json",
];

const darkSd = buildCssTheme({
  name: "dark",
  source: ["tokens/color.dark.json", "tokens/color.alarm.json", ...SHARED],
  selector: ":root",
});
const lightSd = buildCssTheme({
  name: "light",
  source: ["tokens/color.light.json"],
  selector: '[data-theme="light"]',
});

await darkSd.buildPlatform("css");
await lightSd.buildPlatform("css");

const darkCss = readFileSync(path.join(cssDir, "_dark.css"), "utf8");
const lightCss = readFileSync(path.join(cssDir, "_light.css"), "utf8");
const cssBanner =
  "/* Generated by packages/tokens/build.mjs from tokens/*.json. Do not edit by hand. */\n";
writeFileSync(path.join(cssDir, "tokens.css"), cssBanner + darkCss + "\n" + lightCss);
rmSync(path.join(cssDir, "_dark.css"));
rmSync(path.join(cssDir, "_light.css"));

// ---------------------------------------------------------------------------
// 2. Tailwind v4 theme: resets every default scale, then maps Lairy tokens
//    onto Tailwind's namespaces (ADR-0003).
// ---------------------------------------------------------------------------

const colorNames = [...Object.keys(dark), ...Object.keys(alarm)];

const themeLines = [];
themeLines.push(cssBanner.trim());
themeLines.push("@theme {");
themeLines.push("  /* Remove Tailwind's default theme (ADR-0003): only Lairy tokens exist. */");
for (const ns of [
  "color",
  "spacing",
  "text",
  "font",
  "radius",
  "shadow",
  "tracking",
  "leading",
  "font-weight",
  "ease",
  "animate",
  "breakpoint",
]) {
  themeLines.push(`  --${ns}-*: initial;`);
}
themeLines.push("");
themeLines.push("  /* Color — aliases the themed custom properties in tokens.css. */");
for (const name of colorNames) {
  themeLines.push(`  --color-${name}: var(--${name});`);
}
themeLines.push("");
themeLines.push("  /* Below: direct values, not var() aliases like color above. Radius,");
themeLines.push("     spacing and typography are non-themeable constants with no ADR-0008");
themeLines.push("     name to preserve, so there's nothing for an alias to buy here — only");
themeLines.push("     color needs the indirection, to switch at runtime by theme. */");
themeLines.push("  /* Spacing ramp (docs/prd.md §8.3). */");
for (const [step, t] of Object.entries(spacing.space)) {
  themeLines.push(`  --spacing-${step}: ${val(t)};`);
}
themeLines.push("");
themeLines.push("  /* Radius (locked, docs/prd.md §8.4). */");
themeLines.push(`  --radius-ds: ${val(radiusTokens.radius)};`);
themeLines.push(`  --radius-chip: ${val(radiusTokens["radius-chip"])};`);
themeLines.push("");
themeLines.push("  /* Font families. next/font/google supplies --ff-<name> at runtime; the");
themeLines.push("     token value is the fallback stack for non-Next consumers. */");
for (const [name, t] of Object.entries(typography.font)) {
  themeLines.push(`  --font-${name}: var(--ff-${name}, ${val(t)});`);
}
themeLines.push("");
themeLines.push("  /* Font weights. */");
for (const [name, t] of Object.entries(typography.weight)) {
  themeLines.push(`  --font-weight-${name}: ${val(t)};`);
}
themeLines.push("");
themeLines.push("  /* Type styles: paired font-size + line-height (docs/prd.md §8.2). */");
for (const [step, t] of Object.entries(typography.text)) {
  themeLines.push(`  --text-${step}: ${val(t)};`);
  const leading = typography.leading[step];
  if (leading) themeLines.push(`  --text-${step}--line-height: ${val(leading)};`);
}
themeLines.push("");
themeLines.push("  /* Tracking steps. */");
for (const [name, t] of Object.entries(typography.tracking)) {
  themeLines.push(`  --tracking-${name}: ${val(t)};`);
}
themeLines.push("");
themeLines.push("  /* Breakpoints (docs/prd.md §8.6). Phone (<640) is the unprefixed default. */");
for (const [name, t] of Object.entries(breakpoint.breakpoint)) {
  themeLines.push(`  --breakpoint-${name}: ${val(t)};`);
}
themeLines.push("");
themeLines.push("  /* Easing curves (docs/prd.md §8.5). */");
for (const [name, t] of Object.entries(motion.easing)) {
  themeLines.push(`  --ease-${name}: ${val(t)};`);
}
themeLines.push("");
themeLines.push("  /* Elevation shadows (Elevation foundation, elevTokens). */");
for (const [name, t] of Object.entries(elevation.shadow)) {
  themeLines.push(`  --shadow-${name}: ${val(t)};`);
}
themeLines.push("");
themeLines.push("  /* Named entrances and loops (Motion foundation, motEntrances/motTokens).");
themeLines.push("     Keyframe bodies are harvested verbatim from the prototype's own");
themeLines.push("     @keyframes rules (archive/v1/Workspace Shell.dc.html) and declared");
themeLines.push("     below, outside this @theme block. Durations/easings here reuse the");
themeLines.push("     named motion tokens where a call site maps cleanly onto one; the two");
themeLines.push("     that don't (rise-in, draw-in) use their own harvested literal value —");
themeLines.push("     see each animation's comment for its source. */");
for (const a of ANIMATIONS) {
  themeLines.push(`  --animate-${a.name}: ${camel(a.name)} ${a.duration} ${a.easing} ${a.iteration ?? "both"}; /* ${a.note} */`);
}
themeLines.push("}");
themeLines.push("");
themeLines.push("/* Keyframe bodies, harvested verbatim from the prototype's own @keyframes");
themeLines.push("   rules (archive/v1/Workspace Shell.dc.html) — see the --animate-* entries");
themeLines.push("   above for how each is composed into a named animation. */");
for (const a of ANIMATIONS) {
  themeLines.push(`@keyframes ${camel(a.name)} {`);
  themeLines.push(`  ${a.keyframeBody}`);
  themeLines.push(`}`);
}
themeLines.push("");
themeLines.push("/* prefers-reduced-motion (AGENTS.md rule 7, Accessibility foundation motA11y):");
themeLines.push("   every loop stops and entrances collapse to opacity alone. A few loops");
themeLines.push("   freeze on the wrong frame this way (their 100% keyframe isn't the state");
themeLines.push("   the Motion page's own accessibilityNotes promise) and get their own,");
themeLines.push("   more specific override below instead — see each animation's own");
themeLines.push("   `reducedMotion` comment above. */");
themeLines.push("@media (prefers-reduced-motion: reduce) {");
themeLines.push('  [class*="animate-"] {');
themeLines.push("    animation-duration: .01ms !important;");
themeLines.push("    animation-iteration-count: 1 !important;");
themeLines.push("  }");
for (const a of ANIMATIONS) {
  if (!a.reducedMotion) continue;
  themeLines.push(`  .animate-${a.name} {`);
  themeLines.push(`    ${a.reducedMotion}`);
  themeLines.push("  }");
}
themeLines.push("}");
writeFileSync(path.join(cssDir, "tailwind-theme.css"), themeLines.join("\n") + "\n");

// ---------------------------------------------------------------------------
// 3. Typed TS exports, for consumers that need raw values (tests, non-Tailwind
//    contexts). Colors are keyed by theme; everything else is theme-independent.
// ---------------------------------------------------------------------------

const colorObject = (tokens) => {
  const out = {};
  for (const [name, t] of Object.entries(tokens)) out[camel(name)] = val(t);
  return out;
};
const flatObject = (tokens) => {
  const out = {};
  for (const [name, t] of Object.entries(tokens)) out[camel(name)] = val(t);
  return out;
};

const tsBanner =
  "// Generated by packages/tokens/build.mjs from tokens/*.json. Do not edit by hand.\n";
const ts = `${tsBanner}
export const color = {
  dark: ${JSON.stringify(colorObject(dark), null, 2)},
  light: ${JSON.stringify(colorObject(light), null, 2)},
  alarm: ${JSON.stringify(colorObject(alarm), null, 2)},
} as const;

/** Every color token's kebab-case name, exactly as it appears in tokens.css
 * and the Tailwind theme (e.g. "accent-2-line"). The single source other
 * tooling (cn's tailwind-merge config, lint rules) should read from, rather
 * than re-listing token names by hand. */
export const colorTokenNames = ${JSON.stringify([...Object.keys(dark), ...Object.keys(alarm)])} as const;

export const space = ${JSON.stringify(flatObject(spacing.space), null, 2)} as const;

export const radius = ${JSON.stringify(val(radiusTokens.radius))} as const;

export const radiusChip = ${JSON.stringify(val(radiusTokens["radius-chip"]))} as const;

export const font = ${JSON.stringify(flatObject(typography.font), null, 2)} as const;

export const fontWeight = ${JSON.stringify(flatObject(typography.weight), null, 2)} as const;

export const text = ${JSON.stringify(flatObject(typography.text), null, 2)} as const;

export const leading = ${JSON.stringify(flatObject(typography.leading), null, 2)} as const;

export const tracking = ${JSON.stringify(flatObject(typography.tracking), null, 2)} as const;

export const icon = ${JSON.stringify(flatObject(iconTokens.icon), null, 2)} as const;

export const easing = ${JSON.stringify(flatObject(motion.easing), null, 2)} as const;

export const duration = ${JSON.stringify(flatObject(motion.duration), null, 2)} as const;

export const shadow = ${JSON.stringify(flatObject(elevation.shadow), null, 2)} as const;

export const zIndex = ${JSON.stringify(flatObject(elevation.z), null, 2)} as const;

export const breakpoint = ${JSON.stringify(flatObject(breakpoint.breakpoint), null, 2)} as const;

export const shell = ${JSON.stringify(flatObject(shellTokens.shell), null, 2)} as const;

export const popover = ${JSON.stringify(flatObject(popoverTokens.popover), null, 2)} as const;
`;
writeFileSync(path.join(dir, "src/tokens.generated.ts"), ts);

console.log(
  "Tokens built: src/css/tokens.css, src/css/tailwind-theme.css, src/tokens.generated.ts",
);
