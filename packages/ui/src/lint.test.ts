import path from "node:path";
import { fileURLToPath } from "node:url";
import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";

// Regression test for the tailwindcss/no-arbitrary-value rule in the repo's
// eslint.config.js: ADR-0003's theme removal can't stop arbitrary-value
// syntax (text-[10.5px]) since it bypasses the Tailwind theme entirely, so
// this is the seam-4 "off-system utilities" test for that one case.
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

async function lint(source: string) {
  const eslint = new ESLint({ cwd: repoRoot });
  const [result] = await eslint.lintText(source, {
    filePath: path.join(repoRoot, "packages/ui/src/__lint-fixture__.tsx"),
  });
  return result?.messages ?? [];
}

describe("tailwindcss/no-arbitrary-value (eslint.config.js)", () => {
  it("flags an arbitrary-value class like text-[10.5px]", async () => {
    const messages = await lint(`export const X = () => <div className="text-[10.5px]">x</div>;\n`);
    expect(messages.some((m) => m.ruleId === "tailwindcss/no-arbitrary-value")).toBe(true);
  });

  it("does not flag a token-backed class like text-small", async () => {
    const messages = await lint(`export const X = () => <div className="text-small">x</div>;\n`);
    expect(messages.some((m) => m.ruleId === "tailwindcss/no-arbitrary-value")).toBe(false);
  });
});
