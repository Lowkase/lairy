import type { ComponentEntry } from "@lairy/content";
import { listComponents } from "@lairy/content";

/**
 * docs/prd.md §6.3 `llms.txt` / `llms-full.txt`: flat text renderings of the
 * whole system for agents, generated at build from the same content entries
 * the docs app renders (no separate copy to keep in sync).
 */

const SYSTEM_SUMMARY =
  "Lairy is a design system with the visual language of an operator console: dark-first, monospaced, amber-accented, with a locked 2px corner.";

const SECTION_TITLES: Record<ComponentEntry["meta"]["section"], string> = {
  foundations: "Foundations",
  components: "Components",
  patterns: "Patterns",
};

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Entries with a real docs page. `app/components/[slug]/page.tsx` excludes
 * drafts the same way (`generateStaticParams`, and `notFound()` in the page
 * itself) — a draft stub has no page for either file to link to yet.
 */
function publishedEntries(): ComponentEntry[] {
  return listComponents()
    .filter((entry) => entry.meta.status !== "draft")
    .sort((a, b) => a.meta.id.localeCompare(b.meta.id));
}

function routeFor(entry: ComponentEntry): string {
  return `/${entry.meta.section}/${entry.meta.id}`;
}

function groupBySection(entries: ComponentEntry[]): Map<ComponentEntry["meta"]["section"], ComponentEntry[]> {
  const groups = new Map<ComponentEntry["meta"]["section"], ComponentEntry[]>();
  for (const entry of entries) {
    const group = groups.get(entry.meta.section) ?? [];
    group.push(entry);
    groups.set(entry.meta.section, group);
  }
  return groups;
}

/**
 * docs/prd.md §6.3 point 4, `llms.txt`: an index with one-line summaries and
 * links, following the llmstxt.org convention (a title, a blockquote
 * summary, then one linked list per section).
 */
export function buildLlmsIndex(): string {
  const entries = publishedEntries();
  const groups = groupBySection(entries);

  const lines: string[] = ["# Lairy", "", `> ${SYSTEM_SUMMARY}`, ""];

  for (const [section, sectionEntries] of groups) {
    lines.push(`## ${SECTION_TITLES[section]}`, "");
    for (const entry of sectionEntries) {
      lines.push(`- [${entry.meta.name}](${routeFor(entry)}): ${entry.purpose}`);
    }
    lines.push("");
  }

  return `${lines.join("\n").trimEnd()}\n`;
}

function renderEntry(entry: ComponentEntry): string[] {
  const lines: string[] = [];

  lines.push(`## ${entry.meta.name}`, "");
  lines.push(
    `Status: ${entry.meta.status} · Version: ${entry.meta.version} · Updated: ${formatDate(entry.meta.updated)} · ${routeFor(entry)}`,
    "",
  );
  lines.push(`Purpose: ${entry.purpose}`, "");

  if (entry.description) {
    lines.push("### Description", "", entry.description.summary, "", entry.description.boundary, "");
  }

  if (entry.anatomy.length > 0) {
    lines.push("### Anatomy", "");
    for (const part of entry.anatomy) {
      lines.push(`${part.number}. ${part.name} — ${part.description}`);
    }
    lines.push("");
  }

  if (entry.variants.length > 0) {
    lines.push("### Variants", "");
    for (const variant of entry.variants) {
      const tokens = variant.tokens.map((t) => `--${t}`).join(", ");
      lines.push(`- ${variant.name} (${tokens}): ${variant.description}`);
    }
    if (entry.variantsNote) lines.push("", entry.variantsNote);
    lines.push("");
  }

  if (entry.usage.useWhen.length > 0) {
    lines.push("### Use when", "");
    for (const row of entry.usage.useWhen) lines.push(`- ${row}`);
    lines.push("");
  }

  if (entry.usage.useInstead.length > 0) {
    lines.push("### Use something else when", "");
    for (const row of entry.usage.useInstead) lines.push(`- ${row.target}: ${row.text}`);
    lines.push("");
  }

  if (entry.contentRules.length > 0) {
    lines.push("### Content rules", "");
    for (const rule of entry.contentRules) lines.push(`- ${rule.text}`);
    lines.push("");
  }

  if (entry.examples.length > 0) {
    lines.push("### Examples", "");
    for (const example of entry.examples) {
      const caption = example.caption ? ` — ${example.caption}` : "";
      lines.push(`- [${example.kind}] ${example.title}${caption}`);
    }
    lines.push("");
  }

  if (entry.accessibility.length > 0) {
    lines.push("### Accessibility", "");
    for (const note of entry.accessibility) lines.push(`- ${note.title}: ${note.body}`);
    lines.push("");
  }

  if (entry.tokens.length > 0) {
    lines.push("### Tokens", "");
    for (const row of entry.tokens) {
      lines.push(`- ${row.tokens.map((t) => `--${t}`).join(", ")}: ${row.usage}`);
    }
    lines.push("");
  }

  if (entry.relationships.length > 0) {
    lines.push("### Related", "");
    for (const relationship of entry.relationships) {
      lines.push(`- ${relationship.target} (${relationship.kind}): ${relationship.text}`);
    }
    lines.push("");
  }

  if (entry.changelog.length > 0) {
    lines.push("### Changelog", "");
    for (const change of entry.changelog) {
      lines.push(`- v${change.version} (${formatDate(change.date)}): ${change.text}`);
    }
    lines.push("");
  }

  return lines;
}

/**
 * docs/prd.md §6.3 point 4, `llms-full.txt`: a full rendering of every
 * entry, same content the docs page shows, in reading order.
 */
export function buildLlmsFull(): string {
  const entries = publishedEntries();
  const groups = groupBySection(entries);

  const lines: string[] = ["# Lairy — full reference", "", `> ${SYSTEM_SUMMARY}`, ""];

  for (const [section, sectionEntries] of groups) {
    lines.push(`# ${SECTION_TITLES[section]}`, "");
    for (const entry of sectionEntries) {
      lines.push(...renderEntry(entry));
      lines.push("---", "");
    }
  }

  return `${lines.join("\n").trimEnd()}\n`;
}
