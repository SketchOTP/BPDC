# Project Profile

## Lifecycle

- Status: `ADOPTED`
- Last verified: 2026-08-23 America/New_York

## Identity

- Project: BPDC — Believably Persistent Desktop Creature
- Repository root: `\\rpi5\RPI5SharedDrive\100_ACTIVE\Projects\BPDC`
- GitHub: `SketchOTP/BPDC`
- Default branch: `main`
- GitHub visibility: public
- GitHub state at adoption: empty repository, size 0, no indexed source files
- Current phase: Phase 3 — Minimal Relationship Memory; Architect accepted, repository safety checkpoint blocked on remote ancestry

## Languages and runtimes

- ECMAScript modules on Node.js 24.13.1; framework-independent core with no desktop imports.

## Tools

- Build/test/lint/type-check/package commands: direct `node --test`; package scripts are present but npm script execution from this UNC path falls back through `cmd.exe`.
- Preferred navigation/indexing: repository-specific tooling to be established before implementation

## Verified commands

- Governance checks: `UNSET UNTIL VERIFIED`
- Project-specific checks: `node --test` — verified; `node src/cli/experiments.js` — verified; `node src/cli/simulate.js --seed 1234 --hours 24` — verified.

## Constraints

- Platform target: desktop; exact shell/runtime is a Phase 0 decision.
- Privacy: use only bounded, low-privacy environmental signals in early work.
- Deployment: no deployment authorized; Phase 3 local checkpoint is accepted; synchronization is blocked pending Architect review of unrelated Git roots.
