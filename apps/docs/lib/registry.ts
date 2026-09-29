import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getComponent } from "@lairy/content";

/**
 * Route handlers run with cwd = apps/docs (both `next dev` and `next start`
 * per docs/build-guide.md §6), two levels below the repo root.
 */
const REPO_ROOT = join(process.cwd(), "..", "..");

function readSource(relativePath: string): string {
  // No production deploy exists yet to trace output for (docs/prd.md §10
  // isn't live) — opt out rather than have Turbopack bundle the whole repo
  // into this route's output for a target that doesn't exist.
  return readFileSync(join(/* turbopackIgnore: true */ REPO_ROOT, relativePath), "utf8");
}

/** Fails loudly instead of silently shipping a stale import path if the
 * shipped component's source ever changes shape. */
function replaceOrThrow(source: string, search: string, replacement: string): string {
  if (!source.includes(search)) {
    throw new Error(`registry: expected to find ${JSON.stringify(search)} in source to rewrite for the registry item.`);
  }
  return source.replace(search, replacement);
}

export type RegistryFileType = "registry:ui" | "registry:lib";

export interface RegistryFile {
  path: string;
  target: string;
  type: RegistryFileType;
  content: string;
}

export interface RegistryItem {
  $schema: string;
  name: string;
  type: "registry:ui" | "registry:component";
  title: string;
  description: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files: RegistryFile[];
}

export interface RegistryIndexItem {
  name: string;
  type: RegistryItem["type"];
  title: string;
  description: string;
}

export const REGISTRY_NAME = "lairy";
export const REGISTRY_HOMEPAGE = "https://github.com/Lowkase/lairy";

function buildCalloutItem(): RegistryItem {
  const entry = getComponent("callout");
  if (!entry) throw new Error('registry: content entry "callout" not found.');

  // The shipped component imports its cn helper from a package-relative
  // path (../cn); a registry consumer gets it copied in at lib/lairy-cn.ts
  // instead (ADR-0002: components copy in, tokens stay a package).
  const calloutSource = replaceOrThrow(
    readSource("packages/ui/src/callout/callout.tsx"),
    'import { cn } from "../cn";',
    'import { cn } from "@/lib/lairy-cn";',
  );
  const calloutIconSource = readSource("packages/ui/src/callout/callout-icon.tsx");
  const cnSource = readSource("packages/ui/src/cn.ts");

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "callout",
    type: "registry:ui",
    title: entry.meta.name,
    description: entry.purpose,
    // Hand-maintained, not derived from packages/ui/package.json: that
    // file's `dependencies` will end up aggregating every component's
    // needs once more than one exists, which isn't the same list as what
    // *this* item's files import — keep this in sync with what
    // callout.tsx/callout-icon.tsx/cn.ts actually import instead.
    //
    // Bare names (no version): the shadcn CLI skips a dependency that's
    // already present in the target project's package.json instead of
    // re-resolving it from the npm registry. @lairy/tokens isn't published
    // there yet (ADR-0002), so a consuming app installs it locally first
    // (docs/build-guide.md's registry seam test does exactly this) and the
    // CLI leaves that entry alone; the other two are real npm packages the
    // CLI installs normally.
    dependencies: ["@lairy/tokens", "class-variance-authority", "cn"],
    files: [
      {
        path: "packages/ui/src/callout/callout.tsx",
        target: "components/ui/callout/callout.tsx",
        type: "registry:ui",
        content: calloutSource,
      },
      {
        path: "packages/ui/src/callout/callout-icon.tsx",
        target: "components/ui/callout/callout-icon.tsx",
        type: "registry:ui",
        content: calloutIconSource,
      },
      {
        path: "packages/ui/src/cn.ts",
        target: "lib/lairy-cn.ts",
        type: "registry:lib",
        content: cnSource,
      },
    ],
  };
}

const REGISTRY_ITEM_BUILDERS: Record<string, () => RegistryItem> = {
  callout: buildCalloutItem,
};

export function listRegistryItemNames(): string[] {
  return Object.keys(REGISTRY_ITEM_BUILDERS);
}

export function getRegistryItem(name: string): RegistryItem | undefined {
  return REGISTRY_ITEM_BUILDERS[name]?.();
}

export function getRegistryIndex(): {
  $schema: string;
  name: string;
  homepage: string;
  items: RegistryIndexItem[];
} {
  return {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: REGISTRY_NAME,
    homepage: REGISTRY_HOMEPAGE,
    items: listRegistryItemNames().map((name) => {
      const item = getRegistryItem(name);
      if (!item) throw new Error(`registry: unknown item "${name}".`);
      return { name: item.name, type: item.type, title: item.title, description: item.description };
    }),
  };
}
