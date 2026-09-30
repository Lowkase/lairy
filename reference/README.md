# reference

`reference/` holds what we build about the prototype: an index, screenshots, a harvest report and capture scripts. The prototype itself is `archive/v1/`, the spec, never imported, built or linted. Known deviations are in `docs/prd.md` §8.

## Baseline screenshots

`capture-baseline.mjs` serves `archive/v1/Workspace Shell.dc.html` over HTTP and drives it with Playwright, clicking through the real nav (main rail → subnav rail) to capture every Foundation, Component and Pattern page in both themes at 1440px width, full page. Output: `screenshots/<section>/<entry>--<theme>.png`.

This directory is its own standalone tool, not part of the pnpm workspace — like `archive/`, it is never built or linted (`AGENTS.md`).

```bash
cd reference
pnpm install
pnpm run capture:baseline
```

**Needs network access** — the prototype loads React, ReactDOM and Babel from unpkg.com at runtime (see `archive/v1/support.js`). **Run manually**, not in CI: there's no offline fallback and no CI job wired up for it.

Compare a ported component against its baseline with the docs app's `/dev/compare/[entry]` route (`docs/build-guide.md` §2).
