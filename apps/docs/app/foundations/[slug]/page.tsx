import { getFoundation, getToken, listFoundations } from "@lairy/content";
import { PageHeader } from "@/components/docs-page/page-header";
import { Section } from "@/components/docs-page/section";
import { Shell } from "@/components/shell";
import { shellMainRailItems, shellSectionMeta, shellSubnavGroup } from "@/lib/shell-nav";
import Link from "next/link";
import { notFound } from "next/navigation";
import { alarmInkPairing, contrastPairings } from "../../dev/tokens/contrast";

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function generateStaticParams() {
  return listFoundations().map((entry) => ({ slug: entry.meta.id }));
}

function ContrastTable({ theme }: { theme: "dark" | "light" }) {
  const rows = contrastPairings(theme);
  return (
    <div className="flex flex-col gap-4">
      <div className="text-micro uppercase tracking-tight-6 text-mute">{theme}</div>
      <table className="w-full border-collapse text-small">
        <thead>
          <tr className="border-b border-border text-micro uppercase tracking-tight-6 text-mute">
            <th className="py-4 text-left font-body font-regular">Text</th>
            <th className="py-4 text-left font-body font-regular">On</th>
            <th className="py-4 text-left font-body font-regular">Ratio</th>
            <th className="py-4 text-left font-body font-regular">AA</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.fgToken} className="border-b border-border">
              <td className="py-6">
                <span
                  className="mr-8 inline-block h-16 w-16 rounded-ds border border-border-2 align-middle"
                  style={{ background: r.fg }}
                />
                <code className="text-mute">--{r.fgToken}</code>
              </td>
              <td className="py-6">
                <code className="text-mute">--{r.bgToken}</code>
              </td>
              <td className="py-6 text-dim">{r.ratio.toFixed(2)}:1</td>
              <td className="py-6">
                <span className={r.level === "fail" ? "text-alarm" : "text-dim"}>{r.level}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function FoundationPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ theme?: string }>;
}) {
  const { slug } = await params;
  const { theme } = await searchParams;
  const entry = getFoundation(slug);
  if (!entry) notFound();

  const ink = alarmInkPairing();

  const meta = shellSectionMeta("foundations");
  return (
    <Shell
      section="foundations"
      moduleIcon={meta.icon}
      moduleLabel={meta.label}
      moduleCode={meta.code}
      items={shellMainRailItems()}
      group={shellSubnavGroup("foundations")}
      activeId={slug}
      initialTheme={theme === "light" ? "light" : "dark"}
    >
      <div className="flex flex-col gap-32">
        <PageHeader
          title={entry.meta.name}
          status={entry.meta.status}
          version={entry.meta.version}
          updated={formatDate(entry.meta.updated)}
        />

        <div className="flex flex-col gap-8">
          <div className="text-section text-fg">{entry.description.summary}</div>
          <div className="text-body text-mute">{entry.description.boundary}</div>
        </div>

        {entry.scales.length > 0 ? (
          <Section number="01" title="Roles" meta={`${entry.scales.length}`}>
            <div className="border border-border bg-panel">
              {entry.scales.map((scale) => (
                <div
                  key={scale.name}
                  className="grid grid-cols-1 gap-16 border-b border-border p-16 last:border-b-0 sm:grid-cols-2"
                >
                  <div className="flex min-w-0 flex-col gap-8">
                    <span className="text-small text-fg">{scale.name}</span>
                    <span
                      className="h-22 w-44 border border-border-2"
                      style={{ background: `var(--${scale.tokens[0]})` }}
                    />
                    <span className="text-micro text-mute">{scale.tokens.map((t) => `--${t}`).join(" · ")}</span>
                  </div>
                  <span className="min-w-0 text-small text-mute">{scale.description}</span>
                </div>
              ))}
            </div>
            {entry.scalesNote ? <div className="text-micro text-mute">{entry.scalesNote}</div> : null}
          </Section>
        ) : null}

        {entry.usage.useWhen.length > 0 || entry.usage.useInstead.length > 0 ? (
          <Section number="02" title="Usage" meta="Reach for / use something else">
            <div className="grid grid-cols-1 gap-16 sm:grid-cols-2">
              <div className="border border-accent-line bg-accent-soft p-18">
                {/* text-fg, not text-accent: the same --accent-on-soft
                    pairing fails AA for text at this size in the light
                    theme (see components/docs-page/page-header.tsx). */}
                <div className="mb-12 text-micro uppercase tracking-tight-6 text-fg">Reach for it when</div>
                <div className="flex flex-col gap-8 text-small text-dim">
                  {entry.usage.useWhen.map((row) => (
                    <span key={row}>{row}</span>
                  ))}
                </div>
              </div>
              <div className="border border-border-2 p-18">
                <div className="mb-12 text-micro uppercase tracking-tight-6 text-mute">Use something else when</div>
                <div className="flex flex-col gap-8 text-small text-dim">
                  {entry.usage.useInstead.map((row) => (
                    <span key={row}>{row}</span>
                  ))}
                </div>
              </div>
            </div>
          </Section>
        ) : null}

        {entry.principles.length > 0 ? (
          <Section number="03" title="Application" meta={`${entry.principles.length} rules`}>
            <div className="border border-border bg-panel">
              {entry.principles.map((rule) => (
                <div key={rule.text} className="border-b border-border p-16 text-small text-mute last:border-b-0">
                  {rule.text}
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {entry.accessibilityNotes.length > 0 ? (
          <Section number="04" title="Accessibility" meta="Measured">
            <div className="grid grid-cols-1 gap-22 sm:grid-cols-2">
              <ContrastTable theme="dark" />
              <ContrastTable theme="light" />
            </div>
            <div className="flex items-center gap-12 border border-alarm-line p-12">
              <span className="inline-block h-16 w-16 border border-border-2" style={{ background: ink.bg }} />
              <span className="text-small text-dim">
                <code className="text-mute">--alarm-ink</code> on <code className="text-mute">--alarm</code>{" "}
                (non-themeable, same in both themes): {ink.ratio.toFixed(2)}:1 — {ink.level}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-16 sm:grid-cols-2">
              {entry.accessibilityNotes.map((note) => (
                <div key={note.title} className="flex flex-col gap-8 border border-border bg-panel p-18">
                  <span className="text-micro uppercase tracking-tight-6 text-fg">{note.title}</span>
                  <span className="text-small text-dim">{note.body}</span>
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {entry.scales.length > 0 ? (
          <Section
            number="05"
            title="Tokens"
            meta={`${entry.scales.reduce((n, s) => n + s.tokens.length, 0)} · two themes`}
          >
            <div className="border border-border bg-panel">
              {entry.scales.map((scale) => (
                <div key={scale.name} className="flex flex-col gap-12 border-b border-border p-16 last:border-b-0">
                  <span className="text-micro uppercase tracking-tight-6 text-mute">{scale.name}</span>
                  <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
                    {scale.tokens.map((tokenName) => {
                      const token = getToken(`--${tokenName}`);
                      if (!token) return null;
                      const dark = typeof token.value === "string" ? token.value : token.value.dark;
                      const light = typeof token.value === "string" ? token.value : token.value.light;
                      return (
                        <div key={tokenName} className="flex items-center gap-12 border border-border p-12">
                          <span
                            className="h-32 w-32 shrink-0 border border-border-2"
                            style={{ background: `var(--${tokenName})` }}
                          />
                          <div className="flex min-w-0 flex-1 flex-col gap-4">
                            <div className="text-small text-fg">--{tokenName}</div>
                            <div className="text-micro text-mute">{dark}</div>
                            <div className="text-micro text-mute">{light}</div>
                          </div>
                          <span className="text-right text-micro leading-tight text-mute">
                            {token.useFor.join(" ")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {entry.relationships.length > 0 ? (
          <Section number="06" title="Related" meta={`${entry.relationships.length}`}>
            <div className="grid grid-cols-1 gap-16 sm:grid-cols-2">
              {entry.relationships.map((relationship) => {
                const target = getFoundation(relationship.target);
                const linkable = target && target.meta.status !== "draft";
                const card = (
                  <div className="flex flex-col gap-8 border border-border bg-panel p-16">
                    <span className="text-small text-fg">{target?.meta.name ?? relationship.target}</span>
                    <span className="text-small text-mute">{relationship.text}</span>
                  </div>
                );
                return linkable ? (
                  <Link
                    key={relationship.target}
                    href={`/foundations/${relationship.target}`}
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
          <Section number="07" title="Changelog" meta="Newest first">
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
