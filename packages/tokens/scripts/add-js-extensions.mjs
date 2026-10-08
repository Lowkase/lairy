// Native Node ESM needs explicit extensions on relative imports. The source
// keeps them extensionless, because the workspace's bundlers resolve it that
// way (a `.js` specifier pointing at a `.ts` file doesn't resolve under
// Turbopack here). So the compiled output gets them added after `tsc` runs.
// Applied to both .js and .d.ts so NodeNext consumers resolve types too.
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "dist");

// A dotted base name ("tokens.generated") is not an extension, so match known ones.
const HAS_EXTENSION = /\.(js|mjs|cjs|json|css|d\.ts|ts)$/;

const RELATIVE = /(\bfrom\s*|\bimport\s*\(?\s*)(["'])(\.{1,2}\/[^"']+)\2/g;

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

for (const file of walk(dist)) {
  if (!/\.(js|d\.ts)$/.test(file)) continue;
  const before = readFileSync(file, "utf8");
  const after = before.replace(RELATIVE, (match, lead, quote, spec) =>
    HAS_EXTENSION.test(spec) ? match : `${lead}${quote}${spec}.js${quote}`,
  );
  if (after !== before) writeFileSync(file, after);
}
