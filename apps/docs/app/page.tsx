import { Card, Text } from "@lairy/ui";
import { headers } from "next/headers";
import Link from "next/link";
import { Shell } from "@/components/shell";
import { principles, sections } from "@/lib/overview";
import { shellMainRailItems, shellSectionMeta } from "@/lib/shell-nav";

// docs/prd.md §1, first sentence.
const STATEMENT =
  "Lairy is a design system with the visual language of an operator console: dark-first, monospaced, amber-accented, with a locked 2px corner.";

const LINK =
  "text-accent underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

function Command({ label, children }: { label: string; children: string }) {
  return (
    <div className="flex flex-col gap-4">
      <Text variant="caption">{label}</Text>
      <pre className="whitespace-pre-wrap break-all rounded-ds border border-border bg-panel px-12 py-8 font-body text-small text-fg">
        {children}
      </pre>
    </div>
  );
}

/** The origin this page is being served from, so the registry command is
 * right in dev and right once the docs are hosted (docs/prd.md §12 Q3). */
async function currentOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export default async function OverviewPage() {
  const meta = shellSectionMeta("overview");
  const origin = await currentOrigin();
  return (
    <Shell
      section="overview"
      moduleIcon={meta.icon}
      moduleLabel={meta.label}
      moduleCode={meta.code}
      items={shellMainRailItems()}
    >
      <div className="flex flex-col gap-32">
        <header className="flex flex-col gap-12">
          <h1 className="font-heading text-doc-title font-semibold tracking-tight-neg-2 text-fg">
            Overview
          </h1>
          <Text variant="body" as="p" className="max-w-prose">
            {STATEMENT}
          </Text>
        </header>

        <section aria-labelledby="overview-sections" className="flex flex-col gap-12">
          <Text variant="eyebrow" as="h2" id="overview-sections">
            What is documented
          </Text>
          <div className="grid grid-cols-1 gap-16 tablet:grid-cols-3">
            {sections().map((section) => (
              <Card
                key={section.id}
                kind="with-header"
                title={section.name}
                titleAs="h3"
                meta={section.count === 0 ? "None yet" : `${section.count} entries`}
              >
                <div className="flex flex-col gap-12">
                  <p>{section.purpose}</p>
                  <Link href={section.href} className={LINK}>
                    Open {section.name}
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section aria-labelledby="overview-start" className="flex flex-col gap-12">
          <Text variant="eyebrow" as="h2" id="overview-start">
            Start here
          </Text>
          <div className="grid grid-cols-1 gap-16 tablet:grid-cols-2">
            <Card kind="with-header" title="Build an app" titleAs="h3">
              <div className="flex flex-col gap-12">
                <Command label="Tokens">npm install @lairy/tokens</Command>
                <Command label="A component, copied in as source">
                  {`npx shadcn@latest add ${origin}/r/callout.json`}
                </Command>
              </div>
            </Card>
            <Card kind="with-header" title="Ask an agent" titleAs="h3">
              <div className="flex flex-col gap-12">
                <Command label="MCP server, from a checkout">pnpm --filter mcp start</Command>
                <p>
                  Or load the whole system as text:{" "}
                  <Link href="/llms.txt" className={LINK}>
                    llms.txt
                  </Link>{" "}
                  and{" "}
                  <Link href="/llms-full.txt" className={LINK}>
                    llms-full.txt
                  </Link>
                  .
                </p>
              </div>
            </Card>
          </div>
        </section>

        <section aria-labelledby="overview-principles" className="flex flex-col gap-12">
          <Text variant="eyebrow" as="h2" id="overview-principles">
            Principles
          </Text>
          <ul className="grid grid-cols-1 gap-16 tablet:grid-cols-2">
            {principles().map((principle) => (
              <li key={principle.foundationId + principle.title}>
                <Card kind="with-header" title={principle.title} titleAs="h3" className="h-full">
                  <div className="flex flex-col gap-12">
                    <p>{principle.text}</p>
                    <Link href={`/foundations/${principle.foundationId}`} className={LINK}>
                      {principle.foundationName}
                    </Link>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Shell>
  );
}
