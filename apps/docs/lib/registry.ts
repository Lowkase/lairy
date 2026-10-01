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

/** Rewrites the package-relative `../cn` import every component source
 * file uses to the path a registry consumer gets it copied in at instead
 * (ADR-0002: components copy in, tokens stay a package). Shared by every
 * builder below rather than only `buildCalloutItem`'s, now that more than
 * one component exists. */
function withLairyCnImport(source: string): string {
  return replaceOrThrow(source, 'import { cn } from "../cn";', 'import { cn } from "@/lib/lairy-cn";');
}

const BUTTON_FILE = {
  path: "packages/ui/src/button/button.tsx",
  target: "components/ui/button/button.tsx",
  type: "registry:ui" as const,
};

const CN_FILE = {
  path: "packages/ui/src/cn.ts",
  target: "lib/lairy-cn.ts",
  type: "registry:lib" as const,
};

function buildCalloutItem(): RegistryItem {
  const entry = getComponent("callout");
  if (!entry) throw new Error('registry: content entry "callout" not found.');

  const calloutSource = withLairyCnImport(readSource("packages/ui/src/callout/callout.tsx"));
  const calloutIconSource = readSource("packages/ui/src/callout/callout-icon.tsx");

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
    // callout.tsx/callout-icon.tsx/button.tsx/cn.ts actually import instead.
    //
    // Bare names (no version): the shadcn CLI skips a dependency that's
    // already present in the target project's package.json instead of
    // re-resolving it from the public registry. @lairy/tokens isn't
    // published there yet (ADR-0002), so a consuming app installs it
    // locally first (docs/build-guide.md's registry seam test does exactly
    // this) and the CLI leaves that entry alone; the other two are real npm
    // packages the CLI installs normally.
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
      // Callout's action slot renders Button (LDS-018). Inlined directly
      // here, the same way callout-icon.tsx already is, rather than
      // declared via `registryDependencies: ["button"]`: the shadcn CLI
      // resolves bare registryDependency names against the registry
      // configured in the *consumer's* components.json, which has no entry
      // for our local "button" item (confirmed against the registry seam
      // test, apps/docs/e2e/registry-install.spec.ts, which installs
      // Callout from a raw item URL with no `registries` mapping
      // configured) — it isn't a path this repo's own fixture can rely on.
      // Its target matches buildButtonItem's own, so installing both
      // "callout" and "button" later doesn't duplicate the file.
      { ...BUTTON_FILE, content: withLairyCnImport(readSource(BUTTON_FILE.path)) },
      { ...CN_FILE, content: readSource(CN_FILE.path) },
    ],
  };
}

function buildButtonItem(): RegistryItem {
  const entry = getComponent("button");
  if (!entry) throw new Error('registry: content entry "button" not found.');

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "button",
    type: "registry:ui",
    title: entry.meta.name,
    description: entry.purpose,
    // Hand-maintained for the same reason buildCalloutItem's is (see its own
    // comment): what this item's files actually import, not an aggregate of
    // every component's dependencies.
    dependencies: ["@lairy/tokens", "class-variance-authority", "cn"],
    files: [
      { ...BUTTON_FILE, content: withLairyCnImport(readSource(BUTTON_FILE.path)) },
      { ...CN_FILE, content: readSource(CN_FILE.path) },
    ],
  };
}

const REGISTRY_ITEM_BUILDERS: Record<string, () => RegistryItem> = {
  callout: buildCalloutItem,
  button: buildButtonItem,
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
