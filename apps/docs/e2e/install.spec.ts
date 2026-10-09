import { execFile, spawn, type ChildProcess } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { expect, test, type Page } from "@playwright/test";

const execFileAsync = promisify(execFile);

// Same arrangement as registry-install.spec.ts: the shadcn CLI makes its own
// HTTP requests, so it hits the already-running docs app directly.
const REGISTRY_ORIGIN = "http://127.0.0.1:4310";
const FIXTURE_PORT = 4323;
const FIXTURE_ORIGIN = `http://127.0.0.1:${FIXTURE_PORT}`;

// Pixel baselines are per-OS; see callout.spec.ts. Compare locally, capture in CI.
async function screenshot(page: Page, name: string) {
  const stage = page.getByTestId("stage");
  if (process.env.CI) {
    await stage.screenshot({ path: `test-results/${name}` });
  } else {
    await expect(stage).toHaveScreenshot(name);
  }
}

async function waitForHttp(url: string, timeoutMs: number): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  let lastError: unknown;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
      lastError = new Error(`${url} responded ${res.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Timed out waiting for ${url}: ${String(lastError)}`);
}

function scaffoldFixtureApp(dir: string): void {
  mkdirSync(join(dir, "app"), { recursive: true });

  writeFileSync(
    join(dir, "package.json"),
    JSON.stringify(
      {
        name: "lairy-install-fixture",
        version: "0.0.0",
        private: true,
        type: "module",
        scripts: { build: "next build", start: "next start" },
        dependencies: {
          next: "^16.3.6",
          react: "^19.3.0",
          "react-dom": "^19.3.0",
          tailwindcss: "^4.3.3",
          "@tailwindcss/postcss": "^4.3.3",
        },
        // Declared up front rather than left for `next build`'s own
        // auto-install-missing-TypeScript-deps step: that step shells out
        // to npm mid-build, which raced flakily under Playwright's process
        // spawning.
        devDependencies: {
          typescript: "^6.0.3",
          "@types/node": "^26.6.3",
          "@types/react": "^19.3.0",
          "@types/react-dom": "^19.3.0",
        },
      },
      null,
      2,
    ),
  );

  writeFileSync(
    join(dir, "tsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          target: "ES2022",
          lib: ["dom", "dom.iterable", "ES2022"],
          module: "esnext",
          moduleResolution: "bundler",
          jsx: "preserve",
          noEmit: true,
          strict: true,
          skipLibCheck: true,
          esModuleInterop: true,
          incremental: true,
          plugins: [{ name: "next" }],
          paths: { "@/*": ["./*"] },
        },
        include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
        exclude: ["node_modules"],
      },
      null,
      2,
    ),
  );

  // No next.config: the packed @lairy/tokens ships compiled JS (ADR-0011), so
  // a consuming app needs no `transpilePackages` for it.

  writeFileSync(
    join(dir, "postcss.config.mjs"),
    `export default { plugins: { "@tailwindcss/postcss": {} } };\n`,
  );

  // Written directly rather than via `shadcn init`: it's a small, fully
  // known config and skipping init keeps this test's network calls scoped
  // to exactly the seam it's verifying (installing tokens, then Callout).
  writeFileSync(
    join(dir, "components.json"),
    JSON.stringify(
      {
        $schema: "https://ui.shadcn.com/schema.json",
        style: "new-york",
        rsc: true,
        tsx: true,
        tailwind: { css: "app/globals.css", baseColor: "neutral", cssVariables: true },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
          ui: "@/components/ui",
          lib: "@/lib",
          hooks: "@/hooks",
        },
      },
      null,
      2,
    ),
  );

  // The registry item delivers the component; wiring the tokens package's
  // CSS into the app root is a one-time app-setup step the docs app itself
  // also does by hand (apps/docs/app/globals.css) — this mirrors it rather
  // than asking the shadcn CLI to merge it.
  writeFileSync(
    join(dir, "app", "globals.css"),
    `@import "tailwindcss";\n@import "@lairy/tokens/css/tokens.css";\n@import "@lairy/tokens/css/tailwind-theme.css";\n\nbody {\n  background: var(--bg);\n  color: var(--fg);\n}\n`,
  );

  writeFileSync(
    join(dir, "app", "layout.tsx"),
    `import type { ReactNode } from "react";\nimport "./globals.css";\n\nexport default function RootLayout({ children }: { children: ReactNode }) {\n  return (\n    <html lang="en">\n      <body>{children}</body>\n    </html>\n  );\n}\n`,
  );

  writeFileSync(
    join(dir, "app", "page.tsx"),
    `import { Badge } from "@/components/ui/badge/badge";
import { Callout } from "@/components/ui/callout/callout";
import { TextInput } from "@/components/ui/text-input/text-input";

export default function Page() {
  return (
    <main data-testid="stage" style={{ padding: 32, display: "grid", gap: 24, maxWidth: 480 }}>
      <Callout tone="success" title="Sync scheduled">
        Installed from the Lairy registry.
      </Callout>
      <div style={{ display: "flex", gap: 8 }}>
        <Badge tone="neutral">Draft</Badge>
        <Badge tone="info">Running</Badge>
        <Badge tone="success">Healthy</Badge>
        <Badge tone="fail">Failed</Badge>
      </div>
      <TextInput label="Pipeline name" hint="Letters, numbers and hyphens." />
    </main>
  );
}
`,
  );
}

test.describe("Install test: three components against the published tokens (PRD §13)", () => {
  test.setTimeout(300_000);

  test("a fresh Next.js app installs Callout, Badges and Text input and renders them in both themes", async ({
    page,
  }) => {
    const fixtureDir = mkdtempSync(join(tmpdir(), "lairy-install-"));
    let server: ChildProcess | undefined;

    try {
      await test.step("scaffold a blank Next.js app", () => {
        scaffoldFixtureApp(fixtureDir);
      });

      await test.step("install its dependencies", async () => {
        await execFileAsync("npm", ["install", "--no-audit", "--no-fund"], { cwd: fixtureDir });
      });

      await test.step("install the published @lairy/tokens from npm", async () => {
        await execFileAsync("npm", ["install", "@lairy/tokens@latest", "--no-audit", "--no-fund"], {
          cwd: fixtureDir,
        });
        const pkgJson = JSON.parse(readFileSync(join(fixtureDir, "package.json"), "utf8"));
        // A registry version, not a file: or workspace: link.
        expect(pkgJson.dependencies["@lairy/tokens"]).toMatch(/^\^?\d+\.\d+\.\d+/);
      });

      await test.step("add Callout, Badges and Text input through the shadcn CLI", async () => {
        const { stdout } = await execFileAsync(
          "npx",
          [
            "--yes",
            "shadcn@latest",
            "add",
            `${REGISTRY_ORIGIN}/r/callout.json`,
            `${REGISTRY_ORIGIN}/r/badge.json`,
            `${REGISTRY_ORIGIN}/r/text-input.json`,
            "--cwd",
            fixtureDir,
            "--yes",
          ],
          { cwd: fixtureDir },
        );
        expect(stdout).toContain("components/ui/callout/callout.tsx");
        expect(stdout).toContain("components/ui/badge/badge.tsx");
        expect(stdout).toContain("components/ui/text-input/text-input.tsx");
      });

      await test.step("build and start the fixture app", async () => {
        await execFileAsync("npx", ["next", "build"], { cwd: fixtureDir });
        server = spawn("npx", ["next", "start", "--port", String(FIXTURE_PORT)], {
          cwd: fixtureDir,
          stdio: "pipe",
          detached: true,
        });
        await waitForHttp(FIXTURE_ORIGIN, 30_000);
      });

      await test.step("render in the dark theme", async () => {
        await page.goto(FIXTURE_ORIGIN);
        await expectInstalledComponents(page);
        await screenshot(page, "install-dark.png");
      });

      await test.step("render in the light theme", async () => {
        const darkBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
        await page.evaluate(() => document.documentElement.setAttribute("data-theme", "light"));
        const lightBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
        expect(lightBg).not.toBe(darkBg);
        await expectInstalledComponents(page);
        await screenshot(page, "install-light.png");
      });
    } finally {
      if (server?.pid) {
        try {
          process.kill(-server.pid, "SIGTERM");
        } catch {
          server.kill("SIGTERM");
        }
      }
      rmSync(fixtureDir, { recursive: true, force: true });
    }
  });
});

async function expectInstalledComponents(page: Page): Promise<void> {
  const callout = page.locator('[data-slot="callout"]');
  await expect(callout).toBeVisible();
  await expect(page.getByText("Sync scheduled")).toBeVisible();
  await expect(page.getByText("Healthy")).toBeVisible();
  const input = page.getByLabel("Pipeline name");
  await expect(input).toBeVisible();

  // The tokens CSS really applied (not only class names in the markup): the
  // locked 2px radius (AGENTS.md rule 5) comes only from @lairy/tokens.
  expect(await callout.evaluate((el) => getComputedStyle(el).borderRadius)).toBe("2px");
  expect(await input.evaluate((el) => getComputedStyle(el).borderRadius)).toBe("2px");
  expect(await callout.evaluate((el) => getComputedStyle(el).backgroundColor)).not.toBe(
    "rgba(0, 0, 0, 0)",
  );
}
