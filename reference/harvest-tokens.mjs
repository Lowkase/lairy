#!/usr/bin/env node
// Scans archive/v1/Workspace Shell.dc.html for every raw colour, font-size,
// letter-spacing, line-height, gap/padding/margin, radius, duration and
// easing value, counts occurrences, and proposes a token per docs/prd.md §8's
// mapping rules. Writes reference/token-harvest.md.
//
// Usage: node harvest-tokens.mjs   (run from reference/, see README.md)

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROTOTYPE_PATH = path.join(
  __dirname,
  "..",
  "archive/v1/Workspace Shell.dc.html",
);
const OUTPUT_PATH = path.join(__dirname, "token-harvest.md");

const src = readFileSync(PROTOTYPE_PATH, "utf8");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Count occurrences of each captured value from a global regex, preserving first-seen order. */
function tally(re, text, transform = (v) => v) {
  const counts = new Map();
  for (const m of text.matchAll(re)) {
    const v = transform(m[1]);
    if (v == null) continue;
    counts.set(v, (counts.get(v) || 0) + 1);
  }
  return counts;
}

function sortedByCount(counts) {
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

function mdEscape(s) {
  return String(s).replace(/\|/g, "\\|");
}

function table(headers, rows) {
  const head = `| ${headers.join(" | ")} |`;
  const sep = `| ${headers.map(() => "---").join(" | ")} |`;
  const body = rows
    .map((r) => `| ${r.map(mdEscape).join(" | ")} |`)
    .join("\n");
  return [head, sep, body].join("\n");
}

// ---------------------------------------------------------------------------
// 0. Token catalogue — parsed from the prototype's own :root / [data-theme="light"] blocks
// (docs/prd.md §8.1: keep the prototype's CSS variable names).
// ---------------------------------------------------------------------------

function parseThemeBlock(blockSrc) {
  const map = new Map();
  for (const m of blockSrc.matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
    map.set(m[1], m[2].trim());
  }
  return map;
}

const rootMatch = src.match(/:root\{([^}]*)\}/);
const lightMatch = src.match(/\[data-theme="light"\]\{([^}]*)\}/);
const darkTokens = parseThemeBlock(rootMatch ? rootMatch[1] : "");
const lightTokens = parseThemeBlock(lightMatch ? lightMatch[1] : "");

/** value (as it appears literally in markup) -> "--token-name (theme)" */
const colorValueToToken = new Map();
for (const [name, value] of darkTokens) {
  colorValueToToken.set(value.replace(/\s+/g, ""), `--${name} (dark)`);
}
for (const [name, value] of lightTokens) {
  colorValueToToken.set(value.replace(/\s+/g, ""), `--${name} (light)`);
}

const ALARM_HEX = "#ff8f6b";
const ALARM_RGB = "255,143,107";

// ---------------------------------------------------------------------------
// 1. Colour — hex literals and rgb()/rgba() functions.
// Excludes numeric character references like `&#10003;` (not colours) and
// requires a valid CSS hex length (3, 4, 6 or 8 digits).
// ---------------------------------------------------------------------------

const hexCounts = tally(
  /(?<!&)#([0-9a-fA-F]{3,8})\b/g,
  src,
  (digits) => ([3, 4, 6, 8].includes(digits.length) ? `#${digits}` : null),
);

const rgbCounts = tally(/(rgba?\([^)]*\))/g, src, (v) =>
  v.replace(/\s+/g, ""),
);

const colorCounts = new Map([...hexCounts, ...rgbCounts]);

const colorRows = [];
const alarmAlphaRows = [];
for (const [value, count] of sortedByCount(colorCounts)) {
  const lower = value.toLowerCase();
  if (lower === ALARM_HEX) {
    colorRows.push([value, count, "--alarm", "mapped — non-themeable (§8.1)"]);
    continue;
  }
  if (lower.startsWith(`rgba(${ALARM_RGB}`) || lower.startsWith(`rgba(${ALARM_RGB.replace(/,/g, ", ")}`)) {
    alarmAlphaRows.push([value, count]);
    continue;
  }
  const known = colorValueToToken.get(value.replace(/\s+/g, ""));
  if (known) {
    colorRows.push([value, count, known, "mapped"]);
  } else {
    colorRows.push([value, count, "—", "**flagged** — no exact token match"]);
  }
}
// Sort: mapped first is not required; keep by count desc (already sorted), but
// group flagged to the bottom for readability.
colorRows.sort((a, b) => {
  const aFlagged = a[3].startsWith("**flagged**") ? 1 : 0;
  const bFlagged = b[3].startsWith("**flagged**") ? 1 : 0;
  if (aFlagged !== bFlagged) return aFlagged - bFlagged;
  return b[1] - a[1];
});

// ---------------------------------------------------------------------------
// 2. Typography — font-size, letter-spacing, line-height
// ---------------------------------------------------------------------------

// docs/prd.md §8.2 scale (rem values shown in px for comparison with harvested px)
const TYPE_SCALE = [
  { px: 48, name: "Display" },
  { px: 34, name: "Doc title" },
  { px: 28, name: "Title / Metric" },
  { px: 17, name: "Section" },
  { px: 14, name: "Body" },
  { px: 13, name: "Small" },
  { px: 12, name: "Label" },
  { px: 11, name: "Micro" },
];
const OFF_SCALE_MAP = {
  10.5: "Micro",
  11.5: "Label",
  12.5: "Small",
  13.5: "Body",
  15: "Body",
  19: "Section",
};

function proposeFontSizeToken(px) {
  const onScale = TYPE_SCALE.find((s) => s.px === px);
  if (onScale) return { token: onScale.name, status: "mapped" };
  if (px in OFF_SCALE_MAP) {
    return {
      token: OFF_SCALE_MAP[px],
      status: `mapped — default off-scale mapping (§8.2)`,
    };
  }
  if (px < 11) {
    return {
      token: "Micro",
      status:
        "mapped — 8–10px snaps to Micro per §8.2, **except** chart SVG text (see §6 below)",
    };
  }
  if (px < 8) {
    return { token: "—", status: "**flagged** — below the 11px floor (§8.2, AGENTS.md rule 6)" };
  }
  return { token: "—", status: "**flagged** — not on scale or in the default mapping" };
}

// Font-size: covers CSS `font-size:12px` and JS object `fontSize: 12` / `fontSize:'12px'`.
const fontSizeCounts = tally(
  /font-size\s*:\s*([0-9]+(?:\.[0-9]+)?)px/gi,
  src,
  (v) => Number(v),
);
const fontSizeJsCounts = tally(
  /fontSize\s*:\s*'?([0-9]+(?:\.[0-9]+)?)(?:px)?'?/g,
  src,
  (v) => Number(v),
);
for (const [px, count] of fontSizeJsCounts) {
  fontSizeCounts.set(px, (fontSizeCounts.get(px) || 0) + count);
}

const fontSizeRows = sortedByCount(fontSizeCounts).map(([px, count]) => {
  const { token, status } = proposeFontSizeToken(px);
  return [`${px}px`, count, token, status];
});

// Letter-spacing
const TRACKING_SET = new Set([".06em", ".08em", ".1em", ".12em", ".14em", ".16em", ".2em"]);
const DISPLAY_NEGATIVE_TRACKING = new Set(["-.02em"]);
const METRIC_TRACKING = new Set(["-.01em"]);

const letterSpacingCounts = tally(
  /letter-spacing\s*:\s*(-?\.[0-9]+em)/g,
  src,
  (v) => v,
);
const letterSpacingJsCounts = tally(
  /letterSpacing\s*:\s*'(-?\.[0-9]+em)'/g,
  src,
  (v) => v,
);
for (const [v, count] of letterSpacingJsCounts) {
  letterSpacingCounts.set(v, (letterSpacingCounts.get(v) || 0) + count);
}

const letterSpacingRows = sortedByCount(letterSpacingCounts).map(([v, count]) => {
  if (TRACKING_SET.has(v)) return [v, count, "tracking token", "mapped — working set (§8.2)"];
  if (DISPLAY_NEGATIVE_TRACKING.has(v))
    return [v, count, "Display/Doc title/Title tracking", "mapped — negative display tracking (§8.2)"];
  if (METRIC_TRACKING.has(v))
    return [v, count, "Metric tracking", "mapped — Metric row, §8.2 type table"];
  return [v, count, "—", "**flagged** — outside the working tracking set, collapse only with review (§8.2)"];
});

// Line-height (unitless only — matches the type table's convention)
const LINE_HEIGHT_SET = new Map([
  ["1.08", "Display"],
  ["1.1", "Doc title / Metric"],
  ["1.15", "Title"],
  ["1.4", "Label / Micro"],
  ["1.5", "Small"],
  ["1.6", "Body"],
]);

const lineHeightCounts = tally(
  /line-height\s*:\s*([0-9]+(?:\.[0-9]+)?)(?!px|em|%)/g,
  src,
  (v) => v,
);
const lineHeightJsCounts = tally(
  /lineHeight\s*:\s*'?([0-9]+(?:\.[0-9]+)?)'?/g,
  src,
  (v) => v,
);
for (const [v, count] of lineHeightJsCounts) {
  lineHeightCounts.set(v, (lineHeightCounts.get(v) || 0) + count);
}

const lineHeightRows = sortedByCount(lineHeightCounts).map(([v, count]) => {
  if (LINE_HEIGHT_SET.has(v)) {
    return [v, count, LINE_HEIGHT_SET.get(v), "mapped — §8.2 type table"];
  }
  return [v, count, "—", "**flagged** — not in the type table's line-height set"];
});

// ---------------------------------------------------------------------------
// 3. Spacing — padding / margin / gap, decomposed into individual lengths.
// ---------------------------------------------------------------------------

const SPACING_RAMP = new Set([4, 6, 8, 12, 16, 18, 22, 32, 44]);
const SPACING_SNAP = {
  5: "4 or 6",
  7: "6 or 8",
  9: "8",
  10: "8 or 12",
  11: "12",
  13: "12",
  20: "18 or 22",
};

function extractLengths(propRe) {
  const counts = new Map();
  for (const m of src.matchAll(propRe)) {
    const shorthand = m[1];
    for (const tokenMatch of shorthand.matchAll(/(-?[0-9]+(?:\.[0-9]+)?)px|(auto)/g)) {
      const key = tokenMatch[2] ? "auto" : `${Number(tokenMatch[1])}px`;
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  }
  return counts;
}

const paddingCounts = extractLengths(/padding\s*:\s*([^;"'}]+)/g);
const marginCounts = extractLengths(/margin\s*:\s*([^;"'}]+)/g);
const gapCounts = extractLengths(/\bgap\s*:\s*([^;"'}]+)/g);

function mergeCounts(...maps) {
  const out = new Map();
  for (const m of maps) {
    for (const [k, v] of m) out.set(k, (out.get(k) || 0) + v);
  }
  return out;
}

function spacingRows(counts) {
  return sortedByCount(counts)
    .filter(([v]) => v !== "auto" && v !== "0px")
    .map(([v, count]) => {
      const n = Number(v.replace("px", ""));
      if (n === 14) {
        return [
          v,
          count,
          "—",
          "**flagged for Cory** — 14px is a review decision, not a snap (§8.3); appears 600+ times across the prototype",
        ];
      }
      if (SPACING_RAMP.has(n)) return [v, count, `${n}`, "mapped — on the ramp (§8.3)"];
      if (n === 1) return [v, count, "border", "mapped — hairline grid border, not spacing (§8.3)"];
      if (n in SPACING_SNAP)
        return [v, count, SPACING_SNAP[n], `mapped — default snap, choose by context (§8.3)`];
      return [v, count, "—", "**flagged** — off the ramp, no snapping rule covers it"];
    });
}

const paddingRows = spacingRows(paddingCounts);
const marginRows = spacingRows(marginCounts);
const gapRows = spacingRows(gapCounts);

// ---------------------------------------------------------------------------
// 4. Radius
// ---------------------------------------------------------------------------

const radiusCounts = extractLengths(/border-radius\s*:\s*([^;"'}!]+)/g);
const radiusPercentCounts = tally(/border-radius\s*:\s*(50%)/g, src, (v) => v);

const radiusRows = [];
for (const [v, count] of sortedByCount(radiusCounts)) {
  if (v === "0px") continue;
  const n = Number(v.replace("px", ""));
  if (n === 2) radiusRows.push([v, count, "--radius (locked)", "mapped (§8.4)"]);
  else if (n === 20) radiusRows.push([v, count, "chip shape token", "mapped — chip shape, not a size (§8.4)"]);
  else
    radiusRows.push([
      v,
      count,
      "—",
      "**flagged** — off the locked scale; check whether it's illustrative demo content before treating as a defect",
    ]);
}
for (const [v, count] of sortedByCount(radiusPercentCounts)) {
  radiusRows.push([
    v,
    count,
    "circle",
    "**flagged for review** — full circle is only correct for marks with no layout (§8.4); confirm each use",
  ]);
}

// ---------------------------------------------------------------------------
// 5. Motion — duration and easing
// ---------------------------------------------------------------------------

// Named durations documented on the Motion page itself (motDocs() → motDurations/motTokens,
// reference/INDEX.md §5 Motion row). Used to propose names for harvested raw values.
const NAMED_DURATIONS = new Map([
  ["140ms", "Instant"],
  [".14s", "Instant"],
  ["180ms", "Control"],
  [".18s", "Control"],
  ["260ms", "Panel"],
  [".26s", "Panel"],
  ["500ms", "Reveal"],
  [".5s", "Reveal"],
]);

const NAMED_EASINGS = new Map([
  ["cubic-bezier(.4,0,.2,1)", "standard"],
  ["cubic-bezier(.45,0,.55,1)", "symmetric"],
  ["cubic-bezier(.35,0,.2,1)", "draw"],
]);

// Durations: `.NNs` short form and `NNNms` long form, from transition/animation values.
const shortDurationCounts = tally(/(?<![\w.])(\.[0-9]+s)\b/g, src, (v) => v);
const longDurationCounts = tally(/(?<![\w.])([0-9]{2,4}ms)\b/g, src, (v) => v);
const durationCounts = mergeCounts(shortDurationCounts, longDurationCounts);

const durationRows = sortedByCount(durationCounts).map(([v, count]) => {
  const named = NAMED_DURATIONS.get(v);
  if (named) return [v, count, named, "mapped — named on the Motion page (motDocs)"];
  return [
    v,
    count,
    "—",
    "**flagged** — not one of the Motion page's five named durations (Instant/Control/Panel/Reveal/Draw); confirm whether it collapses into one or is a distinct step",
  ];
});

const easingCounts = tally(/(cubic-bezier\([^)]*\))/g, src, (v) => v.replace(/\s+/g, ""));
const keywordEasingCounts = tally(
  /transition\s*:\s*[^;"'}]*?\b(ease-in-out|ease-in|ease-out|ease|linear)\b/g,
  src,
  (v) => v,
);

const easingRows = [];
for (const [v, count] of sortedByCount(easingCounts)) {
  const named = NAMED_EASINGS.get(v);
  easingRows.push([
    v,
    count,
    named || "—",
    named ? `mapped — "${named}" (§8.5, confirmed against Motion page)` : "**flagged** — not one of the three named easings",
  ]);
}
for (const [v, count] of sortedByCount(keywordEasingCounts)) {
  easingRows.push([v, count, "—", "flagged for awareness — keyword easing, not one of the three cubic-bezier tokens (§8.5)"]);
}

// ---------------------------------------------------------------------------
// 6. Chart SVG text sizes
// ---------------------------------------------------------------------------
// docs/prd.md §8.2: text inside chart SVGs renders in viewBox units, not px —
// evaluate its rendered size and flag. The values below are the `size` argument
// to the shared `mono()` text primitive and the `f1`/`f2` callout sizes
// (archive/v1/Workspace Shell.dc.html:13605–13973, reference/INDEX.md §5
// Visualization row / §6 Charts). These are call-site arguments inside nested
// JS expressions, which a value regex cannot reliably isolate from the
// surrounding markup — they were read directly from the `mono()`/`callout()`
// call sites instead of pattern-matched.
const CHART_SVG_TEXT_SIZES = [
  { size: "11.5", uses: "callout() narrow sub-label (f2)", occurrences: "narrow charts only" },
  { size: "12", uses: "mono() chart caption", occurrences: 1 },
  { size: "12.5", uses: "mono() node/region labels", occurrences: 4 },
  { size: "13", uses: "mono() captions; callout() narrow title (f1)", occurrences: 8 },
  { size: "14", uses: "mono() region labels, headline values; callout() wide sub-label (f2)", occurrences: 5 },
  { size: "16", uses: "callout() wide title (f1)", occurrences: "wide charts only" },
];

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

function flaggedCount(rows, statusIdx = 3) {
  return rows.filter((r) => String(r[statusIdx]).includes("flagged")).length;
}

const sections = [];

sections.push(`# Token harvest report

Generated by \`reference/harvest-tokens.mjs\` from \`archive/v1/Workspace Shell.dc.html\` (${src.split("\n").length} lines). Do not hand-edit — rerun the script instead. Scans that one file only: \`archive/v1/support.js\` is the generic \`dc-runtime\` template engine, not app content (reference/INDEX.md, opening paragraph), so it carries no Lairy-specific values to harvest.

Every raw colour, font-size, letter-spacing, line-height, gap/padding/margin, radius, duration and easing value in the prototype, with its count and its proposed token per \`docs/prd.md\` §8's mapping rules. Rows marked **flagged** have no rule that maps them cleanly and need a decision before a token is cut (AGENTS.md rule 1: "If a needed value has no token, flag it — never invent one").

## Summary

${table(
  ["Category", "Distinct values", "Flagged"],
  [
    ["Color", colorRows.length, flaggedCount(colorRows)],
    ["Font size", fontSizeRows.length, flaggedCount(fontSizeRows)],
    ["Letter spacing", letterSpacingRows.length, flaggedCount(letterSpacingRows)],
    ["Line height", lineHeightRows.length, flaggedCount(lineHeightRows)],
    ["Padding", paddingRows.length, flaggedCount(paddingRows)],
    ["Margin", marginRows.length, flaggedCount(marginRows)],
    ["Gap", gapRows.length, flaggedCount(gapRows)],
    ["Radius", radiusRows.length, flaggedCount(radiusRows)],
    ["Duration", durationRows.length, flaggedCount(durationRows)],
    ["Easing", easingRows.length, flaggedCount(easingRows)],
    ["Alarm alpha variants", alarmAlphaRows.length, alarmAlphaRows.length],
    ["Chart SVG text sizes", CHART_SVG_TEXT_SIZES.length, CHART_SVG_TEXT_SIZES.length],
  ],
)}
`);

sections.push(`## 1. Color

Compared against the token catalogue parsed from the prototype's own \`:root\` and \`[data-theme="light"]\` blocks (docs/prd.md §8.1). \`--alarm\` and its alpha variants are broken out separately below.

A value's count is every literal occurrence in the file, regardless of CSS property — a "mapped" \`rgba(0,0,0,.45)\` count includes both uses as a plain colour and uses inside a \`box-shadow\` string, so it isn't necessarily that many uses of the token itself. In particular, the **flagged** \`rgba(0,0,0,*)\` rows below (\`.5\`, \`.35\`, \`.72\`, \`.3\`, \`.24\`) are almost all Elevation's shadow/scrim tints (\`elevTokens\`, reference/INDEX.md §5 Elevation row) rather than new or stray colours — Elevation has no named colour token of its own for them yet, which is why they don't match the catalogue.

${table(["Value", "Count", "Proposed token", "Status"], colorRows)}

### Alarm alpha variants

\`--alarm\` (\`${ALARM_HEX}\`) is non-themeable by design (AGENTS.md rule 4, docs/prd.md §8.1). Its \`rgba(${ALARM_RGB},…)\` alpha variants are harvested here for consolidation into a small named set (e.g. \`--alarm-soft\`, \`--alarm-line\`) — the PRD only sketches the shape of that set, not which alpha gets which name, so every variant is flagged for that decision.

${table(["Value", "Count"], alarmAlphaRows)}
`);

sections.push(`## 2. Typography

### Font size

Scale from docs/prd.md §8.2. Off-scale values use the default mapping table; anything else is flagged. Chart SVG text sizes are handled separately in §6 — they're excluded from "below the 11px floor" flags here because they render in viewBox units, not px.

${table(["Value", "Count", "Proposed token", "Status"], fontSizeRows)}

### Letter spacing

Working tracking set and negative display/Metric tracking from docs/prd.md §8.2.

${table(["Value", "Count", "Proposed token", "Status"], letterSpacingRows)}

### Line height

Values from the docs/prd.md §8.2 type table. Note the volume on \`1.55\` below relative to \`1.6\` (Body's documented line-height) — worth Cory's attention as a possible mismatch between the documented scale and the prototype's actual body copy.

${table(["Value", "Count", "Proposed token", "Status"], lineHeightRows)}
`);

sections.push(`## 3. Spacing

Ramp and default snapping rules from docs/prd.md §8.3. Each shorthand (\`padding\`/\`margin\`/\`gap\`) is decomposed into its individual length values; \`0px\` and \`auto\` are omitted as uninformative. 1px values are excluded as hairline-grid borders per §8.3, except where flagged.

### Padding

${table(["Value", "Count", "Proposed token", "Status"], paddingRows)}

### Margin

${table(["Value", "Count", "Proposed token", "Status"], marginRows)}

### Gap

${table(["Value", "Count", "Proposed token", "Status"], gapRows)}
`);

sections.push(`## 4. Radius

Locked at 2px; 20px is the chip shape (docs/prd.md §8.4, AGENTS.md rule 5). Full circle (\`50%\`) is allowed only for marks holding no layout — the script can't tell layout from markup alone, so every \`50%\` use is flagged for a human pass.

${table(["Value", "Count", "Proposed token", "Status"], radiusRows)}
`);

sections.push(`## 5. Motion

### Duration

Named durations (Instant/Control/Panel/Reveal/Draw) come from the Motion page's own \`motDocs()\` content (\`archive/v1/Workspace Shell.dc.html\`, reference/INDEX.md §5), not an invented scale. Values are counted in both their long (\`NNNms\`) and short (\`.NNs\`) forms as they appear in the source.

${table(["Value", "Count", "Proposed token", "Status"], durationRows)}

### Easing

Three easing tokens named per docs/prd.md §8.5, confirmed against the Motion page's own durations table (\`cubic-bezier(.4,0,.2,1)\` also documented there as Panel/Reveal's curve, i.e. "standard"; \`cubic-bezier(.35,0,.2,1)\` as Draw's curve; \`cubic-bezier(.45,0,.55,1)\` as the sweepline loop, i.e. "symmetric").

${table(["Value", "Count", "Proposed token", "Status"], easingRows)}
`);

sections.push(`## 6. Chart SVG text sizes

docs/prd.md §8.2: text inside chart SVGs renders in viewBox units, not px, so its rendered size depends on the chart's container — evaluate and flag rather than mapping directly onto the type scale. These are the \`size\` arguments to the shared \`mono()\` text primitive and the \`callout()\` tooltip's \`f1\`/\`f2\` sizes (\`archive/v1/Workspace Shell.dc.html\` lines 13605–13973; reference/INDEX.md §5 Visualization row, §6 Charts). Hand-read from the call sites — a value regex can't safely isolate a positional argument from the surrounding JS expressions here.

${table(
  ["viewBox size", "Used for", "Call sites"],
  CHART_SVG_TEXT_SIZES.map((c) => [c.size, c.uses, String(c.occurrences)]),
)}

All seven Visualization components (Block field, Column series, Plate stack, Ridge, Node map, Ring coverage, City grid) share these primitives, so the same sizes recur across every chart. **Flagged**: none of these map onto the type scale directly, and the 11.5/13/14/16 pairing changes with the chart's \`narrow\` flag rather than being fixed — needs a decision on whether chart text gets its own small token set or a documented viewBox → rendered-px conversion.
`);

writeFileSync(OUTPUT_PATH, sections.join("\n") + "\n");

const totalFlagged =
  flaggedCount(colorRows) +
  flaggedCount(fontSizeRows) +
  flaggedCount(letterSpacingRows) +
  flaggedCount(lineHeightRows) +
  flaggedCount(paddingRows) +
  flaggedCount(marginRows) +
  flaggedCount(gapRows) +
  flaggedCount(radiusRows) +
  flaggedCount(durationRows) +
  flaggedCount(easingRows) +
  alarmAlphaRows.length +
  CHART_SVG_TEXT_SIZES.length;

console.log(`Wrote ${OUTPUT_PATH}`);
console.log(`${totalFlagged} values flagged for review across all categories.`);
