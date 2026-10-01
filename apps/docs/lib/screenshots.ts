import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getComponent, getFoundation, listComponents, listFoundations } from "@lairy/content";

/**
 * Route handlers run with cwd = apps/docs (both `next dev` and `next start`
 * per docs/build-guide.md §6), two levels below the repo root.
 */
const REPO_ROOT = join(process.cwd(), "..", "..");

export type CompareKind = "component" | "foundation";
export type CompareTheme = "dark" | "light";

/**
 * reference/capture-baseline.mjs (LDS-010) slugifies the prototype's own
 * nav label, not our content entry id — most match, a couple of the
 * prototype's plural labels ("Badges", "Cards") don't.
 */
const COMPONENT_SCREENSHOT_SLUGS: Record<string, string> = {
  badge: "badges",
  card: "cards",
  button: "buttons",
};

export interface CompareEntry {
  id: string;
  name: string;
  kind: CompareKind;
}

/** Only entries with a live docs page to compare against (docs/build-guide.md
 * §2: the compare route is read alongside a built page, not instead of one) —
 * same "not draft" filter /components/[slug] and /foundations/[slug] use. */
export function resolveCompareEntry(id: string): CompareEntry | undefined {
  const component = getComponent(id);
  if (component && component.meta.status !== "draft") {
    return { id, name: component.meta.name, kind: "component" };
  }
  const foundation = getFoundation(id);
  if (foundation && foundation.meta.status !== "draft") {
    return { id, name: foundation.meta.name, kind: "foundation" };
  }
  return undefined;
}

export function listCompareEntries(): CompareEntry[] {
  const components = listComponents()
    .filter((entry) => entry.meta.status !== "draft")
    .map((entry) => ({ id: entry.meta.id, name: entry.meta.name, kind: "component" as const }));
  const foundations = listFoundations()
    .filter((entry) => entry.meta.status !== "draft")
    .map((entry) => ({ id: entry.meta.id, name: entry.meta.name, kind: "foundation" as const }));
  return [...components, ...foundations];
}

function screenshotPath(entry: CompareEntry, theme: CompareTheme): string {
  const section = entry.kind === "component" ? "components" : "foundations";
  const slug = entry.kind === "component" ? (COMPONENT_SCREENSHOT_SLUGS[entry.id] ?? entry.id) : entry.id;
  return join(REPO_ROOT, "reference", "screenshots", section, `${slug}--${theme}.png`);
}

/** Reads straight from reference/screenshots/ (never copied into public/ —
 * that would ship all 98 baseline PNGs in a production build, defeating the
 * ticket's "excluded from production builds" requirement). */
export function readBaselineScreenshot(entry: CompareEntry, theme: CompareTheme): Buffer {
  // No production deploy traces this route's output (same reasoning as
  // lib/registry.ts's readSource) — opt out of Turbopack bundling the whole
  // repo into it.
  return readFileSync(/* turbopackIgnore: true */ screenshotPath(entry, theme));
}
