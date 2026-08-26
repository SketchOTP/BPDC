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
- Current phase: Phase 16 — Learned Coarse Daily Activity Routine; Architect accepted and published; canonical local/remote `main` is `df12dd0f2b0a5985d87b29aea245e76f04d361d0`; Phase 17 is not authorized.

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
- Deployment: no deployment authorized; live Phase 16 routine behavior remains `UNKNOWN / NOT CLAIMED`; Phase 17 is not authorized.

## Historical Phase 16 handoff — 2026-08-26

- Local `main` is `156c3e8`, consisting of product `42a7799` plus records-only Authority closure; remote remains the published P15 tip `7b8f249985c54d752d4cc87a5862b43553222298`.
- Phase 16 is locally implemented and awaiting Architect review. No push or Phase 17 work is authorized.

## BPDC-SYNC-013 publication — 2026-08-26

- Phase 16 was accepted by the Architect at `E4_REGRESSION_PROTECTED` and published normally.
- Final canonical state: local `main == origin/main == df12dd0f2b0a5985d87b29aea245e76f04d361d0`; worktree clean; no history rewrite.
- Live Windows/Electron routine behavior remains `UNKNOWN / NOT CLAIMED`; Phase 17 remains unauthorized.
