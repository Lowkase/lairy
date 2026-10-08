import { execFile, spawn, type ChildProcess } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { promisify } from "node:util";
import { expect, test } from "@playwright/test";

const execFileAsync = promisify(execFile);

// Keep in sync with playwright.config.ts's webServer / baseURL: this test
// hits the already-running docs app directly (not through `page`) so the
// shadcn CLI, which drives its own HTTP requests, can reach it too.
const REGISTRY_ORIGIN = "http://127.0.0.1:4310";
const FIXTURE_PORT = 4322;
const FIXTURE_ORIGIN = `http://127.0.0.1:${FIXTURE_PORT}`;

const REPO_ROOT = join(process.cwd(), "..", "..");
const TOKENS_DIR = join(REPO_ROOT, "packages", "tokens");

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
        name: "lairy-registry-fixture",
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
    `import { Callout } from "@/components/ui/callout/callout";\n\nexport default function Page() {\n  return (\n    <main style={{ padding: 32 }}>\n      <Callout tone="success" title="Sync scheduled">\n        Installed from the Lairy registry.\n      </Callout>\n    </main>\n  );\n}\n`,
  );
}

test.describe("Callout installs from the registry (seam 5)", () => {
  // A blank Next.js app, two npm installs, the shadcn CLI and a production
  // build — well past the default 30s.
  test.setTimeout(300_000);

  test("a fresh Next.js app installs Callout via the shadcn CLI and renders it on Lairy tokens", async ({
    page,
  }) => {
    const fixtureDir = mkdtempSync(join(tmpdir(), "lairy-registry-"));
    let server: ChildProcess | undefined;

    try {
      await test.step("scaffold a blank Next.js app", () => {
        scaffoldFixtureApp(fixtureDir);
      });

      await test.step("install its dependencies", async () => {
        await execFileAsync("npm", ["install", "--no-audit", "--no-fund"], { cwd: fixtureDir });
      });

      await test.step("install @lairy/tokens locally", async () => {
        // A packed tarball, not a workspace symlink: the fixture lives
        // outside this repo's directory tree, and Next's bundler won't
        // follow a node_modules symlink that escapes it. `pnpm pack`, not
        // `npm pack`: only pnpm applies the package's `publishConfig`
        // overrides (ADR-0011), so this is what a consumer really receives.
        const { stdout } = await execFileAsync("pnpm", ["pack", "--pack-destination", fixtureDir], {
          cwd: TOKENS_DIR,
        });
        const tarballPath = stdout.trim().split("\n").pop();
        if (!tarballPath) throw new Error("pnpm pack did not report a tarball path.");
        const tarballName = basename(tarballPath);
        await execFileAsync(
          "npm",
          ["install", join(fixtureDir, tarballName), "--no-audit", "--no-fund"],
          { cwd: fixtureDir },
        );
      });

      await test.step("add Callout through the shadcn CLI from the local registry", async () => {
        const { stdout } = await execFileAsync(
          "npx",
          [
            "--yes",
            "shadcn@latest",
            "add",
            `${REGISTRY_ORIGIN}/r/callout.json`,
            "--cwd",
            fixtureDir,
            "--yes",
          ],
          { cwd: fixtureDir },
        );
        expect(stdout).toContain("components/ui/callout/callout.tsx");

        // The tokens package must have been skipped, not re-resolved from
        // the public npm registry (it isn't published there) — confirms
        // the registry item's bare, versionless dependency declaration did
        // what it's meant to (docs/adr/0002).
        const pkgJson = JSON.parse(readFileSync(join(fixtureDir, "package.json"), "utf8"));
        expect(pkgJson.dependencies["@lairy/tokens"]).toMatch(/^file:/);
        expect(pkgJson.dependencies).toHaveProperty("class-variance-authority");
        expect(pkgJson.dependencies).toHaveProperty("cn");
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

      await test.step("render Callout and screenshot", async () => {
        await page.goto(FIXTURE_ORIGIN);

        const callout = page.locator('[data-slot="callout"]');
        await expect(callout).toBeVisible();
        await expect(callout).toHaveAttribute("role", "status");
        await expect(page.getByText("Sync scheduled")).toBeVisible();

        // Proves the tokens CSS actually loaded, not just that the class
        // names are present in markup: the locked 2px radius (AGENTS.md
        // rule 5) and a non-default background both come only from
        // @lairy/tokens's generated CSS.
        const radius = await callout.evaluate((el) => getComputedStyle(el).borderRadius);
        expect(radius).toBe("2px");
        const background = await callout.evaluate((el) => getComputedStyle(el).backgroundColor);
        expect(background).not.toBe("rgba(0, 0, 0, 0)");

        await page.screenshot({ path: "test-results/registry-install-callout.png" });
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
