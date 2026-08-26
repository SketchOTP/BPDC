# Project Profile

## Lifecycle

- Status: `ADOPTED`
- Last verified: 2026-08-25 America/New_York

## Identity

- Project: BPDC — Believably Persistent Desktop Creature
- Repository root: `\\atlas\ATLAS\100_ACTIVE\Projects\BPDC`
- GitHub: `SketchOTP/BPDC`
- Default branch: `main`
- GitHub visibility: public
- GitHub state at adoption: empty repository, size 0, no indexed source files
- Current phase: Phase 14 — Midpoint Reconsideration; Architect accepted and published through `BPDC-SYNC-011`, final canonical SHA `be9a3be33be120a47cccfd9c0c0251e8155a12c0`. Phase 15 is not authorized.

## Languages and runtimes

- ECMAScript modules on Node.js 24.13.1; framework-independent core with no desktop imports.

## Tools

- Build/test/lint/type-check/package commands: direct `node --test`; package scripts are present but npm script execution from this UNC path falls back through `cmd.exe`.
- Preferred navigation/indexing: repository-specific tooling to be established before implementation

## Verified commands

- Governance checks: `git diff --check`; boundary/privacy/secret scans — verified.
- Project-specific checks: `node --test` — verified; `node src/cli/experiments.js` — verified; `node src/cli/simulate.js --seed 1234 --hours 24` — verified; local-staged `node scripts/build-openpets-plugin.mjs` — verified; pinned OpenPets manifest validation — verified.

## Constraints

- Platform target: desktop; exact shell/runtime is a Phase 0 decision.
- Privacy: use only bounded, low-privacy environmental signals in early work.
- Deployment: no deployment authorized; accepted Phase 1–14 state is synchronized to GitHub `main` at `be9a3be33be120a47cccfd9c0c0251e8155a12c0`; live P14 desktop evidence remains `UNKNOWN / NOT CLAIMED`; Phase 15 is not authorized.
