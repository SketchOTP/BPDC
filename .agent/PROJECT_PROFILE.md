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
- Current phase: Phase 12 — Reunion Response; implemented locally and pending Architect review. Phase 13 is not authorized.

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
- Deployment: no deployment authorized; accepted Phase 1–11 state is synchronized to GitHub `main`; Phase 12 is local and pending Architect review; Phase 13 is not authorized.
