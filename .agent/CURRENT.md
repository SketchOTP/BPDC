# Current State

## Lifecycle

- Status: `ACTIVE`
- Last updated: 2026-08-24 America/New_York

## Active state

- Local directive ID: `BPDC-P5-001`
- External directive ID: `BPDC-P5-001`
- Objective: Wire OpenPets' bounded presence signals into the existing host-neutral environment snapshot without adding a behavioral subsystem.
- Current status: `COMPLETE_FOR_ARCHITECT_HANDOFF`
- Acceptance: Phase 5 presence translation is implemented and target-tested; startup presence remains conservatively `UNKNOWN` until a curated signal arrives; no live desktop session is required for acceptance and no operational claim is made.
- Current phase: `Phase 5 — Minimal User Presence Awareness` complete for Architect review; no subsequent phase is authorized.
- Expected touched areas: integration presence tracker, OpenPets adapter/plugin bundle, deterministic experiments/tests, README, and Authority records only.
- Immediate next action: wait for Architect review. Do not start Phase 6 or add broader environmental sensing.

## Temporary task-relevant facts

- Canonical repository path: `\\atlas\ATLAS\100_ACTIVE\Projects\BPDC`; retired `\\rpi5\RPI5SharedDrive` must not be used.
- GitHub repository exists at `SketchOTP/BPDC`, default branch `main`; local `main` and `origin/main` both resolve to `b40232c` at entry.
- Notion defines Phase 0 as evaluation of OpenPets first, VPet second, and a minimal shell only if required, with PetzA as behavioral research.

## Last validation

- Command or check: `node --test`, P4 experiment suite, manifest validation, local-staged OpenPets build, dependency/time scan, and `git diff --check`
- Result: `PASSED`; 17/17 tests, experiment suite PASS, manifest PASS, staged bundle PASS at 34,901 bytes, core scan clean, migration review PASS, publication-safety scan PASS, and diff check PASS. Canonical UNC esbuild remains `BLOCKED` by known `spawn EPERM`; staged build succeeds. Product commit `cb5d6ad1b61a3833582781a9f169ea53954b7d67` and final Authority closure commit are published; local `main == origin/main`. Habit-specific live evidence remains `UNKNOWN`/deferred.

## Risks and blockers

- BPDC Phase 1 uses framework-independent ECMAScript modules and Node's built-in test runner; no third-party runtime dependency was added.
- jCodemunch-MCP is unavailable in this session; code indexing is therefore not yet verified.
- Full OpenPets desktop suite has a reproducible failure in `plugin-service.test.js` under this Windows/Node 24 environment; it remains tracked and is outside BPDC Phase 1.
- Live Windows/Electron integration: `E5_OPERATIONALLY_OBSERVED` in disposable Electron profiles; forced WANDER, SLEEP, and SEEK_ATTENTION reached the real host, and one uninterrupted autonomous session selected SEEK_ATTENTION then WANDER.
- Phase 2 acceptance: Architect accepted `BPDC-P2-002` on 2026-08-23; Phase 2 is closed.
- Phase 3 boundary: one normalized persistent `bond` value, bounded structured interaction history, deterministic decay/saturation, existing utility integration, and one real OpenPets interaction path. Phase 3 is accepted. Habits, generic memory, environment learning, mood, hunger, evolution, and Phase 4 remain out of scope.
- Phase 4 implementation: one 24-slot `attentionByHour` aggregate, saturating positive-interaction reinforcement, seven-day half-life decay, schema 2 → 3 migration, and `SEEK_ATTENTION.timeHabit` utility contribution are implemented and target-tested. No general habit engine or additional sensing was added.
- Deferred P4 live evidence: the Computer Use skill is present but no callable `node_repl`/Sky tool is exposed. No synthetic interaction was used and no habit-specific live claim is made. This is deferred, not a sync blocker.
- Phase 5 implementation: OpenPets `idle:enter`, `idle:exit`, `screen:locked`, and `screen:unlocked` map through a transient integration `PresenceTracker` to the existing `userPresent` and `userIdleDuration` fields. Direct pet interaction marks active presence. Startup uses internal `UNKNOWN`, conservatively mapped to absent/zero-duration; presence is not persisted.
- Phase 5 validation: `node --test` 22/22, combined experiment suite PASS, manifest PASS, local-staged plugin build PASS at 38,483 bytes, core dependency/privacy scans PASS, and `git diff --check` PASS. Canonical UNC esbuild remains blocked by known `spawn EPERM`; staging succeeds.
- Phase 5 publication: product commit `c13d3e8b0a51b1799872672ffbca57059fa56a55` (`feat: wire curated user presence signals`) pushed normally; final local/remote equality and clean-worktree verification will be recorded after the Authority closure commit.

## Pending decisions

- P3-003 live evidence is accepted by the Architect. `BPDC-SYNC-001` was superseded by `BPDC-SYNC-002`; reconciliation commit `34aef6f` was pushed normally and verified equal on local `main` and GitHub `main`. Architect accepted `BPDC-P4-001`, superseded `BPDC-P4-002` as a blocking gate, accepted `BPDC-SYNC-003`, and issued `BPDC-P5-001`; P5 is complete for Architect handoff and no subsequent phase is authorized.
