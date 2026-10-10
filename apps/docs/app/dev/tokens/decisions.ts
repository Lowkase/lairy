/* eslint-disable lairy/no-hardcoded-color -- prose quotes prototype colour values as evidence, not styling */
export type Decision = {
  id: string;
  title: string;
  question: string;
  evidence: string[];
  recommendation: string;
  source: string;
  /** The prototype Foundations page this decision's evidence comes from —
   * the full baseline capture from LDS-010 (reference/screenshots/), served
   * from apps/docs/public/dev/evidence/ for direct review here rather than
   * a hand-cropped excerpt this script can't verify is accurately framed. */
  screenshot: { src: string; alt: string };
};

/**
 * The five open token questions this ticket (LDS-012) exists to settle
 * (docs/prd.md §12 Q1/Q4, and the three token-decisions items reference/
 * token-harvest.md flags without a rule to resolve them). Evidence is
 * quoted or counted from reference/token-harvest.md and docs/prd.md §8 —
 * nothing here is invented (AGENTS.md rule 1).
 */
export const DECISIONS: Decision[] = [
  {
    id: "14px-spacing",
    title: "Is 14px a spacing step?",
    question:
      "docs/prd.md §12 Q1. The ramp is 4, 6, 8, 12, 16, 18, 22, 32 — 14 sits unused between 12 and 16, and every occurrence of it today gets snapped to a neighbour.",
    evidence: [
      "Gap: 14px appears 616 times — the single most common gap value in the whole prototype, ahead of 12px (524) and 16px (243).",
      "Padding: 14px appears 211 times — the 8th most common padding value.",
      "827 raw occurrences total. This isn't a stray value creeping in at the edges; it's used as often as the ramp's own established steps.",
    ],
    recommendation:
      "Add 14 to the ramp as a new step between 12 and 16. Treat it as a missing rung rather than continuing to snap ~830 real occurrences onto neighbours that don't match the prototype's own rhythm.",
    source: "reference/token-harvest.md §3 (Padding, Gap)",
    screenshot: { src: "/dev/evidence/spacing.png", alt: "Prototype Spacing foundation page, dark theme" },
  },
  {
    id: "small-section-tracking-leading",
    title: "Do Small and Section need their own tracking/leading?",
    question:
      "docs/prd.md §12 Q4. Small's leading is documented (1.5) but it has no dedicated tracking token — only Callout's own action-button label carries one (.06em), which is a component override, not a style rule. Section's tracking AND leading are both listed as \"per prototype\" with no fixed figure.",
    evidence: [
      "Section leading is currently a harvested compromise (1.3): the prototype's own section-title spans set no line-height at all (browser default, ~1.2), while the one wrapped use — the docs page's opening sentence — used 1.55.",
      "Small's tracking is 0 (untracked) everywhere except the one Callout button, which already has its own explicit tracking-tight-6 utility applied — Small itself carries nothing.",
    ],
    recommendation:
      "Keep Section's leading at the harvested 1.3 unless a stronger reading of the prototype argues otherwise, and leave both styles untracked by default (0) — bake in a tracking value only where a specific use (like the Callout button) already applies one explicitly, rather than pairing tracking into the text-small/text-section utilities the way leading already is.",
    source: "docs/prd.md §8.2 type table; packages/tokens/tokens/typography.json (leading.section)",
    screenshot: { src: "/dev/evidence/typography.png", alt: "Prototype Typography foundation page, dark theme" },
  },
  {
    id: "alarm-alpha-set",
    title: "Does the alarm alpha set match how alarm is actually used?",
    question:
      "color.alarm.json's alarm-soft (.1 opacity) and alarm-line (.4 opacity) were cut for Callout (LDS-004) before the full harvest existed. The harvest shows the prototype's own most common raw alarm alphas are .45 and .6 — neither matches today's two named steps.",
    evidence: [
      "rgba(255,143,107,.45) — 20 occurrences (the most common alarm alpha in the file).",
      "rgba(255,143,107,.6) — 11 occurrences (second most common).",
      "rgba(255,143,107,.7) — 4; rgba(...,.14) — 3; rgba(...,.5) — 2; four more variants at 1 occurrence each.",
      "Today's alarm-line (.4) doesn't exactly match any of these; alarm-soft (.1) is closest to the .13/.14 cluster (4 occurrences) rather than the dominant .45/.6 pair.",
    ],
    recommendation:
      "Retarget alarm-line from .4 to .45 (the dominant border/line alpha) and add a third step — alarm-strong at .6 — for the next most common use, rather than leaving the two highest-frequency raw values with no named token at all.",
    source: "reference/token-harvest.md §1 (Alarm alpha variants)",
    screenshot: { src: "/dev/evidence/color.png", alt: "Prototype Color foundation page, dark theme" },
  },
  {
    id: "tracking-consolidation",
    title: "Collapse the tracking outliers, or keep them?",
    question:
      "Three raw tracking values fall outside the seven-step working set (.06/.08/.1/.12/.14/.16/.2em): .22em, .18em and .04em. docs/prd.md §8.2 says to collapse further only with review.",
    evidence: [
      ".22em — 6 occurrences.",
      ".18em — 2 occurrences.",
      ".04em — 1 occurrence.",
    ],
    recommendation:
      "Fold .22em into tight-20 (.2em) and .18em into tight-16 (.16em) — both are within .02em of an existing step and each appears too rarely to justify its own token. .04em (a single occurrence) is more likely a rounding artifact than a deliberate step; fold it into tight-6 (.06em) or drop it as stray, Cory's call.",
    source: "reference/token-harvest.md §2 (Letter spacing)",
    screenshot: { src: "/dev/evidence/typography.png", alt: "Prototype Typography foundation page, dark theme" },
  },
  {
    id: "chart-svg-text",
    title: "Does chart SVG text get its own token set?",
    question:
      "Text inside chart SVGs renders in viewBox units, not px (docs/prd.md §8.2), so its rendered size depends on the chart's container rather than mapping directly onto the type scale. The sizes in play (11.5/12/12.5/13/14/16) don't land cleanly on Micro/Label/Small, and the 11.5/13/14/16 pairing changes with the chart's narrow flag rather than being fixed.",
    evidence: [
      "mono() chart caption/labels: 12, 12.5, 13, 14 viewBox units across all seven Visualization components.",
      "callout() tooltip: 11.5/13 (narrow charts) vs 14/16 (wide charts) for its sub-label/title pair.",
      "None of these six sizes is a stray one-off — every Visualization component shares the same primitives, so the same sizes recur everywhere charts appear.",
    ],
    recommendation:
      "Give chart text its own small token set (e.g. chart-caption, chart-label, chart-title, chart-title-narrow) independent of the main type scale, rather than forcing a viewBox-to-px conversion that would vary by chart size and break the 11px floor's guarantee outside of true px contexts.",
    source: "reference/token-harvest.md §6 (Chart SVG text sizes)",
    screenshot: { src: "/dev/evidence/visualization.png", alt: "Prototype Visualization foundation page, dark theme" },
  },
];
