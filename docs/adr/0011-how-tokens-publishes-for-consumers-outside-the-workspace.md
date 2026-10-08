# ADR-0011: How `@lairy/tokens` publishes for consumers outside the workspace

**Status:** Accepted
**Date:** 2026-10-07

## Context

ADR-0002 says `@lairy/tokens` is a versioned package that apps never edit, and that registry components declare a dependency on it. Today the package can't be consumed that way (issue #64):

- `packages/tokens/package.json` is `private: true`, version `0.0.0`, and its `main`, `types` and `exports` all point at raw TypeScript in `./src/`.
- Inside the workspace that works: pnpm symlinks it, and `apps/docs/next.config.ts` lists it in `transpilePackages` so Next compiles it.
- A consumer outside the workspace has to know to do the same. The registry seam test (`apps/docs/e2e/registry-install.spec.ts`) writes `transpilePackages: ["@lairy/tokens"]` into its fixture app for exactly this reason, and says so in a comment. A real app installing a Callout from the registry wouldn't know.
- Registry items list `@lairy/tokens` under `dependencies` (`apps/docs/lib/registry.ts`). The shadcn CLI skips a dependency already in the target's `package.json`, so today the consumer has to install the package by hand first. That works in the seam test only because it installs a packed tarball.
- `pnpm run build` already compiles the TypeScript to `dist/` (JS and `.d.ts`). `dist/` does not contain the CSS: `tokens.css` and `tailwind-theme.css` live in `src/css/` and are exported as `./css/*`. They are plain CSS and need no transpiling.
- What breaks outside Next is wider than the `next.config`: any consumer without a transform for `node_modules` TypeScript (a plain Vite or esbuild setup that doesn't compile dependencies, a Node script, the MCP server importing token values) can't import the package.

Constraint from #64: changing the export shape of a package every workspace package consumes risks breaking them all.

## Options considered

### A. Document `transpilePackages`

Keep the package as is. Add the requirement to wherever installation is documented (PRD §10, a future "install tokens" doc, the registry item's own description).

- **For:** no code change, no risk to the workspace.
- **Against:** the requirement is invisible to the people and agents it hits, and the fix is Next-specific. Non-Next consumers and Node scripts remain unsupported. The seam test keeps proving the workaround instead of the real install.

### B. Point `exports` at the compiled `dist/` for everyone

Change `main`, `types` and `exports` to `./dist/*`, and build before anything consumes it.

- **For:** one shape, standard, no transform needed by any consumer.
- **Against:** it changes how every workspace package consumes tokens. Dev and test loops now need `dist/` built and kept fresh (a watch mode, or `turbo` ordering everywhere), and a stale `dist/` is a new class of confusing failure. CI has already shown how a stale cache hit can pass a check it shouldn't (see #108). `transpilePackages` for tokens becomes dead config to remove.

### C. Conditional exports: source in the workspace, `dist/` by default

Use a custom export condition, for example `"lairy-source": "./src/index.ts"` ahead of `"default": "./dist/index.js"`, and have the workspace's tooling (TypeScript `customConditions`, Next, Vitest) opt into the source condition.

- **For:** one `exports` map, correct in both worlds, and no build step in the dev loop.
- **Against:** every tool in the workspace has to be told about the condition and each handles it differently (TypeScript, Vitest, Next/Turbopack, ESLint's import resolver). I haven't verified Turbopack supports it in this Next version. More moving parts, and a misconfigured tool silently resolves the wrong build.

### D. Keep `exports` as source in the repo; override it for the published package with `publishConfig`

`pnpm` applies `publishConfig` fields (`main`, `types`, `exports`) only when packing or publishing. In the repo nothing changes. The tarball that consumers install contains `exports` pointing at `dist/`.

- **For:** zero change to how workspace packages consume tokens, which removes the risk named in #64. Consumers get compiled JS, `.d.ts` and the CSS with no `transpilePackages`. The seam test already installs a packed tarball, so it can verify the real thing: drop `transpilePackages` from the fixture and the test fails today and passes with the fix.
- **Against:** the published shape differs from the in-repo shape, so something has to prove the tarball is right (the seam test does). The package must be built before packing, and `dist/` must include the CSS (a copy step in `build`, with `publishConfig.exports` pointing `./css/*` at it). The package must stop being `private`, gain a real version, and have a `files` list.

## Decision

**Option D.** `exports` keeps pointing at `./src/` in the repo, and `publishConfig` overrides `main`, `types` and `exports` to point at `dist/` for the packed and published package. It is the only option that fixes the consumer problem without touching how the rest of the workspace resolves tokens, which was the explicit worry in #64. Options B and C each trade a consumer fix for workspace-wide churn. Option A can stand in as a one-line note until D lands.

Implementation, as one ticket:

1. Add `files`, and make the version real (keep `private` until the publishing questions below are settled).
2. Make `build` copy `src/css/` to `dist/css/`.
3. Add `publishConfig` with `main`, `types` and `exports` pointing at `dist/`, including `./css/*`.
4. Remove `transpilePackages: ["@lairy/tokens"]` from the seam test's fixture, so the test proves the packed package works on its own.
5. Remove the now-stale comments in `apps/docs/lib/registry.ts` and the seam test.

## Still open

These do not block the decision above, because D works with a packed tarball alone, but they need answers before the first real publish:

- **Where does it publish?** Public npm, a private registry or GitHub Packages? ADR-0002 says "versioned package" but not where it lives. This decides whether registry items can use a version range instead of the bare name, and whether the shadcn CLI can resolve it without a manual install.
- **Versioning policy.** Do token changes follow semver (a palette change is a minor, a removed token is a major), and who bumps it?

## Consequences

- Consumers outside the workspace get compiled JS, type declarations and the CSS from a normal install, with no `transpilePackages` and no Next-specific setup. Non-Next consumers and plain Node scripts can import it.
- Nothing changes for workspace packages: they keep resolving tokens from source, so there is no new build-ordering or stale-`dist/` risk in the dev loop.
- The published shape differs from the in-repo shape. The seam test is what keeps that honest: it installs the packed tarball into a fresh app and must pass without `transpilePackages`. Any change to `publishConfig` or `files` is covered by it.
- `dist/` must include the CSS, so `build` has a copy step that can drift from `src/css/`; the seam test's CSS imports cover it.
- The package stays `private` until the publishing destination and versioning policy are decided, so no accidental publish can happen in the meantime.
- Packing must use `pnpm pack` or `pnpm publish`: `npm pack` ignores `publishConfig` export overrides and would ship the source entry points. The seam test packs with pnpm for that reason.
- Native Node ESM needs explicit `.js` extensions on relative imports. The source stays extensionless, because a `.js` specifier pointing at a `.ts` file does not resolve under Turbopack in this workspace, so `build` adds the extensions to the compiled `.js` and `.d.ts` after `tsc` (`packages/tokens/scripts/add-js-extensions.mjs`).
- `pnpm pack` still includes the original `main` file (`src/index.ts`) in the tarball, even though `files` lists only `dist`. It is unused and harmless.
