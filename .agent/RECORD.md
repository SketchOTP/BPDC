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
