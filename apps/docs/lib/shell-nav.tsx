import { listComponents, listFoundations, listPatterns } from "@lairy/content";
import { Glyph, type MainRailItem, type SubnavGroup } from "@lairy/ui";
import type { ReactNode } from "react";
import type { ShellSection } from "@/components/shell";

/**
 * Server-only: the three page.tsx files (foundations/components/patterns,
 * [slug] and index) call these to build the Shell's own props, rather than
 * the Shell client component ("use client", apps/docs/components/shell.tsx)
 * importing `@lairy/content` itself — that package's `props.ts` pulls in
 * `react-docgen-typescript`, a Node-only dependency (`require("fs")`), so a
 * Client Component importing it breaks the browser bundle (confirmed
 * against this ticket's own dev server: "Module not found: Can't resolve
 * 'fs'"). This file stays server-side; `shell.tsx` receives only plain,
 * already-resolved nav data as props.
 */

const SECTION_META: Record<ShellSection, { label: string; code: string; icon: ReactNode }> = {
  foundations: { label: "Foundations", code: "SYS·01", icon: <Glyph name="book" size="rail" /> },
  components: { label: "Components", code: "SYS·02", icon: <Glyph name="grid" size="rail" /> },
  patterns: { label: "Patterns", code: "SYS·03", icon: <Glyph name="rings" size="rail" /> },
};

export function shellSectionMeta(section: ShellSection) {
  return SECTION_META[section];
}

function firstHref(section: ShellSection): string {
  if (section === "foundations") {
    const first = listFoundations()[0];
    return first ? `/foundations/${first.meta.id}` : "/foundations";
  }
  if (section === "components") {
    const first = listComponents()[0];
    return first ? `/components/${first.meta.id}` : "/components";
  }
  const first = listPatterns()[0];
  return first ? `/patterns/${first.meta.id}` : "/patterns";
}

/** The main rail's own fixed item set — one per section, order fixed
 * (mainNavRules "Order is fixed"). */
export function shellMainRailItems(): MainRailItem[] {
  return (["foundations", "components", "patterns"] as const).map((id) => ({
    id,
    label: SECTION_META[id].label,
    icon: SECTION_META[id].icon,
    href: firstHref(id),
  }));
}

/** The subnav's own single group for the active section — every entry in
 * that section, in catalogue order. */
export function shellSubnavGroup(section: ShellSection): SubnavGroup {
  if (section === "foundations") {
    return {
      id: "foundations",
      label: "Foundations",
      pages: listFoundations().map((entry) => ({
        id: entry.meta.id,
        label: entry.meta.name,
        href: `/foundations/${entry.meta.id}`,
      })),
    };
  }
  if (section === "components") {
    return {
      id: "components",
      label: "Components",
      pages: listComponents().map((entry) => ({
        id: entry.meta.id,
        label: entry.meta.name,
        href: `/components/${entry.meta.id}`,
      })),
    };
  }
  return {
    id: "patterns",
    label: "Patterns",
    pages: listPatterns().map((entry) => ({
      id: entry.meta.id,
      label: entry.meta.name,
      href: `/patterns/${entry.meta.id}`,
    })),
  };
}
