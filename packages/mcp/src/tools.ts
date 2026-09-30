import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { ComponentEntry, ComponentProp, Relationship, TokenEntry, UseInstead } from "@lairy/content";
import { getComponent, getComponentProps, listComponents, listTokens } from "@lairy/content";
import { REPO_ROOT } from "./repo-root";

export class EntryNotFoundError extends Error {
  constructor(id: string) {
    super(`No component entry with id "${id}".`);
    this.name = "EntryNotFoundError";
  }
}

export interface EntrySummary {
  id: string;
  name: string;
  section: string;
  status: string;
  purpose: string;
}

export type Section = "foundations" | "components" | "patterns";

/**
 * docs/prd.md §9 `list_entries({ section? })`. Only the `components` section
 * has content entries so far (packages/content/src/catalogue.ts) —
 * foundations and patterns join once their own tickets land, and this list
 * will surface them without any change here.
 */
export function listEntries(input: { section?: Section } = {}): EntrySummary[] {
  return listComponents()
    .filter((entry) => !input.section || entry.meta.section === input.section)
    .map((entry) => ({
      id: entry.meta.id,
      name: entry.meta.name,
      section: entry.meta.section,
      status: entry.meta.status,
      purpose: entry.purpose,
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

interface ResolvedRelationship extends Relationship {
  targetName: string;
}

interface ResolvedUseInstead extends UseInstead {
  targetName: string;
}

interface ExampleWithSource {
  id: string;
  kind: string;
  title: string;
  caption?: string;
  source: string;
  sourceText: string;
}

export interface ComponentDetail extends Omit<
  ComponentEntry,
  "examples" | "relationships" | "usage"
> {
  examples: ExampleWithSource[];
  relationships: ResolvedRelationship[];
  usage: Omit<ComponentEntry["usage"], "useInstead"> & { useInstead: ResolvedUseInstead[] };
  /** Extracted from the component's own source via react-docgen-typescript,
   * merged with `propGuidance` by name — the real API, never a hand-written
   * table (docs/prd.md D5, LDS-009). Empty for a component with no `ui`
   * implementation yet. */
  props: ComponentProp[];
}

function resolveName(id: string): string {
  return getComponent(id)?.meta.name ?? id;
}

/**
 * docs/prd.md §9 `get_component({ id })`: the full entry, with relationships
 * and useInstead rows resolved to names, and every example's source read
 * from its TSX file and returned as text, by id (the ticket's "example
 * sources returned as text by id").
 */
export function getComponentDetail(input: { id: string }): ComponentDetail {
  const entry = getComponent(input.id);
  if (!entry) {
    throw new EntryNotFoundError(input.id);
  }

  return {
    ...entry,
    props: getComponentProps(input.id) ?? [],
    examples: entry.examples.map((example) => ({
      ...example,
      sourceText: readFileSync(resolve(REPO_ROOT, example.source), "utf-8"),
    })),
    relationships: entry.relationships.map((relationship) => ({
      ...relationship,
      targetName: resolveName(relationship.target),
    })),
    usage: {
      ...entry.usage,
      useInstead: entry.usage.useInstead.map((useInstead) => ({
        ...useInstead,
        targetName: resolveName(useInstead.target),
      })),
    },
  };
}

interface AlternativeReason {
  /** Where this edge came from: a relationship's own kind, or "use-instead". */
  kind: string;
  text: string;
}

interface AlternativeSuggestion {
  id: string;
  name: string;
  purpose: string;
  reasons: AlternativeReason[];
  useWhen: string[];
  boundary?: string;
}

const STOPWORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "but",
  "not",
  "no",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "to",
  "of",
  "in",
  "on",
  "at",
  "by",
  "for",
  "from",
  "with",
  "about",
  "as",
  "into",
  "than",
  "that",
  "this",
  "these",
  "those",
  "it",
  "its",
  "what",
  "when",
  "where",
  "why",
  "who",
  "whom",
  "how",
  "should",
  "would",
  "could",
  "will",
  "can",
  "do",
  "does",
  "did",
  "i",
  "you",
  "someone",
  "something",
  "tell",
]);

function significantWords(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter(
    (word) => word.length >= 3 && !STOPWORDS.has(word),
  );
}

function wordScore(text: string, words: string[]): number {
  const lower = text.toLowerCase();
  return words.reduce((sum, word) => sum + (lower.includes(word) ? 1 : 0), 0);
}

/**
 * docs/prd.md §9 `suggest_alternative({ component, situation })`: traverses
 * relationship and useInstead data. Candidates are every other entry
 * connected to `component` by an edge in either direction (its own
 * relationships/useInstead pointing at `component`, or `component`'s
 * pointing at it) — the tool surfaces the content's own reasoning text
 * rather than judging the situation itself; `situation` only orders
 * multiple candidates by word overlap.
 */
export function suggestAlternative(input: { component: string; situation: string }): {
  component: string;
  situation: string;
  suggestions: AlternativeSuggestion[];
} {
  const target = getComponent(input.component);
  if (!target) {
    throw new EntryNotFoundError(input.component);
  }

  const candidates = new Map<string, AlternativeSuggestion>();

  const addReason = (otherId: string, kind: string, text: string) => {
    const other = getComponent(otherId);
    if (!other || other.meta.id === input.component) return;
    const existing = candidates.get(other.meta.id);
    if (existing) {
      existing.reasons.push({ kind, text });
      return;
    }
    candidates.set(other.meta.id, {
      id: other.meta.id,
      name: other.meta.name,
      purpose: other.purpose,
      reasons: [{ kind, text }],
      useWhen: other.usage.useWhen,
      boundary: other.description?.boundary,
    });
  };

  for (const entry of listComponents()) {
    for (const relationship of entry.relationships) {
      if (relationship.target === input.component) {
        addReason(entry.meta.id, relationship.kind, relationship.text);
      }
    }
    for (const useInstead of entry.usage.useInstead) {
      if (useInstead.target === input.component) {
        addReason(entry.meta.id, "use-instead", useInstead.text);
      }
    }
  }
  for (const relationship of target.relationships) {
    addReason(relationship.target, relationship.kind, relationship.text);
  }
  for (const useInstead of target.usage.useInstead) {
    addReason(useInstead.target, "use-instead", useInstead.text);
  }

  const situationWords = significantWords(input.situation);
  const suggestions = [...candidates.values()].sort((a, b) => {
    const scoreOf = (candidate: AlternativeSuggestion) =>
      wordScore(
        [
          ...candidate.reasons.map((r) => r.text),
          ...candidate.useWhen,
          candidate.boundary ?? "",
        ].join(" "),
        situationWords,
      );
    return scoreOf(b) - scoreOf(a);
  });

  return { component: input.component, situation: input.situation, suggestions };
}

interface GuidelineField {
  field: string;
  text: string;
}

interface GuidelineMatch {
  id: string;
  name: string;
  score: number;
  matches: GuidelineField[];
}

function guidanceFields(entry: ComponentEntry): GuidelineField[] {
  const fields: GuidelineField[] = [{ field: "purpose", text: entry.purpose }];
  if (entry.description) {
    fields.push({ field: "description.summary", text: entry.description.summary });
    fields.push({ field: "description.boundary", text: entry.description.boundary });
  }
  for (const rule of entry.contentRules) {
    fields.push({ field: "contentRules", text: rule.text });
  }
  for (const useWhen of entry.usage.useWhen) {
    fields.push({ field: "usage.useWhen", text: useWhen });
  }
  for (const useInstead of entry.usage.useInstead) {
    fields.push({ field: `usage.useInstead:${useInstead.target}`, text: useInstead.text });
  }
  for (const note of entry.accessibility) {
    fields.push({ field: `accessibility:${note.title}`, text: note.body });
  }
  for (const relationship of entry.relationships) {
    fields.push({
      field: `relationships:${relationship.kind}:${relationship.target}`,
      text: relationship.text,
    });
  }
  return fields;
}

/**
 * docs/prd.md §9 `search_guidelines({ query })`: full-text search across
 * rules, usage and content guidance, returning entry ids and the matching
 * rules — ranked by how many of the query's significant words each entry's
 * guidance contains.
 */
export function searchGuidelines(input: { query: string }): GuidelineMatch[] {
  const words = significantWords(input.query);
  if (words.length === 0) return [];

  const results: GuidelineMatch[] = [];
  for (const entry of listComponents()) {
    const fields = guidanceFields(entry);
    const matches = fields.filter((f) => wordScore(f.text, words) > 0);
    if (matches.length === 0) continue;
    const score = matches.reduce((sum, f) => sum + wordScore(f.text, words), 0);
    results.push({ id: entry.meta.id, name: entry.meta.name, score, matches });
  }

  return results.sort((a, b) => b.score - a.score);
}

export type Theme = "dark" | "light";

/** A token entry with its value resolved to a single theme, when `theme` was
 * requested. A themeable token keeps its `{ dark, light }` shape otherwise;
 * a non-themeable token's plain-string value is unaffected either way. */
export interface ResolvedTokenEntry extends Omit<TokenEntry, "value"> {
  value: TokenEntry["value"] | string;
}

/**
 * docs/prd.md §9 `get_tokens({ group?, theme? })`: every token with its
 * value(s), use for, never for and rationale (docs/prd.md §7.2). `group` is
 * an exact, case-insensitive match against an entry's `group` field (e.g.
 * "Accent", "Spacing", "Typography — tracking"). `theme` projects a
 * themeable token's `{ dark, light }` value down to the one requested,
 * leaving a non-themeable token's single value as-is.
 */
export function getTokens(input: { group?: string; theme?: Theme } = {}): ResolvedTokenEntry[] {
  const { group, theme } = input;
  return listTokens()
    .filter((token) => !group || token.group.toLowerCase() === group.toLowerCase())
    .map((token) => ({
      ...token,
      value: theme && typeof token.value === "object" ? token.value[theme] : token.value,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
