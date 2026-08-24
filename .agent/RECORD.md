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
