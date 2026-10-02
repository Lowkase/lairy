import { getComponent, getComponentProps, listComponents } from "@lairy/content";
import { UsageCard } from "@lairy/ui";
import { PageHeader } from "@/components/docs-page/page-header";
import { Section } from "@/components/docs-page/section";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import { BADGE_EXAMPLES } from "./badge-examples";
import { BUTTON_EXAMPLES } from "./button-examples";
import { CALLOUT_EXAMPLES } from "./callout-examples";
import { CARD_EXAMPLES } from "./card-examples";
import { CHIP_EXAMPLES } from "./chip-examples";
import { EMPTY_STATE_EXAMPLES } from "./empty-state-examples";
import { LOADING_EXAMPLES } from "./loading-examples";
import { PROGRESS_EXAMPLES } from "./progress-examples";
import { TEXT_EXAMPLES } from "./text-examples";
import { USAGE_CARD_EXAMPLES } from "./usage-card-examples";

const EXAMPLE_REGISTRIES: Record<string, Record<string, ComponentType>> = {
  badge: BADGE_EXAMPLES,
  button: BUTTON_EXAMPLES,
  callout: CALLOUT_EXAMPLES,
  card: CARD_EXAMPLES,
  chip: CHIP_EXAMPLES,
  "empty-state": EMPTY_STATE_EXAMPLES,
  loading: LOADING_EXAMPLES,
  progress: PROGRESS_EXAMPLES,
  text: TEXT_EXAMPLES,
  "usage-card": USAGE_CARD_EXAMPLES,
};

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function generateStaticParams() {
  return listComponents()
    .filter((entry) => entry.meta.status !== "draft")
    .map((entry) => ({ slug: entry.meta.id }));
}

export default async function ComponentPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ theme?: string }>;
}) {
  const { slug } = await params;
  const { theme } = await searchParams;
  const entry = getComponent(slug);
  if (!entry || entry.meta.status === "draft") notFound();

  const examples = EXAMPLE_REGISTRIES[slug] ?? {};
  const props = getComponentProps(slug) ?? [];
  const demoExamples = entry.examples.filter((example) => example.kind === "demo");
  const goodExamples = entry.examples.filter((example) => example.kind === "good");
  const badExamples = entry.examples.filter((example) => example.kind === "bad");
  const dontPairs = goodExamples.map((good, index) => ({ good, bad: badExamples[index] }));

  return (
    <ThemeToggle initialTheme={theme === "light" ? "light" : "dark"}>
      <div className="flex flex-col gap-32">
        <PageHeader
          title={entry.meta.name}
          status={entry.meta.status}
          version={entry.meta.version}
          updated={formatDate(entry.meta.updated)}
        />

        {entry.description ? (
          <div className="flex flex-col gap-8">
            <div className="text-section text-fg">{entry.description.summary}</div>
            <div className="text-body text-mute">{entry.description.boundary}</div>
          </div>
        ) : null}

        {entry.anatomy.length > 0 ? (
          <Section number="01" title="Anatomy" meta={`${entry.anatomy.length} parts`}>
            <div className="flex items-center justify-center border border-border bg-panel p-32">
              {(() => {
                const specimenExample =
                  demoExamples.find((example) => example.title.toLowerCase() === "success") ??
                  demoExamples[0];
                const Specimen = specimenExample ? examples[specimenExample.id] : undefined;
                return Specimen ? <Specimen /> : null;
              })()}
            </div>
            {entry.anatomyCaption ? (
              <div className="text-micro text-faint">{entry.anatomyCaption}</div>
            ) : null}
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
              {entry.anatomy.map((part) => (
                <div key={part.number} className="flex items-start gap-12">
                  <span className="flex size-22 shrink-0 items-center justify-center rounded-full bg-accent font-heading text-label font-semibold text-bg">
                    {part.number}
                  </span>
                  <span className="flex min-w-0 flex-col gap-4">
                    <span className="text-body text-fg">{part.name}</span>
                    <span className="text-small text-mute">{part.description}</span>
                  </span>
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {entry.variants.length > 0 ? (
          <Section number="02" title="Variants" meta={`${entry.variants.length}`}>
            <div className="flex flex-col gap-12">
              {entry.variants.map((variant) => {
                const example = demoExamples.find(
                  (e) => e.title.toLowerCase() === variant.name.toLowerCase(),
                );
                const Specimen = example ? examples[example.id] : undefined;
                return (
                  <div
                    key={variant.name}
                    className="grid grid-cols-1 gap-16 border border-border bg-panel p-16 sm:grid-cols-2"
                  >
                    <div className="flex min-w-0 flex-col gap-8">
                      <span className="text-small text-fg">{variant.name}</span>
                      <span className="text-micro text-faint">
                        {variant.tokens.map((t) => `--${t}`).join(", ")}
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-col items-start gap-8">
                      {Specimen ? <Specimen /> : null}
                      <span className="text-small text-mute">{variant.description}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            {entry.variantsNote ? (
              <div className="text-micro text-faint">{entry.variantsNote}</div>
            ) : null}
          </Section>
        ) : null}

        {entry.states.length > 0 ? (
          <Section number="03" title="States" meta={`${entry.states.length}`}>
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
              {entry.states.map((state) => (
                <div key={state.name} className="flex flex-col gap-8 border border-border p-16">
                  <span className="text-micro uppercase tracking-tight-6 text-accent">
                    {state.name}
                  </span>
                  <span className="text-small text-mute">{state.description}</span>
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {entry.usage.useWhen.length > 0 || entry.usage.useInstead.length > 0 ? (
          <Section number="04" title="Usage" meta="Use when / use instead">
            <UsageCard
              useWhen={entry.usage.useWhen}
              useInstead={entry.usage.useInstead.map((row) => row.text)}
            />
          </Section>
        ) : null}

        {entry.contentRules.length > 0 ? (
          <Section number="05" title="Content" meta={`${entry.contentRules.length} rules`}>
            <div className="border border-border bg-panel">
              {entry.contentRules.map((rule) => (
                <div
                  key={rule.text}
                  className="border-b border-border p-16 text-small text-mute last:border-b-0"
                >
                  {rule.text}
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {dontPairs.length > 0 ? (
          <Section number="06" title="Do and don't" meta={`${dontPairs.length} pairs`}>
            <div className="grid grid-cols-1 gap-16 sm:grid-cols-2">
              {dontPairs.flatMap(({ good, bad }) => [
                <DoDontCell
                  key={good.id}
                  example={good}
                  mark="good"
                  Specimen={examples[good.id]}
                />,
                bad ? (
                  <DoDontCell key={bad.id} example={bad} mark="bad" Specimen={examples[bad.id]} />
                ) : null,
              ])}
            </div>
          </Section>
        ) : null}

        {entry.accessibility.length > 0 ? (
          <Section number="07" title="Accessibility" meta={`${entry.accessibility.length}`}>
            <div className="grid grid-cols-1 gap-16 sm:grid-cols-2">
              {entry.accessibility.map((note) => (
                <div
                  key={note.title}
                  className="flex flex-col gap-8 border border-border bg-panel p-18"
                >
                  <span className="text-micro uppercase tracking-tight-6 text-accent">
                    {note.title}
                  </span>
                  <span className="text-small text-dim">{note.body}</span>
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {entry.tokens.length > 0 ? (
          <Section number="08" title="Tokens" meta={`${entry.tokens.length}`}>
            <div className="border border-border bg-panel">
              {entry.tokens.map((row) => (
                <div
                  key={row.tokens.join(",")}
                  className="grid grid-cols-1 gap-16 border-b border-border p-16 text-small last:border-b-0 sm:grid-cols-2"
                >
                  <span className="text-fg">{row.tokens.map((t) => `--${t}`).join(", ")}</span>
                  <span className="text-mute">{row.usage}</span>
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {props.length > 0 ? (
          <Section number="09" title="Props" meta={`${props.length}`}>
            <div className="border border-border bg-panel">
              {props.map((prop) => (
                <div
                  key={prop.name}
                  className="grid grid-cols-1 gap-16 border-b border-border p-16 text-small last:border-b-0 sm:grid-cols-2"
                >
                  <span className="text-fg">
                    {prop.name}
                    {prop.required ? null : <span className="text-faint">?</span>}
                    <span className="ml-8 text-micro text-faint">{prop.type}</span>
                  </span>
                  <span className="text-mute">{prop.guidance ?? prop.description}</span>
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {entry.relationships.length > 0 ? (
          <Section number="10" title="Related" meta={`${entry.relationships.length}`}>
            <div className="grid grid-cols-1 gap-16 sm:grid-cols-2">
              {entry.relationships.map((relationship) => {
                const target = getComponent(relationship.target);
                const linkable = target && target.meta.status !== "draft";
                const card = (
                  <div className="flex flex-col gap-8 border border-border bg-panel p-16">
                    <span className="text-small text-fg">
                      {target?.meta.name ?? relationship.target}
                    </span>
                    <span className="text-small text-mute">{relationship.text}</span>
                  </div>
                );
                return linkable ? (
                  <Link
                    key={relationship.target}
                    href={`/components/${relationship.target}`}
                    className="rounded-ds focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                  >
                    {card}
                  </Link>
                ) : (
                  <div key={relationship.target}>{card}</div>
                );
              })}
            </div>
          </Section>
        ) : null}

        {entry.changelog.length > 0 ? (
          <Section number="11" title="Changelog" meta="Newest first">
            <div className="border border-border bg-panel">
              {entry.changelog.map((change) => (
                <div
                  key={change.version}
                  className="flex flex-col gap-8 border-b border-border p-16 text-small text-mute last:border-b-0 sm:flex-row"
                >
                  <span className="text-micro text-accent">v{change.version}</span>
                  <span className="text-micro text-faint">{formatDate(change.date)}</span>
                  <span className="flex-1">{change.text}</span>
                </div>
              ))}
            </div>
          </Section>
        ) : null}
      </div>
    </ThemeToggle>
  );
}

function DoDontCell({
  example,
  mark,
  Specimen,
}: {
  example: { id: string; title: string; caption?: string };
  mark: "good" | "bad";
  Specimen?: ComponentType;
}) {
  return (
    <div className="flex flex-col border border-border">
      <div className="flex flex-1 items-center bg-panel p-18">{Specimen ? <Specimen /> : null}</div>
      <div className="flex gap-8 border-t border-border p-12">
        <span className={mark === "good" ? "text-small text-accent" : "text-small text-alarm"}>
          {mark === "good" ? "✓" : "✕"}
        </span>
        <span className="text-small text-mute">{example.caption}</span>
      </div>
    </div>
  );
}
