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
    throw new Error(
      `registry: expected to find ${JSON.stringify(search)} in source to rewrite for the registry item.`,
    );
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
  return replaceOrThrow(
    source,
    'import { cn } from "../cn";',
    'import { cn } from "@/lib/lairy-cn";',
  );
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

function buildBadgeItem(): RegistryItem {
  const entry = getComponent("badge");
  if (!entry) throw new Error('registry: content entry "badge" not found.');

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "badge",
    type: "registry:ui",
    title: entry.meta.name,
    description: entry.purpose,
    // Hand-maintained for the same reason buildCalloutItem's is (see its own
    // comment): what this item's files actually import, not an aggregate of
    // every component's dependencies.
    dependencies: ["@lairy/tokens", "class-variance-authority", "cn"],
    files: [
      {
        path: "packages/ui/src/badge/badge.tsx",
        target: "components/ui/badge/badge.tsx",
        type: "registry:ui",
        content: withLairyCnImport(readSource("packages/ui/src/badge/badge.tsx")),
      },
      { ...CN_FILE, content: readSource(CN_FILE.path) },
    ],
  };
}

function buildChipItem(): RegistryItem {
  const entry = getComponent("chip");
  if (!entry) throw new Error('registry: content entry "chip" not found.');

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "chip",
    type: "registry:ui",
    title: entry.meta.name,
    description: entry.purpose,
    // Hand-maintained for the same reason buildCalloutItem's is (see its own
    // comment): what this item's files actually import, not an aggregate of
    // every component's dependencies.
    dependencies: ["@lairy/tokens", "class-variance-authority", "cn"],
    files: [
      {
        path: "packages/ui/src/chip/chip.tsx",
        target: "components/ui/chip/chip.tsx",
        type: "registry:ui",
        content: withLairyCnImport(readSource("packages/ui/src/chip/chip.tsx")),
      },
      { ...CN_FILE, content: readSource(CN_FILE.path) },
    ],
  };
}

function buildCardItem(): RegistryItem {
  const entry = getComponent("card");
  if (!entry) throw new Error('registry: content entry "card" not found.');

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "card",
    type: "registry:ui",
    title: entry.meta.name,
    description: entry.purpose,
    // Hand-maintained for the same reason buildCalloutItem's is (see its own
    // comment): what this item's files actually import, not an aggregate of
    // every component's dependencies.
    dependencies: ["@lairy/tokens", "cn"],
    files: [
      {
        path: "packages/ui/src/card/card.tsx",
        target: "components/ui/card/card.tsx",
        type: "registry:ui",
        content: withLairyCnImport(readSource("packages/ui/src/card/card.tsx")),
      },
      { ...CN_FILE, content: readSource(CN_FILE.path) },
    ],
  };
}

function buildEmptyStateItem(): RegistryItem {
  const entry = getComponent("empty-state");
  if (!entry) throw new Error('registry: content entry "empty-state" not found.');

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "empty-state",
    type: "registry:ui",
    title: entry.meta.name,
    description: entry.purpose,
    // Hand-maintained for the same reason buildCalloutItem's is (see its own
    // comment): what this item's files actually import, not an aggregate of
    // every component's dependencies. class-variance-authority is here
    // because the inlined Button file (below) imports it, the same way
    // buildCalloutItem's own list already accounts for it.
    dependencies: ["@lairy/tokens", "class-variance-authority", "cn"],
    files: [
      {
        path: "packages/ui/src/empty-state/empty-state.tsx",
        target: "components/ui/empty-state/empty-state.tsx",
        type: "registry:ui",
        content: withLairyCnImport(readSource("packages/ui/src/empty-state/empty-state.tsx")),
      },
      {
        path: "packages/ui/src/empty-state/empty-state-icon.tsx",
        target: "components/ui/empty-state/empty-state-icon.tsx",
        type: "registry:ui",
        content: readSource("packages/ui/src/empty-state/empty-state-icon.tsx"),
      },
      // Its action slot renders Button — inlined directly here, the same way
      // buildCalloutItem's own Button inclusion is (see its own comment:
      // registryDependencies isn't a path this repo's fixture can rely on).
      // Its target matches buildButtonItem's own, so installing both
      // "empty-state" and "button" later doesn't duplicate the file.
      { ...BUTTON_FILE, content: withLairyCnImport(readSource(BUTTON_FILE.path)) },
      { ...CN_FILE, content: readSource(CN_FILE.path) },
    ],
  };
}

function buildLoadingItem(): RegistryItem {
  const entry = getComponent("loading");
  if (!entry) throw new Error('registry: content entry "loading" not found.');

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "loading",
    type: "registry:ui",
    title: entry.meta.name,
    description: entry.purpose,
    // Hand-maintained for the same reason buildCalloutItem's is (see its own
    // comment): what this item's files actually import, not an aggregate of
    // every component's dependencies. No class-variance-authority: unlike
    // Callout/Empty state, Loading doesn't render Button and has no cva
    // variant map of its own.
    dependencies: ["@lairy/tokens", "cn"],
    files: [
      {
        path: "packages/ui/src/loading/loading.tsx",
        target: "components/ui/loading/loading.tsx",
        type: "registry:ui",
        content: withLairyCnImport(readSource("packages/ui/src/loading/loading.tsx")),
      },
      { ...CN_FILE, content: readSource(CN_FILE.path) },
    ],
  };
}

function buildProgressItem(): RegistryItem {
  const entry = getComponent("progress");
  if (!entry) throw new Error('registry: content entry "progress" not found.');

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "progress",
    type: "registry:ui",
    title: entry.meta.name,
    description: entry.purpose,
    // Hand-maintained for the same reason buildCalloutItem's is (see its own
    // comment): what this item's files actually import, not an aggregate of
    // every component's dependencies. No class-variance-authority: like
    // Loading, Progress's three variants are a discriminated union, not a
    // cva style map.
    dependencies: ["@lairy/tokens", "cn"],
    files: [
      {
        path: "packages/ui/src/progress/progress.tsx",
        target: "components/ui/progress/progress.tsx",
        type: "registry:ui",
        content: withLairyCnImport(readSource("packages/ui/src/progress/progress.tsx")),
      },
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

function buildTextItem(): RegistryItem {
  const entry = getComponent("text");
  if (!entry) throw new Error('registry: content entry "text" not found.');

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "text",
    type: "registry:ui",
    title: entry.meta.name,
    description: entry.purpose,
    // Hand-maintained for the same reason buildCalloutItem's is (see its own
    // comment): what this item's files actually import, not an aggregate of
    // every component's dependencies.
    dependencies: ["@lairy/tokens", "class-variance-authority", "cn"],
    files: [
      {
        path: "packages/ui/src/text/text.tsx",
        target: "components/ui/text/text.tsx",
        type: "registry:ui",
        content: withLairyCnImport(readSource("packages/ui/src/text/text.tsx")),
      },
      { ...CN_FILE, content: readSource(CN_FILE.path) },
    ],
  };
}

function buildTextInputItem(): RegistryItem {
  const entry = getComponent("text-input");
  if (!entry) throw new Error('registry: content entry "text-input" not found.');

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "text-input",
    type: "registry:ui",
    title: entry.meta.name,
    description: entry.purpose,
    // Hand-maintained for the same reason buildCalloutItem's is (see its own
    // comment): what this item's files actually import, not an aggregate of
    // every component's dependencies.
    dependencies: ["@lairy/tokens", "class-variance-authority", "cn"],
    files: [
      {
        path: "packages/ui/src/text-input/text-input.tsx",
        target: "components/ui/text-input/text-input.tsx",
        type: "registry:ui",
        content: withLairyCnImport(readSource("packages/ui/src/text-input/text-input.tsx")),
      },
      { ...CN_FILE, content: readSource(CN_FILE.path) },
    ],
  };
}

function buildCheckboxItem(): RegistryItem {
  const entry = getComponent("checkbox");
  if (!entry) throw new Error('registry: content entry "checkbox" not found.');

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "checkbox",
    type: "registry:ui",
    title: entry.meta.name,
    description: entry.purpose,
    // Hand-maintained for the same reason buildCalloutItem's is (see its own
    // comment): what this item's files actually import, not an aggregate of
    // every component's dependencies.
    dependencies: ["@lairy/tokens", "class-variance-authority", "cn"],
    files: [
      {
        path: "packages/ui/src/checkbox/checkbox.tsx",
        target: "components/ui/checkbox/checkbox.tsx",
        type: "registry:ui",
        content: withLairyCnImport(readSource("packages/ui/src/checkbox/checkbox.tsx")),
      },
      { ...CN_FILE, content: readSource(CN_FILE.path) },
    ],
  };
}

function buildRadioItem(): RegistryItem {
  const entry = getComponent("radio");
  if (!entry) throw new Error('registry: content entry "radio" not found.');

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "radio",
    type: "registry:ui",
    title: entry.meta.name,
    description: entry.purpose,
    // Hand-maintained for the same reason buildCalloutItem's is (see its own
    // comment): what this item's files actually import, not an aggregate of
    // every component's dependencies.
    dependencies: ["@lairy/tokens", "class-variance-authority", "cn"],
    files: [
      {
        path: "packages/ui/src/radio/radio.tsx",
        target: "components/ui/radio/radio.tsx",
        type: "registry:ui",
        content: withLairyCnImport(readSource("packages/ui/src/radio/radio.tsx")),
      },
      { ...CN_FILE, content: readSource(CN_FILE.path) },
    ],
  };
}

function buildTextareaItem(): RegistryItem {
  const entry = getComponent("textarea");
  if (!entry) throw new Error('registry: content entry "textarea" not found.');

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "textarea",
    type: "registry:ui",
    title: entry.meta.name,
    description: entry.purpose,
    // Hand-maintained for the same reason buildCalloutItem's is (see its own
    // comment): what this item's files actually import, not an aggregate of
    // every component's dependencies.
    dependencies: ["@lairy/tokens", "class-variance-authority", "cn"],
    files: [
      {
        path: "packages/ui/src/textarea/textarea.tsx",
        target: "components/ui/textarea/textarea.tsx",
        type: "registry:ui",
        content: withLairyCnImport(readSource("packages/ui/src/textarea/textarea.tsx")),
      },
      { ...CN_FILE, content: readSource(CN_FILE.path) },
    ],
  };
}

function buildScrollbarItem(): RegistryItem {
  const entry = getComponent("scrollbar");
  if (!entry) throw new Error('registry: content entry "scrollbar" not found.');

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "scrollbar",
    type: "registry:ui",
    title: entry.meta.name,
    description: entry.purpose,
    // Hand-maintained for the same reason buildCalloutItem's is (see its own
    // comment): what this item's files actually import, not an aggregate of
    // every component's dependencies. No class-variance-authority: unlike
    // Callout/Empty state, Scrollbar has no cva variant map — it has no
    // variants at all (Scrollbar Content rule 1).
    dependencies: ["@lairy/tokens", "cn"],
    files: [
      {
        path: "packages/ui/src/scrollbar/scrollbar.tsx",
        target: "components/ui/scrollbar/scrollbar.tsx",
        type: "registry:ui",
        content: withLairyCnImport(readSource("packages/ui/src/scrollbar/scrollbar.tsx")),
      },
      { ...CN_FILE, content: readSource(CN_FILE.path) },
    ],
  };
}

function buildUsageCardItem(): RegistryItem {
  const entry = getComponent("usage-card");
  if (!entry) throw new Error('registry: content entry "usage-card" not found.');

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "usage-card",
    type: "registry:ui",
    title: entry.meta.name,
    description: entry.purpose,
    // Hand-maintained for the same reason buildCalloutItem's is (see its own
    // comment): what this item's files actually import, not an aggregate of
    // every component's dependencies.
    dependencies: ["@lairy/tokens", "cn"],
    files: [
      {
        path: "packages/ui/src/usage-card/usage-card.tsx",
        target: "components/ui/usage-card/usage-card.tsx",
        type: "registry:ui",
        content: withLairyCnImport(readSource("packages/ui/src/usage-card/usage-card.tsx")),
      },
      { ...CN_FILE, content: readSource(CN_FILE.path) },
    ],
  };
}

function buildSwitchItem(): RegistryItem {
  const entry = getComponent("switch");
  if (!entry) throw new Error('registry: content entry "switch" not found.');

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "switch",
    type: "registry:ui",
    title: entry.meta.name,
    description: entry.purpose,
    // Hand-maintained for the same reason buildCalloutItem's is (see its own
    // comment): what this item's files actually import, not an aggregate of
    // every component's dependencies.
    dependencies: ["@lairy/tokens", "class-variance-authority", "cn"],
    files: [
      {
        path: "packages/ui/src/switch/switch.tsx",
        target: "components/ui/switch/switch.tsx",
        type: "registry:ui",
        content: withLairyCnImport(readSource("packages/ui/src/switch/switch.tsx")),
      },
      { ...CN_FILE, content: readSource(CN_FILE.path) },
    ],
  };
}

function buildTabsItem(): RegistryItem {
  const entry = getComponent("tabs");
  if (!entry) throw new Error('registry: content entry "tabs" not found.');

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "tabs",
    type: "registry:ui",
    title: entry.meta.name,
    description: entry.purpose,
    // Hand-maintained for the same reason buildCalloutItem's is (see its own
    // comment): what this item's files actually import, not an aggregate of
    // every component's dependencies. No class-variance-authority: unlike
    // Callout/Switch, Tabs computes its own selected/rest classes with a
    // plain `cn()` conditional rather than a cva variant map.
    dependencies: ["@lairy/tokens", "cn"],
    files: [
      {
        path: "packages/ui/src/tabs/tabs.tsx",
        target: "components/ui/tabs/tabs.tsx",
        type: "registry:ui",
        content: withLairyCnImport(readSource("packages/ui/src/tabs/tabs.tsx")),
      },
      { ...CN_FILE, content: readSource(CN_FILE.path) },
    ],
  };
}

function buildTooltipItem(): RegistryItem {
  const entry = getComponent("tooltip");
  if (!entry) throw new Error('registry: content entry "tooltip" not found.');

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "tooltip",
    type: "registry:ui",
    title: entry.meta.name,
    description: entry.purpose,
    // Hand-maintained for the same reason buildCalloutItem's is (see its own
    // comment): what this item's files actually import, not an aggregate of
    // every component's dependencies. No class-variance-authority: like
    // Tabs and main-rail, tooltip.tsx computes its own conditional classes
    // with plain `cn()`.
    dependencies: ["@lairy/tokens", "cn"],
    files: [
      {
        path: "packages/ui/src/tooltip/tooltip.tsx",
        target: "components/ui/tooltip/tooltip.tsx",
        type: "registry:ui",
        content: withLairyCnImport(readSource("packages/ui/src/tooltip/tooltip.tsx")),
      },
      { ...CN_FILE, content: readSource(CN_FILE.path) },
    ],
  };
}

function buildMainRailItem(): RegistryItem {
  const entry = getComponent("main-rail");
  if (!entry) throw new Error('registry: content entry "main-rail" not found.');

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "main-rail",
    type: "registry:ui",
    title: entry.meta.name,
    description: entry.purpose,
    // Hand-maintained for the same reason buildCalloutItem's is (see its own
    // comment): what this item's files actually import, not an aggregate of
    // every component's dependencies. No class-variance-authority: like
    // Tabs and Table, main-rail.tsx computes its own conditional classes
    // with plain `cn()`.
    dependencies: ["@lairy/tokens", "cn"],
    files: [
      {
        path: "packages/ui/src/main-rail/main-rail.tsx",
        target: "components/ui/main-rail/main-rail.tsx",
        type: "registry:ui",
        content: withLairyCnImport(readSource("packages/ui/src/main-rail/main-rail.tsx")),
      },
      {
        path: "packages/ui/src/main-rail/main-rail-mark.tsx",
        target: "components/ui/main-rail/main-rail-mark.tsx",
        type: "registry:ui",
        content: readSource("packages/ui/src/main-rail/main-rail-mark.tsx"),
      },
      // The collapse row's chevron (anatomy #5) reuses the shared Inline
      // icon set rather than a one-off mark — the first registry item to
      // depend on it, so its target mirrors main-rail.tsx's own relative
      // import ("../icons/inline-icon") into the copied tree.
      {
        path: "packages/ui/src/icons/inline-icon.tsx",
        target: "components/ui/icons/inline-icon.tsx",
        type: "registry:ui",
        content: readSource("packages/ui/src/icons/inline-icon.tsx"),
      },
      { ...CN_FILE, content: readSource(CN_FILE.path) },
    ],
  };
}

function buildSubnavItem(): RegistryItem {
  const entry = getComponent("subnav");
  if (!entry) throw new Error('registry: content entry "subnav" not found.');

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "subnav",
    type: "registry:ui",
    title: entry.meta.name,
    description: entry.purpose,
    // Hand-maintained for the same reason buildCalloutItem's is (see its own
    // comment): what this item's files actually import, not an aggregate of
    // every component's dependencies.
    dependencies: ["@lairy/tokens", "cn"],
    files: [
      {
        path: "packages/ui/src/subnav/subnav.tsx",
        target: "components/ui/subnav/subnav.tsx",
        type: "registry:ui",
        content: withLairyCnImport(readSource("packages/ui/src/subnav/subnav.tsx")),
      },
      { ...CN_FILE, content: readSource(CN_FILE.path) },
    ],
  };
}

function buildHeaderItem(): RegistryItem {
  const entry = getComponent("header");
  if (!entry) throw new Error('registry: content entry "header" not found.');

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "header",
    type: "registry:ui",
    title: entry.meta.name,
    description: entry.purpose,
    // Hand-maintained for the same reason buildCalloutItem's is (see its own
    // comment): what this item's files actually import, not an aggregate of
    // every component's dependencies.
    dependencies: ["@lairy/tokens", "cn"],
    files: [
      {
        path: "packages/ui/src/header/header.tsx",
        target: "components/ui/header/header.tsx",
        type: "registry:ui",
        content: withLairyCnImport(readSource("packages/ui/src/header/header.tsx")),
      },
      {
        path: "packages/ui/src/header/header-icons.tsx",
        target: "components/ui/header/header-icons.tsx",
        type: "registry:ui",
        content: readSource("packages/ui/src/header/header-icons.tsx"),
      },
      { ...CN_FILE, content: readSource(CN_FILE.path) },
    ],
  };
}

function buildTableItem(): RegistryItem {
  const entry = getComponent("table");
  if (!entry) throw new Error('registry: content entry "table" not found.');

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "table",
    type: "registry:ui",
    title: entry.meta.name,
    description: entry.purpose,
    // Hand-maintained for the same reason buildCalloutItem's is (see its own
    // comment): what this item's files actually import, not an aggregate of
    // every component's dependencies. No class-variance-authority: table.tsx
    // computes its own conditional classes with plain `cn()`, the same call
    // buildTabsItem's own comment already made for the same reason.
    dependencies: ["@lairy/tokens", "cn"],
    files: [
      {
        path: "packages/ui/src/table/table.tsx",
        target: "components/ui/table/table.tsx",
        type: "registry:ui",
        content: withLairyCnImport(readSource("packages/ui/src/table/table.tsx")),
      },
      {
        path: "packages/ui/src/table/table-icons.tsx",
        target: "components/ui/table/table-icons.tsx",
        type: "registry:ui",
        content: readSource("packages/ui/src/table/table-icons.tsx"),
      },
      { ...CN_FILE, content: readSource(CN_FILE.path) },
    ],
  };
}

function buildModalItem(): RegistryItem {
  const entry = getComponent("modal");
  if (!entry) throw new Error('registry: content entry "modal" not found.');

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "modal",
    type: "registry:ui",
    title: entry.meta.name,
    description: entry.purpose,
    // Hand-maintained for the same reason buildCalloutItem's is (see its own
    // comment): what this item's files actually import, not an aggregate of
    // every component's dependencies. The second registry item to depend on
    // radix-ui, after popover: modal.tsx is scaffolded from shadcn's own
    // `dialog` and `alert-dialog` items (ADR-0004), restyled with Lairy
    // tokens only.
    dependencies: ["@lairy/tokens", "class-variance-authority", "cn", "radix-ui"],
    files: [
      {
        path: "packages/ui/src/modal/modal.tsx",
        target: "components/ui/modal/modal.tsx",
        type: "registry:ui",
        content: withLairyCnImport(readSource("packages/ui/src/modal/modal.tsx")),
      },
      // Modal's footer actions render Button (ModalCancel/ModalAction and
      // their Confirm counterparts) — inlined directly here, the same way
      // buildCalloutItem's and buildPopoverItem's own Button inclusion is
      // (registryDependencies isn't a path this repo's fixture can rely on,
      // see buildCalloutItem's own comment). Its target matches
      // buildButtonItem's own, so installing both "modal" and "button"
      // later doesn't duplicate the file.
      { ...BUTTON_FILE, content: withLairyCnImport(readSource(BUTTON_FILE.path)) },
      { ...CN_FILE, content: readSource(CN_FILE.path) },
    ],
  };
}

function buildDrawerItem(): RegistryItem {
  const entry = getComponent("drawer");
  if (!entry) throw new Error('registry: content entry "drawer" not found.');

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "drawer",
    type: "registry:ui",
    title: entry.meta.name,
    description: entry.purpose,
    // Hand-maintained for the same reason buildCalloutItem's is (see its own
    // comment): what this item's files actually import, not an aggregate of
    // every component's dependencies. Scaffolded from shadcn's own `sheet`
    // item (ADR-0004, built on @radix-ui/react-dialog like modal.tsx's own
    // `dialog`), restyled with Lairy tokens only.
    dependencies: ["@lairy/tokens", "class-variance-authority", "cn", "radix-ui"],
    files: [
      {
        path: "packages/ui/src/drawer/drawer.tsx",
        target: "components/ui/drawer/drawer.tsx",
        type: "registry:ui",
        content: withLairyCnImport(readSource("packages/ui/src/drawer/drawer.tsx")),
      },
      // Drawer's footer actions render Button (DrawerCancel/DrawerAction) —
      // inlined directly here, the same way buildModalItem's own Button
      // inclusion is. Its target matches buildButtonItem's own, so
      // installing both "drawer" and "button" later doesn't duplicate the
      // file.
      { ...BUTTON_FILE, content: withLairyCnImport(readSource(BUTTON_FILE.path)) },
      { ...CN_FILE, content: readSource(CN_FILE.path) },
    ],
  };
}

function buildPopoverItem(): RegistryItem {
  const entry = getComponent("popover");
  if (!entry) throw new Error('registry: content entry "popover" not found.');

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "popover",
    type: "registry:ui",
    title: entry.meta.name,
    description: entry.purpose,
    // Hand-maintained for the same reason buildCalloutItem's is (see its own
    // comment): what this item's files actually import, not an aggregate of
    // every component's dependencies. The first registry item to depend on
    // radix-ui: popover.tsx is scaffolded from shadcn's own `popover` and
    // `dropdown-menu` items (ADR-0004), restyled with Lairy tokens only.
    dependencies: ["@lairy/tokens", "class-variance-authority", "cn", "radix-ui"],
    files: [
      {
        path: "packages/ui/src/popover/popover.tsx",
        target: "components/ui/popover/popover.tsx",
        type: "registry:ui",
        content: withLairyCnImport(readSource("packages/ui/src/popover/popover.tsx")),
      },
      { ...CN_FILE, content: readSource(CN_FILE.path) },
    ],
  };
}

function buildSelectItem(): RegistryItem {
  const entry = getComponent("select");
  if (!entry) throw new Error('registry: content entry "select" not found.');

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "select",
    type: "registry:ui",
    title: entry.meta.name,
    description: entry.purpose,
    // Hand-maintained for the same reason buildCalloutItem's is (see its own
    // comment): what this item's files actually import, not an aggregate of
    // every component's dependencies. select.tsx is scaffolded from shadcn's
    // own `select` item (ADR-0004, built on Radix Select), restyled with
    // Lairy tokens only.
    dependencies: ["@lairy/tokens", "class-variance-authority", "cn", "radix-ui"],
    files: [
      {
        path: "packages/ui/src/select/select.tsx",
        target: "components/ui/select/select.tsx",
        type: "registry:ui",
        content: withLairyCnImport(readSource("packages/ui/src/select/select.tsx")),
      },
      { ...CN_FILE, content: readSource(CN_FILE.path) },
    ],
  };
}

const REGISTRY_ITEM_BUILDERS: Record<string, () => RegistryItem> = {
  callout: buildCalloutItem,
  badge: buildBadgeItem,
  card: buildCardItem,
  chip: buildChipItem,
  "empty-state": buildEmptyStateItem,
  loading: buildLoadingItem,
  progress: buildProgressItem,
  button: buildButtonItem,
  text: buildTextItem,
  checkbox: buildCheckboxItem,
  radio: buildRadioItem,
  "text-input": buildTextInputItem,
  textarea: buildTextareaItem,
  scrollbar: buildScrollbarItem,
  switch: buildSwitchItem,
  table: buildTableItem,
  tabs: buildTabsItem,
  "usage-card": buildUsageCardItem,
  "main-rail": buildMainRailItem,
  subnav: buildSubnavItem,
  header: buildHeaderItem,
  tooltip: buildTooltipItem,
  popover: buildPopoverItem,
  select: buildSelectItem,
  modal: buildModalItem,
  drawer: buildDrawerItem,
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
