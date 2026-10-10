import path from "node:path";
import { fileURLToPath } from "node:url";
import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";

// Regression test for the Lairy plugin applied in the repo's
// eslint.config.ts (LDS-047): ADR-0003's theme removal can't stop arbitrary-value
// syntax (text-[10.5px]) since it bypasses the Tailwind theme entirely, so
// this is the seam-4 "off-system utilities" test for that one case.
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

// Loading the config pulls in the Lairy plugin and the content catalogue, so
// the first lint is slow; one instance is shared.
const eslint = new ESLint({ cwd: repoRoot });

async function lint(source: string) {
  const [result] = await eslint.lintText(source, {
    filePath: path.join(repoRoot, "packages/ui/src/__lint-fixture__.tsx"),
  });
  return result?.messages ?? [];
}

describe("lairy/no-arbitrary-tailwind-value (eslint.config.ts)", { timeout: 60_000 }, () => {
  it("flags an arbitrary-value class like text-[10.5px]", async () => {
    const messages = await lint(`export const X = () => <div className="text-[10.5px]">x</div>;\n`);
    expect(messages.some((m) => m.ruleId === "lairy/no-arbitrary-tailwind-value")).toBe(true);
  });

  it("does not flag a token-backed class like text-small", async () => {
    const messages = await lint(`export const X = () => <div className="text-small">x</div>;\n`);
    expect(messages.some((m) => m.ruleId === "lairy/no-arbitrary-tailwind-value")).toBe(false);
  });
});
