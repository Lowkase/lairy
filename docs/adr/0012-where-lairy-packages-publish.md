# ADR-0012: Where `@lairy/tokens` and future packages publish

**Status:** Accepted — public npm, `@lairy` scope (PRD Q2, LDS-045)
**Date:** 2026-10-08

## Context

ADR-0011 made the packed `@lairy/tokens` tarball consumable outside the workspace and left the destination open. PRD Q2 asks: GitHub Packages (private) or public npm?

Facts about this repo that decide the trade-offs:

- The repo is `Lowkase/lairy`: a **personal account**, not an organisation, and it is **public**.
- The package name is `@lairy/tokens`. `npm view @lairy/tokens` returns 404, so the package is unpublished. Whether the `@lairy` npm scope is available or owned has **not** been checked and needs Cory (an npm login is required).
- Registry items depend on the bare name `@lairy/tokens` (`apps/docs/lib/registry.ts`). The shadcn CLI skips a dependency already in the target's `package.json`, so today a consumer installs tokens by hand first.
- The package is `private: true` today, which is the guard against an accidental publish. Publishing needs it removed.

## Options

### 1. Public npm

Setup:

1. Create the `@lairy` org (or confirm the scope is free) on npmjs.com; enable 2FA.
2. Remove `private`, add `"publishConfig": { "access": "public" }` alongside the existing overrides.
3. Add a release workflow using npm trusted publishing (OIDC) so no long-lived token is stored, with `--provenance` (available because the repo is public).
4. First release: `pnpm --filter @lairy/tokens publish` from a tag.

For:

- The name stays `@lairy/tokens`, so ADR-0002, registry items and the docs need no change.
- Zero consumer setup: no `.npmrc`, no token. `pnpm add @lairy/tokens` works in any app, CI, the shadcn CLI and sandboxes such as Claude Code on the web.
- Registry items can use a version range, and the shadcn CLI can resolve it.
- Provenance attestations link each version to its commit.

Against:

- Public and effectively permanent: npm only allows unpublish within narrow limits, so a mistaken release stays visible.
- The scope must be available. If `@lairy` is taken, the name changes everywhere.
- The tokens become a public product with a versioning promise (see Versioning below).

### 2. GitHub Packages (npm registry)

Setup:

1. Rename the package to **`@lowkase/tokens`**. GitHub Packages requires the scope to equal the owner of the repo, and the owner is the user `Lowkase`. `@lairy` is not available here unless the repo moves into a `lairy` organisation.
2. Add `"publishConfig": { "registry": "https://npm.pkg.github.com" }` and a `repository` field.
3. Release workflow with `permissions: packages: write` and the built-in `GITHUB_TOKEN`.
4. Every consumer adds `@lowkase:registry=https://npm.pkg.github.com` and an auth token with `read:packages` to `.npmrc`.

For:

- Access control through GitHub: visibility follows the repo's permissions, and versions can be deleted.
- No third-party account, no npm 2FA, and publishing uses the workflow token.

Against:

- **Rename.** The scope change touches ADR-0002, the registry dependency lists, the docs and the seam test. The alternative is a new `lairy` GitHub organisation and a repo transfer.
- **Auth for every reader, even though the repo is public.** GitHub's npm registry requires a token for installs. A fresh app, the shadcn CLI and CI need `.npmrc` setup before `add` works, which breaks the "a fresh Next.js app can install a Component through the CLI" success criterion (PRD §13) unless the install docs add the step.
- Registry items cannot declare the dependency in a way the CLI resolves without that `.npmrc`.
- Privacy buys little: the source and the compiled tokens are already public in the repo.

### 3. Defer publishing; keep installing from a tarball or git URL

Not recommended. It leaves the dependency manual and PRD §13 unmet. Listed for completeness.

## Comparison

| | Public npm | GitHub Packages |
|---|---|---|
| Package name | `@lairy/tokens` (scope must be available) | `@lowkase/tokens` (or move to a `lairy` org) |
| Consumer setup | none | `.npmrc` registry mapping and a token |
| Works with shadcn CLI out of the box | yes | only after `.npmrc` setup |
| Publish credential | OIDC trusted publishing, no stored secret | `GITHUB_TOKEN` |
| Mistake recovery | limited (deprecate, new version) | delete a version |
| Needs an account outside GitHub | yes (npm) | no |

## Recommendation

**Public npm**, if the `@lairy` scope can be claimed. It is the only option that keeps the name and meets PRD §13 without install-time setup. The repo and the tokens are already public, so private hosting protects nothing.

If Cory wants private distribution, choose GitHub Packages knowing it costs a rename (or an org) plus consumer auth.

## Versioning (also open from ADR-0011)

Proposal: semver, where a removed or renamed token is a major, a new token or changed value is a minor, and a fix is a patch. Pre-1.0, minors may break and say so in the release notes. The agent who changes tokens bumps the version in the same PR; a tag `tokens-vX.Y.Z` triggers the release workflow. Not decided here beyond the proposal.

## Decision

**Public npm**, scope `@lairy` (the npm org exists). Versioning follows the semver policy above.

Done in this ticket: `private` removed, `publishConfig.access` set to `public`, `repository` added, and `.github/workflows/release-tokens.yml` publishes on a `tokens-vX.Y.Z` tag using npm trusted publishing.

Still manual, by Cory:

1. First publish of v0.1.0 from a local machine: `npm login`, `pnpm pack` in `packages/tokens` (not `npm pack`, which ignores `publishConfig`), then `npm publish <tarball> --access public`. A package must exist before npm lets you configure trusted publishing.
2. On npmjs.com, add a trusted publisher for the package: repo `Lowkase/lairy`, workflow `release-tokens.yml`. Later releases publish from a pushed tag.
