# Project Decision and Milestone Record

## BPDC-GOV-001

- Date: 2026-08-22
- Record ID: `BPDC-GOV-001`
- Status: `ACTIVE`
- Decision: Adopt the Authority 3.0 installation model for BPDC using the stable 2026.08.15 / schema 2.2.0 governance baseline.
- Rationale: The Notion installation package defines the Architect → Codex → evidence → Architect loop, while the preserved Authority record identifies 2.2.0 as the stable production baseline.
- Affected areas: root router, `.agent/`, `.agents/`, `.authority/`
- Supersession: `NONE`

## BPDC-P0-001-ACCEPTED

- Date: 2026-08-22
- Record ID: `BPDC-P0-001-ACCEPTED`
- Status: `ACCEPTED`
- Decision: OpenPets is accepted as BPDC's primary desktop foundation through an adapter/plugin, without a core fork. The pruning concern is tracked and does not block Phase 1 unless it affects BPDC lifecycle/state integrity.
- Rationale: Architect review accepted the Phase 0 evidence and authorized the framework-independent headless CreatureCore directive.
- Affected areas: foundation decision and Phase 1 authorization.
- Supersession: `BPDC-PHASE-001` pending acceptance state.

## BPDC-PHASE-002

- Date: 2026-08-22
- Record ID: `BPDC-PHASE-002`
- Status: `PENDING_ARCHITECT_ACCEPTANCE`
- Decision: Implement the first headless CreatureCore as framework-independent ECMAScript modules; keep OpenPets behind a future DesktopAdapter.
- Rationale: The accepted P1 directive requires proof of internal motivation, individual differences, and deterministic persistence before desktop integration. The implementation and A–D experiments pass without desktop dependencies.
- Affected areas: `src/creature-core/`, `src/cli/`, `tests/`, package metadata, and project evidence.
- Supersession: `NONE`

## BPDC-PHASE-000

- Date: 2026-08-22
- Record ID: `BPDC-PHASE-000`
- Status: `ACTIVE`
- Decision: Keep the project at Phase 0 — Foundation Evaluation until external desktop-pet candidates and the architectural seam are evidenced.
- Rationale: This is the explicit first assignment in the canonical BPDC Notion directive.
- Affected areas: project plan and future directives.
- Supersession: `NONE`

## BPDC-PHASE-001

- Date: 2026-08-22
- Record ID: `BPDC-PHASE-001`
- Status: `PENDING_ARCHITECT_ACCEPTANCE`
- Decision: Codex recommends OpenPets adapter/plugin as BPDC's initial body/renderer foundation; VPet remains fallback; Petz/PetzA is reference-only.
- Rationale: OpenPets passed the required disposable movement/reaction/timer/state/restore/headless proof and exposes a cleanest separation between BPDC-owned state and host rendering, while VPet couples plugins to WPF/game state and PetzA is not a host.
- Affected areas: Phase 0 foundation decision and future `CreatureCore → BehaviorIntent → DesktopAdapter` implementation.
- Supersession: `NONE`

## BPDC-P1-001-ACCEPTED

- Date: 2026-08-22
- Record ID: `BPDC-P1-001-ACCEPTED`
- Status: `ACCEPTED`
- Decision: The Architect accepted the framework-independent CreatureCore and authorized the desktop embodiment gate `BPDC-P2-001`.
- Rationale: Phase 1 verified deterministic replay, persistence continuity, personality-dependent divergence, drive-dependent causality, autonomous selection, and behavior commitment. Believability and live host execution remain unknown.
- Affected areas: Phase 2 integration authorization.
- Supersession: `BPDC-PHASE-002` pending acceptance state.

## BPDC-PHASE-003

- Date: 2026-08-22
- Record ID: `BPDC-PHASE-003`
- Status: `ACTIVE`
- Decision: Test CreatureCore embodiment through a thin host-neutral adapter and pinned OpenPets plugin; OpenPets remains the body and BPDC remains the brain.
- Rationale: The highest-value remaining uncertainty is whether BPDC intent reaches visible desktop behavior without host autonomy overriding it.
- Affected areas: `src/desktop/`, `integrations/openpets/`, original placeholder assets, runtime evidence, and persistence validation.
- Supersession: `NONE`

## BPDC-P2-001-HANDOFF

- Date: 2026-08-23
- Record ID: `BPDC-P2-001-HANDOFF`
- Status: `PENDING_ARCHITECT_ACCEPTANCE`
- Decision: The accepted CreatureCore now controls a real OpenPets desktop body through a thin adapter and bundled plugin, with no core fork or host-specific imports.
- Rationale: The disposable Windows/Electron run installed the original BPDC placeholder, rendered it, restored the stable creature snapshot, reached autonomous SLEEP, and recorded host state and authority. Target tests covered three forced mappings.
- Affected areas: desktop adapter, OpenPets integration, original placeholder assets, plugin build, runtime evidence, and persistence boundary.
- Supersession: `BPDC-PHASE-003` remains the active phase record until Architect acceptance.

## BPDC-P2-002-HANDOFF

- Date: 2026-08-23
- Record ID: `BPDC-P2-002-HANDOFF`
- Status: `PENDING_ARCHITECT_ACCEPTANCE`
- Decision: The remaining Phase 2 embodiment evidence gap is closed for Codex. The real Windows/Electron OpenPets host accepted all three required visible mappings, and one autonomous live session selected two distinct CreatureCore behaviors that reached the host through the adapter.
- Rationale: `SEEK_ATTENTION → waving` at `15:53:12.047Z` was followed by `WANDER → pet.wander(distance=110)` at `15:55:50.759Z` in the same disposable session; host authority remained configured with gravity disabled and no observed host behavior selector.
- Affected areas: runtime evidence and Authority records only; P2 implementation is unchanged.
- Supersession: P2-001 concern about live multi-intent embodiment evidence.

## BPDC-P2-002-ACCEPTED

- Date: 2026-08-23
- Record ID: `BPDC-P2-002-ACCEPTED`
- Status: `ACCEPTED`
- Decision: Phase 2 desktop embodiment is closed. The live OpenPets host accepted three materially distinct BPDC intents, one autonomous session selected two distinct behaviors, provenance remained CreatureCore → adapter → host, and host override was not observed.
- Rationale: The Architect accepted `BPDC-E017` through `BPDC-E021` at `E5_OPERATIONALLY_OBSERVED`; regression remained green at 8/8.
- Affected areas: Phase 2 milestone and Phase 3 authorization.
- Supersession: `BPDC-P2-002-HANDOFF` pending-acceptance state.

## BPDC-PHASE-004

- Date: 2026-08-23
- Record ID: `BPDC-PHASE-004`
- Status: `ACTIVE`
- Decision: Implement the bounded relationship-memory slice `BPDC-P3-001` before any habits, environment learning, mood, hunger, evolution, or Phase 4 work.
- Rationale: The largest remaining believability gap is that interaction history has no lasting behavioral consequence. The smallest testable bridge is a persistent bond scalar plus bounded interaction events that influence existing utility scores.
- Affected areas: CreatureCore state/persistence/utility diagnostics, host-neutral interaction boundary, OpenPets adapter event translation, bounded experiments, and live restart evidence.
- Supersession: `NONE`

## BPDC-P3-003-LIVE-GATE

- Date: 2026-08-23
- Record ID: `BPDC-P3-003-LIVE-GATE`
- Status: `PENDING_ARCHITECT_ACCEPTANCE`
- Decision: Codex completed the workspace-recovery and live relationship evidence gate. A real click entered the OpenPets `pet:clicked` path, produced a host-neutral interaction, mutated and persisted the bounded relationship state, survived restart, and changed later utility scoring.
- Rationale: `BPDC-E022` provides the missing operational link between user action and later creature motivation. Bond changes remain bounded and the utility difference is explicit without strengthening relationship weights or editing the live snapshot.
- Affected areas: Phase 3 evidence and Authority state; no new architecture.
- Supersession: `BPDC-PHASE-004` remains the active Phase 3 milestone pending Architect acceptance.

## BPDC-P3-003-ACCEPTED

- Date: 2026-08-23
- Record ID: `BPDC-P3-003-ACCEPTED`
- Status: `ACCEPTED`
- Decision: Architect accepted Phase 3. The live relationship-memory chain is operationally established at E5.
- Authorization: repository safety checkpoint `BPDC-SYNC-001`.
- Supersession: `BPDC-P3-003-LIVE-GATE` pending-acceptance state.

## BPDC-SYNC-001-REMOTE-ANCESTRY-BLOCKED

- Date: 2026-08-23
- Record ID: `BPDC-SYNC-001-REMOTE-ANCESTRY-BLOCKED`
- Status: `BLOCKED_PENDING_ARCHITECT_REVIEW`
- Decision: Do not push. The fetched `origin/main` bootstrap root `c1eaf441...` is not an ancestor of local accepted tip `1ef3937...`; no merge base exists.
- Rationale: The directive requires a normal fast-forward push and explicitly forbids merge, rebase, reset, and force push when remote history diverges.
- Validation: clean worktree before inspection, 13/13 tests, diff check pass, safety scan pass; push not attempted.
- Supersession: `NONE`; awaiting Architect reconciliation decision.

## BPDC-SYNC-002-RECONCILED

- Date: 2026-08-23
- Record ID: `BPDC-SYNC-002-RECONCILED`
- Status: `PASSED`
- Decision: Preserve both unrelated roots with one explicit merge and publish the accepted Phase 1–3 state to GitHub `main`.
- Evidence: safety ref `safety/pre-github-root-reconcile`; isolated branch `sync/github-root-reconcile`; merge commit `34aef6f965a10624b5db0eb06691cab60af89b1c` with parents `5780122059755516b99da56366d33e6c5d5f2432` and `c1eaf44196fb2c58e92e61fa1059e2e283304cf1`.
- Application invariant: only `.gitignore` and `LICENSE` changed in the reconciliation merge; no delta under `src/`, `tests/`, or `integrations/`.
- Validation: 13/13 tests, relationship experiments, manifest validation, local-staged build, diff check, safety scan, ancestry checks, and GitHub commit verification passed.
- Publication: normal non-force push succeeded; local `main` equals GitHub `main` at the reconciliation SHA.
- Supersession: `BPDC-SYNC-001-REMOTE-ANCESTRY-BLOCKED` is superseded by `BPDC-SYNC-002-RECONCILED`.
- Boundary: Phase 4 remains unauthorized.

## BPDC-P4-001-IMPLEMENTATION-STARTED

- Date: 2026-08-23
- Record ID: `BPDC-P4-001-IMPLEMENTATION-STARTED`
- Status: `PARTIAL_PENDING_LIVE_EVIDENCE`
- Decision: Begin the Architect-authorized minimal time-of-day attention habit while preserving the accepted Phase 1–3 architecture and core/adapter boundary.
- Evidence: one 24-slot `attentionByHour` aggregate; bounded reinforcement/decay; `SEEK_ATTENTION.timeHabit`; schema 2 → 3 migration; deterministic habit experiments; 17/17 regression.
- Limitation: live OpenPets click/restart evidence was not attempted through a synthetic path because callable Computer Use UI tooling was unavailable.
- Supersession: `BPDC-SYNC-002-RECONCILED` remains the repository checkpoint; no subsequent phase is authorized.

## BPDC-P4-002-LIVE-GATE-BLOCKED

- Date: 2026-08-23
- Record ID: `BPDC-P4-002-LIVE-GATE-BLOCKED`
- Status: `BLOCKED_ENVIRONMENT`
- Decision: Preserve the accepted P4 implementation and stop at the exact live evidence boundary until callable desktop automation is available.
- Evidence: 17/17 tests, P4 experiments, staged plugin build, manifest validation, CreatureCore boundary scan, and diff check passed.
- Limitation: the required physical click → current-hour habit reinforcement → normal persistence → host restart → restored utility chain was not run; no synthetic or manually edited evidence was substituted.
- Supersession: `BPDC-P4-001-IMPLEMENTATION-STARTED` remains the implementation record; no subsequent phase is authorized.

## BPDC-P4-001-ACCEPTED

- Date: 2026-08-23
- Record ID: `BPDC-P4-001-ACCEPTED`
- Status: `ACCEPTED`
- Decision: Architect accepted the Phase 4 minimal time-of-day habit implementation on deterministic target-tested evidence.
- Evidence: `BPDC-E023`; 17/17 regression, target experiments, schema migration, persistence, and utility subordination passed.
- Limitation: habit-specific physical click → current-hour reinforcement → restart evidence remains `UNKNOWN` and deferred; the Phase 3 underlying click/persistence seam remains accepted at `BPDC-E022`.
- Supersession: `BPDC-P4-001-IMPLEMENTATION-STARTED` and `BPDC-P4-002-LIVE-GATE-BLOCKED` as active blocking states.

## BPDC-SYNC-003-STARTED

- Date: 2026-08-23
- Record ID: `BPDC-SYNC-003-STARTED`
- Status: `IN_PROGRESS`
- Decision: Durably synchronize the accepted Phase 4 implementation to canonical GitHub `main`.
- Evidence: dirty-tree classification found accepted P4 source/plugin/tests and Authority records only; required validation passed; canonical UNC esbuild is blocked by known `spawn EPERM`, while the local-staged build passed at 34,901 bytes.
- Boundary: no application behavior change or subsequent phase is authorized; final commit/push and equality verification remain pending.

## BPDC-SYNC-003-PUBLISHED

- Date: 2026-08-23
- Record ID: `BPDC-SYNC-003-PUBLISHED`
- Status: `PASSED`
- Decision: Publish the accepted Phase 4 habit implementation and close the durability checkpoint.
- Product commit: `cb5d6ad1b61a3833582781a9f169ea53954b7d67` (`feat: add time-of-day attention habit`).
- Validation: 17/17 tests, P4 experiments, manifest, staged build, boundary scan, migration review, publication-safety scan, and diff check passed; canonical UNC esbuild `spawn EPERM` remained non-blocking.
- Publication: normal non-force push succeeded; final Authority closure is recorded in a follow-up records-only commit; local `main == origin/main` and worktree are clean after final verification.
- Deferred evidence: habit-specific live click reinforcement remains `UNKNOWN`; no synthetic or manually edited evidence was used.
- Supersession: `BPDC-SYNC-003-STARTED`.

## BPDC-P5-001-IMPLEMENTATION-COMPLETE

- Date: 2026-08-24
- Record ID: `BPDC-P5-001-IMPLEMENTATION-COMPLETE`
- Status: `PENDING_ARCHITECT_ACCEPTANCE`
- Decision: Implement the smallest authorized environmental-awareness increment by translating curated OpenPets presence events into the existing host-neutral environment fields.
- Evidence: transient integration `PresenceTracker`; adapter mappings for idle entry/exit and screen lock/unlock; direct interaction establishes active presence; 22/22 tests; P4/presence experiments; manifest; staged bundle; boundary/privacy scans; and diff check passed.
- Startup rule: internal `UNKNOWN`, conservatively mapped to absent/zero-duration until an explicit signal; no unknown state enters CreatureCore and presence is not persisted.
- Limitation: no live desktop observation is claimed; the Architect explicitly made it unnecessary for acceptance.
- Supersession: `BPDC-SYNC-003-PUBLISHED` as the active implementation stage.

## BPDC-P5-001-PUBLISHED

- Date: 2026-08-24
- Record ID: `BPDC-P5-001-PUBLISHED`
- Status: `PASSED`
- Decision: Publish the accepted-scope Phase 5 presence implementation and preserve the explicit non-live evidence boundary.
- Product commit: `c13d3e8b0a51b1799872672ffbca57059fa56a55`; normal non-force push succeeded.
- Evidence: `BPDC-E026`; 22/22 tests, P4/presence experiments, adapter harness, manifest, staged bundle, core/privacy scans, and diff check passed.
- Limitation: live desktop presence observation is not claimed or required by `BPDC-P5-001`.
- Supersession: `BPDC-P5-001-IMPLEMENTATION-COMPLETE` pending-acceptance state.

## BPDC-P6-001-IMPLEMENTATION-COMPLETE

- Date: 2026-08-24
- Record ID: `BPDC-P6-001-IMPLEMENTATION-COMPLETE`
- Status: `PENDING_ARCHITECT_ACCEPTANCE`
- Decision: Implement the authorized elapsed-time continuity layer before adding more environmental familiarity or memory categories.
- Evidence: version-1 persistence envelope, exact quiet reconciliation through existing CreatureCore mechanics, current-intent resume handling, legacy migration, clock-skew protection, offline local-time timeline, 31/31 tests, P6 experiment suite, persistence harness, manifest, staged bundle, core/privacy scans, and diff check.
- Measured performance: approximately 13ms/81ms/340ms for exact 24-hour/7-day/30-day catch-up in the Node 24 environment.
- Limitation: live Windows/Electron elapsed-time observation is `UNKNOWN` and not claimed; direct UNC esbuild remains blocked by known `spawn EPERM`, while local staging succeeds.
- Supersession: `BPDC-P5-001-PUBLISHED` as the active implementation stage.

## BPDC-P6-001-PUBLISHED

- Date: 2026-08-24
- Record ID: `BPDC-P6-001-PUBLISHED`
- Status: `PASSED`
- Decision: Publish the authorized elapsed-time reconciliation implementation and close the Phase 6 Codex handoff without starting a later phase.
- Product commit: `2e4ff7eb261b1df1c8db57392cfa4bbee9b99b61`; normal non-force push succeeded; local `main`, `origin/main`, and GitHub `main` were verified equal at `2e4ff7e`.
- Evidence: `BPDC-E027`; 31/31 tests, P6 experiments A–I, persistence harness, manifest, staged bundle, core/privacy scans, publication-safety scan, and diff check passed.
- Limitation: live Windows/Electron elapsed-time observation remains `UNKNOWN` and not claimed; direct UNC esbuild remains blocked by known `spawn EPERM`, while staging succeeds.
- Supersession: `BPDC-P6-001-IMPLEMENTATION-COMPLETE` pending-acceptance state.

## BPDC-P7-001-IMPLEMENTATION-COMPLETE

- Date: 2026-08-24
- Record ID: `BPDC-P7-001-IMPLEMENTATION-COMPLETE`
- Status: `PENDING_ARCHITECT_ACCEPTANCE`
- Decision: Implement the authorized transient contact-expression layer without changing autonomous behavior authority.
- Evidence: `BPDC-E028`; separate host-neutral response intent; three bounded semantics; state-dependent diagnostics; unchanged current behavior/timing/RNG/drives; adapter mapping/restoration; rapid-click coalescing; offline non-fabrication; 38/38 regression; P7 experiments; manifest/staged build; boundary/privacy/publication-safety scans; diff check.
- Limitation: live Windows/Electron physical-click observation of the new response remains `UNKNOWN` and is not claimed, as permitted by the directive.
- Boundary: no new autonomous behavior, state dimension, persistence field, utility weight, privacy-sensitive sensing, OpenPets core change, or later phase.
- Supersession: `BPDC-P6-001-PUBLISHED` as the active implementation stage.

## BPDC-P7-001-LOCAL-COMMIT

- Date: 2026-08-24
- Record ID: `BPDC-P7-001-LOCAL-COMMIT`
- Status: `PASSED`
- Decision: Record the completed P7 implementation and Authority handoff locally without remote publication.
- Commit: `98b506d` (`feat: express immediate contact response`).
- Publication: no push performed; GitHub remains at accepted Phase 6 head `bdeffd9` pending separate authorization.
- Notion: canonical BPDC page updated and verified for the P7 handoff.
- Supersession: `BPDC-P7-001-IMPLEMENTATION-COMPLETE` remains the implementation record.

## BPDC-P7-001-ACCEPTED

- Date: 2026-08-24
- Record ID: `BPDC-P7-001-ACCEPTED`
- Status: `ACCEPTED`
- Decision: Architect accepted Phase 7 and closed the immediate touch-response phase. State-dependent transient response selection, autonomous-state preservation, bounded adapter restoration, and target-tested evidence were retained; live visual observation remains `UNKNOWN`/not claimed.
- Supersession: `BPDC-P7-001-LOCAL-COMMIT` and `BPDC-P7-001-IMPLEMENTATION-COMPLETE` are accepted records.

## BPDC-SYNC-004-PUBLISHED

- Date: 2026-08-24
- Record ID: `BPDC-SYNC-004-PUBLISHED`
- Status: `PASSED`
- Decision: Publish the accepted P7 implementation and Authority closure without application changes or history rewriting.
- Publication: normal non-force push succeeded from `bdeffd909ef7c993dc4daf9d97837a14e36742d1` to `619b35e1e2020ba9157d16d5241628f73a83395c`; local `main == origin/main`; worktree clean.
- Validation: 38/38 tests, diff check, and publication-safety scan passed; zero filename/content safety findings; live P7 visual response remains `UNKNOWN`/not claimed.
- Boundary: no Phase 8 work started; await a new Architect directive.

## BPDC-P8-001-IMPLEMENTATION-COMPLETE

- Date: 2026-08-24
- Record ID: `BPDC-P8-001-IMPLEMENTATION-COMPLETE`
- Status: `PENDING_ARCHITECT_ACCEPTANCE`
- Decision: Implement the authorized minimal spatial familiarity mechanism as one abstract `REST_SITE`, not a coordinate map.
- Core: schema 4 adds bounded persistent `restSiteAffinity`; raw host coordinates remain outside CreatureCore.
- Integration: version-2 envelope stores one candidate coordinate plus a bounded relocation streak; `pet:dragEnd` is the only learning source; `display:changed` invalidates geometry; SLEEP targeting calls `moveTo` before the existing sleep expression.
- Rule: 96-unit consistency radius, 0.25 coordinate smoothing, 0.12 saturating learning rate, 14-day affinity half-life, 0.6 targeting threshold, three repeated new-area placements for relocation.
- Validation: `BPDC-E030`; 45/45 tests; P8 experiments; manifest; staged bundle; schema/envelope/persistence tests; adapter/display/utility tests; boundary/privacy/secret scans; diff check.
- Limitation: live Windows/Electron spatial observation is `UNKNOWN`/not claimed; no synthetic live claim was made.
- Supersession: `BPDC-SYNC-004-PUBLISHED` as the active implementation stage.

## BPDC-P8-001-LOCAL-COMMIT

- Date: 2026-08-24
- Record ID: `BPDC-P8-001-LOCAL-COMMIT`
- Status: `PASSED`
- Decision: Record the completed P8 implementation locally without remote publication.
- Commit: `0b7e70e` (`feat: teach one persistent rest site`).
- Publication: no push performed; GitHub remains at `b9d6b5d` pending separate authorization.
- Validation: post-commit 45/45 tests, P8 experiments, bundle syntax, and diff check passed; live spatial observation remains `UNKNOWN`/not claimed.
- Supersession: `BPDC-P8-001-IMPLEMENTATION-COMPLETE` remains the implementation evidence record.

## BPDC-SYNC-005-PUBLISHED

- Date: 2026-08-24
- Record ID: `BPDC-SYNC-005-PUBLISHED`
- Status: `PASSED`
- Decision: Publish the accepted Phase 8 implementation and Authority closure without application changes or history rewriting.
- Publication: normal non-force push succeeded from `b9d6b5d10e83df54d9e039421d2b40aba1c0176d` to the accepted P8 state `807d867e898b784b2b0321e0c570db4ea9314ae5`; records-only closure pushes then completed; local `main == origin/main`; worktree clean. The exact final SHA is recorded in the verified Notion handoff and repository state.
- Validation: 45/45 tests, P8 experiments, diff check, and publication-safety scan passed; zero unexpected filenames, secret-pattern findings, or out-of-scope files.
- Boundary: live P8 drag/return/SLEEP visual observation remains `UNKNOWN`/not claimed; no Phase 9 work started.

## BPDC-P9-001-IMPLEMENTATION-COMPLETE

- Date: 2026-08-24
- Record ID: `BPDC-P9-001-IMPLEMENTATION-COMPLETE`
- Status: `PENDING_ARCHITECT_ACCEPTANCE`
- Decision: Implement exactly one user-shaped play preference without mutable personality or a general reinforcement system.
- Core: schema 5 adds bounded persistent `playPreference` with deterministic last-update metadata; schema 4 and earlier snapshots migrate to zero preference.
- Learning: only positive contact during committed `PLAY` reinforces at `0.06` against remaining capacity; other behaviors and autonomous PLAY without contact do not.
- Utility: `PLAY.learnedPreference` contributes at most `0.3`; strong fatigue still selects `SLEEP`.
- Decay: deterministic 21-day half-life; offline reconciliation decays but never reinforces.
- Validation: `BPDC-E032`; 53/53 tests; P9 experiments; P4-P8 regression; manifest; staged bundle at 63,376 bytes; boundary/privacy/secret/publication-safety scans; diff check.
- Limitation: live observation is not required and is not claimed; direct UNC esbuild remains blocked by known `spawn EPERM`, while local staging succeeds.
- Publication: local commit authorized; push not authorized; stop before Phase 10.

## BPDC-SYNC-007-PUBLISHED

- Date: 2026-08-25
- Record ID: `BPDC-SYNC-007-PUBLISHED`
- Status: `PASSED`
- Decision: Publish the Architect-accepted Phase 10 maturation implementation and Authority closure without application changes or history rewriting.
- Publication: normal non-force push succeeded from `9f38bb0db40332c6f3d2524dd889877523778a4d` to `edff9031a90a1420552ab4d51cdbc03d9d8a05d5`; local `main == origin/main`; worktree clean.
- Unpublished commits: `9045fb7a61a29917405e3d1d53174aec63246dfb` and `edff9031a90a1420552ab4d51cdbc03d9d8a05d5`; freshly fetched remote was an ancestor; no unexpected files.
- Validation: 60/60 tests, P10 experiments, diff check, and publication-safety scan passed; `pet:animate` was the only permission expansion and no added secret findings were present.
- Boundary: live visual growth remains `UNKNOWN` / not claimed; Phase 11 was not started and remains unauthorized.

## BPDC-P9-001-LOCAL-COMMIT

- Date: 2026-08-24
- Record ID: `BPDC-P9-001-LOCAL-COMMIT`
- Status: `PASSED`
- Decision: Record the completed P9 implementation locally for Architect review without remote publication.
- Commit: `f25010b0fd5a89776d8fb151c5fd5dc9e2d0b5b6` (`feat: learn user-shaped play preference`).
- Publication: no push performed; `origin/main` remains at accepted Phase 8 publication `1feeb4c`.
- Validation: `BPDC-E032`; 53/53 tests; P9 experiments; staged bundle at 63,376 bytes; manifest; boundary/privacy/secret/publication-safety scans; diff check.
- Boundary: exactly one user-shaped play preference; no mutable personality, general reinforcement, development stage, or Phase 10 work.

## BPDC-SYNC-006-PUBLISHED

- Date: 2026-08-24
- Record ID: `BPDC-SYNC-006-PUBLISHED`
- Status: `PASSED`
- Decision: Publish the Architect-accepted Phase 9 implementation and Authority closure without application changes or history rewriting.
- Publication: normal non-force push succeeded from `1feeb4c8079e823cb365a1016536f7dc655f5362` to `58acab9a85fefeb7b79d130b3ceb0e75d7aada89`; local `main == origin/main`; worktree clean.
- Unpublished commits: `f25010b0fd5a89776d8fb151c5fd5dc9e2d0b5b6` and `58acab9a85fefeb7b79d130b3ceb0e75d7aada89`; freshly fetched remote was an ancestor; no unexpected files.
- Validation: 53/53 tests, P9 experiments, diff check, and publication-safety scan passed; zero bad filenames or added secret findings.
- Boundary: live observation was not required and remains unclaimed; Phase 10 was not started and is not authorized.

## BPDC-P10-001-IMPLEMENTATION-COMPLETE

- Date: 2026-08-25
- Record ID: `BPDC-P10-001-IMPLEMENTATION-COMPLETE`
- Status: `PENDING_ARCHITECT_ACCEPTANCE`
- Decision: Implement the smallest visible maturation cue: a derived 14-day physical size curve, without adding development state or evolution.
- Core: `developmentSnapshot()` derives age from existing `simulationTimestamp - createdAt`, clamps backward age to zero, and returns maturity plus size factor without affecting behavior scoring.
- Embodiment: OpenPets adapter applies quantized `0.8..1.0` through `pet.setScale()` after startup reconciliation and only when the 0.01 step changes; exactly one `pet:animate` permission was added.
- Validation: `BPDC-E034`; baseline 53/53 and final 60/60 tests; P10 experiments; staged plugin at 65,763 bytes; manifest/syntax; wall-clock/dependency; added-line privacy; publication-safety; and diff checks passed.
- Product commit: `9045fb7a61a29917405e3d1d53174aec63246dfb` (`feat: add continuous physical maturation`); local only.
- Limitation: live visual growth observation was not performed or claimed; direct UNC esbuild remains blocked by known `spawn EPERM`, while local staging succeeds.
- Boundary: no schema bump, utility consequence, personality/preference mutation, evolution, alternate form, care-history development, OpenPets core change, or Phase 11 work.
- Publication: local commit authorized; push not authorized; stop before Phase 11.

## 2026-08-26 — BPDC-P11-001 implementation handoff

- Decision: implement one care-shaped developmental consequence only: positive juvenile contact leaves a persistent socialization imprint.
- Core: `socializationImprint` is a bounded numeric scalar; learning uses `0.03 * intensity * (1 - maturity) * (1 - imprint)` and naturally closes at maturity 1.
- Behavior: the only downstream consequence is `SEEK_ATTENTION.developmentalSocialization = imprint * maturity * 0.12`; low imprint has no penalty and fatigue remains dominant.
- Persistence: snapshot schema 6; schema 5 and earlier migrate with zero imprint; no developmental history is inferred from bond, events, habits, preference, or age.
- Validation: `BPDC-E036`; 68/68 tests; P4–P11 experiments; staged plugin 68,010 bytes; syntax/manifest/boundary/privacy/diff checks passed.
- Product commit: `536abe67e724437dc969e1e27736bd08af9edea1`; local only, no push.
- Boundary: no negative development, multiple traits, XP/levels, mutable personality, evolution, new permissions, Phase 12, or live desktop claim.

## 2026-08-26 — BPDC-SYNC-008 Phase 11 publication

- Decision: publish the Architect-accepted Phase 11 product and Authority closure to canonical GitHub `main` by normal non-force fast-forward.
- Verification: product `536abe67e724437dc969e1e27736bd08af9edea1` and Authority closure `7b039ae80de50113c0b84e399fddf0fbfb863c1c` were the expected unpublished commits; remote `4b3890cece60289ac48bf3d5791cfe96bea5ac14` was their ancestor.
- Validation: 68/68 tests, P4–P11 experiments, manifest review, generated syntax/markers, bounded secret scan, and `git diff --check` passed.
- Publication: normal push succeeded; final local `main == origin/main == 7b039ae80de50113c0b84e399fddf0fbfb863c1c`; worktree clean; no history rewrite.
- Boundary: live P11 evidence remains unclaimed; Phase 12 did not start.

## 2026-08-26 — BPDC-P12-001 implementation handoff

- Decision: implement one transient reunion response from observed user return after IDLE/LOCKED absence.
- Core: `ReunionResponseIntent` is selected from a saturating observed absence contribution plus existing bond, sociability, socialization imprint, and current behavior; only `ACKNOWLEDGE_RETURN` and `GREET_RETURN` exist.
- Presence: return metadata is one-shot and non-persistent; UNKNOWN startup and application restart do not create a reunion.
- Expression: SLEEP remains undisturbed; autonomous timing/RNG/drives/relationship/development remain unchanged; P7's single generation-guarded transient slot is reused.
- Validation: `BPDC-E038`; 76/76 tests, P4–P12 experiments, staged build, manifest, syntax, boundary/privacy, and diff checks passed.
- Product commit: `4cd6099` (`feat: add reunion response`); local only, no push authorized.
- Boundary: Phase 13 not authorized.

## 2026-08-26 — BPDC-P13-001 implementation handoff

- Decision: implement exactly one desktop-native autonomous action, `FOLLOW_CURSOR`, selected by the existing utility authority only when active user presence is established.
- Core: 30–45 second interruptible behavior with 180-second cooldown; contributors are active presence, social pressure, curiosity, playfulness, sociability, bond, socialization imprint, independence penalty, and fatigue penalty. No cursor data or host dependency crosses the core boundary.
- Adapter: OpenPets `followCursor({ enabled: true, lag: 0.35 })`; disable before non-follow embodiment, transient responses, and shutdown; redundant calls suppressed; P7/P12 use the single existing restoration slot.
- Persistence: no new cursor field or schema; existing current-behavior persistence remains authoritative; offline absence cannot select follow.
- Validation: `BPDC-E039`; 85/85 tests; combined P4–P13 experiments; staged build A/B identical at 74,401 bytes with SHA-256 `59D488B2962A9D340BD4CE2B330EF8CE1B386A217061EBADFF7F42F98C982946`; manifest unchanged; syntax/boundary/privacy/safety/diff checks passed.
- Product commit: `aba30b150a670a068c9011ecf9b05d65e42751b8` (`feat: add autonomous cursor following`); local only, no push.
- Boundary: live desktop follow remains `UNKNOWN / NOT CLAIMED`; Phase 14 not started or authorized.

## 2026-08-26 — BPDC-SYNC-010 Phase 13 publication

- Decision: publish the accepted Phase 13 `FOLLOW_CURSOR` implementation and Authority closure through a normal non-force fast-forward push.
- Verification: local accepted commits `aba30b150a670a068c9011ecf9b05d65e42751b8` and `8fa4a8b67cd44d64708f3b141773d4b6caf54d7a` were the only unpublished descendants of `0d8dde1961d2fcda4f9f03d6af50c11846ff18fb`; ancestry, scope, permissions, safety, and validation passed.
- Generated artifact: two independent staged builds and the tracked bundle were byte/hash-identical at 74,401 bytes, SHA-256 `59D488B2962A9D340BD4CE2B330EF8CE1B386A217061EBADFF7F42F98C982946`.
- Result: GitHub `main` advanced normally to `8fa4a8b67cd44d64708f3b141773d4b6caf54d7a`; local `main == origin/main`; worktree clean; no history rewrite.
- Evidence boundary: P13 remains `E4_REGRESSION_PROTECTED`; live cursor-follow behavior remains `UNKNOWN / NOT CLAIMED`; Phase 14 not started or authorized.

## 2026-08-26 — BPDC-P14-001 implementation handoff

- Decision: implement exactly one deterministic midpoint reconsideration for existing interruptible behavior commitments.
- Core: checkpoint is derived at `startedAt + duration * 0.5`; `SLEEP` and `AVOID` remain non-interruptible; current utility is compared with the strongest eligible challenger using a `0.15` hysteresis margin.
- Randomness: the reconsideration gate consumes no RNG. A selected replacement is committed through the existing behavior authority and samples only its ordinary duration.
- Persistence: no checkpoint field or schema change; before/after-midpoint reload is deterministic and legacy/current snapshots do not fabricate retroactive interruption.
- Offline/transient: quiet reconciliation suppresses historical intents and host commands; P7/P12 continue to share one generation-guarded restoration slot.
- Validation: `BPDC-E041`; 94/94 tests, P4–P14 experiments, deterministic two-build correspondence, syntax/manifest/boundary/privacy/safety, and `git diff --check` passed.
- Generated artifact: 77,281 bytes; SHA-256 `F0671BCF39B9FF2DCF4BEF61DFB195A5B5F5CBACC8B42F66F9BDCEFEF1A43A38`; staged builds A/B and tracked bundle match.
- Product commit: pending local commit; push not authorized.
- Boundary: live midpoint behavior is `UNKNOWN / NOT CLAIMED`; Phase 15 did not start.
