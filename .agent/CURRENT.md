# Current State

## Lifecycle

- Status: `ACTIVE`
- Last updated: 2026-08-26 America/New_York

## Active state

- Local directive ID: `BPDC-P12-001`
- External directive ID: `BPDC-P12-001`
- Objective: Implement one transient, state-dependent reunion response after an observed idle or locked absence, reusing the bounded P7 expression slot.
- Current status: `COMPLETE_FOR_ARCHITECT_REVIEW`
- Acceptance: P12 implementation and deterministic evidence are complete for Architect review; no Phase 13 work has started.
- Current phase: `Phase 12 — Reunion Response` implemented; awaiting Architect review.
- Expected touched areas: transient presence return metadata, host-neutral reunion intent, bounded OpenPets expression arbitration, tests, experiments, generated plugin, and Authority records.
- Immediate next action: await Architect review; do not begin Phase 13 or push.
- Local P12 implementation commit: `4cd6099` (`feat: add reunion response`); local only.
- Local implementation commit: `536abe67e724437dc969e1e27736bd08af9edea1` (`feat: add juvenile socialization imprint`); published.
- Authority closure commit: `7b039ae80de50113c0b84e399fddf0fbfb863c1c` (`chore: record Phase 11 authority handoff`); published.
- Local implementation commit: `0b7e70e` (`feat: teach one persistent rest site`); published.
- Authority closure commit: `807d867` (`chore: record Phase 8 authority handoff`); published.
- Local P9 implementation commit: `f25010b0fd5a89776d8fb151c5fd5dc9e2d0b5b6` (`feat: learn user-shaped play preference`); published.
- Authority closure commit: `58acab9a85fefeb7b79d130b3ceb0e75d7aada89` (`chore: record Phase 9 authority handoff`); published.
- Local P10 implementation commit: `9045fb7a61a29917405e3d1d53174aec63246dfb` (`feat: add continuous physical maturation`); published.
- P10 Authority closure commit: `edff9031a90a1420552ab4d51cdbc03d9d8a05d5` (`chore: record Phase 10 authority handoff`); published.
- Publication result: `BPDC-SYNC-007` pushed normally and non-force; final local `main == origin/main == edff9031a90a1420552ab4d51cdbc03d9d8a05d5`; worktree clean.
- Publication result: `BPDC-SYNC-008` pushed normally and non-force; final local `main == origin/main == 7b039ae80de50113c0b84e399fddf0fbfb863c1c`; worktree clean.

## Temporary task-relevant facts

- Canonical repository path: `\\atlas\ATLAS\100_ACTIVE\Projects\BPDC`; retired `\\rpi5\RPI5SharedDrive` must not be used.
- GitHub repository exists at `SketchOTP/BPDC`, default branch `main`; P6 entry and final verification use local `main == origin/main` at `47bb5cc` before the P6 commit.
- Notion defines Phase 0 as evaluation of OpenPets first, VPet second, and a minimal shell only if required, with PetzA as behavioral research.

## Last validation

- Command or check: `node --test`, `node src/cli/experiments.js`, adapter response harness, manifest validation, local-staged OpenPets build, dependency/privacy/publication-safety scans, and `git diff --check`
- Result: `PASSED`; 68/68 tests, combined P4–P11 experiment suite PASS, staged bundle PASS at 68,010 bytes, generated syntax/manifest validation PASS, no new permission beyond accepted `pet:animate`, CreatureCore boundary/privacy scans clear, and `git diff --check` PASS. Direct UNC esbuild remains blocked by known `spawn EPERM`; local staging succeeds. Live desktop evidence was not required and was not claimed.

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
- Phase 11 implementation: one persistent numeric `socializationImprint` was added with schema 5 → 6 zero migration, continuous `1 - maturity` plasticity, `0.03` saturating learning, and a maximum `0.12` `SEEK_ATTENTION.developmentalSocialization` contributor. Innate sociability, bond, P7 response, P8 REST_SITE, P9 play preference, and P10 maturation remain separate.
- Phase 12 implementation: observed IDLE/LOCKED → ACTIVE return metadata feeds a host-neutral `ReunionResponseIntent`; five-minute minimum absence, saturating duration contribution, `ACKNOWLEDGE_RETURN`/`GREET_RETURN`, unchanged SLEEP/autonomous state, no persistence, and one shared generation-guarded P7 transient slot are implemented and target-tested.

## Pending decisions

- P3-003 live evidence is accepted by the Architect. `BPDC-SYNC-001` was superseded by `BPDC-SYNC-002`; reconciliation commit `34aef6f` was pushed normally and verified equal on local `main` and GitHub `main`. Architect accepted `BPDC-SYNC-003`, `BPDC-P5-001`, `BPDC-P6-001`, `BPDC-P7-001`, `BPDC-SYNC-004`, `BPDC-P8-001`, `BPDC-SYNC-005`, `BPDC-SYNC-006`, `BPDC-P10-001`, `BPDC-SYNC-007`, `BPDC-P11-001`, and `BPDC-SYNC-008`; `BPDC-P12-001` is authorized and pending review. Phase 13 is not authorized.
