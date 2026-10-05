import { getComponent, getPattern, listPatterns } from "@lairy/content";
import { PageHeader } from "@/components/docs-page/page-header";
import { Section } from "@/components/docs-page/section";
import { Shell } from "@/components/shell";
import { shellMainRailItems, shellSectionMeta, shellSubnavGroup } from "@/lib/shell-nav";
import Link from "next/link";
import { notFound } from "next/navigation";

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function generateStaticParams() {
  return listPatterns().map((entry) => ({ slug: entry.meta.id }));
}

// No `?theme=` searchParams support (unlike foundations/[slug] and
// components/[slug]): the /dev/compare/[entry] tool (LDS-016) only resolves
// "component" and "foundation" kinds (apps/docs/lib/screenshots.ts), never
// "pattern" — there's no prototype pattern page to compare against yet, and
// no pattern entries exist (listPatterns() is empty pending its own
// tickets). Reading `searchParams` on a route whose generateStaticParams
// returns an empty array throws DYNAMIC_SERVER_USAGE in a production build
// for an unmatched slug (confirmed against this ticket's own e2e run);
// dropping the otherwise-unused prop avoids that entirely.
export default async function PatternPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getPattern(slug);
  if (!entry) notFound();

  const shellMeta = shellSectionMeta("patterns");
  return (
    <Shell
      section="patterns"
      moduleIcon={shellMeta.icon}
      moduleLabel={shellMeta.label}
      moduleCode={shellMeta.code}
      items={shellMainRailItems()}
      group={shellSubnavGroup("patterns")}
      activeId={slug}
    >
      <div className="flex flex-col gap-32">
        <PageHeader
          title={entry.meta.name}
          status={entry.meta.status}
          version={entry.meta.version}
          updated={formatDate(entry.meta.updated)}
        />

        {/* A pattern "has no code of its own" (CONTEXT.md) — every pattern
            page shows this note, not only entries lacking a built component
            (docs/build-guide.md, LDS-035 acceptance criteria). */}
        <div className="border border-border-2 bg-panel p-16 text-small text-mute">
          Patterns have no code of their own — they describe how the components below are composed. See
          each component's own page to try it live.
        </div>

        <div className="text-body text-mute">{entry.description}</div>

        {entry.whenItApplies.length > 0 ? (
          <Section number="01" title="When it applies" meta={`${entry.whenItApplies.length}`}>
            <div className="border border-border bg-panel">
              {entry.whenItApplies.map((row) => (
                <div key={row} className="border-b border-border p-16 text-small text-mute last:border-b-0">
                  {row}
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {entry.composes.length > 0 ? (
          <Section number="02" title="Composes" meta={`${entry.composes.length} components`}>
            <div className="grid grid-cols-1 gap-16 sm:grid-cols-2">
              {entry.composes.map((componentId) => {
                const component = getComponent(componentId);
                return (
                  <Link
                    key={componentId}
                    href={`/components/${componentId}`}
                    className="rounded-ds border border-border bg-panel p-16 text-small text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                  >
                    {component?.meta.name ?? componentId}
                  </Link>
                );
              })}
            </div>
          </Section>
        ) : null}

        {entry.rules.length > 0 ? (
          <Section number="03" title="Rules" meta={`${entry.rules.length}`}>
            <div className="border border-border bg-panel">
              {entry.rules.map((rule) => (
                <div key={rule.text} className="border-b border-border p-16 text-small text-mute last:border-b-0">
                  {rule.text}
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {entry.relationships.length > 0 ? (
          <Section number="04" title="Related" meta={`${entry.relationships.length}`}>
            <div className="grid grid-cols-1 gap-16 sm:grid-cols-2">
              {entry.relationships.map((relationship) => (
                <div key={relationship.target} className="flex flex-col gap-8 border border-border bg-panel p-16">
                  <span className="text-small text-fg">{relationship.target}</span>
                  <span className="text-small text-mute">{relationship.text}</span>
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {entry.changelog.length > 0 ? (
          <Section number="05" title="Changelog" meta="Newest first">
            <div className="border border-border bg-panel">
              {entry.changelog.map((change) => (
                <div
                  key={change.version}
                  className="flex flex-col gap-8 border-b border-border p-16 text-small text-mute last:border-b-0 sm:flex-row"
                >
                  <span className="text-micro text-fg">v{change.version}</span>
                  <span className="text-micro text-mute">{formatDate(change.date)}</span>
                  <span className="flex-1">{change.text}</span>
                </div>
              ))}
            </div>
          </Section>
        ) : null}
      </div>
    </Shell>
  );
}
