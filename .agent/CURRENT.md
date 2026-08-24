# Current State

## Lifecycle

- Status: `ACTIVE`
- Last updated: 2026-08-24 America/New_York

## Active state

- Local directive ID: `BPDC-SYNC-005`
- External directive ID: `BPDC-SYNC-005`
- Objective: Publish the accepted Phase 8 implementation and Authority closure to canonical GitHub `main` without changing application behavior.
- Current status: `COMPLETED`
- Acceptance: P8 is Architect-accepted and published; local `main == origin/main`; worktree is clean; live spatial observation remains `UNKNOWN`/not claimed.
- Current phase: `Phase 8 — Spatial Habitat Familiarity` closed; awaiting a new Architect directive; no Phase 9 work is authorized.
- Expected touched areas: CreatureCore schema/persistence, OpenPets integration tracker/adapter, generated plugin, tests, README, and Authority records.
- Immediate next action: await the next Architect directive; do not add multiple sites, grids, pathfinding, new utility weights, or a subsequent phase.
- Local implementation commit: `0b7e70e` (`feat: teach one persistent rest site`); published.
- Authority closure commit: `807d867` (`chore: record Phase 8 authority handoff`); published.
- Publication result: normal non-force push published the accepted P8 state at `807d867e898b784b2b0321e0c570db4ea9314ae5`; the records-only sync closure is final at `7e85eba25b9a9934ec74a53d7a94555d89ff6c85`.

## Temporary task-relevant facts

- Canonical repository path: `\\atlas\ATLAS\100_ACTIVE\Projects\BPDC`; retired `\\rpi5\RPI5SharedDrive` must not be used.
- GitHub repository exists at `SketchOTP/BPDC`, default branch `main`; P6 entry and final verification use local `main == origin/main` at `47bb5cc` before the P6 commit.
- Notion defines Phase 0 as evaluation of OpenPets first, VPet second, and a minimal shell only if required, with PetzA as behavioral research.

## Last validation

- Command or check: `node --test`, `node src/cli/experiments.js`, adapter response harness, manifest validation, local-staged OpenPets build, dependency/privacy/publication-safety scans, and `git diff --check`
- Result: `PASSED`; 45/45 tests, BPDC-P8-001 experiment suite PASS, spatial/adapter/state/persistence/migration/display/utility checks PASS, manifest PASS, staged bundle PASS at 59,600 bytes, boundary/privacy/secret scans PASS, diff check PASS, publication-safety scan PASS, normal pushes PASS, and final local/remote equality verified at `7e85eba25b9a9934ec74a53d7a94555d89ff6c85`. Canonical UNC esbuild remains `BLOCKED` by known `spawn EPERM`; staged build succeeds. Live Windows/Electron spatial observation remains `UNKNOWN`/not claimed.

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
- Phase 6 implementation: integration-owned version-1 envelope stores `savedAtEpochMs` beside the existing serialized schema-3 snapshot; legacy raw snapshots receive zero invented catch-up and migrate on save; backward clocks skip catch-up; offline environment is absent with changing local time; quiet reconciliation uses the existing deterministic core path; only the current resume intent is expressed.
- Phase 6 validation: `node --test` 31/31, `node src/cli/experiments.js` BPDC-P6-001 PASS, OpenPets manifest PASS, local-staged bundle PASS at 43,351 bytes, core wall-clock boundary scan PASS, privacy scan PASS, and `git diff --check` PASS. Canonical UNC esbuild remains blocked by known `spawn EPERM`; staging succeeds. Live desktop elapsed-time observation is `UNKNOWN`/not claimed.
- Phase 6 publication: product and Authority implementation commit `2e4ff7eb261b1df1c8db57392cfa4bbee9b99b61` was pushed normally; final Authority closure verification is recorded after the follow-up records-only commit.
- Phase 7 implementation: `InteractionResponseIntent` is transient and non-persistent; `ENJOY_CONTACT`, `ACKNOWLEDGE_CONTACT`, and `WITHDRAW_CONTACT` are selected from existing bond/personality/current behavior. The adapter maps them to existing reactions and uses one generation-guarded restoration timer; no autonomous behavior/timing/RNG/drive state is replaced.
- Phase 7 publication: product commit `98b506d` (`feat: express immediate contact response`) and Authority closure `619b35e` were published normally under `BPDC-SYNC-004`; GitHub `main`, local `main`, and `origin/main` now equal `619b35e1e2020ba9157d16d5241628f73a83395c`.

## Pending decisions

- P3-003 live evidence is accepted by the Architect. `BPDC-SYNC-001` was superseded by `BPDC-SYNC-002`; reconciliation commit `34aef6f` was pushed normally and verified equal on local `main` and GitHub `main`. Architect accepted `BPDC-P4-001`, superseded `BPDC-P4-002` as a blocking gate, accepted `BPDC-SYNC-003`, `BPDC-P5-001`, `BPDC-P6-001`, `BPDC-P7-001`, `BPDC-SYNC-004`, and `BPDC-P8-001`; `BPDC-SYNC-005` is complete and no Phase 9 work is authorized.
