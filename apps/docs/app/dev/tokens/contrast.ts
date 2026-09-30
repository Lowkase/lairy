import { color } from "@lairy/tokens";

/** WCAG 2 relative luminance and contrast ratio (solid colors only — a
 * translucent token has no single contrast ratio without knowing what it
 * sits over, so this only covers the opaque text/ground/accent pairs). */
function relativeLuminance(hex: string): number {
  const n = hex.replace("#", "");
  const channel = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const r = channel(parseInt(n.slice(0, 2), 16) / 255);
  const g = channel(parseInt(n.slice(2, 4), 16) / 255);
  const b = channel(parseInt(n.slice(4, 6), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(hexA: string, hexB: string): number {
  const la = relativeLuminance(hexA);
  const lb = relativeLuminance(hexB);
  const l1 = Math.max(la, lb);
  const l2 = Math.min(la, lb);
  return (l1 + 0.05) / (l2 + 0.05);
}

/** AA thresholds (WCAG 2.1 §1.4.3): 4.5:1 for body text, 3:1 for large text
 * (≥18.66px bold or ≥24px regular) and non-text UI components. */
function aaLevel(ratio: number): "AA" | "AA (large only)" | "fail" {
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA (large only)";
  return "fail";
}

export type ContrastPairing = {
  fg: string;
  fgToken: string;
  bg: string;
  bgToken: string;
  ratio: number;
  level: ReturnType<typeof aaLevel>;
};

/** Every solid-on-solid text/ground pairing worth reviewing for AA, computed
 * for both themes from the actual token values (not hand-copied numbers). */
export function contrastPairings(theme: "dark" | "light"): ContrastPairing[] {
  const c = color[theme];
  const pairs: [string, string, string, string][] = [
    [c.fg, "fg", c.bg, "bg"],
    [c.dim, "dim", c.bg, "bg"],
    [c.mute, "mute", c.bg, "bg"],
    [c.faint, "faint", c.bg, "bg"],
    [c.accent, "accent", c.bg, "bg"],
    [c.accent2, "accent-2", c.bg, "bg"],
  ];
  return pairs.map(([fg, fgToken, bg, bgToken]) => {
    const ratio = contrastRatio(fg, bg);
    return { fg, fgToken, bg, bgToken, ratio, level: aaLevel(ratio) };
  });
}

/** The alarm-ink proposal (LDS-004): text/icon color for content on a solid
 * --alarm fill. Alarm is non-themeable, so this pairing is theme-independent
 * — it's computed once, not per theme. */
export function alarmInkPairing(): ContrastPairing {
  const ratio = contrastRatio(color.alarm.alarmInk, color.alarm.alarm);
  return {
    fg: color.alarm.alarmInk,
    fgToken: "alarm-ink",
    bg: color.alarm.alarm,
    bgToken: "alarm",
    ratio,
    level: aaLevel(ratio),
  };
}
