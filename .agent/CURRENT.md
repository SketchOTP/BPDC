# Current State

## Lifecycle

- Status: `ACTIVE`
- Last updated: 2026-08-24 America/New_York

## Active state

- Local directive ID: `BPDC-P10-001`
- External directive ID: `BPDC-P10-001`
- Objective: Implement continuous physical maturation derived solely from existing simulation age and present it through bounded OpenPets scaling.
- Current status: `IMPLEMENTED_PENDING_ARCHITECT_ACCEPTANCE`
- Acceptance: Phase 10 implementation is deterministic and regression-protected for Architect review; no new persistent development state, behavior consequence, evolution system, or Phase 11 work was added.
- Current phase: `Phase 10 — Continuous Physical Maturation` implementation complete for handoff.
- Expected touched areas: derived CreatureCore development projection, OpenPets adapter presentation, generated plugin, manifest permission, tests, experiments, README, and Authority records.
- Immediate next action: commit the validated Phase 10 implementation locally and await Architect review; do not push or begin Phase 11.
- Local implementation commit: `0b7e70e` (`feat: teach one persistent rest site`); published.
- Authority closure commit: `807d867` (`chore: record Phase 8 authority handoff`); published.
- Local P9 implementation commit: `f25010b0fd5a89776d8fb151c5fd5dc9e2d0b5b6` (`feat: learn user-shaped play preference`); published.
- Authority closure commit: `58acab9a85fefeb7b79d130b3ceb0e75d7aada89` (`chore: record Phase 9 authority handoff`); published.
- Local P10 implementation commit: `9045fb7a61a29917405e3d1d53174aec63246dfb` (`feat: add continuous physical maturation`); not pushed.
- Publication result: `BPDC-SYNC-006` remains durable at `9f38bb0db40332c6f3d2524dd889877523778a4d`; Phase 10 is local-only pending Architect publication authorization.

## Temporary task-relevant facts

- Canonical repository path: `\\atlas\ATLAS\100_ACTIVE\Projects\BPDC`; retired `\\rpi5\RPI5SharedDrive` must not be used.
- GitHub repository exists at `SketchOTP/BPDC`, default branch `main`; P6 entry and final verification use local `main == origin/main` at `47bb5cc` before the P6 commit.
- Notion defines Phase 0 as evaluation of OpenPets first, VPet second, and a minimal shell only if required, with PetzA as behavioral research.

## Last validation

- Command or check: `node --test`, `node src/cli/experiments.js`, adapter response harness, manifest validation, local-staged OpenPets build, dependency/privacy/publication-safety scans, and `git diff --check`
- Result: `PASSED`; baseline 53/53 tests, final 60/60 tests, BPDC-P10-001 experiment suite PASS, staged bundle PASS at 65,763 bytes, manifest/syntax/permission validation PASS, CreatureCore wall-clock/dependency scan clear, added-line privacy scan clear, publication-safety scan PASS, and `git diff --check` PASS. Direct UNC esbuild remains blocked by known `spawn EPERM`; local staging succeeds. Live visual observation was not performed or claimed.

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

- P3-003 live evidence is accepted by the Architect. `BPDC-SYNC-001` was superseded by `BPDC-SYNC-002`; reconciliation commit `34aef6f` was pushed normally and verified equal on local `main` and GitHub `main`. Architect accepted `BPDC-P4-001`, superseded `BPDC-P4-002` as a blocking gate, accepted `BPDC-SYNC-003`, `BPDC-P5-001`, `BPDC-P6-001`, `BPDC-P7-001`, `BPDC-SYNC-004`, `BPDC-P8-001`, `BPDC-SYNC-005`, and `BPDC-SYNC-006`; `BPDC-P10-001` is authorized and no Phase 11 work is authorized.
