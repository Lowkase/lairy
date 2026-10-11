import { getFoundation, listComponents, listFoundations, listPatterns } from "@lairy/content";

/**
 * The words Overview quotes, looked up in the catalogue by what they say
 * rather than copied into the page. If an entry's sentence is reworded or
 * removed this throws at build, so the page can never quietly drift from the
 * content it cites (ADR-0001, ADR-0009).
 */
function fromFoundation<T>(id: string, pick: (entry: NonNullable<ReturnType<typeof getFoundation>>) => T | undefined): T {
  const entry = getFoundation(id);
  const found = entry ? pick(entry) : undefined;
  if (found === undefined) throw new Error(`Overview: the "${id}" foundation no longer has the text it quotes.`);
  return found;
}

export interface Principle {
  title: string;
  text: string;
  foundationId: string;
  foundationName: string;
}

export function principles(): Principle[] {
  const make = (title: string, foundationId: string, text: string): Principle => ({
    title,
    text,
    foundationId,
    foundationName: fromFoundation(foundationId, (entry) => entry.meta.name),
  });
  return [
    make(
      "Tokens only",
      "spacing",
      fromFoundation("spacing", (e) => e.principles.find((p) => p.text.startsWith("Anything not on the ramp"))?.text),
    ),
    make(
      "A locked 2px radius",
      "radius",
      fromFoundation("radius", (e) => e.description.summary),
    ),
    make(
      "Alarm does not theme",
      "color",
      fromFoundation("color", (e) => e.scales.find((s) => s.name === "Alarm")?.description),
    ),
    make(
      "Nothing below Micro",
      "typography",
      fromFoundation("typography", (e) => {
        const body = e.accessibilityNotes.find((n) => n.title === "Text floors")?.body;
        return body?.split(". ").slice(1).join(". ");
      }),
    ),
  ];
}

export interface SectionSummary {
  id: "foundations" | "components" | "patterns";
  name: string;
  href: string;
  count: number;
  /** CONTEXT.md's own sentence for the term. */
  purpose: string;
}

/** Counts are read from the catalogue. Purposes are CONTEXT.md's glossary
 * sentences for Foundation, Component and Pattern, verbatim. */
export function sections(): SectionSummary[] {
  return [
    {
      id: "foundations",
      name: "Foundations",
      href: "/foundations",
      count: listFoundations().length,
      purpose:
        "An entry defining a system-wide rule set: Color, Typography, Spacing, Radius, Icons, Elevation, Motion, Visualization, Accessibility.",
    },
    {
      id: "components",
      name: "Components",
      href: "/components",
      count: listComponents().length,
      purpose: "An entry for a reusable interface element with its own anatomy, variants and states.",
    },
    {
      id: "patterns",
      name: "Patterns",
      href: "/patterns",
      count: listPatterns().length,
      purpose:
        "An entry describing how several components are composed to solve a recurring situation. A pattern has no code of its own.",
    },
  ];
}
