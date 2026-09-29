import { existsSync } from "node:fs";
import { join } from "node:path";
import { withCustomConfig, type ComponentDoc } from "react-docgen-typescript";
import { REPO_ROOT } from "./repo-root";

/** One prop, as react-docgen-typescript reads it straight from the
 * component's own TSX source — the real API, never hand-written
 * (docs/prd.md D5). */
export interface ExtractedProp {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  description?: string;
}

const parser = withCustomConfig(join(REPO_ROOT, "packages/ui/tsconfig.json"), {
  shouldRemoveUndefinedFromOptional: true,
  // Keeps only props declared in the component's own workspace source —
  // without this, every inherited DOM/ARIA attribute from
  // `ComponentProps<"div">` etc. would flood the table.
  propFilter: (prop) => !prop.parent || !prop.parent.fileName.includes("node_modules"),
});

function pascalCase(id: string): string {
  return id
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

/** The convention every component port follows (docs/build-guide.md §4):
 * `packages/ui/src/<id>/<id>.tsx` exporting a `<PascalCase(id)>` component. */
function componentSourcePath(id: string): string {
  return join(REPO_ROOT, "packages/ui/src", id, `${id}.tsx`);
}

/**
 * Extracted props for one component id, via react-docgen-typescript over
 * its own source file. Returns undefined when the component has no `ui`
 * implementation yet (a draft stub) — LDS-009's "every ui component" means
 * every one that actually exists, not every content entry.
 */
export function extractProps(id: string): ExtractedProp[] | undefined {
  const file = componentSourcePath(id);
  if (!existsSync(file)) return undefined;

  const docs: ComponentDoc[] = parser.parse(file);
  const displayName = pascalCase(id);
  const doc = docs.find((d) => d.displayName === displayName) ?? docs[0];
  if (!doc) return undefined;

  return Object.values(doc.props)
    .map((prop) => ({
      name: prop.name,
      type: prop.type.name,
      required: prop.required,
      defaultValue: prop.defaultValue?.value !== undefined ? String(prop.defaultValue.value) : undefined,
      description: prop.description || undefined,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
